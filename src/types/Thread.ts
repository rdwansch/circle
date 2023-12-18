export type ThreadType = {
  id: number;
  user: {
    name: string;
    username: string;
  };
  content: string;
  image: string;
  likes: number;
  replies: number;
  isLiked: boolean;
};
