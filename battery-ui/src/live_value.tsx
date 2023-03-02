import React from 'react';
import './App.css';

interface TemperatureProps {
  temp: number;
  color: string;
}

function LiveValue({ temp } : TemperatureProps) {

  let valueColour = 'white';

  return (
      <header className="live-value" style={{ color : valueColour }}>
        {`${temp.toString()}°C`}
      </header>
  );
}

export default LiveValue;