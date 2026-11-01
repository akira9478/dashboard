export interface ToolItem {
  id: number | string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  tags: string[];
  is_visible: boolean;
  featured?: boolean;
  githubUrl?: string;
  updatedAt?: string;
}

export interface VercelApiResponse {
  status: 'success' | 'error';
  count: number;
  data: ToolItem[];
  message?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
  homepage?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  slug: string;
}
