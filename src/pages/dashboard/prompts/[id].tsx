import React, { useState } from "react";
import { Typography, Box, Container, styled, Paper, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
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
import { CreateTemplate } from "~/components/create_template";
import toast from 'react-hot-toast';
import PromptTemplate from "~/components/prompt_template";


// interface PackageShowProps {
//     // Define your component props here
// }

// function createNewTemplate(pp: pp) {
//     const pt = {
//         promptPackageId: pp.id,
//         name: 'Untitled',
//         description: ''
//     } as pt

//     return pt
// }

// function createNewVersion(pp: pp, pt: pt) {
//     const pv = {
//         promptPackageId: pp.id,
//         template: '',
//         version: '0.0.1',
//     } as pv
//     return pv
// }


const PackageShow: NextPage = () => {
    const router = useRouter();
    const packageId = router.query.id as string;

    const { data: sessionData } = useSession();
    const user = sessionData?.user

    // Load data 
    const { data: pp } = api.prompt.getPackage.useQuery({ id: packageId });
    console.log(`pp <<<<>>>> ${JSON.stringify(pp)}`);
    const [ptId, setPtId] = useState();
    const [pt, setPt] = useState<pt>();

    const { data: pts } = api.prompt.getTemplates.useQuery({ promptPackageId: packageId });
    console.log(`pts <<<<>>>> ${JSON.stringify(pts)}`);

    const handleTemplateSelection = (e: any) => {
        const id = e.target.value;
        setPtId(id)
        setPt(pts?.find((pt) => pt.id == id))
    }

    const ptCreateMutation = api.prompt.createTemplate.useMutation({
        onSuccess: (pt) => {
            if (pt !== null) {
                pts?.push(pt)
                toast.success("Template Created Successfully");
            }
        }
    })


    // let pv:pv;

    // if (pts?.length == 0) {
    //     pt = createNewTemplate(pp as pp) as pt
    //     pts.push(pt)

    //     pv = createNewVersion(pp as pp, pt)
    // }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                {pp && (
                    <div>
                    <Typography variant="h4" component="span" sx={{ mt: 1, mb: 2 }}>
                        {pp.name} /
                    </Typography>
                    {pts && pts?.length > 0 ?
                        (
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }} size="small">
                            {/* <InputLabel id="pt-selector">Select Template</InputLabel> */}
                            <Select
                                labelId="pt-selector"
                                label="Select Template"
                                id="pt-selector"
                                value={ptId}
                                onChange={handleTemplateSelection}
                            >   
                                {pts.map((t, index) =>(
                                    <MenuItem 
                                        key={"pt-"+index}
                                        value={t.id}
                                    >
                                        {t?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        ) : (
                        <span>
                        </span>
                    )}
                    <CreateTemplate
                        pp={pp as pp}
                        onSubmit={ptCreateMutation.mutate}
                    ></CreateTemplate>
                    </div>
                )}
                <PromptTemplate pt={pt} pp={pp}></PromptTemplate>
            </Box>
        </>
    );
};

PackageShow.getLayout = getLayout

export default PackageShow;
