import axios from 'axios';
import {OAuth2Client,TokenPayload } from 'google-auth-library';
const client = new OAuth2Client();

export interface GetUserProfileByGoogleTokenOpts {
  input: {
    google_token: string;
  };
}

export type googleUserInfoResults = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

export const fetchGoogleUserInfo = async (googleToken: string): Promise<googleUserInfoResults> => {
  const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${googleToken}`,
    },
  });
  return response.data;
};

export const verifyGoogleToken = async (token: string): Promise<TokenPayload | undefined> => {
  
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID, 
  });
  const payload = ticket.getPayload();
  return payload;

}