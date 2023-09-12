import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Modal from "react-modal";
import { Card, CardHeader, CardBody, CardBodyProps, CardFooter, Heading, SimpleGrid, Button, Text, Flex, Link} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Head from "next/head";

function PromptVersion() {
  const [template, setText] = useState(""); // State to store the text entered in the text area

  const handleTextChange = (e) => {
    setText(e.target.value); // Update the state with the text from the text area
  };

  const handleClearClick = () => {
    setText(""); // Clear the text in the text area
  };


  const handleSubmitClick = () => {
    // Check if the text is not empty before submitting
    if (template.trim() !== "") {
      // Call the createPromptPackage function with the text
      // inputFields    String[]
      // templateFields String[]
      api.prompt.createPackage({ template }).then((response) => {
        
        // Handle the response or any other logic here
        console.log("Prompt package created:", response);
      });
    }
  };

  return (
    <div>
      <textarea
        rows="4"
        cols="50"
        value={template}
        onChange={handleTextChange}
        placeholder="Enter text here"
      />
      <div>
        <button onClick={handleClearClick}>Clear</button>
        <button onClick={handleSubmitClick}>Submit</button>
      </div>
    </div>
  );
}



const CreatePackage = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    // Validate that the name is not empty
    if (name.trim() === "") {
      alert("Name is required.");
      return;
    }

    // Create a package object with the provided data
    const packageData = {
      name: name,
      description: description,
    };

    // Call the onSubmit function with the package data
    // onSubmit(packageData);
    const pkg = await api.prompt.createPackage.useMutation(packageData)

    // Clear the form fields
    setName("");
    setDescription("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Package Form"
    >
      <h2>Create Package</h2>
      <form>
        <div>
          <label htmlFor="name">Name (Required):</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description (Optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <button type="button" onClick={handleSubmit}>
            Create
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};



export const CreatePackageButton = ({ onPackageSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Create Package</button>
      <CreatePackage
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={onPackageSubmit}
      />
    </div>
  );
};


const YourApp = () => {
  const handlePackageSubmit = (packageData) => {
    // Handle the submitted package data here
    console.log("Submitted Package:", packageData);
  };

  return (
    <div>
      {/* Other content in your app */}
      <CreatePackageButton onPackageSubmit={handlePackageSubmit} />
    </div>
  );
};

function Packages() {
  // const { data: sessionData } = useSession();
  const { data: packages } = api.prompt.getPackages.useQuery({});
  return(
    <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
      {packages && packages.length > 0 ? (
        packages.map((pkg, index) => (
          <Card 
            key={index} 
            w="auto"
            display="flex"
            direction="column"
            align="center"
            justify="center"
            padding="2"
          >
            <CardHeader
              display="flex"
              flexDirection="column"
              gap="2"
              alignItems="center"
            >{pkg.name}</CardHeader>
            <CardBody>
              <Text>{pkg.description}</Text>
            </CardBody>
            <CardFooter>
              {/* <Button colorScheme='blue'>View</Button> */}
              <Link href={`/prompts/${pkg.id}`}>View</Link>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Flex w="100vw" h="100%" align="center" justify="center">
          <Text>No cards created</Text>
        </Flex>
          
      )}
    </SimpleGrid>
  )
}

// export default Packages


export default function PackageHome() {
  return (
    <Packages />
  );
}
