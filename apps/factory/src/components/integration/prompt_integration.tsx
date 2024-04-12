import { COMPILER_INDEXES } from "next/dist/shared/lib/constants";
import CodeHighlight from "./code_highlight";
import { PackageOutput as pp } from "~/validators/prompt_package";
import { TemplateOutput as pt } from "~/validators/prompt_template";
import { VersionOutput as pv } from "~/validators/prompt_version";
import { env } from "~/env.mjs";
import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState } from "react";
import { api } from "~/utils/api";
import { getVariables } from "~/utils/template";

export const PromptIntegration = ({
  ns,
  pp,
  pt,
  pv,
}: {
  ns: any;
  pp: pp;
  pt: pt;
  pv: pv;
}) => {
  const identifier = `${ns?.username}/${pp?.name}/${pt?.name || "<template>"}/${
    pv?.version || "RELEASE"
  }/generate`;

  let variables = {
    variable1: "value1",
    variable2: "value2",
    variable3: "value3",
  };

  console.log(pv?.template, variables);

  const apiUrl = `${env.NEXT_PUBLIC_API_ENDPOINT}/api/${identifier}`;
  const jwt = "<jwt token>";

  const pythonExample = `
import requests

API_URL = "${apiUrl}"
headers = {"Authorization": "Bearer ${jwt}"}

def query(variables):
  response = requests.post(API_URL, headers=headers, json={data: variables})
  return response.json()

output = query(${JSON.stringify(variables, null, 2)})

`;

  const curlExample = `
  curl ${apiUrl} \
	-X POST \
	-d '{"data": ${JSON.stringify(variables)}}' \
	-H 'Content-Type: application/json' \
	-H "Authorization: Bearer ${jwt}"
`;

  const javascriptExample = `
async function query(variables) {

  var payload = {
    "data": variables
  };

  const response = await fetch(
    "${apiUrl}",
    {
      headers: { Authorization: "Bearer ${jwt}" },
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
  const result = await response.json();
  return result;
}

query(${JSON.stringify(variables, null, 2)})
.then((response) => {
  console.log(JSON.stringify(response));
});
`;

  // const npmExample = `
  // import { SugarcaneAIClient } from "@sugarcane-ai/kitchen-js";

  // const apiKey = 'your-api-key';
  // const client = new SugarcaneAIClient(apiKey);

  // const template = client.getTemplate("${identifier}");
  // console.log(template);
  // `;

  // const codeExample = apiExample;

  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            onChange={handleChange}
            aria-label="lab API tabs example"
            TabIndicatorProps={{
              style: { background: "var(--sugarhub-text-color)" },
            }}
            sx={{
              ".Mui-selected": {
                color: "var(--sugarhub-text-color)",
              },
            }}
          >
            <Tab
              label="Javascript"
              value="1"
              sx={{ color: "var(--sugarhub-text-color)" }}
            />
            <Tab
              label="Python"
              value="2"
              sx={{ color: "var(--sugarhub-text-color)" }}
            />
            <Tab
              label="Curl"
              value="3"
              sx={{ color: "var(--sugarhub-text-color)" }}
            />
          </TabList>
        </Box>
        <TabPanel value="1">
          <CodeHighlight code={javascriptExample} language="javascript" />
        </TabPanel>
        <TabPanel value="2">
          <CodeHighlight code={pythonExample} language="python" />
        </TabPanel>
        <TabPanel value="3">
          <CodeHighlight code={curlExample} language="shell" />
        </TabPanel>
      </TabContext>
    </>
  );
};

PromptIntegration.defaultProps = {
  pt: null,
  pv: null,
};
