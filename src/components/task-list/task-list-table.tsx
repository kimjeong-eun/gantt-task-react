import React, { useMemo } from "react";
import { ColumnDef, Task, TableCellValue } from "../../types/public-types";

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
  colDefs: ColumnDef[];
}> = ({
        rowHeight,
        rowWidth,
        fontFamily,
        fontSize,
        locale,
        tasks,
        selectedTaskId,
        setSelectedTask,
        onExpanderClick,
        colDefs,
      }) => {
  const toLocaleDateString = useMemo(() => toLocaleDateStringFactory(locale), [locale]);

  const flattenColDefs = (defs: ColumnDef[]): ColumnDef[] =>
    defs.flatMap((def) => (def.children?.length ? def.children : [def]));

  const flatCols = flattenColDefs(colDefs);

  const formatCellValue = (value: TableCellValue): React.ReactNode => {
    if (value instanceof Date) {
      return toLocaleDateString(value, dateTimeOptions);
    }
    return value;
  };

  return (
    <table
      style={{
        fontFamily,
        fontSize,
        borderCollapse: "collapse",
        width: "100%",
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
              height: rowHeight,
              backgroundColor: isSelected
                ? task.styles?.selectedRowColor ?? undefined
                : task.styles?.defaultRowColor ?? undefined,
              cursor: "pointer",
            }}
            onClick={() => setSelectedTask(task.id)}
          >
            {flatCols.map((col, colIndex) => {
              const field = col.field ?? "";
              let content: React.ReactNode;

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
                const value = task.tableDatas?.[field];
                content = formatCellValue(value);
              }

              return (
                <td
                  key={`${task.id}_${colIndex}`}
                  className={col.cellClass ?? ""}
                  style={{
                    minWidth: col.minWidth || rowWidth,
                    border: "1px solid #e6e4e4",
                    padding: "4px",
                    textAlign: "left",
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
