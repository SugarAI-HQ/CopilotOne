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
import { getAllTemplateVariables, getUniqueJsonArray } from "~/utils/template";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

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
    console.log(`PromptVersions <<<<>>>> ${JSON.stringify(templates)}`);

    const allVariables = getAllTemplateVariables(templates || []);
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

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                {pkg && (
                    <Typography variant="h4" component="h2" sx={{ mt: 1, mb: 2 }}>
                        {pkg.name}
                    </Typography>
                )}
                <Grid container spacing={2}>
                    {/* <Grid xs={12} md={2} lg={2}>
                        <PromptVariables
                            vars={pvs}
                            onChange={handleVariablesChange}
                        />
                    </Grid> */}
                    <Grid container xs={12} md={7} lg={8} spacing={1}>
                        {templates && templates.length > 0 ? (
                            templates.map((template, index) => (
                                <Grid key={index} xs={6} lg={4}>
                                    <Item>
                                        <Box
                                            id={"prompt-version-" + index}
                                        // sx={{ fontSize: '12px', textTransform: 'uppercase' }}
                                        >
                                            {template && (<PromptVersion
                                                user={user}
                                                pp={pkg}
                                                pt={template}
                                                pv={version}
                                                variables={pvs}
                                            />)}
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

PackageShow.getLayout = getLayout

export default PackageShow;
