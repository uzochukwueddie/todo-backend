export interface ITodo {
  id?: number;
  title: string;
  order: number;
  description: string;
  completed: boolean;
  due_date: Date;
  project_id?: string;
  priority: string;
  created_by: string;
  assignee_id?: string;
}
