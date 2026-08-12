// lib/provider-configs/africastalking.ts
import { ProviderConfig } from "./types";

export const africastalkingProvider: ProviderConfig = {
  driver: "africastalking",
  category: "sms",

  fields: [
    {
      name: "apiKey",
      label: "API Key",
      type: "password",
      encrypted: true,
      placeholder: "Enter Africa's Talking API key",
      required: true,
    },
    {
      name: "username",
      label: "Username",
      type: "text",
      encrypted: false,
      placeholder: "sandbox",
      required: true,
    },
    {
      name: "senderId",
      label: "Sender ID",
      type: "text",
      encrypted: false,
      placeholder: "Enter sender ID",
      required: false,
    },
  ],

  buildSettings(values) {
    const settings = [
      {
        key: "api_key",
        value: values.apiKey,
        encrypted: true,
      },
      {
        key: "username",
        value: values.username,
        encrypted: false,
      },
    ];

    if (values.senderId) {
      settings.push({
        key: "sender_id",
        value: values.senderId,
        encrypted: false,
      });
    }

    return settings;
  },
};
