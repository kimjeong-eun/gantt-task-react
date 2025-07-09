import { Task } from "../../dist/types/public-types";

export function initTasks() {
/*
  const currentDate = new Date();
*/
  const tasks: Task[] = [
    {
      id:'1-1',
      name :'Project1',
      type: "project",
      start: new Date('2025-06-01'),
      end: new Date('2025-06-10'),
      progress: 1,
      hideChildren :false,
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
      project :'1-1',
      isDisabled : true,
    },
    {
      id: '2',
      name: 'Development',
      start: new Date('2025-06-06'),
      end: new Date('2025-06-09'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
      dependencies: ['1'],
      baselineStart : new Date('2025-06-03'),
      baselineEnd : new Date('2025-06-08'),
      baselineColor:'#de6565',
      tableData : {
        name2 : 'test',
        status : 'test2',
        start :'2025-06-06',
        end :'2025-06-09'
      },
      project :'1-1',
      isDisabled : true
    },
    {
      id: '3',
      name: 'Development',
      start: new Date('2025-06-06'),
      end: new Date('2025-06-12'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
      dependencies: ['1'],
      baselineStart : new Date('2025-06-03'),
      baselineEnd : new Date('2025-06-10'),
      baselineColor:'#de6565',
      tableData : {
        name2 : 'test2',
        status : 'test2',
        start :'2025-06-06',
        end :'2025-06-09'
      },
      project :'1-1',
      isDisabled : true
    },
    {
      id: '4',
      name: 'Development2',
      start: new Date('2025-06-06'),
      end: new Date('2025-06-12'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
      dependencies: ['1'],
      baselineStart : new Date('2025-06-03'),
      baselineEnd : new Date('2025-06-10'),
      baselineColor:'#de6565',
      project :'1-1',
      isDisabled : true
    },
    {
      id:'1-2',
      name :'Project2',
      type: "project",
      start: new Date('2025-06-01'),
      end: new Date('2025-06-10'),
      progress: 1,
      hideChildren :false,
      dependencies: ['1-1'],
      isDisabled : true
    },
    {
      id: '5',
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
      project :'1-2',
      isDisabled : true
    },
    {
      id: '6',
      name: 'Development',
      start: new Date('2025-06-06'),
      end: new Date('2025-06-09'),
      type: 'task',
      progress: 50,
      styles: {
        progressColor: '#f87060',
        backgroundColor: '#f87060',
        selectedRowColor : '#5aa9e6'},
      dependencies: ['5'],
      baselineStart : new Date('2025-06-03'),
      baselineEnd : new Date('2025-06-08'),
      baselineColor:'#de6565',
      tableData : {
        name2 : 'test',
        status : 'test2',
        start :'2025-06-06',
        end :'2025-06-09'
      },
      project :'1-2',
      isDisabled : true
    },
    {
      id: '7',
      name: 'Development',
      start: new Date('2025-06-06'),
      end: new Date('2025-06-12'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
      dependencies: ['5'],
      baselineStart : new Date('2025-06-03'),
      baselineEnd : new Date('2025-06-10'),
      baselineColor:'#de6565',
      tableData : {
        name2 : 'test2',
        status : 'test2',
        start :'2025-06-06',
        end :'2025-06-09'
      },
      project :'1-2',
    },
    {
      id: '8',
      name: 'Development2',
      start: new Date('2025-06-06'),
      end: new Date('2025-06-12'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
      dependencies: ['5'],
      baselineStart : new Date('2025-06-03'),
      baselineEnd : new Date('2025-06-10'),
      baselineColor:'#de6565',
      project :'1-2',
    },
    {
      id: '9',
      name: 'Development2',
      start: new Date('2025-06-30'),
      end: new Date('2025-07-04'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
      dependencies: ['5'],
      baselineStart : new Date('2025-06-30'),
      baselineEnd : new Date('2025-07-04'),
      baselineColor:'#de6565',
      project :'1-2',
    },
    {
      id: '10',
      name: 'Development2',
      start: new Date('2025-09-01'),
      end: new Date('2025-10-01'),
      type: 'task',
      progress: 50,
      styles: { progressColor: '#f87060', backgroundColor: '#f87060' },
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
