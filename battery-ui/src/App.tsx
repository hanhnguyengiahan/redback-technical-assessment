import React, { useState, useRef, useEffect } from 'react';
import LiveValue from './live_value';
import RedbackLogo from './redback_logo.jpg';
import './App.css';

function App() {
  const [temperature, setTemperature] = useState<number>(0);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // using the native browser WebSocket object
    const socket: WebSocket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('opened');
    };

    socket.onclose = () => {
      console.log('closed');
    };

    socket.onmessage = (event) => {
      console.log('got message', event.data);
      let message_obj = JSON.parse(event.data);
      setTemperature(parseFloat(Number(message_obj['battery_temperature']).toPrecision(3)));
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  let temperatureColor = 'white';

  if (temperature < 20) {
    temperatureColor = 'red';
  } else if (temperature > 80) {
    temperatureColor = 'green';
  }

  const liveValueStyle = {
    color: temperatureColor,
    fontSize: '50px',
    fontWeight: 'bold'
  };

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={RedbackLogo} className='redback-logo' alt='Redback Racing Logo' />
        <p className='value-title'>Live Battery Temperature</p>
        <LiveValue temp={temperature} color={temperatureColor} />
      </header>
    </div>
  );
}

export default App;
