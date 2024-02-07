type User = {
  full_name: string;
  id: number;
  profile_picture: string;
  username: string;
};

export type FollowerType = {
  id: number;
  created_at: string;
  updated_at: string;
  follower: User;
  following: User;
  isFollowing?: boolean;
  followingId: number;
};

export type FollowingType = {
  id: number;
  created_at: string;
  updated_at: string;
  follower: User;
  following: User;
};
