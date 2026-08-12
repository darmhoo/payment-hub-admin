// lib/provider-configs/twilio.ts
import { ProviderConfig } from "./types";
export const twilioProvider: ProviderConfig = {
  driver: "twilio",
  category: "sms",

  fields: [
    {
      name: "accountSid",
      label: "Account SID",
      type: "text",
      encrypted: true,
    },
    {
      name: "authToken",
      label: "Auth Token",
      type: "password",
      encrypted: true,
    },
    {
      name: "from",
      label: "From Number",
      type: "text",
      encrypted: false,
    },
  ],

  buildSettings(values) {
    return [
      {
        key: "account_sid",
        value: values.accountSid,
        encrypted: true,
      },
      {
        key: "auth_token",
        value: values.authToken,
        encrypted: true,
      },
      {
        key: "from",
        value: values.from,
        encrypted: false,
      },
    ];
  },
};
