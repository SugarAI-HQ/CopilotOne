import React, { useState } from "react";
import { Button, Dialog, Paper, Typography, Box } from "@mui/material";
import { MdBuild } from "react-icons/md";
import LLMParameter from "./llm_parameter";
import { LlmConfigSchema } from "~/validators/prompt_version";

// export interface LLMConfigProps {
//   temperature: number,
//   maxLength: number,
//   topP: number,
//   freqPenalty: number,
//   presencePenalty: number,
//   logitBias: string,
//   stopSequences: string,
// }

const LLMConfigModal = ({
  isOpen,
  onClose,
  config,
  setConfig,
}: {
  isOpen: boolean;
  onClose: Function;
  config: any;
  setConfig: Function;
}) => {
  const [temperature, setTemperature] = useState(config.temperature);
  const [maxLength, setMaxLength] = useState(config.maxLength);
  const [topP, setTopP] = useState(config.topP);
  const [freqPenalty, setFreqPenalty] = useState(config.freqPenalty);
  const [presencePenalty, setPresencePenalty] = useState(
    config.presencePenalty,
  );
  const [logitBias, setLogitBias] = useState(config.logitBias);
  const [stopSequences, setStopSequences] = useState(config.stopSequences);

  const handleTemperatureChange = (event: any, value: any) => {
    setTemperature(value);
  };

  const handleMaxLengthChange = (event: any, value: any) => {
    setMaxLength(value);
  };

  const handleTopPChange = (event: any, value: any) => {
    setTopP(value);
  };

  const handleFreqPenaltyChange = (event: any, value: any) => {
    setFreqPenalty(value);
  };

  const handlePresencePenaltyChange = (event: any, value: any) => {
    setPresencePenalty(value);
  };

  const handleLogitBiasChange = (event: any, value: any) => {
    setLogitBias(value);
  };

  const handleStopSequencesChange = (event: any) => {
    setStopSequences(event.target.value);
  };

  const handleClose = () => {
    const updatedConfig = {
      temperature,
      maxLength,
      stopSequences,
      topP,
      freqPenalty,
      presencePenalty,
      logitBias,
    };
    setConfig(updatedConfig);
    onClose(updatedConfig);
  };
  // alert(`temperature: ${temperature}`);

  return (
    <>
      <Dialog open={isOpen} fullWidth onClose={handleClose} maxWidth="md">
        <Box
          sx={{
            top: "50%",
            left: "50%",
            // transform: 'translate(-50%, -50%)',
            // width: 400,
            // bgcolor: 'background.paper',
            // border: '2px solid #000',
            // boxShadow: 24,
            p: 1,
          }}
        >
          <Box p={1}>
            <Typography variant="h6">LLM Parameters</Typography>
          </Box>
          <Box p={2}>
            <LLMParameter
              label="Temperature"
              parameter={temperature}
              handleParameterChange={handleTemperatureChange}
              min={0}
              max={2}
              step={0.01}
            />
            <LLMParameter
              label="Max Length"
              parameter={maxLength}
              handleParameterChange={handleMaxLengthChange}
              min={0}
              max={4096}
              step={1}
            />
            {/* <LLMParameter 
                label='Stop Sequences' 
                parameter={stopSequences} 
                handleParameterChange={setStopSequences}
                min={0}
                max={2}
                step={0.02}
                ></LLMParameter> */}
            <LLMParameter
              label="Top P"
              parameter={topP}
              handleParameterChange={handleTopPChange}
              min={0}
              max={1}
              step={0.01}
            />
            <LLMParameter
              label="Frequency Penalty"
              parameter={freqPenalty}
              handleParameterChange={handleFreqPenaltyChange}
              min={-2}
              max={2}
              step={0.01}
            />
            <LLMParameter
              label="Presence Penalty"
              parameter={presencePenalty}
              handleParameterChange={handlePresencePenaltyChange}
              min={-2}
              max={2}
              step={0.01}
            />
            {/* <LLMParameter 
                label='Logit Bias' 
                parameter={logitBias} 
                handleParameterChange={setLogitBias}
                min={0}
                max={2}
                step={0.02}
                ></LLMParameter> */}
          </Box>
          <Box p={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

function LLMConfig({
  config,
  setConfig,
}: {
  config: LlmConfigSchema;
  setConfig: (config: LlmConfigSchema) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = (updatedConfig: any) => {
    setIsOpen(false);
    setConfig(updatedConfig);
  };

  return (
    <>
      <Button
        size="small"
        startIcon={<MdBuild />}
        onClick={handleOpenModal}
        variant="text"
        color="primary"
      >
        Parameters
      </Button>
      <LLMConfigModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        config={config}
        setConfig={setConfig}
      />
    </>
  );
}

export default LLMConfig;
