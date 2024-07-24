import * as healthfix from "./healthfix";
import * as test from "./test";

const formData: Record<string, any> = {
  healthfix: healthfix,
  test: test,
};

export function getFormData(formName: string) {
  const form = formData[formName];
  // if (!form) {
  //   throw new Error(`form "${formName}" not found`);
  // }

  return form;
}
