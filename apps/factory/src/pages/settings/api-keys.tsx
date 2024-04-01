import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { getLayout } from "~/components/Layouts/DashboardLayout";
import { AddCircle } from "@mui/icons-material";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import TimeAgo from "react-timeago";
import CreateKeyDialog from "~/components/key_managements/CreateKeyDialog";
import { KeyListOutput, KeyOutput } from "~/validators/api_key";

const ApiKeys = () => {
  const [keysList, setKeysList] = useState<KeyListOutput>([]);
  const { data: sessionData } = useSession();
  const ns = sessionData?.user;

  const { data: getKeys } = api.apiKey.getKeys.useQuery(
    {
      userId: ns?.id as string,
    },
    {
      onSuccess(keys) {
        setKeysList(keys);
      },
    },
  );

  const setNewKey = (key: KeyOutput) => {
    setKeysList([...keysList, key] as KeyListOutput);
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <Box sx={{ m: 1 }} padding={2}>
        <Typography variant="h6">API Keys</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>NAME</TableCell>
                <TableCell>SECRET KEY</TableCell>
                <TableCell>CREATED</TableCell>
                <TableCell>LAST USED</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keysList &&
                keysList.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key?.name}</TableCell>
                    <TableCell>{key?.apiKey}</TableCell>
                    <TableCell>
                      <TimeAgo date={key?.createdAt} />
                    </TableCell>
                    <TableCell>NEVER</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ m: 1, marginLeft: 0 }} padding={2}>
        <CreateKeyDialog userId={ns?.id as string} setNewKey={setNewKey} />
      </Box>
    </Box>
  );
};

ApiKeys.getLayout = getLayout;

export default ApiKeys;
