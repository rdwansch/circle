export type UserType = {
  id: number;
  created_at: string;
  full_name: string;
  profile_description: string;
  profile_picture: string;
  username: string;
};

export type EditProfil = {
  created_at: string;
  email: string;
  full_name: string;
  id: 1;
  password: string;
  profile_description: string;
  profile_picture: string;
  updated_at: string;
  username: string;
};

export type SuggestionType = {
  follower_created_at: string;
  follower_followerId: number;
  follower_followingId: number;
  follower_id: number;
  follower_updated_at: string;
  user_created_at: string;
  user_email: string;
  user_full_name: string;
  user_id: number;
  user_password: string;
  user_profile_description: null;
  user_profile_picture: null;
  user_updated_at: string;
  user_username: string;
};
