import { JWTSession } from "./UserType";

export type PostReplyType = {
  content: string;
  image?: string;
  threadId: number;
  currentUser: JWTSession;
};
