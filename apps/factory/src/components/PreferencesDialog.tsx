import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextareaAutosize,
  Divider,
  Tabs,
  Tab,
  Box,
  Input,
  TextField,
} from "@mui/material";
import { nanoid } from "nanoid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AddCircle from "@mui/icons-material/AddCircle";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import IconButton from "@mui/material/IconButton";

interface PreferencesModalProps {
  open: boolean;
  onClose: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

type EnvironmentalVariable = {
  [key: string]: string;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ px: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({
  open,
  onClose,
}) => {
  const [value, setValue] = React.useState(0);
  const [openAIKey, setOpenAIKey] = React.useState("");
  const [userEnvironmentalVariables, setUserEnvironmentalVariables] =
    React.useState<(EnvironmentalVariable | undefined)[]>([]);

  React.useEffect(() => {
    let localOpenAIKey = localStorage.getItem("openAIKey");
    let localUserEnvironmentalVariables = localStorage.getItem(
      "userEnvironmentalVariables",
    );
    console.log("dd", localOpenAIKey, localUserEnvironmentalVariables);
    if (localOpenAIKey) {
      setOpenAIKey(localOpenAIKey);
    }
    if (localUserEnvironmentalVariables) {
      setUserEnvironmentalVariables(
        JSON.parse(localUserEnvironmentalVariables),
      );
    }
  }, [open]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  function addUserEnvironmentalVariables() {
    setUserEnvironmentalVariables([
      ...userEnvironmentalVariables,
      { key: "", value: "" },
    ]);
  }

  function updateEnvironmentalVariableAtIndex(
    object: EnvironmentalVariable | undefined,
    key: string,
    newValue: string,
  ) {
    if (object !== undefined && key === "key") {
      object.key = newValue;
    }
    if (object !== undefined && key === "value") {
      object.value = newValue;
    }
    return object;
  }

  function updateUserEnvironmentalVariables(
    index: number,
    type: string,
    newValue: string,
  ) {
    const updatedData = userEnvironmentalVariables;
    if (updatedData[index] !== undefined) {
      updatedData[index] = updateEnvironmentalVariableAtIndex(
        updatedData[index],
        type,
        newValue,
      );
      setUserEnvironmentalVariables([...updatedData]);
    }
  }

  function deleteUserEnvironmentalVariable(index: number) {
    let updatedData = userEnvironmentalVariables; // Create a copy of the array
    updatedData.splice(index, 1); // Remove the element at the specified index
    console.log(updatedData);
    setUserEnvironmentalVariables([...updatedData]);
  }

  function handleOnSaveClick() {
    localStorage.setItem("openAIKey", openAIKey);
    localStorage.setItem(
      "userEnvironmentalVariables",
      JSON.stringify(userEnvironmentalVariables),
    );
    toast.success("Preferences Updated");
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Preferences</DialogTitle>
      <DialogContent>
        <div className="flex">
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            className="shrink-0 text-left"
            onChange={handleChange}
            aria-label="Vertical tabs example"
            sx={{ borderRight: 1, borderColor: "divider" }}
          >
            <Tab className="items-start" label="Global Variables" />
            <Tab className="items-start" label="API Key Settings" />
            {/* <Tab className="items-start" label="Experiments" /> */}
          </Tabs>
          <div className="w-full">
            <TabPanel value={value} index={0}>
              <Typography fontWeight={"700"}>Global Variables</Typography>
              <Box mt={2}>
                <TableContainer component={Paper}>
                  <Table>
                    {/* <TableHead>
                      <TableRow>
                        <TableCell>Key</TableCell>
                        <TableCell>Value</TableCell>
                      </TableRow>
                    </TableHead> */}
                    <TableBody>
                      {userEnvironmentalVariables &&
                        userEnvironmentalVariables?.map((variable, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ padding: 0 }}>
                              <TextField
                                value={variable?.key}
                                onChange={(e) => {
                                  updateUserEnvironmentalVariables(
                                    index,
                                    "key",
                                    e.target.value,
                                  );
                                }}
                                size="small"
                                placeholder="Key"
                                sx={{ border: "none", outline: "none" }}
                              />
                            </TableCell>
                            <TableCell sx={{ padding: 0 }}>
                              <TextField
                                value={variable?.value}
                                onChange={(e) => {
                                  updateUserEnvironmentalVariables(
                                    index,
                                    "value",
                                    e.target.value,
                                  );
                                }}
                                size="small"
                                placeholder="Value"
                              />
                            </TableCell>
                            <TableCell
                              sx={{
                                paddingLeft: 1.5,
                                paddingRight: 1.5,
                                paddingTop: 0,
                                paddingBottom: 0,
                              }}
                            >
                              {" "}
                              <IconButton
                                aria-label="delete"
                                onClick={() =>
                                  deleteUserEnvironmentalVariable(index)
                                }
                              >
                                <MdDelete size={16} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className="flex justify-end">
                  <Button
                    onClick={addUserEnvironmentalVariables}
                    className="!mt-1"
                    startIcon={<AddCircle />}
                    size="small"
                  >
                    Add New Variable
                  </Button>
                </div>
              </Box>

              <Button
                onClick={handleOnSaveClick}
                variant="contained"
                className="!mt-4 bg-white"
              >
                Save
              </Button>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Typography fontWeight={"700"}>API Key Settings</Typography>
              <Box mt={2}>
                <TextField
                  value={openAIKey}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setOpenAIKey(event.target.value);
                  }}
                  id="outlined-basic"
                  label="Open AI API Key"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Button
                onClick={handleOnSaveClick}
                variant="contained"
                className="!mt-4 bg-white"
              >
                Save
              </Button>
            </TabPanel>
            <TabPanel value={value} index={2}>
              Experiments
            </TabPanel>
          </div>
        </div>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default PreferencesModal;
