import * as healthfix from "./healthfix";
import * as test from "./test";
import * as nps from "./nps";
import * as csat from "./csat";
import * as customer_effort from "./customer_effort";
import * as appointment from "./appointment";
import * as meditation_survey from "./meditation_survey";

const formData: Record<string, any> = {
  healthfix: healthfix,
  test: test,
  nps: nps,
  csat: csat,
  customer_effort: customer_effort,
  appointment: appointment,
  meditation_survey: meditation_survey,
};

export function getFormData(formName: string) {
  const form = formData[formName];
  // if (!form) {
  //   throw new Error(`form "${formName}" not found`);
  // }

  return form;
}
