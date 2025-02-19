import React, { useState, useRef } from 'react';
import { Clock, Calendar, Bell, Volume2, Upload, X, Repeat } from 'lucide-react';
import { ALARM_SOUNDS } from '../types';

interface TaskFormProps {
  onSubmit: (task: {
    name: string;
    datetime: string;
    alarmTime: string;
    alarmSound: string;
    customSound?: {
      name: string;
      url: string;
    };
    recurring?: {
      endDate: string;
      frequency: 'daily' | 'weekly' | 'monthly';
    };
  }) => void;
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmSound, setAlarmSound] = useState(ALARM_SOUNDS[0].id);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [customSound, setCustomSound] = useState<{ name: string; url: string } | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !datetime || !alarmTime) return;
    
    if (isRecurring && !recurringEndDate) {
      alert('Please select an end date for recurring tasks');
      return;
    }

    onSubmit({
      name,
      datetime,
      alarmTime,
      alarmSound,
      customSound: customSound || undefined,
      ...(isRecurring && {
        recurring: {
          endDate: recurringEndDate,
          frequency: recurringFrequency,
        },
      }),
    });

    setName('');
    setDatetime('');
    setAlarmTime('');
    setAlarmSound(ALARM_SOUNDS[0].id);
    setCustomSound(null);
    setIsRecurring(false);
    setRecurringFrequency('daily');
    setRecurringEndDate('');
  };

  const stopCurrentSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(null);
  };

  const playSound = (soundId: string) => {
    if (isPlaying) {
      stopCurrentSound();
      if (isPlaying === soundId) return;
    }

    const sound = ALARM_SOUNDS.find(s => s.id === soundId);
    if (!sound) return;

    audioRef.current = new Audio(sound.url);
    audioRef.current.play();
    setIsPlaying(soundId);
    audioRef.current.onended = () => setIsPlaying(null);
  };

  const handleCustomSoundPlay = () => {
    if (!customSound) return;

    if (isPlaying === 'custom') {
      stopCurrentSound();
      return;
    }

    if (isPlaying) {
      stopCurrentSound();
    }

    audioRef.current = new Audio(customSound.url);
    audioRef.current.play();
    setIsPlaying('custom');
    audioRef.current.onended = () => setIsPlaying(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file');
      return;
    }

    const url = URL.createObjectURL(file);
    setCustomSound({
      name: file.name,
      url,
    });
    setAlarmSound('custom');
  };

  const removeCustomSound = () => {
    if (customSound) {
      URL.revokeObjectURL(customSound.url);
    }
    setCustomSound(null);
    setAlarmSound(ALARM_SOUNDS[0].id);
    if (isPlaying === 'custom') {
      stopCurrentSound();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Task Name
        </label>
        <div className="mt-1">
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="datetime" className="block text-sm font-medium text-gray-700">
          Task Date & Time
        </label>
        <div className="mt-1 relative">
          <input
            type="datetime-local"
            id="datetime"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-3 pr-10"
            required
          />
          <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label htmlFor="alarm" className="block text-sm font-medium text-gray-700">
          Alarm Time
        </label>
        <div className="mt-1 relative">
          <input
            type="datetime-local"
            id="alarm"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-3 pr-10"
            required
          />
          <Bell className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Repeat className="h-4 w-4 mr-2" />
            Recurring Task
          </label>
          <button
            type="button"
            onClick={() => setIsRecurring(!isRecurring)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isRecurring ? 'bg-indigo-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isRecurring ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {isRecurring && (
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                Frequency
              </label>
              <select
                id="frequency"
                value={recurringFrequency}
                onChange={(e) => setRecurringFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <div className="mt-1 relative">
                <input
                  type="date"
                  id="endDate"
                  value={recurringEndDate}
                  onChange={(e) => setRecurringEndDate(e.target.value)}
                  min={datetime.split('T')[0]}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required={isRecurring}
                />
                <Calendar className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alarm Sound
        </label>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {ALARM_SOUNDS.map((sound) => (
              <button
                key={sound.id}
                type="button"
                onClick={() => playSound(sound.id)}
                className={`flex items-center justify-between p-3 text-sm rounded-md ${
                  alarmSound === sound.id && !customSound
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                } border hover:bg-indigo-50 transition-colors`}
                onFocus={() => {
                  setAlarmSound(sound.id);
                  setCustomSound(null);
                }}
              >
                <span>{sound.name}</span>
                <Volume2 
                  className={`h-4 w-4 ${
                    isPlaying === sound.id ? 'text-indigo-500' : 'text-gray-400'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="audio/*"
              className="hidden"
            />
            {customSound ? (
              <div
                className={`flex items-center justify-between p-3 text-sm rounded-md border ${
                  alarmSound === 'custom'
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700'
                    : 'bg-gray-50 border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={handleCustomSoundPlay}
                    className="flex items-center space-x-2"
                  >
                    <Volume2 
                      className={`h-4 w-4 ${
                        isPlaying === 'custom' ? 'text-indigo-500' : 'text-gray-400'
                      }`}
                    />
                    <span className="truncate">{customSound.name}</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={removeCustomSound}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center p-3 text-sm border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Custom Sound
              </button>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        Add Task
      </button>
    </form>
  );
}