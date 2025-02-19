import React from 'react';
import { TaskList } from '../components/TaskList';
import { useTasks } from '../hooks/useTasks';

export function CompletedTasks() {
  const { tasks, deleteTask } = useTasks();
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="max-w-2xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Completed Tasks</h1>
        <TaskList
          tasks={completedTasks}
          onDelete={deleteTask}
        />
      </div>
    </div>
  );
}