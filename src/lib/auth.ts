import {
  InitiateAuthCommand,
  InitiateAuthCommandInput,
  SignUpCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  GlobalSignOutCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cognitoClient } from "./cognito-client";
import { createHmac } from 'crypto';

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET!;

export interface AuthResponse {
  success: boolean;
  message?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
    idToken: string;
  };
}

function calculateSecretHash(username: string): string {
  const message = username + CLIENT_ID;
  const hmac = createHmac('sha256', CLIENT_SECRET);
  return hmac.update(message).digest('base64');
}

export async function signIn(
  phoneNumber: string,
  password: string
): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, password }),
    });

    return response.json();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Sign in failed",
    };
  }
}

export async function signUp(
  phoneNumber: string,
  password: string
): Promise<AuthResponse> {
  try {
    // Ensure phone number is in correct format (+1234567890)
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const command = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: formattedPhone,
      Password: password,
      UserAttributes: [
        {
          Name: "phone_number",
          Value: formattedPhone,
        },
      ],
    });

    await cognitoClient.send(command);
    return {
      success: true,
      message: "Sign up successful. Please check your phone for verification code.",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Sign up failed",
    };
  }
}

export async function confirmSignUp(
  phoneNumber: string,
  code: string
): Promise<AuthResponse> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: formattedPhone,
      ConfirmationCode: code,
    });

    await cognitoClient.send(command);
    return {
      success: true,
      message: "Phone number verification successful",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Phone verification failed",
    };
  }
}

export async function forgotPassword(phoneNumber: string): Promise<AuthResponse> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const command = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: formattedPhone,
    });

    await cognitoClient.send(command);
    return {
      success: true,
      message: "Password reset code sent to your phone",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to initiate password reset",
    };
  }
}

export async function confirmForgotPassword(
  phoneNumber: string,
  code: string,
  newPassword: string
): Promise<AuthResponse> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const command = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: formattedPhone,
      ConfirmationCode: code,
      Password: newPassword,
    });

    await cognitoClient.send(command);
    return {
      success: true,
      message: "Password reset successful",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Password reset failed",
    };
  }
}

export async function resendConfirmationCode(
  phoneNumber: string
): Promise<AuthResponse> {
  try {
    const formattedPhone = formatPhoneNumber(phoneNumber);
    
    const command = new ResendConfirmationCodeCommand({
      ClientId: CLIENT_ID,
      Username: formattedPhone,
    });

    await cognitoClient.send(command);
    return {
      success: true,
      message: "Verification code resent",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to resend verification code",
    };
  }
}

// Helper function to format phone numbers
function formatPhoneNumber(phoneNumber: string): string {
  // Remove any non-digit characters except '+'
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // Ensure it starts with '+'
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

export async function signOut(accessToken: string): Promise<AuthResponse> {
  try {
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    await cognitoClient.send(command);
    return {
      success: true,
      message: "Signed out successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Sign out failed",
    };
  }
} 