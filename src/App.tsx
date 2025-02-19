import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ListTodo, CheckSquare, Plus } from 'lucide-react';
import { TaskForm } from './components/TaskForm';
import { ActiveTasks } from './pages/ActiveTasks';
import { CompletedTasks } from './pages/CompletedTasks';
import { useTasks } from './hooks/useTasks';

function App() {
  const { addTask } = useTasks();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link
                  to="/"
                  className="flex items-center px-4 text-gray-900 hover:text-indigo-600"
                >
                  <ListTodo className="h-6 w-6 mr-2" />
                  <span className="font-medium">Task Manager</span>
                </Link>
              </div>
              <div className="flex space-x-1">
                <Link
                  to="/active"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Active Tasks</span>
                </Link>
                <Link
                  to="/completed"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  <CheckSquare className="h-5 w-5 mr-1" />
                  <span className="hidden sm:inline">Completed Tasks</span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="flex-1 max-w-7xl w-full mx-auto py-6 sm:px-6 lg:px-8 mt-16">
          <Routes>
            <Route
              path="/"
              element={
                <div className="px-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Add New Task</h1>
                  <TaskForm onSubmit={addTask} />
                </div>
              }
            />
            <Route path="/active" element={<ActiveTasks />} />
            <Route path="/completed" element={<CompletedTasks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;