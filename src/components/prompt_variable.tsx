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
            label={TV_VALUES[TV_KEYS.indexOf(pv.type)] + ' :   ' + pv.key}
            variant="outlined"
            defaultValue={pv.value}
            onChange={handleValueChange}
        />
    )
                
}