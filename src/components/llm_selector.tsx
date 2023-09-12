import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import React, { useState } from "react";

function LLMSelector({ initialProvider, initialModel, onProviderChange, onModelChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [provider, setProvider] = useState(initialProvider);
  const [model, setModel] = useState(initialModel);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const handleSubmit = () => {
    // Handle form submission here
    // Replace this with your submission logic
  };

  const handleProviderChange = (e) => {
    const selectedProvider = e.target.value;
    setProvider(selectedProvider);
    onProviderChange(selectedProvider);
  };

  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    setModel(selectedModel);
    onModelChange(selectedModel);
  };

  return (
    <>
      <Button
        size='sm'
        variant="solid"
        onClick={onOpen}>
        ({model})
      </Button>

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
                <FormLabel>Provider</FormLabel>
                <Select value={provider} onChange={handleProviderChange}>
                  <option value="OpenAI">OpenAI</option>
                  {/* Add more options if needed */}
                </Select>
                <Text fontSize="sm">(Provide API key to enable)</Text>
              </FormControl>

              <FormControl>
                <FormLabel>Model</FormLabel>
                <Select value={model} onChange={handleModelChange}>
                  <option value="gpt-4-32k">gpt-3.5-turbo</option>
                  <option value="gpt-4">gpt-4</option>
                  <option value="gpt-4-0613">gpt-4-0613</option>
                  <option value="gpt-4-0314">gpt-4-0314</option>
                  {/* Add more options if needed */}
                </Select>
                <Text fontSize="sm">(This is a chat model and supports back and forth dialog.)</Text>
              </FormControl>
            </Stack>
          </ModalBody>

          <Divider />

          <ModalFooter>
            <Stack direction="row" spacing={4}>
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" size="sm" onClick={handleSubmit}>
                Confirm
              </Button>
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LLMSelector;
