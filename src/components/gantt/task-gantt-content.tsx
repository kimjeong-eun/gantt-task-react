import React, { useEffect, useState } from "react";
import { EventOption } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import { Arrow } from "../other/arrow";
import { handleTaskBySVGMouseEvent } from "../../helpers/bar-helper";
import { isKeyboardEvent } from "../../helpers/other-helper";
import { TaskItem } from "../task-item/task-item";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from "../../types/gantt-task-actions";

export type TaskGanttContentProps = {
  tasks: BarTask[];
  dates: Date[];
  ganttEvent: GanttEvent;
  selectedTask: BarTask | undefined;
  rowHeight: number;
  columnWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgWidth: number;
  taskHeight: number;
  arrowColor: string;
  arrowIndent: number;
  fontSize: string;
  fontFamily: string;
  rtl: boolean;
  setGanttEvent: (value: GanttEvent) => void;
  setFailedTask: (value: BarTask | null) => void;
  setSelectedTask: (taskId: string) => void;
  highlightArrow ?: boolean;
  highlightArrowColor ?: string;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
                                                                    tasks,
                                                                    dates,
                                                                    ganttEvent,
                                                                    selectedTask,
                                                                    rowHeight,
                                                                    columnWidth,
                                                                    timeStep,
                                                                    svg,
                                                                    taskHeight,
                                                                    arrowColor,
                                                                    arrowIndent,
                                                                    fontFamily,
                                                                    fontSize,
                                                                    rtl,
                                                                    setGanttEvent,
                                                                    setFailedTask,
                                                                    setSelectedTask,
                                                                    onDateChange,
                                                                    onProgressChange,
                                                                    onDoubleClick,
                                                                    onClick,
                                                                    onDelete,
                                                                    highlightArrow,
                                                                    highlightArrowColor
                                                                  }) => {
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const dateDelta = dates[1].getTime() - dates[0].getTime();
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttEvent.changedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(svg?.current.getScreenCTM()?.inverse());

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        ganttEvent.action as BarMoveAction,
        ganttEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );
      if (isChanged) {
        setGanttEvent({ action: ganttEvent.action, changedTask });
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, changedTask } = ganttEvent;
      if (!changedTask || !point || !svg?.current || !originalSelectedTask) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(svg?.current.getScreenCTM()?.inverse());
      const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl
      );

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end ||
        originalSelectedTask.progress !== newChangedTask.progress;

      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setGanttEvent({ action: "" });
      setIsMoving(false);

      let operationSuccess = true;
      if ((action === "move" || action === "end" || action === "start") && onDateChange && isNotLikeOriginal) {
        try {
          const result = await onDateChange(newChangedTask, newChangedTask.barChildren);
          if (result !== undefined) operationSuccess = result;
        } catch (error) {
          operationSuccess = false;
        }
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(newChangedTask, newChangedTask.barChildren);
          if (result !== undefined) operationSuccess = result;
        } catch (error) {
          operationSuccess = false;
        }
      }

      if (!operationSuccess) {
        setFailedTask(originalSelectedTask);
      }
    };

    if (!isMoving && ["move", "end", "start", "progress"].includes(ganttEvent.action) && svg?.current) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [ganttEvent, xStep, initEventX1Delta, onProgressChange, timeStep, onDateChange, svg, isMoving, point, rtl, setFailedTask, setGanttEvent]);

  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    task: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (!event) {
      if (action === "select") setSelectedTask(task.id);
    } else if (isKeyboardEvent(event)) {
      if (action === "delete" && onDelete) {
        try {
          const result = await onDelete(task);
          if (result !== undefined && result) {
            setGanttEvent({ action, changedTask: task });
          }
        } catch (error) {
          console.error("Error on Delete.", error);
        }
      }
    } else if (action === "mouseenter") {
      if (!ganttEvent.action) setGanttEvent({ action, changedTask: task, originalSelectedTask: task });
    } else if (action === "mouseleave") {
      if (ganttEvent.action === "mouseenter") setGanttEvent({ action: "" });
    } else if (action === "dblclick") {
      onDoubleClick?.(task);
    } else if (action === "click") {
      onClick?.(task);
    } else if (action === "move") {
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(svg.current.getScreenCTM()?.inverse());
      setInitEventX1Delta(cursor.x - task.x1);
      setGanttEvent({ action, changedTask: task, originalSelectedTask: task });
    } else {
      setGanttEvent({ action, changedTask: task, originalSelectedTask: task });
    }
  };

  return (
    <g className="content">
      <g className="arrows" fill={arrowColor} stroke={arrowColor}>
        {tasks.flatMap(task =>
          [task, ...(task.siblingBarTasks ?? [])].flatMap(from =>
            from.barChildren.map(child => {
              const to = tasks.find(t => t.id === child.id) ?? tasks.flatMap(t => t.siblingBarTasks ?? []).find(t => t.id === child.id);
              return to ? (
                <Arrow
                  key={`Arrow from ${from.id} to ${to.id}`}
                  taskFrom={from}
                  taskTo={to}
                  rowHeight={rowHeight}
                  taskHeight={taskHeight}
                  arrowIndent={arrowIndent}
                  rtl={rtl}
                  highlightArrow = {highlightArrow}
                  isHighlighted={
                    selectedTask?.id === from.id || selectedTask?.id === to.id
                  }
                  highlightArrowColor={highlightArrowColor}
                />
              ) : null;
            })
          )
        )}
      </g>
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {tasks.flatMap(task =>
          [task, ...(task.siblingBarTasks ?? [])].map(bar => (
            <TaskItem
              key={bar.id}
              task={bar}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              isProgressChangeable={!!onProgressChange && !bar.isDisabled}
              isDateChangeable={!!onDateChange && !bar.isDisabled}
              isDelete={!bar.isDisabled}
              onEventStart={handleBarEventStart}
              isSelected={!!selectedTask && selectedTask.id === bar.id}
              rtl={rtl}
            />
          ))
        )}
      </g>
    </g>
  );
};
