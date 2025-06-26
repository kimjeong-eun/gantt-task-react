import React from "react";
import { ColumnDef } from "../../types/public-types";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  colDefs ?: ColumnDef[];
}> = ({ headerHeight, fontFamily, fontSize, rowWidth, colDefs }) => {
  const totalDepth = getHeaderDepth(colDefs);

  // 헤더 전체 깊이 계산
  function getHeaderDepth(cols ?: ColumnDef[]): number {
    if (!cols || cols.length === 0) return 0;
    return cols.reduce((max, col) => {
      const childDepth = col.children ? getHeaderDepth(col.children) + 1 : 1;
      return Math.max(max, childDepth);
    }, 0);
  }

  // 각 column이 차지할 leaf node 개수 (colSpan 용)
  function getLeafCount(col: ColumnDef): number {
    if (!col.children || col.children.length === 0) return 1;
    return col.children.reduce((sum, child) => sum + getLeafCount(child), 0);
  }

  // level별로 colDef 배열을 나눔
  function flattenByLevel(columns ?: ColumnDef[], level = 0, result: ColumnDef[][] = []) {
    if (!columns) return result;
    if (!result[level]) result[level] = [];
    for (const col of columns) {
      result[level].push(col);
      if (col.children) {
        flattenByLevel(col.children, level + 1, result);
      }
    }
    return result;
  }

  const headerRows = flattenByLevel(colDefs);

  return (
    <table
      style={{
        fontFamily,
        fontSize,
        borderCollapse: "collapse",
        width: "100%",
      }}
    >
      <thead>
      {headerRows.map((cols, level) => (
        <tr key={`header-row-${level}`} style={{ height: headerHeight / totalDepth }}>
          {cols.map((col, index) => {
            const hasChildren = !!col.children?.length;
            const colSpan = hasChildren ? getLeafCount(col) : 1;
            const rowSpan = hasChildren ? 1 : totalDepth - level;

            return (
              <th
                key={`${col.headerName}-${level}-${index}`}
                colSpan={colSpan}
                rowSpan={rowSpan}
                style={{
                  minWidth: col.minWidth || rowWidth,
                  border: "1px solid #ddd",
                  borderBottom : "none",
                  padding: "4px",
                  textAlign: "center",
                  ...(col.headerStyle || {}),
                }}
              >
                {col.headerName}
              </th>
            );
          })}
        </tr>
      ))}
      </thead>
    </table>
  );
};
