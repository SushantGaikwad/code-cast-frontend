export interface Video {
    _id: string;
    title: string;
    description: string;
    embedLink: string;
    tags: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    category: string;
    creator: { _id: string; email: string };
    views: number;
    likes: number;
    dislikes: number;
    avgWatchDuration: number;
    createdAt: string;
  }

export interface Comment {
  _id: string;
  video: string;
  content: string;
  createdAt: string;
}

export interface User {
  _id: string;
  email: string;
  role: "creator" | "viewer" | "admin";
  token: string;
}
