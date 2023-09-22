import { useEffect, useState } from "react";
import { PromptVariableProps } from "./prompt_variables";
import { InputAdornment, TextField } from "@mui/material";

enum TEMPLATE_VARIABLES {
    '#' = "Config",
    '$' = "System",
    '@' = "Template",
    '%' = "Input",
}

const TV_KEYS = Object.keys(TEMPLATE_VARIABLES);
const TV_VALUES = Object.values(TEMPLATE_VARIABLES);


// function getVariableType(t: string) {
//     return TV_VALUES[TV_KEYS.indexOf(t)]
// }

export function PromptVariable({ pv, onChange }: { pv: PromptVariableProps, onChange: (key:string, value: string) => void }) {
    let [val, setValue] = useState(pv.value);
    
    useEffect(()=>{
        console.log("Rechecking", pv.key)
        const environmentalVariables = JSON.parse(localStorage.getItem('userEnvironmentalVariables'))
        if(environmentalVariables){
            const localEnvironmentalVariableValue = getValueByKey(environmentalVariables,pv.key)
    if(localEnvironmentalVariableValue){
        pv.value = localEnvironmentalVariableValue
        setValue(localEnvironmentalVariableValue)
    }
        }
        
    
        
    },[pv.key])
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setValue(e.target.value);
        onChange(pv.key, e.target.value);
    }

    function getValueByKey(obj, keyToFind) {
        // Check if the object is not null or undefined and is an object
        if(!obj) return "";
        console.log(obj)
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === "object" && value.hasOwnProperty("key") && value.key === keyToFind) {
              return value.value;
            } 
          }
          return "";
      }
    return (
          
        <TextField
            id={'prompt-variable-input' + pv.key}
            InputProps={{
              startAdornment: <InputAdornment position="start">{pv.type}</InputAdornment>
            }}
            label={TV_VALUES[TV_KEYS.indexOf(pv.type)] + ' :   ' + pv.key}
            variant="outlined"
            value={val}
            // defaultValue={pv.value}
            onChange={handleValueChange}
        />
    )
                
}