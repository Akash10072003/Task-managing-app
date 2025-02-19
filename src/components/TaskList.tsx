import React, { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Check, Trash2, Clock, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { Task, ALARM_SOUNDS } from '../types';

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onComplete?: (id: string) => void;
}

export function TaskList({ tasks, onDelete, onComplete }: TaskListProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [playedAlarms, setPlayedAlarms] = useState<string[]>([]); // Store played alarm IDs

  // Group tasks by recurring and single tasks
  const groupedTasks = useMemo(() => {
    const groups: { [key: string]: Task[] } = {};
    
    tasks.forEach(task => {
      if (task.recurring) {
        if (!groups[task.name]) {
          groups[task.name] = [];
        }
        groups[task.name].push(task);
      } else {
        if (!groups['Single Tasks']) {
          groups['Single Tasks'] = [];
        }
        groups['Single Tasks'].push(task);
      }
    });

    return groups;
  }, [tasks]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName)
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  // **Alarm System: Checks every second**
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();

      tasks.forEach(task => {
        if (task.datetime && !task.completed && !playedAlarms.includes(task.id)) {
          const alarmTime = new Date(task.datetime);
          
          if (
            now.getFullYear() === alarmTime.getFullYear() &&
            now.getMonth() === alarmTime.getMonth() &&
            now.getDate() === alarmTime.getDate() &&
            now.getHours() === alarmTime.getHours() &&
            now.getMinutes() === alarmTime.getMinutes()
          ) {
            playAlarm(task);
            setPlayedAlarms(prev => [...prev, task.id]); // Mark alarm as played
          }
        }
      });
    };

    const interval = setInterval(checkAlarms, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [tasks, playedAlarms]);

  // Function to play alarm sound
  const playAlarm = (task: Task) => {
    const alarmSound = task.customSound?.url || ALARM_SOUNDS.find(sound => sound.id === task.alarmSound)?.url;

    if (alarmSound) {
      const audio = new Audio(alarmSound);
      audio.play();
    } else {
      alert(`Alarm for task: ${task.name}!`); // Fallback alert if no sound is selected
    }
  };

  if (Object.keys(groupedTasks).length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {Object.entries(groupedTasks).map(([groupName, groupTasks]) => (
        <div key={groupName} className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleGroup(groupName)}
            className="w-full px-4 py-3 flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {expandedGroups.includes(groupName) ? (
                <ChevronUp className="h-5 w-5 text-indigo-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-indigo-600" />
              )}
              <h3 className="text-lg font-medium text-gray-900">
                {groupName}
                <span className="ml-2 text-sm text-gray-500">
                  ({groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'})
                </span>
              </h3>
            </div>
          </button>

          {expandedGroups.includes(groupName) && (
            <div className="divide-y divide-gray-100">
              {groupTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {task.name}
                      </h4>
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>{format(new Date(task.datetime), 'PPp')}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Volume2 className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span>
                            {task.customSound
                              ? task.customSound.name
                              : ALARM_SOUNDS.find(sound => sound.id === task.alarmSound)?.name || 'Default'}
                          </span>
                        </div>
                        {task.recurring && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Recurring {task.recurring.frequency}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {onComplete && (
                        <button
                          onClick={() => onComplete(task.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Mark as complete"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
