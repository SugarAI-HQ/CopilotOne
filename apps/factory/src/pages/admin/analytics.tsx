import React, { useState } from "react";
import { api } from "~/utils/api";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import { LineChart } from "@mui/x-charts/LineChart";
import { getLayout } from "~/components/Layouts/DashboardLayout";

const Analytics = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="span" sx={{ mt: 1, mb: 2 }}>
          Analytics
        </Typography>
      </Box>
      <Grid container spacing={2} mt={2}>
        <Grid item xs={12} md={6} sx={{ p: 1 }}>
          <MetricLineChart
            metricField={"incrementalTime"}
            metric={"end"}
            heading={"Total Response Time"}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ p: 1 }}>
          <MetricLineChart
            metricField={"cumulativeTime"}
            metric={"load_chat"}
            heading={"Load Chat History"}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ p: 1 }}>
          <MetricLineChart
            metricField={"cumulativeTime"}
            metric={"embeddings"}
            heading={"Embeddings"}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ p: 1 }}>
          <MetricLineChart
            metricField={"cumulativeTime"}
            metric={"generate_prompt"}
            heading={"Generate Prompt"}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ p: 1 }}>
          <MetricLineChart
            metricField={"cumulativeTime"}
            metric={"load_llm_config"}
            heading={"Load LLM Config"}
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ p: 1 }}>
          <MetricLineChart
            metricField={"cumulativeTime"}
            metric={"llm_gateway_response"}
            heading={"LLM Gateway Response"}
          />
        </Grid>
      </Grid>
    </>
  );
};

Analytics.getLayout = getLayout;

export default Analytics;

const MetricLineChart = ({
  metric,
  metricField,
  heading,
}: {
  metric: string;
  metricField: string;
  heading: string;
}) => {
  const [stats, setStats] = useState<any>({});

  api.log.getAnalytics.useQuery(
    {
      fieldName: metricField,
      nestedKey: metric,
    },
    {
      onSuccess(item: any) {
        console.log(item);
        setStats(item as any);
      },
    },
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {stats && Object.keys(stats).length > 0 && (
            <LineChart
              width={500}
              height={300}
              series={[
                { data: stats.average, label: "Average" },
                { data: stats.p95, label: "P95" },
                { data: stats.p50, label: "P50" },
              ]}
              xAxis={[{ scaleType: "point", data: stats.date }]}
            />
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Typography variant="h6" component="span">
            {heading}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
