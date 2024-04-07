import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { getLayout } from "~/app/layout";

import { NextPageWithLayout } from "~/pages/_app";
import { api } from "~/utils/api";

const CopilotShow: NextPageWithLayout = () => {
  const router = useRouter();
  const copilotId = router.query.id as string;
  const { data: copilot } = api.copilot.getCopilot.useQuery({ id: copilotId });

  const { data: copilotKey } = api.apiKey.getCopilotKey.useQuery({
    copilotId: copilot?.id as string,
  });

  return (
    <>
      <Box
        sx={{ p: 2, display: "flex", alignItems: "center" }}
        className="w-full"
      >
        <Typography
          variant="h4"
          component="span"
          sx={{ mt: 1, mb: 4, flex: 1 }}
        >
          {`${copilot?.name} copilot`}
        </Typography>
      </Box>
      {copilot && (
        <Box
          sx={{ p: 2, display: "flex", alignItems: "center" }}
          className="w-full"
        >
          <Typography
            variant="h4"
            component="span"
            sx={{ mt: 1, mb: 4, flex: 1 }}
          >
            Token: {copilotKey?.apiKey}
          </Typography>
        </Box>
      )}
    </>
  );
};

CopilotShow.getLayout = getLayout;

export default CopilotShow;
