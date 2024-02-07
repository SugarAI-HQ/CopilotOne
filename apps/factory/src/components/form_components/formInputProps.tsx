export interface FormInputProps {
  name: string;
  control: any;
  label: string;
  error?: boolean;
  helperText?: string | undefined;
  required?: boolean;
}
