export interface Task {
  id: string;
  name: string;
  datetime: string;
  alarmTime: string;
  alarmSound: string;
  customSound?: {
    name: string;
    url: string;
  };
  completed: boolean;
  recurring?: {
    endDate: string;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

export const ALARM_SOUNDS = [
  { id: 'bell', name: 'Bell', url: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3' },
  { id: 'chime', name: 'Chime', url: 'https://assets.mixkit.co/active_storage/sfx/2871/2871-preview.mp3' },
  { id: 'notification', name: 'Notification', url: 'https://assets.mixkit.co/active_storage/sfx/2867/2867-preview.mp3' },
  { id: 'alert', name: 'Alert', url: 'https://assets.mixkit.co/active_storage/sfx/2866/2866-preview.mp3' }
] as const;