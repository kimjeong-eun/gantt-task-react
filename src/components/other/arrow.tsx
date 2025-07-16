import React from "react";
import { BarTask } from "../../types/bar-task";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
  highlightArrow ?: boolean;
  isHighlighted?: boolean;
  highlightArrowColor ?: string;
};
export const Arrow: React.FC<ArrowProps> = ({
  taskFrom,
  taskTo,
  rowHeight,
  taskHeight,
  arrowIndent,
  rtl,
  isHighlighted = false, highlightArrow ,highlightArrowColor
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
      <path stroke={highlightArrow && isHighlighted ? highlightArrowColor : "#999"}
             strokeWidth={highlightArrow && isHighlighted ? 2.5 : 1.5} d={path} fill="none" />
      <polygon
        points={trianglePoints}
        fill={highlightArrow && isHighlighted ? highlightArrowColor : "#999"}
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

  let verticalOffset = 0;

  if (fromY !== toY && Math.abs(fromY - toY) < rowHeight){
    if (fromY > toY) { verticalOffset = -Math.abs(fromY - toY)  / 2}
    else { verticalOffset = Math.abs(fromY - toY)  / 2}
  } else if (fromY === toY) {
    verticalOffset = 0
  } else if (fromY > toY) {
    verticalOffset = -rowHeight / 2
  } else {
    verticalOffset = rowHeight / 2
  }

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
