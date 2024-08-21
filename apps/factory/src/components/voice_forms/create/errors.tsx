import React from "react";
import { Alert, List, ListItem, Typography } from "@mui/material";

export const FormErrors = ({ errors }: { errors: any }) => {
  return (
    <div>
      <Typography variant="body1">
        Errors: ({Object.keys(errors).length})
      </Typography>
      <List>
        {Object.keys(errors).map((key) => (
          <ListItem key={key}>
            <Alert severity="error">{errors[key].message}</Alert>
          </ListItem>
        ))}
      </List>
    </div>
  );
};
