import { Task } from "../../dist/types/public-types";

export function initTasks() {
/*
  const currentDate = new Date();
  FFA834
*/
  const tasks: Task[] = [
    {
      id: 'empty-1',
      name: '',
      start: new Date('2025-01-01'),
      end: new Date('2025-01-30'),
      type: 'task',
      progress: 70,
      styles: {
        backgroundColor :'none',
        progressColor: 'none',
        progressSelectedColor : 'none',
        backgroundSelectedColor :'none',
      },
      tableData : {
        phase : 'Engineering',
        discipline: 'Machinary'
      },
      isDisabled : true,
    },
    {
      id: '2',
      name: 'Place Holder',
      start: new Date('2024-12-30'),
      end: new Date('2025-01-30'),
      type: 'task',
      progress: 50,
      styles: {
        backgroundColor :'#C0C0C0',
        progressColor: '#C0C0C0',
        progressSelectedColor : '#C0C0C0',
        backgroundSelectedColor :'#C0C0C0' },
      dependencies: ['1'],
      isDisabled : true,
      tableData : {
        phase : 'Engineering',
        discipline: 'Civil'
      },
    },
    {
      id: '3',
      name: 'Receive Order',
      start: new Date('2025-09-09'),
      end: new Date('2025-09-30'),
      type: 'task',
      progress: 50,
      styles: {
        backgroundColor :'#D4E3FC',
        progressColor: '#D4E3FC',
        progressSelectedColor : '#D4E3FC',
        backgroundSelectedColor :'#D4E3FC'},
      dependencies: ['2' , '6'],
      tableData : {
        phase : 'Engineering',
        discipline: 'Mechanical'
      },
      isDisabled : true
    },
    {
      id: '4',
      name: '',
      start: new Date('2025-09-06'),
      end: new Date('2025-10-12'),
      type: 'task',
      progress: 50,
      styles: {
        backgroundColor :'none',
        progressColor: 'none',
        progressSelectedColor : 'none',
        backgroundSelectedColor :'none'},
      isDisabled : true,
      tableData : {
        phase : 'Engineering',
        discipline: 'Electrical'
      },
    },
    {
      id: '5',
      name: 'Manage availability',
      start: new Date('2025-02-27'),
      end: new Date('2025-03-25'),
      type: 'task',
      progress: 70,
      styles: {
        backgroundColor :'#C0C0C0',
        progressColor: '#C0C0C0',
        progressSelectedColor : '#C0C0C0',
        backgroundSelectedColor :'#C0C0C0'
      },
      tableData : {
        phase : 'Procurement',
        discipline: 'Machinary'
      },
      dependencies: ['2'],
      isDisabled : true,
      siblingTasks : [
        {
          id: '6',
          name: 'Adjust stock levels',
          start: new Date('2025-07-02'),
          end: new Date('2025-07-30'),
          type: 'task',
          progress: 50,
          styles: {
            backgroundColor :'#D4E3FC',
            progressColor: '#D4E3FC',
            progressSelectedColor : '#D4E3FC',
            backgroundSelectedColor :'#D4E3FC'
          },
          dependencies :['10'],
          isDisabled : true,
        },
      ]
    },
    {
      id: '8',
      name: 'Generate pick ticket',
      start: new Date('2025-04-15'),
      end: new Date('2025-05-15'),
      type: 'task',
      progress: 70,
      styles: {
        backgroundColor :'#FFA834',
        progressColor: '#FFA834',
        progressSelectedColor : '#FFA834',
        backgroundSelectedColor :'#FFA834'
      },
      tableData : {
        phase : 'Procurement',
        discipline: 'Civil'
      },
      dependencies: ['5'],
      isDisabled : true,
    },
    {
      id: '9',
      name: 'Empty-3',
      start: new Date('2025-11-01'),
      end: new Date('2025-12-09'),
      type: 'task',
      progress: 70,
      styles: {
        backgroundColor :'none',
        progressColor: 'none',
        progressSelectedColor : 'none',
        backgroundSelectedColor :'none'
      },
      tableData : {
        phase : 'Procurement',
        discipline: 'Mechanical'
      },
      isDisabled : true,
    },
    {
      id: '10',
      name: 'Coordinate with cargoagency',
      start: new Date('2025-05-24'),
      end: new Date('2025-06-30'),
      type: 'task',
      progress: 50,
      styles: {
        backgroundColor :'#D4E3FC',
        progressColor: '#D4E3FC',
        progressSelectedColor : '#D4E3FC',
        backgroundSelectedColor :'#D4E3FC'},
      dependencies: ['8'],
      isDisabled : true,
      tableData : {
        phase : 'Procurement',
        discipline: 'Electrical'
      },
    },
    {
      id: '11',
      name: 'Prepare order for shipping',
      start: new Date('2025-02-27'),
      end: new Date('2025-03-20'),
      type: 'task',
      progress: 50,
      styles: {
        backgroundColor :'#C0C0C0',
        progressColor: '#C0C0C0',
        progressSelectedColor : '#C0C0C0',
        backgroundSelectedColor :'#C0C0C0'},
      isDisabled : true,
      tableData : {
        phase : 'Construction',
        discipline: 'Machinary'
      },
      dependencies: ['5']
    },
    {
      id: '12',
      name: 'Print shipping labels',
      start: new Date('2025-06-01'),
      end: new Date('2025-06-30'),
      type: 'task',
      progress: 50,
      styles: {
        backgroundColor :'#D4E3FC',
        progressColor: '#D4E3FC',
        progressSelectedColor : '#D4E3FC',
        backgroundSelectedColor :'#D4E3FC'},
      isDisabled : true,
      tableData : {
        phase : 'Construction',
        discipline: 'Civil'
      },
      dependencies: ['15'],
      siblingTasks: [
        {
          id: '13',
          name: 'Load trucks',
          start: new Date('2025-06-15'),
          end: new Date('2025-08-20'),
          type: 'task',
          progress: 50,
          styles: {
            backgroundColor :'#D4E3FC',
            progressColor: '#D4E3FC',
            progressSelectedColor : '#D4E3FC',
            backgroundSelectedColor :'#D4E3FC'},
          isDisabled : true,
          dependencies: ['12']
        },
        {
          id: '14',
          name: 'Ship Order',
          start: new Date('2025-06-02'),
          end: new Date('2025-09-20'),
          type: 'task',
          progress: 50,
          styles: {
            backgroundColor :'#D4E3FC',
            progressColor: '#D4E3FC',
            progressSelectedColor : '#D4E3FC',
            backgroundSelectedColor :'#D4E3FC'},
          isDisabled : true,
          dependencies: ['13']
        }
      ]
    },
    {
      id: '15',
      name: 'Wait Packages',
      start: new Date('2025-04-15'),
      end: new Date('2025-05-15'),
      type: 'task',
      progress: 50,
      styles: {
        backgroundColor :'#FFA834',
        progressColor: '#FFA834',
        progressSelectedColor : '#FFA834',
        backgroundSelectedColor :'#FFA834'},
      isDisabled : true,
      tableData : {
        phase : 'Construction',
        discipline: 'Mechanical'
      },
      dependencies: ['11'],
      siblingTasks: [
        {
          id: '16',
          name: 'Realease invoice',
          start: new Date('2025-10-09'),
          end: new Date('2025-11-10'),
          type: 'task',
          progress: 50,
          styles: {
            backgroundColor :'#D4E3FC',
            progressColor: '#D4E3FC',
            progressSelectedColor : '#D4E3FC',
            backgroundSelectedColor :'#D4E3FC'},
          isDisabled : true,
          dependencies: ['14','17' ,'3' ]
        },
      ]
    },
    {
      id: '17',
      name: 'Tracking Orders',
      start: new Date('2025-09-01'),
      end: new Date('2025-09-20'),
      type: 'task',
      progress: 50,
      styles: {
        backgroundColor :'#D4E3FC',
        progressColor: '#D4E3FC',
        progressSelectedColor : '#D4E3FC',
        backgroundSelectedColor :'#D4E3FC'},
      isDisabled : true,
      tableData : {
        phase : 'Construction',
        discipline: 'Electrical'
      },
      dependencies: ['13' ]
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
