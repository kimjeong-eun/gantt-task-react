import { Task } from "../../dist/types/public-types";

export function initTasks() {
/*
  const currentDate = new Date();
*/
  const tasks: Task[] = [
    {
      id: '1',
      name: 'Design',
      start: new Date('2025-06-01'),
      end: new Date('2025-06-05'),
      type: 'task',
      progress: 70,
      styles: { progressColor: '#5aa9e6', backgroundColor: '#5aa9e6' },
      baselineStart :  new Date('2025-05-30'),
      baselineEnd : new Date('2025-06-02'),
      baselineColor:'#de6565'
    },
    {
      id: '2',
      name: 'Development',
      start: new Date('2025-06-06'),
      end: new Date('2025-06-12'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
      dependencies: ['1'],
      baselineStart : new Date('2025-06-03'),
      baselineEnd : new Date('2025-06-10'),
      baselineColor:'#de6565'
    },
  ];
  return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
