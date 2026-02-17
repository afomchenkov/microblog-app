export interface FeedPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorUsername?: string;
  createdAt: string;
}

export interface PostsResponse {
  posts: FeedPost[];
}

export interface UsersResponse {
  users: Array<{
    id: string;
    username: string;
  }>;
}

export interface PostData {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export interface UserDataResponse {
  id: string;
  username: string;
  createdAt: string;
  email: string;
  firstName: string;
  lastName: string;
  updatedAt: string;
}

export interface MenuUser {
  id: string;
  username: string;
}

export interface UsersResponse {
  users: MenuUser[];
}

export interface UserPostsResponse {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
  }>;
}
