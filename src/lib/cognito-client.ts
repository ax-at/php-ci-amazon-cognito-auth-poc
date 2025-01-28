import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

const REGION = process.env.NEXT_PUBLIC_AWS_REGION;

export const cognitoClient = new CognitoIdentityProviderClient({
  region: REGION,
}); 