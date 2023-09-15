import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SvgIcon from '@mui/material/SvgIcon';

const PromptOutput = ({output}: {output: string}) => {
  return (
    <Box
      className="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium mui-style-18svhy9"
    >
      <Box className="MuiBox-root mui-style-ou2u7">
        <Box className="MuiStack-root mui-style-vb6e92">
          <Box className="MuiStack-root mui-style-1lhy0r8">
            <Typography
              className="MuiTypography-root MuiTypography-body1 mui-style-1uzkh8u"
            >
              {output}
            </Typography>
            {/* Add more Typography components as needed */}
          </Box>
          <Box className="MuiBox-root mui-style-1fuqp3k">
            {/* Add content here */}
          </Box>
          <Box className="MuiBox-root mui-style-1fuqp3k">
            {/* Add content here */}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PromptOutput;
