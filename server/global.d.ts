declare namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      ORIGIN_URL: string;
      MONGO_URI: string;
      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      GOOGLE_OAUTH_REDIRECT_URI: string;
      ACCESS_TOKEN_PRIVATE_KEY: string;
      SECRET_KEY: string;
    }
  }