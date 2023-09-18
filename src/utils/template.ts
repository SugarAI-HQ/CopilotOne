import {PromptPackage as pp, PromptTemplate as pt, PromptVersion as pv} from "@prisma/client";
import { PromptVariableProps } from "~/components/prompt_variables";

export const getVariables = (template: string) => {
    console.log(`template >>>: ${JSON.stringify(template)}`);
    if (!template) {
        return [];
    }
    const allVariables = template.match(/\{([#$@%].*?)\}/g);

    if (!allVariables) {
        return []; // No variables found, return an empty array.
    }

    const flattenedVariables = allVariables.map((variable) => {
        // const type = variable.charAt(1); // Get the type of variable (#, @, %, $).
        // const key = variable.substring(2, variable.length - 1); // Get the variable name.

        const obj: PromptVariableProps = {
            key: variable.substring(2, variable.length - 1), // Get the variable name.
            type: variable.charAt(1), // Get the type of variable (#, @, %, $).
            value: '',
        };
        return obj
    });
    return flattenedVariables;
};

export const getAllTemplateVariables = (templates: pt[]): Array<PromptVariableProps> => {
    if (!templates) {
        return [];
    }

    const allVariables = templates.flatMap((template) => getVariables(template.description));

    // Use a Set to ensure uniqueness and convert back to an array.
    // const uniqueVariables = Array.from(new Set(allVariables));
    // const uniqueVariables = Array.from(new Set(allVariables.map(item => item.key)));

    return allVariables;
};

export function getUniqueJsonArray(jsonArray: PromptVariableProps[], uniqueKey: any) {
    const uniqueSet = new Set();
    const uniqueArray = [];

    for (const obj of jsonArray) {
        const keyValue = obj[uniqueKey];

        if (!uniqueSet.has(keyValue)) {
            uniqueSet.add(keyValue);
            uniqueArray.push(obj);
        }
    }
    return uniqueArray;
}