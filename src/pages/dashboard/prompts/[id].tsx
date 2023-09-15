import React from "react";
import { Typography, Box, Container, styled, Paper } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import PromptVersion from "~/components/prompt_version";
import PromptVariables from "~/components/prompt_variables";
import { NextPage } from "next";
import { getLayout } from "~/components/Layouts/DashboardLayout";

export const getVariables = (template) => {
    console.debug(`template: ${JSON.stringify(template)}`);
    if (!template) {
        return [];
    }
    const allVariables = template.description.match(/\{([#$@%].*?)\}/g);

    if (!allVariables) {
        return []; // No variables found, return an empty array.
    }

    const flattenedVariables = allVariables.map((variable) => {
        const type = variable.charAt(1); // Get the type of variable (#, @, %, $).
        const key = variable.substring(2, variable.length - 1); // Get the variable name.

        return {
            key,
            type,
        };
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

export const getAllTemplateVariables = (templates) => {
    if (!templates) {
        return [];
    }

    const allVariables = templates.flatMap((template) => getVariables(template));

    // Use a Set to ensure uniqueness and convert back to an array.
    // const uniqueVariables = Array.from(new Set(allVariables));
    // const uniqueVariables = Array.from(new Set(allVariables.map(item => item.key)));

    return allVariables;
};

export function getUniqueJsonArray(jsonArray, uniqueKey) {
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
    const router = useRouter();
    const packageId = router.query.id as string;

    console.log(`Package Id: ${packageId}`);
    const { data: pkg } = api.prompt.getPackage.useQuery({ id: packageId });

    const { data: templates } = api.prompt.getTemplates.useQuery({ promptPackageId: packageId });

    const allVariables = getAllTemplateVariables(templates);
    console.log(allVariables);
    const variables = getUniqueJsonArray(allVariables, "key");

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
                        <PromptVariables vars={variables} />
                    </Grid>
                    <Grid container xs={12} md={7} lg={8} spacing={1}>
                        {templates && templates.length > 0 ? (
                            templates.map((template, index) => (
                                <Grid key={index} xs={6} lg={4}>
                                    <Item>
                                        <Box
                                            id={"prompt-version-"+index}
                                            // sx={{ fontSize: '12px', textTransform: 'uppercase' }}
                                        >
                                            <PromptVersion template={template} version={template} />
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
