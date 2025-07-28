import React, { useMemo } from "react";
import { ColumnDef, Task, TableCellValue } from "../../types/public-types";
import { overlappingCount } from "../../helpers/bar-helper";

const localeDateStringCache: Record<string, string> = {};
const toLocaleDateStringFactory = (locale: string) => (
  date: Date,
  options: Intl.DateTimeFormatOptions
) => {
  const key = date.toISOString();
  if (!localeDateStringCache[key]) {
    localeDateStringCache[key] = date.toLocaleDateString(locale, options);
  }
  return localeDateStringCache[key];
};

const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  colDefs ?: ColumnDef[];
}> = ({
        rowHeight,
        rowWidth,
        fontFamily,
        fontSize,
        locale,
        tasks,
        selectedTaskId,
        /*setSelectedTask,*/
        onExpanderClick,
        colDefs,
      }) => {

  const calculateRowSpans = (tasks: Task[], field: string): Record<string, number> => {
    const spanMap: Record<string, number> = {};
    let prevValue: any = null;
    let span = 0;

    for (const task of tasks) {
      const currValue = task.tableData?.[field];

      if (currValue === prevValue) {
        span++;
      } else {
        if (prevValue != null && span > 0) {
          spanMap[prevValue] = span;
        }
        prevValue = currValue;
        span = 1;
      }
    }

    if (prevValue != null && span > 0) {
      spanMap[prevValue] = span;
    }

    return spanMap;
  };

  const rowSpanField = "phase"; // 예시 필드
  const rowSpanMap = useMemo(() => calculateRowSpans(tasks, rowSpanField), [tasks]);

  const toLocaleDateString = useMemo(() => toLocaleDateStringFactory(locale), [locale]);

  const defaultColDefs: ColumnDef[] = [
    { field: "name", headerName: "Name" },
    { field: "start", headerName: "From" },
    { field: "end", headerName: "To" },
  ];

  const flattenColDefs = (defs?: ColumnDef[]): ColumnDef[] =>
    (defs && defs.length > 0 ? defs : defaultColDefs).flatMap((def) =>
      def.children?.length ? def.children : [def]
    );

  const flatCols = useMemo(() => flattenColDefs(colDefs), [colDefs]);

  const formatCellValue = (value: TableCellValue): React.ReactNode => {
    if (value instanceof Date) {
      return toLocaleDateString(value, dateTimeOptions);
    }
    return value;
  };
  let renderedRowSpanMap: Record<string, boolean> = {};


  const rowSpanHeightMap = useMemo(() => {
    const map: Record<string, number> = {};

    tasks.forEach((task) => {
      const phase = String(task.tableData?.[rowSpanField]);
      const count = overlappingCount(task);
      const totalHeight = (count + 1) * rowHeight;

      if (map[phase]) {
        map[phase] += totalHeight;
      } else {
        map[phase] = totalHeight;
      }
    });

    return map;
  }, [tasks, rowHeight]);

  return (
    <table
      style={{
        fontFamily,
        fontSize,
        borderCollapse: "collapse",
        boxSizing: "border-box",
      }}
    >
      <tbody>
      {tasks.map((task) => {
        const isSelected = selectedTaskId === task.id;
        const expanderSymbol = task.hideChildren === false ? "▼" : task.hideChildren === true ? "▶" : "";

        return (
          <tr
            key={task.id}
            style={{
              minHeight : rowHeight,
              height: rowHeight,
              backgroundColor: isSelected
                ? task.styles?.selectedRowColor ?? undefined
                : task.styles?.defaultRowColor ?? undefined,
              cursor: "pointer",
            }}
            /*onClick={() => setSelectedTask(task.id)}*/
          >
            {flatCols.map((col, colIndex) => {
              const field = col.field ?? "";
              const value = task.tableData?.[field];
              let content: React.ReactNode;

              // name 필드에 대한 확장 처리
              if (field === "name") {
                content = (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: 16,
                        cursor: "pointer",
                        marginRight: 4,
                        userSelect: "none",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpanderClick(task);
                      }}
                    >
                      {expanderSymbol}
                    </div>
                    <div>{task.name}</div>
                  </div>
                );
              } else {
                content = formatCellValue(value);
              }

              // rowSpan 적용 필드일 경우
              if (field === rowSpanField) {
                const rowSpanKey = String(value);
                if (renderedRowSpanMap[rowSpanKey]) {
                  return null; // 이미 렌더링된 경우 생략
                }
                renderedRowSpanMap[rowSpanKey] = true;

                return (
                  <td
                    key={`${task.id}_${colIndex}`}
                    rowSpan={rowSpanMap[rowSpanKey]}
                    className={col.cellClass ?? ""}
                    style={{
                      boxSizing: "border-box",
                      minWidth: col.minWidth || rowWidth,
                      maxWidth: col.minWidth || rowWidth,
                      border: "1px solid #e6e4e4",
                      padding : "0px",
                      textAlign: "center", // 가운데 정렬
                      verticalAlign: "middle",
                      writingMode: "vertical-rl", // 세로 쓰기
                      textOrientation: "upright", // 문자 방향 자연스럽게
                      height: `${rowSpanHeightMap[rowSpanKey]}px`,
                      minHeight: `${rowSpanHeightMap[rowSpanKey]}px`,
                    }}
                  >
                    {col.cellRenderer ? col.cellRenderer(task) : content}
                  </td>
                );
              }

              // 일반 필드
              return (
                <td
                  key={`${task.id}_${colIndex}`}
                  className={col.cellClass ?? ""}
                  style={{
                    boxSizing: "border-box",
                    minHeight : rowHeight,
                    height:
                      task.siblingTasks && task.siblingTasks.length > 0
                        ? (overlappingCount(task)) * rowHeight + rowHeight
                        : '',
                    minWidth: col.minWidth || rowWidth,
                    border: "1px solid #e6e4e4",
                    padding: "0px",
                    textAlign: "center",
                    verticalAlign: "middle",
                    ...(col.cellStyle || {}),
                  }}
                >
                  {col.cellRenderer ? col.cellRenderer(task) : content}
                </td>
              );
            })}
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};
