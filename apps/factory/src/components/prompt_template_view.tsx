import React, { useEffect, useState } from "react";
import Header from "~/components/marketplace/header";
import {
  Container,
  Box,
  Stack,
  Button,
  Checkbox,
  Grid,
  Typography,
  Dialog,
} from "@mui/material";
import { api } from "~/utils/api";
import { promptEnvironment } from "~/validators/base";
import PromptVariables, { PromptVariableProps } from "./prompt_variables";
import { getUniqueJsonArray, getVariables } from "~/utils/template";
import { GenerateInput, GenerateOutput } from "~/validators/service";
import FormControlLabel from "@mui/material/FormControlLabel";
import PromptOutput from "./prompt_output";
import { ModelTypeType } from "~/generated/prisma-client-zod.ts";
import { useSession, signIn } from "next-auth/react";
import Link from "@mui/material/Link";
const isDev = process.env.NODE_ENV === "development";
import { displayModes, DisplayModes } from "~/validators/base";

interface PromptTemplateViewProps {
  username: string;
  packageName: string;
  template: string;
  versionOrEnvironment: string;
}

const PromptTemplateView: React.FC<PromptTemplateViewProps> = ({
  username,
  packageName,
  template,
  versionOrEnvironment,
}) => {
  const { data: session, status } = useSession();
  const [checked, setChecked] = useState(isDev);
  const [pvrs, setVariables] = useState<PromptVariableProps[]>();
  const [pl, setPl] = useState<GenerateOutput>(null);
  const [promptOutput, setPromptOutput] = useState("");
  const [promptPerformance, setPromptPerformacne] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const handleOpen = () => setIsOpen(true);

  const { data } = api.cube.getPrompt.useQuery({
    username: username,
    package: packageName,
    template: template,
    versionOrEnvironment: versionOrEnvironment?.toUpperCase(),
  });

  useEffect(() => {
    const variables = getUniqueJsonArray(
      getVariables(data?.template || ""),
      "key",
    );
    setVariables(variables);
  }, [data]);

  const handleVariablesChange = (k: string, v: string) => {
    setVariables((pvrs) => {
      // Step 2: Update the state
      return pvrs?.map((pvr) => {
        if (pvr.key === k) {
          // pvr.value = v;
          console.log(`gPv  ${pvr.key}: ${pvr.value} => ${v}`);
          return { ...pvr, ...{ value: v } };
        }
        return pvr;
      });
    });

    // console.log(`pvrs >>>> ${JSON.stringify(pvrs)}`);
  };

  const generateMutation = api.service.generate.useMutation(); // Make sure to import 'api' and set up the service

  const handleRun = async (e: any) => {
    console.log(`running template version ${versionOrEnvironment}`);

    let data: { [key: string]: any } = {};
    for (const item of pvrs as PromptVariableProps[]) {
      data[`${item.type}${item.key}`] = item.value;
    }

    const pl = await generateMutation.mutateAsync({
      username: username,
      package: packageName || "",
      template: template || "",
      versionOrEnvironment: versionOrEnvironment?.toUpperCase() || "",
      isDevelopment: checked,

      data: data,
    } as GenerateInput);

    console.log(`pl >>>>>>>: ${JSON.stringify(pl)}`);
    if (pl) {
      setPl(pl);
      setPromptOutput(pl.completion);
      setPromptPerformacne({
        latency: pl.latency,
        prompt_tokens: pl.prompt_tokens,
        completion_tokens: pl.completion_tokens,
        total_tokens: pl.total_tokens,
      });
    }
  };

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  return (
    <>
      <Header headerName={"Sugar Cubes"} />
      <Container className="center">
        <div className="dark:border-gray-70  w-full rounded-lg border p-4 shadow sm:p-6">
          {data || !versionOrEnvironment ? (
            <>
              <h5 className="mb-3 text-base font-semibold text-gray-900 dark:text-white md:text-xl">
                {data?.description}
              </h5>
              <Box sx={{ m: 1 }}>
                {pvrs && (
                  <PromptVariables
                    vars={pvrs}
                    onChange={handleVariablesChange}
                    mode={displayModes.Enum.EDIT}
                  />
                )}
              </Box>
              <Stack direction="row" spacing={1} sx={{ p: 1 }}>
                {isDev && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        color="primary" // Change the color to your preference
                      />
                    }
                    label="Dummy"
                  />
                )}
                <Button
                  color="success"
                  variant="outlined"
                  onClick={session ? handleRun : handleOpen}
                  disabled={pvrs?.some((v) => v.value === "")}
                >
                  Run
                </Button>
                {!session && isOpen && (
                  <Box>
                    <Typography className="mt-2">
                      <Link href="#" onClick={() => void signIn()}>
                        Signup
                      </Link>{" "}
                      to run the task!
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Box sx={{ m: 1 }}>
                {promptOutput && (
                  <Stack direction="row" spacing={2} sx={{ p: 1 }}>
                    <Grid>
                      <Box padding={2}>
                        <Typography variant="h6" className="mb-5">
                          Output
                        </Typography>
                        <PromptOutput
                          output={promptOutput}
                          modelType={data?.modelType as ModelTypeType}
                        />
                      </Box>
                    </Grid>
                  </Stack>
                )}
              </Box>
            </>
          ) : (
            <> No template found</>
          )}
        </div>
      </Container>
    </>
  );
};

export default PromptTemplateView;
