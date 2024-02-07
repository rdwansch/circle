import { UserType } from "./User";

export type LikeType = {
  id: number;
  created_at: string;
  user: UserType;
};
