import { UserType } from "./User";

export type ReplyType = {
  content: string;
  created_at: string;
  id: number;
  image?: string;
  user: UserType;
};
