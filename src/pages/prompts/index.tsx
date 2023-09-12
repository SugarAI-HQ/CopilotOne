import React, { useEffect, useState } from "react";
import { api } from "~/utils/api";
import Modal from "react-modal";
import { Card, CardHeader, CardBody, CardBodyProps, CardFooter, Heading, SimpleGrid, Button, Text, Flex, Link} from "@chakra-ui/react";
import { CreatePackage } from "~/components/create_package";

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
  const mutation = api.prompt.createPackage.useMutation()
  return (
    <>
      <CreatePackage
        onSubmit={mutation.mutate}
      ></CreatePackage>
      <Packages />
    </>
  );
}
