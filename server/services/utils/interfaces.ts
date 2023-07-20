export type PayloadOnAuthJWT={
    userId: string;        
    given_name: string;
    iat: number;  
  }
  
export type clientUser = {
    id: string;
    name: string | null;
    email: string;
    verified_email: boolean;
    picture: string | null;
    locale: string | null;
    family_name: string | null;
    given_name: string;
  }