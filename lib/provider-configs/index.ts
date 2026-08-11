import { africastalkingProvider } from "./africastalking";
import { twilioProvider } from "./twilio";
import { mpesaProvider } from "./mpesa";
import { smtpProvider } from "./smtp";

export const providerConfigs = {
  africastalking: africastalkingProvider,
  twilio: twilioProvider,
  mpesa: mpesaProvider,
  smtp: smtpProvider,
};
