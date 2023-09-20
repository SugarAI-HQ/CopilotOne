import React from "react";
import { Box, styled, Paper } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { api } from "~/utils/api";
import PromptVersion from "~/components/prompt_version";
import {PromptPackage as pp, PromptTemplate as pt, PromptVersion as pv} from "@prisma/client";
import { CreateVersion } from "./create_version";
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const PromptTemplate = ({pp, pt}:{pp: pp, pt: pt}) => {

    const { data: pvs } = api.prompt.getVersions.useQuery({ 
        promptPackageId: pt?.promptPackageId, 
        promptTemplateId: pt?.id 
    });

    console.log(`pvs <<<<>>>> ${JSON.stringify(pvs)}`);

    // const handleTemplateSelection = (e: any) => {
    //     setPtId(e.target.value)
    //     // setPt(pvs?.find(pt => pt.id === e.target.value))
    // }

    const handleVersionCreate = (pv:any) => {
        pvs?.push(pv)
    }

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>

                {pt && pt.id && (<CreateVersion
                    pp={pp as pp}
                    pt={pt as pt}
                    onSubmit={handleVersionCreate}

                ></CreateVersion>)}

                <Grid id="pts-container"  container spacing={2}>
                    {pvs && pvs.length > 0 &&
                        (pvs.map((pv, index) => (
                            <Grid id="pt-{index}" key={index} xs={12} md={6} lg={6}>
                                <Item>
                                    <Box
                                        id={"prompt-version-" + index}
                                    // sx={{ fontSize: '12px', textTransform: 'uppercase' }}
                                    >
                                        {pv && (<PromptVersion
                                            pp={pp}
                                            pt={pt}
                                            pv={pv}
                                            handleVersionCreate={handleVersionCreate}
                                        />)}
                                    </Box>
                                </Item>
                            </Grid>
                        )))
                    }
                </Grid>
            </Box>
        </>
    );
};

export default PromptTemplate;