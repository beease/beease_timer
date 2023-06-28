declare namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT: string;
      MONGO_URI: string;
      GOOGLE_OAUTH_CLIENT_ID: string;
      GOOGLE_OAUTH_CLIENT_SECRET: string;
      GOOGLE_OAUTH_REDIRECT_URI: string;
    }
  }