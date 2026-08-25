import { ProviderConfig } from './types';
export const mpesaProvider: ProviderConfig = {
  driver: 'mpesa',
  category: 'payment',

  fields: [
    {
      name: 'consumerKey',
      label: 'Consumer Key',
      type: 'text',
      encrypted: true,
      placeholder: 'Enter consumer key',
      required: true,
    },
    {
      name: 'consumerSecret',
      label: 'Consumer Secret',
      type: 'password',
      encrypted: true,
      placeholder: 'Enter consumer secret',
      required: true,
    },
    {
      name: 'shortCode',
      label: 'Short Code',
      type: 'text',
      encrypted: false,
      placeholder: 'e.g. 174379',
      required: true,
    },
    {
      name: 'passkey',
      label: 'Passkey',
      type: 'password',
      encrypted: true,
      placeholder: 'Enter M-Pesa passkey',
      required: true,
    },
    {
      name: 'callbackUrl',
      label: 'Callback URL',
      type: 'url',
      encrypted: false,
      placeholder: 'https://example.com/api/mpesa/callback',
      required: true,
    },
    {
      name: 'initiatorName',
      label: 'Initiator Name',
      type: 'text',
      encrypted: true,
      placeholder: 'Enter initiator name',
      required: false,
    },
    {
      name: 'securityCredential',
      label: 'Security Credential',
      type: 'password',
      encrypted: true,
      placeholder: 'Enter security credential',
      required: false,
    },
  ],

  buildSettings(values) {
    const settings = [
      {
        key: 'consumer_key',
        value: values.consumerKey,
        encrypted: true,
      },
      {
        key: 'consumer_secret',
        value: values.consumerSecret,
        encrypted: true,
      },
      {
        key: 'short_code',
        value: values.shortCode,
        encrypted: false,
      },
      {
        key: 'passkey',
        value: values.passkey,
        encrypted: true,
      },
      {
        key: 'callback_url',
        value: values.callbackUrl,
        encrypted: false,
      },
    ];

    if (values.initiatorName) {
      settings.push({
        key: 'initiator_name',
        value: values.initiatorName,
        encrypted: true,
      });
    }

    if (values.securityCredential) {
      settings.push({
        key: 'security_credential',
        value: values.securityCredential,
        encrypted: true,
      });
    }

    return settings;
  },
};
