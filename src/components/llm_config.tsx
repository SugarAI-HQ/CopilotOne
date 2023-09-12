import React, { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Input,
    Text,
    Textarea,
    Flex,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
} from '@chakra-ui/react';
// import { InfoIcon } from "@chakra-ui/icons";
import { MdBuild, MdDisplaySettings } from 'react-icons/md';
import { BiSolidCog } from 'react-icons/bi';
import LLMParameter from './llm_parameter';


const LLMConfigModal = ({ isOpen, onClose, config, setConfig }) => {
    const [temperature, setTemperature] = useState(config.temperature);
    const [maxLength, setMaxLength] = useState(config.maxLength);
    const [stopSequences, setStopSequences] = useState(config.stopSequences);
    const [topP, setTopP] = useState(config.topP);
    const [freqPenalty, setFreqPenalty] = useState(config.freqPenalty);
    const [presencePenalty, setPresencePenalty] = useState(config.presencePenalty);
    const [logitBias, setLogitBias] = useState(config.logitBias);

    const handleTemperatureChange = (value) => {
        setTemperature(value);
    };

    const handleMaxLengthChange = (value) => {
        setMaxLength(value);
    };

    const handleStopSequencesChange = (event) => {
        setStopSequences(event.target.value);
    };

    const handleTopPChange = (value) => {
        setTopP(value);
    };

    const handleFreqPenaltyChange = (value) => {
        setFreqPenalty(value);
    };

    const handlePresencePenaltyChange = (value) => {
        setPresencePenalty(value);
    };

    const handleLogitBiasChange = (event) => {
        setLogitBias(event.target.value);
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

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>LLM Parameters</ModalHeader>
                <ModalBody>
                    <LLMParameter
                        label='Temperature'
                        parameter={temperature}
                        handleParameterChange={setTemperature}
                        min={0}
                        max={2}
                        step={0.01}
                    ></LLMParameter>
                    <LLMParameter
                        label='Max Lenght'
                        parameter={maxLength}
                        handleParameterChange={setMaxLength}
                        min={0}
                        max={4096}
                        step={1}
                    ></LLMParameter>
                    {/* <LLMParameter 
                label='Stop Sequences' 
                parameter={stopSequences} 
                handleParameterChange={setStopSequences}
                min={0}
                max={2}
                step={0.02}
                ></LLMParameter> */}
                    <LLMParameter
                        label='Top P'
                        parameter={topP}
                        handleParameterChange={setTopP}
                        min={0}
                        max={1}
                        step={0.01}
                    ></LLMParameter>
                    <LLMParameter
                        label='Frequency Penalty'
                        parameter={freqPenalty}
                        handleParameterChange={setFreqPenalty}
                        min={-2}
                        max={2}
                        step={0.01}
                    ></LLMParameter>
                    <LLMParameter
                        label='Presence Penalty'
                        parameter={presencePenalty}
                        handleParameterChange={setPresencePenalty}
                        min={-2}
                        max={2}
                        step={0.01}
                    ></LLMParameter>
                    {/* <LLMParameter 
                label='Logit Bias' 
                parameter={logitBias} 
                handleParameterChange={setLogitBias}
                min={0}
                max={2}
                step={0.02}
                ></LLMParameter> */}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

function LLMConfig({ config, setConfig }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = (updatedConfig) => {
        setIsOpen(false);
        setConfig(updatedConfig);
    };

    return (
        <span>
            <Button
                size='sm'
                leftIcon={<BiSolidCog />}
                onClick={handleOpenModal}
                variant="solid"
            >
                Parameters
            </Button>
            <LLMConfigModal
                isOpen={isOpen}
                onClose={handleCloseModal}
                config={config}
                setConfig={setConfig}
            />
            {/* Display or use config values */}
        </span>
    );
}

export default LLMConfig;
