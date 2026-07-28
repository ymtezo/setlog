export type MemberSize = 2 | 3 | 4 | 5;

export interface Profile {
  id: string;
  name: string;
  color: string;
}

export interface Reaction {
  emoji: string;
  memberId: string;
}

export interface Comment {
  id: string;
  memberId: string;
  text: string;
  createdAt: string;
}

export interface LogPost {
  id: string;
  memberId: string;
  imageUrl?: string;
  caption?: string;
  createdAt: string;
  orientation: 'landscape' | 'portrait';
}

export interface ZipPost {
  id: string;
  memberId: string;
  imageUrl?: string;
  text?: string;
  createdAt: string;
}

export interface LogRoom {
  id: string;
  name: string;
  code: string;
  maxMembers: MemberSize;
  locked: boolean;
  members: Profile[];
  logs: LogPost[];
  zips: ZipPost[];
  comments: Record<string, Comment[]>;
  reactions: Record<string, Reaction[]>;
  classicLayout: boolean;
  createdAt: string;
}

export interface AppState {
  me: Profile | null;
  rooms: LogRoom[];
}
