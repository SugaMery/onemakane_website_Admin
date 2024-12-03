export interface Comment {
  user: string;
  comment: string;
  date: string;
  email: string;
}
export class AuthorBox {
  authorName!: string;
  authorImage!: string;
  authorLink!: string;
  authorPosts!: string;
  authorSince!: string;
  authorDescription!: string;
}
export interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  views: string;
  comments: Comment[]; // Change this to an array of Comment objects
  by: string;
  tags: string[];
  date: string;
  link: string;
  shares: string;
  fullContent: string;
  authorBox: AuthorBox;
}
