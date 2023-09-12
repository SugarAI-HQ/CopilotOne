import React, { useState } from "react";
import { Text, Flex, HStack, Grid, GridItem, Stack, InputLeftElement, InputGroup, Input, InputLeftAddon, Button, Box, Container, Heading, Select } from "@chakra-ui/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

import { Textarea } from '@chakra-ui/react'
import LLMSelector from "./llm_selector";
import LLMConfig from "./llm_config";


export const getVariables = (template: string) => {
    console.debug(`template: ${JSON.stringify(template)}`)
    if (!template) {
        return []
    }
    const allVariables = template.description.match(/\{([#$@%].*?)\}/g);

    if (!allVariables) {
        return []; // No variables found, return an empty array.
    }

    const flattenedVariables = allVariables.map((variable) => {
        const type = variable.charAt(1); // Get the type of variable (#, @, %, $).
        const key = variable.substring(2, variable.length - 1); // Get the variable name.
        // const key = variable.substring(1, variable.length - 1)

        return {
            key,
            type,
        };
    });
    // console.log(`variables: ${JSON.stringify(flattenedVariables)}`)
    return flattenedVariables;
};


export const getAllTemplateVariables = (templates: string[]) => {
    if (!templates) {
        return []
    }

    const allVariables = templates.flatMap((template) => getVariables(template));

    // Use a Set to ensure uniqueness and convert back to an array.
    // const uniqueVariables = Array.from(new Set(allVariables));
    // const uniqueVariables = Array.from(new Set(allVariables.map(item => item.key)));


    return allVariables;
};

export function getUniqueJsonArray(jsonArray: object[], uniqueKey: string): object[] {
    const uniqueSet = new Set();
    const uniqueArray = [];

    for (const obj of jsonArray) {
        const keyValue = obj[uniqueKey];

        if (!uniqueSet.has(keyValue)) {
            uniqueSet.add(keyValue);
            uniqueArray.push(obj);
        }
    }
    return uniqueArray;
}




const PackageShow: NextPage = () => {
    // const { data: userData, refetch: refetchUser } = useRequiredUserData();    
    const router = useRouter();
    const packageId = router.query.id as string;

    console.log(`Package Id: ${packageId}`);
    const { data: pkg } = api.prompt.getPackage.useQuery(
        { id: packageId }
    );

    const { data: templates } = api.prompt.getTemplates.useQuery(
        { promptPackageId: packageId }
    );

    const allVariables = getAllTemplateVariables(templates)
    console.log(allVariables)
    const variables = getUniqueJsonArray(allVariables, 'key')

    const color = 'black'
    const bgColor = 'black'

    return (
        <Box>
            {pkg && (
                <Heading as="h2" size="xl" mt={6} mb={2}>
                    {pkg.name}
                </Heading>
            )}
            <Grid
                h='200px'
                color={color}
                templateRows='repeat(2, 1fr)'
                templateColumns='repeat(5, 1fr)'
                gap={4}
            >
                <GridItem rowSpan={'auto'} colSpan={1} bg={bgColor}>
                    <PromptVariables
                        vars={variables}
                    />

                </GridItem>
                <GridItem rowSpan={'auto'} colSpan={4} bg={bgColor}>
                    <HStack color='white'>
                        {templates && templates.length > 0 ? (
                            templates.map((template, index) => (
                                <PromptVersion
                                    color={color}
                                    template={template}
                                    version={index + 1}
                                >
                                </PromptVersion>
                            ))
                        ) : (
                            <Flex w="100vw" h="100%" align="center" justify="center">
                                <Text>No templates created</Text>
                            </Flex>
                        )}
                    </HStack>



                </GridItem>
            </Grid>

        </Box>
    );
};

function PromptVariables({ vars }) {
    console.log(`variables : ${JSON.stringify(vars)}`)
    let [variables, setVariables] = useState(vars)

    return (
        <>
            <Text>Variables</Text>
            <Stack spacing={4}>
                {vars && vars.length > 0 && vars.map((v, index) => (
                    <InputGroup>
                        <InputLeftAddon children={v.type} />
                        <Input type='string' placeholder={v.key} />
                    </InputGroup>


                ))}
            </Stack>
        </>
    )
}


function PromptVersion({ template, version }) {
    // console.log(template);
    let [prompttemplate, setTemplate] = useState(template)
    let [provider, setProvider] = useState('OpenAI')
    let [model, setModel] = useState('gpt-3.5-turbo')
    let [llmConfig, setLLMConfig] = useState({})

    let handleInputChange = (e) => {
        let inputValue = e.target.value
        setTemplate(inputValue)
    }

    return (
        <>
            <Container direction='column' justifyContent="center">
                <Text>{prompttemplate.name}</Text>
                <Textarea
                    value={prompttemplate.description}
                    onChange={handleInputChange}
                    placeholder='Enter your prompt template'
                    size='sm'
                    resize='vertical'
                />
                <Box>
                    <Button colorScheme='green'>Run</Button>
                    <LLMSelector
                        initialProvider={provider}
                        initialModel={model}
                        onProviderChange={setProvider}
                        onModelChange={setModel}
                    ></LLMSelector>
                    <LLMConfig
                        config={llmConfig}
                        setConfig={setLLMConfig}
                    ></LLMConfig>
                </Box>
            </Container>

        </>
    )

}

export default PackageShow;