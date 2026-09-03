export interface Post {
  id: string;
  title: string;
  imageUrl: string;
  ratings: number[];
  comments: Comment[];
  createdAt: number;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: number;
}
