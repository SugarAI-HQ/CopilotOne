import { useEffect, useState } from "react";
import { PromptVariableProps } from "./prompt_variables";
import { InputAdornment, TextField } from "@mui/material";
import { DisplayModes, displayModes } from "~/validators/base";

enum TEMPLATE_VARIABLES {
  "#" = "Config",
  "$" = "System",
  "@" = "Template",
  "%" = "Input",
}

const TV_KEYS = Object.keys(TEMPLATE_VARIABLES);
const TV_VALUES = Object.values(TEMPLATE_VARIABLES);

// function getVariableType(t: string) {
//     return TV_VALUES[TV_KEYS.indexOf(t)]
// }

export function PromptVariable({
  pv,
  onChange,
  mode,
  cube = false,
}: {
  pv: PromptVariableProps;
  onChange: (key: string, value: string) => void;
  mode: DisplayModes;
  cube?: boolean;
}) {
  let [val, setValue] = useState(pv.value);

  useEffect(() => {
    console.log("Rechecking", pv.key);
    const environmentalVariables = JSON.parse(
      localStorage.getItem("userEnvironmentalVariables") || "null",
    );
    if (environmentalVariables) {
      const gPv = getValueByKey(environmentalVariables, pv.key);
      console.log(`gPv: ${pv.key} ${gPv} ${pv.value}`);

      if (gPv) {
        pv.value = gPv;
        setValue(gPv);
        onChange(pv.key, gPv);
      }
    }
  }, [pv.key]);

  function evaluateValue(k: string, v: string): string {
    const environmentalVariables = JSON.parse(
      localStorage.getItem("userEnvironmentalVariables") || "null",
    );

    if (environmentalVariables) {
      const gPv = getValueByKey(environmentalVariables, pv.key);

      console.log(`gPv: ${pv.key} global: ${gPv} current: ${v}`);

      if (!v || v == "" || (v == "null" && gPv)) {
        return gPv ? gPv : "";
      }
    }

    return v;
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = evaluateValue(pv.key, e.target.value);
    console.log(`handleValueChange gpv: ${pv.key} ${v}`);
    setValue(v);
    onChange(pv.key, v);
  };

  function getValueByKey(
    environmentVariablesArray: Array<{ [key: string]: string }>,
    keyToFind: string,
  ) {
    // Check if the object is not null or undefined and is an object
    let environmentVariable = environmentVariablesArray.find(
      (variable) => variable.key === keyToFind,
    );
    if (environmentVariable) {
      return environmentVariable.value;
    } else {
      return "";
    }
    // if(!obj) return "";
    // console.log(obj)
    // for (const [key, value] of Object.entries(obj)) {
    //     if (typeof value === "object" && value.hasOwnProperty("key") && value.key === keyToFind) {
    //       return value.value;
    //     }
    //   }
    //   return "";
  }
  return (
    <>
      {
        <TextField
          id={"prompt-variable-input" + pv.key}
          sx={{
            input: { color: "var(--sugarhub-text-color)" },
            "& .MuiOutlinedInput-root": {
              "&.Mui-focused fieldset": {
                borderColor: "var(--sugarhub-card-color)",
              },
              "& fieldset": {
                borderColor: "var(--sugarhub-card-color)",
              },
            },
            "&:hover": {
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "var(--sugarhub-card-color)",
                },
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span style={{ color: "var(--sugarhub-text-color)" }}>
                  {pv.type}
                </span>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            style: { color: "var(--sugarhub-text-color)" },
          }}
          label={
            (!cube ? TV_VALUES[TV_KEYS.indexOf(pv.type)] + " :   " : "") +
            pv.key
          }
          variant="outlined"
          value={val}
          // defaultValue={pv.value}
          onChange={handleValueChange}
        />
      }
    </>
  );
}
