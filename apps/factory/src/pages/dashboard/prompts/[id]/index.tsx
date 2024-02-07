import React, { useState } from "react";
import {
  Typography,
  Box,
  Container,
  styled,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Link,
  Button,
  Toolbar,
  Chip,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { NextPage } from "next";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import { VersionOutput as pv } from "~/validators/prompt_version";
import { useSession } from "next-auth/react";
import { CreateTemplate } from "~/components/create_template";
import toast from "react-hot-toast";
import PromptTemplate from "~/components/prompt_template";
import DatasetIcon from "@mui/icons-material/Dataset";
import HomeIcon from "@mui/icons-material/Home";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import { NextPageWithLayout } from "~/pages/_app";
import { colorType } from "~/validators/base";
import PublicUrl from "~/components/integration/public_url";

const PackageShow: NextPageWithLayout = () => {
  const router = useRouter();
  const { pathname, query } = router;
  const packageId = query.id as string;
  // to handle the status of mutation
  const [status, setStatus] = useState("");

  //to throw error that we receive from backend
  const [customError, setCustomError] = useState({});

  const { data: sessionData } = useSession();

  // TODO: Fix this NS based on the route rather than current user
  const ns = sessionData?.user;

  // Load data
  const { data: pp, refetch: rpp } = api.prompt.getPackage.useQuery({
    id: packageId,
  });
  // console.log(`pp <<<<>>>> ${JSON.stringify(pp)}`);
  const [ptId, setPtId] = useState<string>("");
  const [ptName, setPtName] = useState<string>("");
  const [pt, setPt] = useState<pt>();
  const [options, setOptions] = useState({
    provider: "llama2",
    model: "7b",
  });

  const { data: pts, refetch: rpts } = api.prompt.getTemplates.useQuery(
    {
      promptPackageId: packageId,
    },
    {
      onSuccess(lPts) {
        if (lPts.length != 0 && !ptId) {
          let ptId: string = query.ptid ? (query.ptid as string) : lPts[0]!.id;
          handleTemplateSelection(ptId, lPts);
        }
      },
    },
  );

  const handleTemplateSelection = (ptId: string, lPts: pt[] = []) => {
    const selectedTemplate = lPts?.find((pt) => pt?.id === ptId);

    console.log(
      `ptId <> selected ${ptId} ${lPts?.length} ${selectedTemplate?.name}`,
    );

    // Update url query
    query.ptid = ptId;
    router.push({ pathname: pathname, query: query });

    // Set states
    setPtName(selectedTemplate?.name as string);
    setPtId(ptId);
    setPt(selectedTemplate);
  };

  const ptCreateMutation = api.prompt.createTemplate.useMutation();

  const handleCreateTemplate = (data: any) => {
    ptCreateMutation.mutate(data.template, {
      onError: (error) => {
        const errorData = JSON.parse(error.message);
        setCustomError(errorData);
      },
      onSuccess: (uPt) => {
        if (uPt !== null) {
          toast.success("Template Created Successfully");
          setStatus("success");
          pts?.push(uPt);
          rpts();
          setPt(uPt);
          setPtId(uPt?.id);
          setOptions(data.options);
        } else {
          toast.error("Something went wrong, Please try again");
        }
      },
    });
  };

  const getColor = (version: string | null | undefined): colorType => {
    let color: colorType = "error";
    if (version) {
      color = "success";
    }
    return color;
  };

  const handleTemplateUpdate = (uPt: pt) => {
    console.log(`handleTemplateUpdate <<<<>>>> ${JSON.stringify(uPt)}`);
    // setPt(uPt)
    rpts();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(`handleTabChange <<<<>>>>`);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {pp && (
          <Toolbar>
            <Typography variant="h4" component="span" sx={{ mt: 1, mb: 2 }}>
              {ns?.username} / {pp.name} /
            </Typography>
            {pts && pts?.length > 0 ? (
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 250 }}
                size="small"
              >
                {/* <InputLabel id="pt-selector">Select Template</InputLabel> */}
                <Select
                  labelId="pt-selector"
                  label="Select Template"
                  id="pt-selector"
                  value={ptId}
                  onChange={(e) => handleTemplateSelection(e.target.value, pts)}
                >
                  {pts.map((t, index) => (
                    <MenuItem key={"pt-" + index} value={t.id}>
                      {t?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <span></span>
            )}
            {pts && (
              <>
                <Grid component="span">
                  <Grid container>
                    <Grid item xs={6} md={6} lg={6}>
                      <CreateTemplate
                        key={"create-template-" + pts.length}
                        pp={pp as pp}
                        pts={pts}
                        onCreate={handleCreateTemplate}
                        status={status}
                        customError={customError}
                        ptId={false}
                      ></CreateTemplate>
                    </Grid>
                    <Grid item xs={6} md={6} lg={6}>
                      {ptId ? (
                        <>
                          <CreateTemplate
                            key={"edit-template-" + ptId}
                            pp={pp as pp}
                            pts={pts}
                            onCreate={handleCreateTemplate}
                            status={status}
                            customError={customError}
                            ptId={ptId}
                          ></CreateTemplate>
                        </>
                      ) : (
                        <></>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            {pt && <Box sx={{ flexGrow: 1 }}></Box>}
            {pt && (
              <Box sx={{ display: "inline", flexGrow: 1 }}>
                <Paper
                  elevation={3}
                  sx={{
                    display: "flex",
                    justifyContent: "right",
                    flexWrap: "wrap",
                    listStyle: "none",
                    p: 0.5,
                  }}
                  component="span"
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Tabs value={1} onChange={handleTabChange}>
                      <Tab
                        label="Home"
                        icon={<HomeIcon />}
                        iconPosition="start"
                        component={Link}
                        value={1}
                        href={`/dashboard/prompts/${pp.id}/logs`}
                      />
                      <Tab
                        label="Logs"
                        icon={<DatasetIcon />}
                        iconPosition="start"
                        value={2}
                        component={Link}
                        href={`/dashboard/prompts/${pp.id}/logs`}
                      />
                      {/* <Tab
                        label="Insights"
                        icon={<AnalyticsIcon />}
                        iconPosition="start"
                        component={Link}
                        href={`/dashboard/prompts/${pp.id}/analytics`}
                      /> */}
                    </Tabs>
                  </Box>

                  <Box sx={{ mt: 2, mb: 2 }}>
                    <Typography component="span" sx={{ mr: 1 }}>
                      Preview :{" "}
                      <Chip
                        label={pt?.previewVersion?.version || "NA"}
                        color={getColor(pt?.previewVersion?.version)}
                        variant="outlined"
                      />
                    </Typography>
                    {pt?.previewVersion?.version && (
                      <Typography component="span" sx={{ ml: 1, p: 2 }}>
                        <PublicUrl
                          title={"Preview URL"}
                          url={`/${ns?.username}/${pp.name}/${ptName}/preview`}
                        />
                      </Typography>
                    )}
                    <Typography component="span" sx={{ ml: 1 }}>
                      Release :{" "}
                      <Chip
                        label={pt?.releaseVersion?.version || "NA"}
                        // color={getColor(pt?.releaseVersion?.version)}
                        color={"primary"}
                        variant="outlined"
                      />
                    </Typography>
                    {pt?.releaseVersion?.version && (
                      <Typography component="span" sx={{ ml: 1, p: 2 }}>
                        <PublicUrl
                          title={"Release URL"}
                          url={`/${ns?.username}/${pp.name}/${ptName}/release`}
                        />
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Box>
            )}
          </Toolbar>
        )}
        {pt && (
          <PromptTemplate
            ns={ns}
            pt={pt}
            pp={pp as pp}
            onTemplateUpdate={handleTemplateUpdate}
            options={options}
          ></PromptTemplate>
        )}
      </Box>
    </>
  );
};

PackageShow.getLayout = getLayout;

export default PackageShow;
