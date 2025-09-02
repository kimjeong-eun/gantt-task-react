import React from "react";
import { BarTask } from "../../types/bar-task";

type LinkType = "SS" | "SE" | "ES" | "EE";
type Side = "start" | "end";

type ArrowProps = {
  taskFrom: BarTask;
  taskTo: BarTask;
  rowHeight: number;
  taskHeight: number;
  arrowIndent: number;
  rtl: boolean;
  linkType?: LinkType; // 기본 ES(끝→시작)
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
                                              linkType = "ES",
                                              isHighlighted = false, highlightArrow ,highlightArrowColor
                                            }) => {
  const fromSide: Side = linkType[0] === "S" ? "start" : "end";
  const toSide: Side = linkType[1] === "S" ? "start" : "end";

  const [path, trianglePoints] = rtl
    ? drownPathAndTriangleRTL_SideAware(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent,
      fromSide,
      toSide
    )
    : drownPathAndTriangle_SideAware(
      taskFrom,
      taskTo,
      rowHeight,
      taskHeight,
      arrowIndent,
      fromSide,
      toSide
    );

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

/* =============== LTR: row 경계 스냅(항상 경계로 우회) =============== */
function drownPathAndTriangle_SideAware(
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number,
  fromSide: Side,
  toSide: Side
): [string, string] {
  const fromX = fromSide === "end" ? taskFrom.x2 : taskFrom.x1;
  const toX   = toSide   === "start" ? taskTo.x1   : taskTo.x2;

  const fromY = taskFrom.y + taskHeight / 2;
  const toY   = taskTo.y + taskHeight / 2;

  const fromRowTop = taskFrom.index * rowHeight;
  const fromRowBottom = fromRowTop + rowHeight;

  // ▼ 첫 꺾임을 "경계선"으로 스냅
  //   - 아래로 내려가는 경우(자식이 아래 행): from 행의 "아래 경계"로
  //   - 위로 올라가는 경우(자식이 위 행): from 행의 "위 경계"로
  const goingDown = taskTo.index > taskFrom.index;
  const elbowY = goingDown ? fromRowBottom : fromRowTop;

  const fromDir = fromSide === "end" ? +1 : -1;   // LTR 기준
  const toDir   = toSide   === "start" ? +1 : -1; // LTR 기준

  const parts: string[] = [];
  parts.push(`M ${fromX} ${fromY}`);
  parts.push(`h ${fromDir * arrowIndent}`);

  // 항상 경계로 먼저 붙기
  parts.push(`V ${elbowY}`);

  // 경계선 위/아래에서 수평 정렬 → 도착 y로 수직 → 마지막 h
  parts.push(`H ${toX - toDir * arrowIndent}`);
  parts.push(`V ${toY}`);
  parts.push(`h ${toDir * arrowIndent}`);

  const path = parts.join(" ");

  // 화살촉: start로 꽂히면 오른쪽(+), end로 꽂히면 왼쪽(-)
  const headDir = toSide === "start" ? +1 : -1;
  const tipX = toX;
  const tipY = toY;
  const baseX = tipX - headDir * 5;
  const trianglePoints = `${tipX},${tipY} ${baseX},${tipY - 5} ${baseX},${tipY + 5}`;

  return [path, trianglePoints];
}

/* =============== RTL: row 경계 스냅(항상 경계로 우회) =============== */
function drownPathAndTriangleRTL_SideAware(
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number,
  fromSide: Side,
  toSide: Side
): [string, string] {
  // RTL 기준 앵커
  const fromX = fromSide === "end" ? taskFrom.x1 : taskFrom.x2;
  const toX   = toSide   === "start" ? taskTo.x2   : taskTo.x1;

  const fromY = taskFrom.y + taskHeight / 2;
  const toY   = taskTo.y + taskHeight / 2;

  const fromRowTop = taskFrom.index * rowHeight;
  const fromRowBottom = fromRowTop + rowHeight;

  const goingDown = taskTo.index > taskFrom.index;
  const elbowY = goingDown ? fromRowBottom : fromRowTop;

  const fromDir = fromSide === "end" ? -1 : +1;   // RTL 기준
  const toDir   = toSide   === "start" ? -1 : +1; // RTL 기준

  const parts: string[] = [];
  parts.push(`M ${fromX} ${fromY}`);
  parts.push(`h ${fromDir * arrowIndent}`);

  parts.push(`V ${elbowY}`);
  parts.push(`H ${toX - toDir * arrowIndent}`);
  parts.push(`V ${toY}`);
  parts.push(`h ${toDir * arrowIndent}`);

  const path = parts.join(" ");

  // 화살촉: RTL에선 start면 좌(-), end면 우(+)
  const headDir = toSide === "start" ? -1 : +1;
  const tipX = toX;
  const tipY = toY;
  const baseX = tipX - headDir * 5;
  const trianglePoints = `${tipX},${tipY} ${baseX},${tipY - 5} ${baseX},${tipY + 5}`;

  return [path, trianglePoints];
}
