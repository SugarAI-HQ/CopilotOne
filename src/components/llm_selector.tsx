import { 
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,  
  Modal,
  Stack,
  Select,
  Typography 
} from "@mui/material";

import CloseIcon from '@mui/icons-material/Close';

import React, { useState } from "react";

function LLMSelector({ initialProvider, initialModel, onProviderChange, onModelChange }) {

  const [isOpen, setIsOpen] = useState(false);

  const [provider, setProvider] = useState(initialProvider);

  const [model, setModel] = useState(initialModel);

  const handleClose = () => setIsOpen(false);

  const handleOpen = () => setIsOpen(true);

  const handleSubmit = () => {
    // Handle form submission here
  };

  const handleProviderChange = (event) => {
    const selectedProvider = event.target.value;
    setProvider(selectedProvider);
    onProviderChange(selectedProvider);
  };

  const handleModelChange = (event) => {
    const selectedModel = event.target.value;
    setModel(selectedModel);
    onModelChange(selectedModel);
  };

  return (
    <>
      <Button variant="text" onClick={handleOpen}>
        {model}
      </Button>

      <Modal open={isOpen} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2">
            Model
          </Typography>
          <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose}/>
          
          <Typography mt={2}>
            The LLM provider and model that'll be used to power this prompt.
          </Typography>

          <Stack spacing={2} mt={2}>
            <FormControl fullWidth>
              <FormLabel>Provider</FormLabel>
              <Select
                value={provider}
                onChange={handleProviderChange}
              >
                <option value="OpenAI">OpenAI</option>
                {/* Add more options */}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>Model</FormLabel>
              <Select
                value={model} 
                onChange={handleModelChange}
              >
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
                <option value="gpt-4">gpt-4</option>
                <option value="gpt-4-0613">gpt-4-0613</option>
                <option value="gpt-4-0314">gpt-4-0314</option>
                {/* Add more options */}
              </Select>
            </FormControl>
          </Stack>

          <Divider />

          <Stack direction="row" spacing={2} mt={2}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Confirm
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
}

export default LLMSelector;
