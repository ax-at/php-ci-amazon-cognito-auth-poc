import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET!;
import { cognitoClient } from '@/lib/cognito-client';
import { InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';

function calculateSecretHash(username: string): string {
  const message = username + CLIENT_ID;
  const hmac = createHmac('sha256', CLIENT_SECRET);
  return hmac.update(message).digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, password } = await request.json();
    
    const formattedPhone = phoneNumber.replace(/[^\d+]/g, '');
    const secretHash = calculateSecretHash(formattedPhone);

    const command = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: formattedPhone,
        PASSWORD: password,
        SECRET_HASH: secretHash
      },
    });

    const response = await cognitoClient.send(command);

    if (!response.AuthenticationResult) {
      return NextResponse.json({ 
        success: false, 
        message: "Authentication failed" 
      });
    }

    return NextResponse.json({
      success: true,
      tokens: {
        accessToken: response.AuthenticationResult.AccessToken,
        refreshToken: response.AuthenticationResult.RefreshToken,
        idToken: response.AuthenticationResult.IdToken,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      message: error.message || "Sign in failed" 
    });
  }
} 