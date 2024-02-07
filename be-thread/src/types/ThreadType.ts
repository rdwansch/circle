import { JWTSession } from "./UserType";

export type PostThreadType = {
  content: string;
  image: {
    secure_url: string;
  };
  currentUser: JWTSession;
};
