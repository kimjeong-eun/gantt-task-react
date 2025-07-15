import { Task, TaskType } from "./public-types";

export interface BarTask extends Task {
  index: number;
  typeInternal: TaskTypeInternal;
  x1: number;
  x2: number;
  y: number;
  height: number;
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  handleWidth: number;
  barChildren: BarTask[];
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  xBaseline1?: number; // 좌측 x 좌표
  xBaseline2?: number; // 우측 x 좌표
  siblingBarTasks ?: BarTask[];
}

export type TaskTypeInternal = TaskType | "smalltask";
