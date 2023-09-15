import React from 'react';
import PromptPerformanceMetric from './prompt_performance_metric'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Chip, Divider } from '@mui/material';

const thresholds = {

  latency: {
      green: 800,
      yellow: 20000,
      red: 40000
  },
    
    prompt_tokens: {
        green: 2000,
        yellow: 3500,
        red: 4500
    },
    completion_tokens: {
        green: 2000,
        yellow: 3500,
        red: 4500
    },

    total_tokens: {
        green: 2000,
        yellow: 3500,
        red: 4500
    }
};

const PromptPerformance = ({ data }: { data: any }) => {
  return (
    <Box>
      {Object.entries(data).map(([key, value]) => {
        return (
          <PromptPerformanceMetric
            key={key}
            label={key}
            value={value}
            threshold={thresholds[key]}
          />
        );
      })}
    </Box>
  );
};

export default PromptPerformance;
