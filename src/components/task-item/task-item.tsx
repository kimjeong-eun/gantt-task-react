import React, { useRef } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";
import style from "./task-list.module.css";

// 텍스트 너비 측정
const getTextWidth = (text: string, font: string): number => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;
  context.font = font;
  return context.measureText(text).width;
};

// 말줄임 표시
const getDisplayText = (text: string, maxWidth: number, font: string): string => {
  const ellipsis = "...";
  if (getTextWidth(text, font) <= maxWidth) return text;

  let trimmed = text;
  while (trimmed.length > 0 && getTextWidth(trimmed + ellipsis, font) > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed + ellipsis;
};

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};

const renderBarComponent = (task: BarTask, props: TaskItemProps) => {
  switch (task.typeInternal) {
    case "milestone":
      return <Milestone {...props} task={task} />;
    case "project":
      return <Project {...props} task={task} />;
    case "smalltask":
      return <BarSmall {...props} task={task} />;
    default:
      return <Bar {...props} task={task} />;
  }
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const { task, arrowIndent, taskHeight, isDelete, rtl, onEventStart } = props;
  const textRef = useRef<SVGTextElement>(null);

  const width = task.x2 - task.x1;
  const hasChild = task.barChildren.length > 0;
  const font = "12px Arial";
  const displayText = getDisplayText(task.name, width * 0.8, font);
  const isTextInside = getTextWidth(displayText, font) < width;

  const x = isTextInside
    ? task.x1 + width * 0.5
    : rtl
      ? task.x1 - getTextWidth(displayText, font) - arrowIndent * +hasChild - arrowIndent * 0.2
      : task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;

  return (
    <g
      onKeyDown={e => {
        if (e.key === "Delete" && isDelete) {
          onEventStart("delete", task, e);
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => onEventStart("mouseenter", task, e)}
      onMouseLeave={e => onEventStart("mouseleave", task, e)}
      onDoubleClick={e => onEventStart("dblclick", task, e)}
      onClick={e => onEventStart("click", task, e)}
      onFocus={() => onEventStart("select", task)}
    >
      {renderBarComponent(task, props)}
      <text
        x={x}
        y={task.y + taskHeight * 0.5}
        className={isTextInside ? style.barLabel : style.barLabelOutside}
        ref={textRef}
      >
        {displayText}
      </text>
    </g>
  );
};
