export interface Task {
  lead: string;
  description: string;
  assign: string;
  status: "Late" | "OnTime";
  dueDate: string;
  priority: "High" | "Low";
}
