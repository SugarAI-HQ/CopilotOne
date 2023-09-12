import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

export function CreatePackage({ onSubmit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const handleSubmit = () => {
    onSubmit({
      name: name,
      description: description,
    });
    onClose(); // Close the modal after submitting
  };

  return (
    <>
      <Box>
        <Button 
          ml="auto" 
          size="sm" 
          variant="outline" 
          onClick={onOpen}
        >
          Create
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Heading as="h2" size="md">
              Model
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>The LLM provider and model that'll be used to power this prompt.</Text>

            <Stack spacing={4} mt={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
            </Stack>
          </ModalBody>

          <Divider />

          <ModalFooter>
            <Stack direction="row" spacing={4}>
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="outline" colorScheme="blue" size="sm" onClick={handleSubmit}>
                Confirm
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
