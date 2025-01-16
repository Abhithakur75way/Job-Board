export interface JobDto {
    title: string;
    description: string;
    location: string;
    type: 'full-time' | 'part-time' | 'contract';
    skills: string[];
  }
  