import React from "react";
import { Typography, Grid, Box, Container } from "@mui/material";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import PromptVersion from "~/components/prompt_version";
import PromptVariables from "~/components/prompt_variables";

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

const PackageShow = () => {
    const router = useRouter();
    const packageId = router.query.id as string;

    console.log(`Package Id: ${packageId}`);
    const { data: pkg } = api.prompt.getPackage.useQuery({ id: packageId });

    const { data: templates } = api.prompt.getTemplates.useQuery({ promptPackageId: packageId });

    const allVariables = getAllTemplateVariables(templates);
    console.log(allVariables);
    const variables = getUniqueJsonArray(allVariables, "key");

    return (
        <Container>
            {pkg && (
                <Typography variant="h2" component="h2" sx={{ mt: 6, mb: 2 }}>
                    {pkg.name}
                </Typography>
            )}
            <Grid container spacing={4}>
                <Grid item xs={12} sm={3}>
                    <PromptVariables vars={variables} />
                </Grid>
                <Grid item xs={12} sm={9}>
                    {templates && templates.length > 0 ? (
                        templates.map((template, index) => (
                            <PromptVersion key={index} template={template} version={template} />
                        ))
                    ) : (
                        <Box
                            width="100vw"
                            height="100%"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Typography>No templates created</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default PackageShow;
