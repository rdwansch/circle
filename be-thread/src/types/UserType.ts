export type JWTSession = {
  id: number;
  username: string;
  full_name: string;
  profile_description: string;
  profile_picture: string;
  iat: number;
  exp: number;
};
