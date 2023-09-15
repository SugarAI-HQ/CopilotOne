import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

const getColor = (value, threshold) => {
  if (value <= threshold.green) {
    return 'green';
  } else if (value <= threshold.yellow) {
    return 'yellow';
  } else {
    return 'red';
  }
};

const PromptPerformanceMetric = ({ label, value, threshold }) => {
  const color = getColor(value, threshold);

  return (
    <Box>
      <Typography variant="body1">
        {label}: <span style={{ color }}>{value}</span>
      </Typography>
    </Box>
  );
};

export default PromptPerformanceMetric;
