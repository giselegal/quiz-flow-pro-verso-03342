// @ts-nocheck
import { QuizQuestion } from './quiz';
import { ResultPageConfig } from './resultPageConfig';

export interface QuizTemplate {
  id: string;
  name: string;
  description: string;
  questions: QuizQuestion[];
  resultPageSettings:
    | ResultPageConfig
    | {
        styleType: string;
        blocks: any[];
        headerConfig: any;
        mainContentConfig: any;
        offerConfig: any;
      };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export type TemplateListItem = Pick<
  QuizTemplate,
  'id' | 'name' | 'description' | 'isPublished' | 'updatedAt'
>;
