import axios from 'axios';

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
