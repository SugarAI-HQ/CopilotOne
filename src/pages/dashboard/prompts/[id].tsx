import React, { useState } from "react";
import { Typography, Box, Container, styled, Paper } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import PromptVersion from "~/components/prompt_version";
import PromptVariables from "~/components/prompt_variables";
import { NextPage } from "next";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import {PromptPackage as pp, PromptTemplate as pt, PromptVersion as pv} from "@prisma/client";
import { PromptVariableProps } from "~/components/prompt_variables";
import { useSession } from "next-auth/react";
import CodeHighlight from "~/components/code_highlight";

export const getVariables = (template: pt) => {
    console.debug(`template: ${JSON.stringify(template)}`);
    if (!template) {
        return [];
    }
    const allVariables = template.description.match(/\{([#$@%].*?)\}/g);

    if (!allVariables) {
        return []; // No variables found, return an empty array.
    }

    const flattenedVariables = allVariables.map((variable) => {
        // const type = variable.charAt(1); // Get the type of variable (#, @, %, $).
        // const key = variable.substring(2, variable.length - 1); // Get the variable name.



        const obj: PromptVariableProps = {
            key: variable.substring(2, variable.length - 1), // Get the variable name.
            type: variable.charAt(1), // Get the type of variable (#, @, %, $).
            value: '',
        };
        return obj
    });
    return flattenedVariables;
};

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export const getAllTemplateVariables = (templates: pt[]): Array<PromptVariableProps> => {
    if (!templates) {
        return [];
    }

    const allVariables = templates.flatMap((template) => getVariables(template));

    // Use a Set to ensure uniqueness and convert back to an array.
    // const uniqueVariables = Array.from(new Set(allVariables));
    // const uniqueVariables = Array.from(new Set(allVariables.map(item => item.key)));

    return allVariables;
};

export function getUniqueJsonArray(jsonArray: PromptVariableProps[], uniqueKey: any) {
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

// interface PackageShowProps {
//     // Define your component props here
// }


const PackageShow: NextPage = () => {
    const router = useRouter();
    const packageId = router.query.id as string;

    const { data: sessionData } = useSession();
    const user = sessionData?.user

    console.log(`Package Id: ${packageId}`);
    const { data: pkg } = api.prompt.getPackage.useQuery({ id: packageId });

    const { data: templates } = api.prompt.getTemplates.useQuery({ promptPackageId: packageId });

    const allVariables = getAllTemplateVariables(templates || []);
    console.log(allVariables);
    let templateVariables = getUniqueJsonArray(allVariables, "key");
    console.log(`templateVariables >>>> ${JSON.stringify(templateVariables)}`);
    
    const pvvvs = [{"key":"BOT_NAME","type":"#","value":""},{"key":"LLM_PROVIDER","type":"#","value":""},{"key":"ROLE","type":"@","value":""},{"key":"DESCRIPTION","type":"@","value":""},{"key":"TASKS","type":"@","value":""},{"key":"CHAT_HISTORY","type":"$","value":""},{"key":"QUERY","type":"%","value":""}]
    let [pvs, setVars] = useState(pvvvs);

    const version = {version: '0.0.1'} as pv
    

    console.log(`pvs >>>> ${JSON.stringify(pvs)}`);

    // Function to update the array
    const handleVariablesChange = (k: string, v: string) => {
        setVars((pvs) => {
            // Step 2: Update the state
            return pvs.map((pv) => {
                if (pv.key === k) {
                    // pv.value = v;
                    console.log(`value of ${pv.key}: ${pv.value} => ${v}`);
                    return { ...pv, ...{ value: v } };
                }
                return pv;
            });
        });
    };

    // const handleVariablesChange = (k: string, v: string) => {
    //     templateVariables = templateVariables.map((variable) => {
    //         if (variable.key === k) {
    //             variable.value = v;
    //             console.log(`value of ${variable.key} changed to ${variable.value}`);
    //             return { ...variable, ...{value: v} };
    //         }
    //         return variable;
    //     });
    //     // setVariables(newVariables);

    //     // return arr.map((item) => {
    //     //     if (item.id === idToUpdate) {
    //     //       // Use Object.assign or the spread operator to update the object's properties
    //     //       return { ...item, ...updatedProperties };
    //     //     }
    //     //     return item; // Leave other objects unchanged
    //     //   });
    //     console.log(vars);
    // };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                {pkg && (
                    <Typography variant="h4" component="h2" sx={{ mt: 1, mb: 2 }}>
                        {pkg.name}
                    </Typography>
                )}
                <Grid container spacing={2}>
                    <Grid xs={12} md={2} lg={2}>
                        <PromptVariables
                            vars={pvs}
                            onChange={handleVariablesChange}
                        />
                    </Grid>
                    <Grid container xs={12} md={7} lg={8} spacing={1}>
                        {templates && templates.length > 0 ? (
                            templates.map((template, index) => (
                                <Grid key={index} xs={6} lg={4}>
                                    <Item>
                                        <Box
                                            id={"prompt-version-" + index}
                                        // sx={{ fontSize: '12px', textTransform: 'uppercase' }}
                                        >
                                            <PromptVersion
                                                user={user}
                                                pkg={pkg}
                                                template={template}
                                                version={version}
                                                variables={pvs}
                                            />
                                        </Box>
                                    </Item>
                                </Grid>
                            ))
                        ) : (
                            <Grid xs={6} lg={3}>
                                <Item>
                                    <Box
                                        sx={{ fontSize: '12px', textTransform: 'uppercase' }}
                                        width="100vw"
                                        height="100%"
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <Typography variant="h2">No templates created</Typography>
                                    </Box>
                                </Item>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

// PackageShow.getLayout = getLayout

export default PackageShow;
