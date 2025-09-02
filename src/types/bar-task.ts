import { DependencyType, Task, TaskType } from "./public-types";

export interface BarChild {
  index: number;             // 연결 대상 Task의 index
  linkType: DependencyType;  // 연결 타입
}

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
  barChildren: BarChild[];
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  xBaseline1?: number; // 좌측 x 좌표
  xBaseline2?: number; // 우측 x 좌표
}

export type TaskTypeInternal = TaskType | "smalltask";
