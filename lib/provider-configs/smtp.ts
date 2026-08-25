import { ProviderConfig } from './types';
export const smtpProvider: ProviderConfig = {
  driver: 'smtp',
  category: 'email',

  fields: [
    {
      name: 'host',
      label: 'SMTP Host',
      type: 'text',
      encrypted: false,
      placeholder: 'smtp.example.com',
      required: true,
    },
    {
      name: 'port',
      label: 'SMTP Port',
      type: 'number',
      encrypted: false,
      placeholder: '587',
      required: true,
    },
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      encrypted: false,
      placeholder: 'username@example.com',
      required: true,
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      encrypted: true,
      placeholder: 'SMTP password',
      required: true,
    },
    {
      name: 'encryption',
      label: 'Encryption',
      type: 'select',
      encrypted: false,
      required: true,
      options: [
        {
          label: 'TLS',
          value: 'tls',
        },
        {
          label: 'SSL',
          value: 'ssl',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
    },
    {
      name: 'fromAddress',
      label: 'From Email',
      type: 'email',
      encrypted: false,
      placeholder: 'noreply@example.com',
      required: true,
    },
    {
      name: 'fromName',
      label: 'From Name',
      type: 'text',
      encrypted: false,
      placeholder: 'Payment Hub',
      required: true,
    },
  ],

  buildSettings(values) {
    return [
      {
        key: 'host',
        value: values.host,
        encrypted: false,
      },
      {
        key: 'port',
        value: String(values.port),
        encrypted: false,
      },
      {
        key: 'username',
        value: values.username,
        encrypted: false,
      },
      {
        key: 'password',
        value: values.password,
        encrypted: true,
      },
      {
        key: 'encryption',
        value: values.encryption,
        encrypted: false,
      },
      {
        key: 'from_address',
        value: values.fromAddress,
        encrypted: false,
      },
      {
        key: 'from_name',
        value: values.fromName,
        encrypted: false,
      },
    ];
  },
};
