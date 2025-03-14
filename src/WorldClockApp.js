import React, { useState, useEffect } from 'react';
import { Clock, RotateCcw, Edit3, Check, Heart, Github } from 'lucide-react';

// Main component
const WorldClockApp = () => {
  // Get current time
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editMode, setEditMode] = useState(null);
  const [editHours, setEditHours] = useState('');
  const [editMinutes, setEditMinutes] = useState('');
  const [editSeconds, setEditSeconds] = useState('');
  const [isLive, setIsLive] = useState(true);

  // Update time every second when in live mode
  useEffect(() => {
    let interval;
    if (isLive) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Clock data
  const clocks = [
    { 
      id: 1, 
      name: 'Universal Time', 
      shortName: 'UTC', 
      timezone: 'UTC', 
      offset: 0, 
      major: true,
      bgColor: 'from-gray-700 via-gray-600 to-gray-500' 
    },
    { 
        id: 2, 
        name: 'Indian Time ❤️', 
        shortName: 'IST- Bengaluru❣️', 
        timezone: 'Asia/Kolkata', 
        offset: 5.5, 
        major: true,
        bgColor: 'from-orange-500 via-blue-400 to-green-600'
      }
    ,
    { 
      id: 3, 
      name: 'German Time', 
      shortName: 'CET ', 
      timezone: 'Europe/Berlin', 
      offset: isDST(currentTime, 'Europe/Berlin') ? 1 : 0, 
      major: true,
      bgColor: 'from-black via-red-600 to-yellow-500'
    },
    { 
      id: 4, 
      name: 'Romanian Time', 
      shortName: 'EET', 
      timezone: 'Europe/Bucharest', 
      offset: isDST(currentTime, 'Europe/Bucharest') ? 2 : 1, 
      major: true,
      bgColor: 'from-blue-700 via-yellow-500 to-red-600'
    },
    { 
      id: 5, 
      name: 'Central European Time', 
      shortName: 'CET', 
      timezone: 'Europe/Paris', 
      offset: isDST(currentTime, 'Europe/Paris') ? 1 : 0, 
      major: false,
      bgColor: 'from-blue-600 via-yellow to-blue-600'  
    },
    { 
      id: 6, 
      name: 'US Eastern Time', 
      shortName:'ET', 
      timezone: 'America/New_York', 
      offset: isDST(currentTime, 'America/New_York') ? -4 : -5, 
      major: false,
      bgColor: 'from-blue-600 via-white-200 to-red-600' 
    }
  ];

  function isDST(date, timezone) {
    const month = date.getMonth() + 1; 
    if (timezone.includes('Europe') || timezone.includes('America')) {
      return month >= 3 && month <= 10;
    }
    
    return false;
  }

  // Calculate time for a specific timezone
  const getTimeForTimezone = (offset) => {
    const time = new Date(currentTime);
    
    // Reset to UTC time
    time.setTime(time.getTime() + time.getTimezoneOffset() * 60000);
    
    // Add the timezone offset
    time.setTime(time.getTime() + (offset * 60 * 60000));
    
    return time;
  };

  // Format time as HH:MM:SS
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
    });
  };

  // Format date as DD/MM/YYYY
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB');
  };

  // Handle reset to current time
  const handleReset = () => {
    setCurrentTime(new Date());
    setEditMode(null);
    setIsLive(true);
  };

  // Enter edit mode for a clock
  const handleEdit = (id) => {
    // Pause the live updates
    setIsLive(false);
    
    const clock = clocks.find(clock => clock.id === id);
    const time = getTimeForTimezone(clock.offset);
    
    setEditHours(time.getHours().toString().padStart(2, '0'));
    setEditMinutes(time.getMinutes().toString().padStart(2, '0'));
    setEditSeconds(time.getSeconds().toString().padStart(2, '0'));
    
    setEditMode(id);
  };

  const generateTimeOptions = (max) => {
    const options = [];
    for (let i = 0; i < max; i++) {
      const value = i.toString().padStart(2, '0');
      options.push(<option key={value} value={value}>{value}</option>);
    }
    return options;
  };

  const handleSave = () => {
    if (editMode) {
      try {
        const hours = parseInt(editHours, 10);
        const minutes = parseInt(editMinutes, 10);
        const seconds = parseInt(editSeconds, 10);
        
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
            hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
          throw new Error("Invalid time values");
        }
        
        const editedClock = clocks.find(clock => clock.id === editMode);
        
        const editedTime = getTimeForTimezone(editedClock.offset);
        editedTime.setHours(hours, minutes, seconds);
        
        const newUtcTime = new Date(editedTime);
        newUtcTime.setTime(newUtcTime.getTime() - (editedClock.offset * 60 * 60000));

        const localTime = new Date(newUtcTime);
        localTime.setTime(localTime.getTime() - (localTime.getTimezoneOffset() * 60000));
        
        setCurrentTime(localTime);
        setEditMode(null);
      } catch (e) {
        console.error("Invalid time format:", e);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setIsLive(true); // Resume live updates
  };

  const toggleLiveUpdates = () => {
    setIsLive(!isLive);
  };

  return (
    <div className="**w-full** bg-gray-1000 text-white">
      <main className="flex-grow p-4 **w-full**">
        <div className="**w-full**">
          <header className="mb-4 text-center">
            <h1 className="text-xl font-bold text-white">Time Checker ( 24 Hours System )</h1>
            <p className='text-white/100 text-sm  mb-4'>set time on any to see time parallely in other places</p>
            <p classNa ></p>
            <div className="flex justify-center space-x-4 mb-2">
              <button 
                onClick={handleReset}
                className="flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
              >
                <RotateCcw className="w-3 h-3 mr-3" />
                Reset to Current
              </button>
              
              <button 
                onClick={toggleLiveUpdates}
                className={`flex items-center px-4 py-2 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 ${
                  isLive ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                <Clock className="w-4 h-4 mr-2" />
                {isLive ? 'Pause Clock' : 'Resume Clock'}
              </button>
            </div>
          </header>

          <div className="flex flex-wrap justify-center gap-4 mb-12 **w-full**">
            {clocks.filter(clock => clock.major).map(clock => (
              <div 
                key={clock.id}
                className={`w-64 bg-gradient-to-br ${clock.bgColor} rounded-xl shadow-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-white/10 transform hover:-translate-y-1`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="font-bold text-xl text-white">{clock.name}</h2>
                    <p className="text-white/80 font-semibold">{clock.shortName}</p>
                  </div>
                  <Clock className="text-white/70 w-6 h-6" />
                </div>
                
                {editMode === clock.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-white/90 mb-1">Hours</label>
                        <select 
                          value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          className="w-full border rounded px-2 py-1 bg-white/90 text-gray-800"
                        >
                          {generateTimeOptions(24)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/80 mb-1">Minutes</label>
                        <select 
                          value={editMinutes}
                          onChange={(e) => setEditMinutes(e.target.value)}
                          className="w-full border rounded px-2 py-1 bg-white/90 text-gray-800"
                        >
                          {generateTimeOptions(60)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-white/80 mb-1">Seconds</label>
                        <select 
                          value={editSeconds}
                          onChange={(e) => setEditSeconds(e.target.value)}
                          className="w-full border rounded px-2 py-1 bg-white/90 text-gray-800"
                        >
                          {generateTimeOptions(60)}
                        </select>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={handleSave}
                        className="flex-1 bg-white/90 hover:bg-white text-gray-800 py-1 rounded transition"
                      >
                        Apply
                      </button>
                      <button 
                        onClick={handleCancelEdit}
                        className="flex-1 bg-black/20 hover:bg-black/30 text-white py-1 rounded transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <time className="text-3xl font-mono font-bold text-white">{formatTime(getTimeForTimezone(clock.offset))}</time>
                    <button 
                      onClick={() => handleEdit(clock.id)}
                      className="text-white/70 hover:text-white p-1 transition-colors"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                )}
                
                <div className="mt-4 text-white/60">{formatDate(getTimeForTimezone(clock.offset))}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {clocks.filter(clock => !clock.major).map(clock => (
              <div 
                key={clock.id}
                className={`w-64 bg-gradient-to-br ${clock.bgColor} rounded-lg shadow-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-white/10`}
              >
                <div className="">
                  <div>
                    <h3 className="font-bold text-white text-lg">{clock.name}</h3>
                    <p className="text-white/80 text-sm">{clock.shortName}</p>
                    
                    {editMode === clock.id ? (
                      <div className="mt-2 space-y-2">
                        <div className="grid grid-cols-3 gap-1">
                          <select 
                            value={editHours}
                            onChange={(e) => setEditHours(e.target.value)}
                            className="border rounded px-1 py-1 text-sm bg-white/90 text-gray-800"
                          >
                            {generateTimeOptions(24)}
                          </select>
                          <select 
                            value={editMinutes}
                            onChange={(e) => setEditMinutes(e.target.value)}
                            className="border rounded px-1 py-1 text-sm bg-white/90 text-gray-800"
                          >
                            {generateTimeOptions(60)}
                          </select>
                          <select 
                            value={editSeconds}
                            onChange={(e) => setEditSeconds(e.target.value)}
                            className="border rounded px-1 py-1 text-sm bg-white/90 text-gray-800"
                          >
                            {generateTimeOptions(60)}
                          </select>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            onClick={handleSave}
                            className="text-xs flex-1 bg-white/90 hover:bg-white text-gray-800 py-1 rounded"
                          >
                            Apply
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="text-xs flex-1 bg-black/20 hover:bg-black/30 text-white py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center mt-1">
                        <time className="text-xl font-mono font-semibold text-white">{formatTime(getTimeForTimezone(clock.offset))}</time>
                        <button 
                          onClick={() => handleEdit(clock.id)}
                          className="ml-2 text-white/60 hover:text-white transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-b text-m text-white/60">
                    {formatDate(getTimeForTimezone(clock.offset))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      

      <footer className="">
        <div className="container mx-auto flex justify-center items-center text-sm text-gray-400">
          <span className="flex items-center">
            Made with <Heart className="mx-1 text-red-500 w-4 h-4" /> <a 
              href="https://github.com/isaac-rnd/convenience-clock" className='text-green-500'>in ಬೆಂಗಳೂರು </a> 
            <a 
              href="https://github.com/isaac-rnd/convenience-clock" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center ml-1 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Github className="w-4 h-4 mr-1" />
              Checkout code
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default WorldClockApp;