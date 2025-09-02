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
};

export const Arrow: React.FC<ArrowProps> = ({
                                              taskFrom,
                                              taskTo,
                                              rowHeight,
                                              taskHeight,
                                              arrowIndent,
                                              rtl,
                                              linkType = "ES",
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
      <path strokeWidth="1.5" d={path} fill="none" />
      <polygon points={trianglePoints} />
    </g>
  );
};

/* ===================== LTR: side-aware 버전 ===================== */
function drownPathAndTriangle_SideAware(
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number,
  fromSide: Side, // 'start'|'end'
  toSide: Side    // 'start'|'end'
): [string, string] {
  // 앵커 X
  const fromX = fromSide === "end" ? taskFrom.x2 : taskFrom.x1;
  const toX   = toSide   === "start" ? taskTo.x1   : taskTo.x2;

  const fromY = taskFrom.y + taskHeight / 2;
  const toY   = taskTo.y + taskHeight / 2;

  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;

  // LTR: end면 오른쪽(+), start면 왼쪽(-)
  const fromDir = fromSide === "end" ? +1 : -1;
  // 도착 엣지 기준으로, 마지막 들여쓰기 방향: start면 왼쪽(-)에서 멈추니 부호 +1, end면 오른쪽(+)에서 멈추니 부호 -1을 써서 (toX - toDir*indent) 계산에 쓰기 좋게 함
  const toDir = toSide === "start" ? +1 : -1;

  // 시작점에서 인덴트 2칸을 적용한 비교용 X
  const fromEndX = fromX + fromDir * arrowIndent * 2;

  // 중간 수평(H)로 toX 근처까지 갈 필요가 있는지 (기존 로직의 부등식 일반화)
  const needH = fromDir > 0 ? fromEndX > toX : fromEndX < toX;

  // 경로 만들기 (기존 스타일 유지: M → h → v → [H?] → V → h)
  const parts: string[] = [];
  parts.push(`M ${fromX} ${fromY}`);
  parts.push(`h ${fromDir * arrowIndent}`);
  parts.push(`v ${(indexCompare * rowHeight) / 2}`);

  if (needH) {
    // 도착 엣지에서 arrowIndent만큼 떨어진 절대 X
    const targetHX = toX - toDir * arrowIndent;
    parts.push(`H ${targetHX}`);
  }

  parts.push(`V ${toY}`);

  if (needH) {
    // 이미 toX - toDir*indent까지 와 있으니 마지막에 indent 만큼만
    parts.push(`h ${toDir * arrowIndent}`);
  } else {
    // 아직 수평 정렬을 안 했으니, 현재 x에서 toX까지 한 번에
    const currentX = fromX + fromDir * arrowIndent; // 첫 h 이후의 x
    parts.push(`h ${toX - currentX}`);
  }

  const path = parts.join(" ");

  // 삼각형 방향: LTR에서 start로 꽂히면 → 오른쪽(+)을 향해야 하므로 headDir=+1
  //              end로 꽂히면 → 왼쪽(-)을 향해야 하므로 headDir=-1
  const headDir = toSide === "start" ? +1 : -1;
  const tipX = toX;
  const tipY = toY;
  const baseX = tipX - headDir * 5;
  const trianglePoints = `${tipX},${tipY} ${baseX},${tipY - 5} ${baseX},${tipY + 5}`;

  return [path, trianglePoints];
}

/* ===================== RTL: side-aware 버전 ===================== */
function drownPathAndTriangleRTL_SideAware(
  taskFrom: BarTask,
  taskTo: BarTask,
  rowHeight: number,
  taskHeight: number,
  arrowIndent: number,
  fromSide: Side,
  toSide: Side
): [string, string] {
  // RTL에서 기존 로직은 from.x1 -> to.x2를 사용
  const fromX = fromSide === "end" ? taskFrom.x1 : taskFrom.x2;
  const toX   = toSide   === "start" ? taskTo.x2   : taskTo.x1;

  const fromY = taskFrom.y + taskHeight / 2;
  const toY   = taskTo.y + taskHeight / 2;

  const indexCompare = taskFrom.index > taskTo.index ? -1 : 1;

  // RTL: end면 왼쪽(-), start면 오른쪽(+)
  const fromDir = fromSide === "end" ? -1 : +1;
  // 도착 엣지 방향 부호: start면 왼쪽(-)을 향해 멈추니 -1, end면 오른쪽(+)을 향해 멈추니 +1
  const toDir = toSide === "start" ? -1 : +1;

  const fromEndX = fromX + fromDir * arrowIndent * 2;

  // fromDir이 -면 왼쪽으로 가니, 왼쪽으로 넘어가면 needH; +면 오른쪽으로 가니, 오른쪽으로 넘어가면 needH
  const needH = fromDir < 0 ? fromEndX < toX : fromEndX > toX;

  const parts: string[] = [];
  parts.push(`M ${fromX} ${fromY}`);
  parts.push(`h ${fromDir * arrowIndent}`); // RTL에서는 end면 음수
  parts.push(`v ${(indexCompare * rowHeight) / 2}`);

  if (needH) {
    const targetHX = toX - toDir * arrowIndent;
    parts.push(`H ${targetHX}`);
  }

  parts.push(`V ${toY}`);

  if (needH) {
    parts.push(`h ${toDir * arrowIndent}`);
  } else {
    const currentX = fromX + fromDir * arrowIndent;
    parts.push(`h ${toX - currentX}`);
  }

  const path = parts.join(" ");

  // 삼각형 방향: RTL에서는 start로 꽂히면 시각적으로 "왼쪽(-)"을 향해야 함 → headDir=-1
  //              end로 꽂히면 "오른쪽(+)"을 향해야 함 → headDir=+1
  const headDir = toSide === "start" ? -1 : +1;
  const tipX = toX;
  const tipY = toY;
  const baseX = tipX - headDir * 5;
  const trianglePoints = `${tipX},${tipY} ${baseX},${tipY - 5} ${baseX},${tipY + 5}`;

  return [path, trianglePoints];
}
