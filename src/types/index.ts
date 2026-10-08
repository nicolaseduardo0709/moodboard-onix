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

export type StageName =
  | "briefing"
  | "moodboard"
  | "archetype"
  | "competitors"
  | "presentation";

export interface ProjectStage {
  name: StageName;
  label: string;
  description: string;
  status: "locked" | "available" | "in_progress" | "completed";
  icon: string;
}

export interface Client {
  id: string;
  name: string;
  segment: string;
  avatarColor: string;
  createdAt: number;
  stages: Record<StageName, "locked" | "available" | "in_progress" | "completed">;
}

export interface BriefingQuestion {
  id: string;
  category: string;
  question: string;
  type: "text" | "textarea" | "select" | "multi-select" | "scale";
  options?: string[];
  required: boolean;
}

export interface BriefingResponse {
  questionId: string;
  answer: string | string[] | number;
}

export interface BriefingData {
  clientId: string;
  responses: BriefingResponse[];
  completedAt: number | null;
  updatedAt: number;
}
