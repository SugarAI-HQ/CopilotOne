import React, { useState } from "react";
import { api } from "~/utils/api";
import { Box, Grid, Typography, Paper } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { getLayout } from "~/components/Layouts/DashboardLayout";

const SubmissionAnalytics = ({ formId }: { formId: string }) => {
  const { data: totalSubmissions } = api.form.getTotalSubmissions.useQuery(
    { formId },
    { enabled: !!formId },
  );
  const { data: submissionTimeSeries } =
    api.form.getSubmissionTimeSeries.useQuery(
      { formId },
      { enabled: !!formId },
    );
  // const { data: languageBreakdown } = api.form.getLanguageBreakdown.useQuery(
  //   { formId },
  //   { enabled: !!formId },
  // );
  const { data: completionRate } = api.form.getCompletionRate.useQuery(
    { formId },
    { enabled: !!formId },
  );
  const { data: avgCompletionTime } =
    api.form.getAverageCompletionTime.useQuery(
      { formId },
      { enabled: !!formId },
    );

  return (
    <>
      <Grid container spacing={2} mt={2}>
        {/* Total Submissions */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{ padding: 2, backgroundColor: "#1e1e1e", color: "#ffffff" }}
          >
            <Typography variant="h6">Total Submissions</Typography>
            <Typography variant="h3">{totalSubmissions || 0}</Typography>
          </Paper>
        </Grid>

        {/* Completion Rate */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{ padding: 2, backgroundColor: "#1e1e1e", color: "#ffffff" }}
          >
            <Typography variant="h6">Completion Rate</Typography>
            <Typography variant="h3">
              {completionRate?.toFixed(2) || 0}%
            </Typography>
          </Paper>
        </Grid>

        {/* Average Completion Time */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{ padding: 2, backgroundColor: "#1e1e1e", color: "#ffffff" }}
          >
            <Typography variant="h6">Avg. Completion Time</Typography>
            <Typography variant="h3">
              {Math.round(avgCompletionTime || 0)} sec
            </Typography>
          </Paper>
        </Grid>

        {/* Time Series Line/Area Chart */}
        <Grid item xs={12} md={12}>
          <Paper
            elevation={3}
            sx={{ padding: 2, backgroundColor: "#1e1e1e", color: "#ffffff" }}
          >
            <Typography variant="h6">Submissions Over Time</Typography>
            {submissionTimeSeries &&
              submissionTimeSeries &&
              submissionTimeSeries.counts.length > 0 && (
                <LineChart
                  // width={600}
                  height={300}
                  series={[
                    {
                      data: submissionTimeSeries.counts,
                      label: "Submissions",
                    },
                  ]}
                  xAxis={[
                    { scaleType: "point", data: submissionTimeSeries.dates },
                  ]}
                  yAxis={[{ data: [1, 5, 10, 100, 200, 500, 1000] }]}
                />
              )}
          </Paper>
        </Grid>

        {/* Language Breakdown */}
        {/* <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{ padding: 2, backgroundColor: "#1e1e1e", color: "#ffffff" }}
          >
            <Typography variant="h6">Language Breakdown</Typography>
            {languageBreakdown && languageBreakdown.length > 0 && (
              <PieChart
                width={600}
                height={300}
                series={[
                  {
                    data: languageBreakdown.map((lang) => lang.value),
                    label: "Languages",
                  },
                ]}
              />
            )}
          </Paper>
        </Grid> */}
      </Grid>
    </>
  );
};

SubmissionAnalytics.getLayout = getLayout;

export default SubmissionAnalytics;
