import { useState } from "react";
import { PromptVariableProps } from "./prompt_variables";
import { InputAdornment, TextField } from "@mui/material";



export function PromptVariable({ pv, onChange }: { pv: PromptVariableProps, onChange: (key:string, value: string) => void }) {
    // let [val, setValue] = useState(pv.value);
    
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setValue(e.target.value);
        onChange(pv.key, e.target.value);
    }

    return (
          
        <TextField
            id={'prompt-variable-input' + pv.key}
            InputProps={{
              startAdornment: <InputAdornment position="start">{pv.type}</InputAdornment>
            }}
            label={pv.key}
            variant="outlined"
            defaultValue={pv.value}
            onChange={handleValueChange}
        />
    )
  
                
}