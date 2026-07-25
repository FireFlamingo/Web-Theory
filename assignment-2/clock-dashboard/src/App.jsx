import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const AVAILABLE_TIMEZONES = [
  { label: 'Local Time', value: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: 'New York (EST/EDT)', value: 'America/New_York' },
  { label: 'London (GMT/BST)', value: 'Europe/London' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Sydney (AEST/AEDT)', value: 'Australia/Sydney' },
  { label: 'Dubai (GST)', value: 'Asia/Dubai' },
  { label: 'São Paulo (BRT)', value: 'America/Sao_Paulo' },
];

export default function ClockDashboard() {
  const [date, setDate] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [themeMode, setThemeMode] = useState('light'); // 'light' | 'dark' | 'contrast'
  const [selectedZones, setSelectedZones] = useState([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo'
  ]);
  
  // Alarms State
  const [alarms, setAlarms] = useState([]);
  const [alarmInput, setAlarmInput] = useState('');
  const [alarmMessage, setAlarmMessage] = useState('');
  const [triggeredAlarm, setTriggeredAlarm] = useState(null);

  // Stopwatch State
  const [swTime, setSwTime] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState([]);

  // Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerInputMin, setTimerInputMin] = useState('');
  const [timerRunning, setTimerRunning] = useState(false);

  // Meeting Planner Slider Offset
  const [meetingOffset, setMeetingOffset] = useState(0);

  // Master Clock & Timer Loops
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setDate(now);
      checkAlarms(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [alarms]);

  // Stopwatch Loop
  useEffect(() => {
    let interval;
    if (swRunning) {
      interval = setInterval(() => setSwTime(prev => prev + 10), 10);
    }
    return () => clearInterval(interval);
  }, [swRunning]);

  // Countdown Timer Loop
  useEffect(() => {
    let interval;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            alert('Countdown Timer Finished!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const checkAlarms = (currentDate) => {
    const currentTimeStr = currentDate.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    alarms.forEach(alarm => {
      if (alarm.time === currentTimeStr && alarm.active && !alarm.triggered) {
        setTriggeredAlarm(alarm);
        setAlarms(prev => prev.map(a => a.id === alarm.id ? { ...a, triggered: true } : a));
      }
    });
  };

  const addAlarm = (e) => {
    e.preventDefault();
    if (!alarmInput) return;
    const newAlarm = {
      id: Date.now(),
      time: alarmInput,
      message: alarmMessage || 'Scheduled Alarm',
      active: true,
      triggered: false
    };
    setAlarms([...alarms, newAlarm]);
    setAlarmInput('');
    setAlarmMessage('');
  };

  const toggleAlarm = (id) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active, triggered: false } : a));
  };

  const deleteAlarm = (id) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const addTimeZone = (e) => {
    const zone = e.target.value;
    if (zone && !selectedZones.includes(zone)) {
      setSelectedZones([...selectedZones, zone]);
    }
  };

  const removeTimeZone = (zoneToRemove) => {
    setSelectedZones(selectedZones.filter(z => z !== zoneToRemove));
  };

  return (
    <div className={`dashboard-root theme-${themeMode}`}>
      {triggeredAlarm && (
        <div className="alarm-modal-overlay">
          <div className="alarm-modal">
            <div className="modal-icon-glow">⏰</div>
            <h2>Alarm Triggered</h2>
            <p className="alarm-time-display">{triggeredAlarm.time}</p>
            <p className="alarm-msg-display">{triggeredAlarm.message}</p>
            <button 
              className="dismiss-btn"
              onClick={() => setTriggeredAlarm(null)}
            >
              Dismiss Alarm
            </button>
          </div>
        </div>
      )}

      <header className="dashboard-header">
        <div className="header-brand">
          <span className="brand-dot"></span>
          <h1>Chronos Advanced Executive</h1>
        </div>
        
        <div className="header-controls-group">
          <div className="theme-switcher">
            <button className={themeMode === 'light' ? 'active' : ''} onClick={() => setThemeMode('light')}>Light</button>
            <button className={themeMode === 'dark' ? 'active' : ''} onClick={() => setThemeMode('dark')}>Dark</button>
            <button className={themeMode === 'contrast' ? 'active' : ''} onClick={() => setThemeMode('contrast')}>Contrast</button>
          </div>

          <label className="toggle-switch">
            <span>24H</span>
            <input 
              type="checkbox" 
              checked={is24Hour} 
              onChange={() => setIs24Hour(!is24Hour)} 
            />
            <span className="slider"></span>
          </label>
        </div>
      </header>

      <div className="dashboard-grid">
        {/* Primary Clock Section */}
        <section className="card primary-clock-card">
          <div className="card-top-row">
            <h2>Primary Local Time</h2>
            <span className="live-pill">Live Synced</span>
          </div>
          <div className="primary-clock-display">
            <AnalogClock date={date} />
            <DigitalClock date={date} is24Hour={is24Hour} />
          </div>
        </section>

        {/* Alarm Control Center */}
        <section className="card alarm-card">
          <h2>Alarm Control Center</h2>
          <form onSubmit={addAlarm} className="alarm-form">
            <input 
              type="time" 
              value={alarmInput} 
              onChange={(e) => setAlarmInput(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Label description..." 
              value={alarmMessage} 
              onChange={(e) => setAlarmMessage(e.target.value)} 
            />
            <button type="submit" className="action-btn">Set Alarm</button>
          </form>

          <div className="alarm-list">
            {alarms.length === 0 ? (
              <p className="empty-text">No active alarms configured.</p>
            ) : (
              alarms.map(alarm => (
                <div key={alarm.id} className={`alarm-item ${alarm.active ? '' : 'inactive'}`}>
                  <div className="alarm-info">
                    <span className="time">{alarm.time}</span>
                    <span className="label">{alarm.message}</span>
                  </div>
                  <div className="alarm-actions">
                    <label className="switch-sm">
                      <input 
                        type="checkbox" 
                        checked={alarm.active} 
                        onChange={() => toggleAlarm(alarm.id)} 
                      />
                      <span className="slider-sm"></span>
                    </label>
                    <button onClick={() => deleteAlarm(alarm.id)} className="delete-btn" title="Delete">×</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Stopwatch & Timer Section */}
        <section className="card tools-card">
          <h2>Precision Chronograph Tools</h2>
          <div className="tools-tabs-grid">
            {/* Stopwatch sub-card */}
            <div className="tool-subbox">
              <h3>Stopwatch</h3>
              <div className="stopwatch-display">
                {formatStopwatchTime(swTime)}
              </div>
              <div className="tool-btn-group">
                {!swRunning ? (
                  <button className="tool-btn start" onClick={() => setSwRunning(true)}>Start</button>
                ) : (
                  <button className="tool-btn pause" onClick={() => setSwRunning(false)}>Pause</button>
                )}
                <button className="tool-btn" onClick={() => { setSwRunning(false); setSwTime(0); setLaps([]); }}>Reset</button>
                <button className="tool-btn" onClick={() => swRunning && setLaps([...laps, swTime])}>Lap</button>
              </div>
              {laps.length > 0 && (
                <div className="laps-container">
                  {laps.map((lap, i) => (
                    <div key={i} className="lap-row"><span>Lap {i + 1}</span> <span>{formatStopwatchTime(lap)}</span></div>
                  ))}
                </div>
              )}
            </div>

            {/* Countdown Timer sub-card */}
            <div className="tool-subbox">
              <h3>Countdown Timer</h3>
              <div className="stopwatch-display">
                {formatCountdownTime(timerSeconds)}
              </div>
              <div className="timer-input-row">
                <input 
                  type="number" 
                  placeholder="Mins" 
                  value={timerInputMin} 
                  onChange={e => setTimerInputMin(e.target.value)} 
                />
                <button className="tool-btn start" onClick={() => {
                  const mins = parseInt(timerInputMin);
                  if (!isNaN(mins) && mins > 0) {
                    setTimerSeconds(mins * 60);
                    setTimerRunning(true);
                  }
                }}>Set & Start</button>
                <button className="tool-btn" onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}>Stop</button>
              </div>
            </div>
          </div>
        </section>

        {/* World Meeting Planner Slider */}
        <section className="card meeting-planner-card">
          <div className="timezone-header">
            <h2>Global Meeting Planner Slider</h2>
            <span className="planner-offset-label">Offset: {meetingOffset >= 0 ? `+${meetingOffset}` : meetingOffset} hrs</span>
          </div>
          <div className="slider-container">
            <input 
              type="range" 
              min="-12" 
              max="12" 
              value={meetingOffset} 
              onChange={e => setMeetingOffset(parseInt(e.target.value))} 
              className="time-scrubber"
            />
          </div>
          <div className="planner-grid">
            {selectedZones.map(zone => (
              <PlannerTimeZoneCard key={zone} zone={zone} currentDate={date} offsetHours={meetingOffset} is24Hour={is24Hour} />
            ))}
          </div>
        </section>

        {/* World Clocks Matrix */}
        <section className="card timezone-card wide-card">
          <div className="timezone-header">
            <h2>World Clocks Matrix</h2>
            <select onChange={addTimeZone} defaultValue="" className="zone-selector">
              <option value="" disabled>+ Add Timezone</option>
              {AVAILABLE_TIMEZONES.map(tz => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          <div className="timezone-grid">
            {selectedZones.map(zone => (
              <TimeZoneCard 
                key={zone} 
                zone={zone} 
                date={date} 
                is24Hour={is24Hour} 
                onRemove={() => removeTimeZone(zone)} 
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function AnalogClock({ date }) {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes();
  const hours = date.getHours();

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = (((hours % 12) + minutes / 60) / 12) * 360;

  return (
    <div className="analog-clock-container">
      <div className="analog-clock">
        <div className="clock-face">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="clock-marker" 
              style={{ transform: `rotate(${i * 30}deg)` }}
            />
          ))}
          <div className="hand hour-hand" style={{ transform: `translate(-50%, 0) rotate(${hourDegrees}deg)` }} />
          <div className="hand minute-hand" style={{ transform: `translate(-50%, 0) rotate(${minuteDegrees}deg)` }} />
          <div className="hand second-hand" style={{ transform: `translate(-50%, 0) rotate(${secondDegrees}deg)` }} />
          <div className="clock-center-dot" />
        </div>
      </div>
    </div>
  );
}

function DigitalClock({ date, is24Hour }) {
  const timeString = date.toLocaleTimeString([], { 
    hour12: !is24Hour,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const dateString = date.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="digital-clock-display">
      <div className="digital-time">{timeString}</div>
      <div className="digital-date">{dateString}</div>
    </div>
  );
}

function TimeZoneCard({ zone, date, is24Hour, onRemove }) {
  const formattedTime = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !is24Hour
      }).format(date);
    } catch (e) {
      return 'Invalid Zone';
    }
  }, [date, zone, is24Hour]);

  const formattedDate = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        month: 'short',
        day: 'numeric',
        weekday: 'short'
      }).format(date);
    } catch (e) {
      return '';
    }
  }, [date, zone]);

  const shortZoneName = zone.split('/').pop().replace('_', ' ');

  return (
    <div className="tz-card">
      <button className="remove-tz-btn" onClick={onRemove} title="Remove timezone">×</button>
      <div className="tz-info">
        <h3>{shortZoneName}</h3>
        <span className="tz-zone-sub">{zone}</span>
      </div>
      <div className="tz-time-block">
        <div className="tz-time">{formattedTime}</div>
        <div className="tz-date">{formattedDate}</div>
      </div>
    </div>
  );
}

function PlannerTimeZoneCard({ zone, currentDate, offsetHours, is24Hour }) {
  const adjustedDate = useMemo(() => {
    const d = new Date(currentDate.getTime() + offsetHours * 3600 * 1000);
    return d;
  }, [currentDate, offsetHours]);

  const formattedTime = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: zone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: !is24Hour
      }).format(adjustedDate);
    } catch (e) {
      return '--:--';
    }
  }, [adjustedDate, zone, is24Hour]);

  const shortZoneName = zone.split('/').pop().replace('_', ' ');

  return (
    <div className="planner-subcard">
      <span className="planner-zone-name">{shortZoneName}</span>
      <span className="planner-zone-time">{formattedTime}</span>
    </div>
  );
}

function formatStopwatchTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centi = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centi).padStart(2, '0')}`;
}

function formatCountdownTime(totalSecs) {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}