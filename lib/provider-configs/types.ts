export type ProviderField = {
  name: string;
  label: string;
  type: "text" | "password" | "number" | "email" | "url" | "select";
  encrypted: boolean;
  placeholder?: string;
  required?: boolean;
  options?: {
    label: string;
    value: string;
  }[];
};

export type ProviderConfig = {
  driver: string;
  category: string;
  fields: ProviderField[];
  buildSettings: (values: Record<string, any>) => {
    key: string;
    value: string;
    encrypted: boolean;
  }[];
};
