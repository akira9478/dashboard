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

export interface VercelPhotosApiResponse {
  status: 'success' | 'error';
  count: number;
  data: PhotoItem[];
  message?: string;
}

export interface SkillGroup {
  category: string;
  subtitle: string;
  items: string[];
}

export interface ExperienceStage {
  period: string;
  roles: string[];
  achievements: string[];
}

export interface WorkExperience {
  company: string;
  title: string;
  period: string;
  duration?: string;
  location?: string;
  stages: ExperienceStage[];
}

export interface EducationItem {
  school: string;
  department: string;
  period: string;
  descriptions: string[];
}

export interface PhotoItem {
  id: string | number;
  title: string;
  description?: string;
  /**
   * 支援直接貼上：
   * 1. Google Drive 分享連結 (例如 https://drive.google.com/file/d/1abcDEF.../view?usp=sharing)
   * 2. Google Drive 檔案 ID (例如 1abcDEF...)
   * 3. 任何一般圖片網址 (https://...)
   */
  driveUrlOrId: string;
  category?: string;
  date?: string;
  location?: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}
