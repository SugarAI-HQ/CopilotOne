import React from 'react';
import {
    Flex,
    Box,
    Text,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    NumberInput,
    NumberInputField,
    Input,
} from '@chakra-ui/react';

function LLMParameter({ label, parameter, handleParameterChange, min, max, step }) {
    return (
        <Flex alignItems="center" justifyContent="space-between">
            <Box flex="1">
                <Text fontSize="md" fontWeight="bold">
                    {label}
                </Text>
            </Box>
            <Box flex="3">
                <Slider
                    focusThumbOnChange={false}
                    value={parameter}
                    onChange={handleParameterChange}
                    min={min}
                    max={max}
                    step={step}
                >
                    <SliderTrack>
                        <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb fontSize="xs" boxSize="32px" children={parameter} />
                </Slider>
            </Box>
            <Box flex="1" ml="1rem">
                {/* <Input
          value={parameter}
          onChange={(e) => handleParameterChange(e.target.value)}
          min={min}
          max={max}
          step={step}
        /> */}
                {/* <LowerLineInput
            value={parameter}
            onChange={(e) => handleParameterChange(e.target.value)}
            min={min}
            max={max}
            step={step}
        ></LowerLineInput> */}
                <NumberInput
                    width='100px'
                    value={parameter}
                    onChange={(value) => handleParameterChange(value)}
                    min={min}
                    max={max}
                    step={step}
                >
                    <NumberInputField
                        // width='20px'
                        borderWidth="0px"   // Set the border width for the lower line
                        borderBottom='1px'
                        // borderColor="gray.300"    // Set the border color for the lower line
                        borderRadius="0"         // Remove border radius to make it square
                    // px="0"                    // Remove horizontal padding
                    // py="3"                    // Adjust vertical padding as needed
                    />
                </NumberInput>
            </Box>
        </Flex>
    );
}



function LowerLineInput(props) {
    return (
        <Input
            borderBottomWidth="1px"   // Set the border width for the lower line
            borderColor="gray.300"    // Set the border color for the lower line
            borderRadius="0"         // Remove border radius to make it square
            px="0"                    // Remove horizontal padding
            py="3"                    // Adjust vertical padding as needed
            {...props}                // Spread additional props
        />
    );
}


export default LLMParameter;
