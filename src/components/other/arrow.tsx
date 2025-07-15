import React from "react";
import { BarTask } from "../../types/bar-task";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
  isHighlighted?: boolean;
};
export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
  isHighlighted = false,
}) => {
  let path: string;
  let trianglePoints: string;
  if (rtl) {
    [path, trianglePoints] = drownPathAndTriangleRTL(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  } else {
    [path, trianglePoints] = drownPathAndTriangle(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent
    );
  }

  return (
    <g className="arrow">
      <path stroke={isHighlighted ? "#ff6600" : "#999"}
             strokeWidth={isHighlighted ? 2.5 : 1.5} d={path} fill="none" />
      <polygon
        points={trianglePoints}
        fill={isHighlighted ? "#ff6600" : "#999"}
        stroke="none"
      />
    </g>
  );
};

const drownPathAndTriangle = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const fromX = taskFrom.x2;
  const fromY = taskFrom.y + taskHeight / 2;
  const toX = taskTo.x1;
  const toY = taskTo.y + taskHeight / 2;

  const verticalOffset =
    (fromY !== toY && Math.abs(fromY - toY) < rowHeight) ?
      Math.abs(fromY - toY) / 2 :
      fromY === toY ? 0 :
      fromY > toY
      ? -rowHeight / 2
      : rowHeight / 2;

  const taskFromEndPosition = fromX + arrowIndent * 2;

  const taskFromHorizontalOffsetValue =
    taskFromEndPosition < toX ? "" : `H ${toX - arrowIndent}`;

  const taskToHorizontalOffsetValue =
    taskFromEndPosition > toX
      ? arrowIndent
      : toX - taskFrom.x2 - arrowIndent;

  const path = `M ${fromX} ${fromY}
  h ${arrowIndent}
  v ${verticalOffset}
  ${taskFromHorizontalOffsetValue}
  V ${toY}
  h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${taskTo.x1},${toY}
  ${taskTo.x1 - 5},${toY - 5}
  ${taskTo.x1 - 5},${toY + 5}`;
  return [path, trianglePoints];
};

const drownPathAndTriangleRTL = (
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number
) => {
  const fromX = taskFrom.x1;
  const fromY = taskFrom.y + taskHeight / 2;
  const toX = taskTo.x2;
  const toY = taskTo.y + taskHeight / 2;

  const verticalOffset = Math.abs(fromY - toY) < rowHeight
    ? 0
    : fromY > toY
      ? -rowHeight / 2
      : rowHeight / 2;

  const taskFromEndPosition = fromX - arrowIndent * 2;

  const taskFromHorizontalOffsetValue =
    taskFromEndPosition > toX ? "" : `H ${toX + arrowIndent}`;

  const taskToHorizontalOffsetValue =
    taskFromEndPosition < toX
      ? -arrowIndent
      : toX - taskFrom.x1 + arrowIndent;

  const path = `M ${fromX} ${fromY}
    h ${-arrowIndent}
    v ${verticalOffset}
    ${taskFromHorizontalOffsetValue}
    V ${toY}
    h ${taskToHorizontalOffsetValue}`;

  const trianglePoints = `${toX},${toY}
    ${toX + 5},${toY + 5}
    ${toX + 5},${toY - 5}`;

  return [path.trim(), trianglePoints.trim()];
};
