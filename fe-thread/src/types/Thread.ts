import { LikeType } from "./Like";
import { UserType } from "./User";

export type ThreadType = {
  id: number;
  content?: string;
  image?: string;
  like: LikeType[];
  isLiked: boolean;
  created_at: string;
  user: UserType;
  reply: Replies[];
};

type Replies = {
  content: "reply to thread";
  created_at: "2023-12-26T07:12:13.441Z";
  id: 2;
  image?: string;
  updated_at: "2023-12-26T07:12:13.441Z";
  user: UserType;
};
