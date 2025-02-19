import { useState, useEffect } from 'react';
import { Task } from '../types';
import { addDays, addWeeks, addMonths, parseISO, format } from 'date-fns';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    if (task.recurring) {
      const startDate = parseISO(task.datetime);
      const endDate = parseISO(task.recurring.endDate);
      const recurringTasks: Task[] = [];

      let currentDate = startDate;
      while (currentDate <= endDate) {
        const currentDateTime = format(currentDate, "yyyy-MM-dd'T'HH:mm");
        const alarmDateTime = format(
          parseISO(task.alarmTime),
          "yyyy-MM-dd'T'HH:mm"
        );

        recurringTasks.push({
          ...task,
          id: crypto.randomUUID(),
          datetime: currentDateTime,
          alarmTime: alarmDateTime,
          completed: false,
        });

        // Calculate next date based on frequency
        switch (task.recurring.frequency) {
          case 'daily':
            currentDate = addDays(currentDate, 1);
            break;
          case 'weekly':
            currentDate = addWeeks(currentDate, 1);
            break;
          case 'monthly':
            currentDate = addMonths(currentDate, 1);
            break;
        }
      }

      setTasks(prev => [...prev, ...recurringTasks]);
    } else {
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        completed: false,
      };
      setTasks(prev => [...prev, newTask]);
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return {
    tasks,
    addTask,
    deleteTask,
    toggleComplete,
  };
}