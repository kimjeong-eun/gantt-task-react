import { Task } from "../../dist/types/public-types";


export function initTasks() {
/*
  const currentDate = new Date();
*/
  const tasks: Task[] = [
    {
      id: '2',
      name: 'Development',
      start: new Date('2025-05-06'),
      end: new Date('2025-07-09'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
      dependencies: [{id:'1',type:'SE'}],
      baselineStart : new Date('2025-06-03'),
      baselineEnd : new Date('2025-06-08'),
      baselineColor:'#de6565',
      tableData : {
        name2 : 'test',
        status : 'test2',
        start :'2025-06-06',
        end :'2025-06-09'
      },
      isDisabled : true
    },
    {
      id: '1',
      name: 'Design',
      start: new Date('2025-06-01'),
      end: new Date('2025-06-09'),
      type: 'task',
      progress: 70,
      styles: {
        progressColor: '#5aa9e6', //bar progress color
        backgroundColor: '#5aa9e6', // bar background color
        defaultRowColor :'', //default row color (table)
        selectedRowColor : '#5aa9e6' // selected row color (table)
      },
      baselineStart :  new Date('2025-06-01'),
      baselineEnd : new Date('2025-06-05'),
      baselineColor:'#de6565',
      tableData : {
        name2 : 'test',
        status : 'test2',
        start :'2025-06-06',
        end :'2025-06-09'
      },
      isDisabled : true,
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
