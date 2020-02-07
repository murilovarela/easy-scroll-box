import React from 'react';
import ColorCard from './components/ColorCard';
import ScrollBox from './components/ScrollBox';
import COLORS from './mocks/data.json';
import './app.css';

function App() {
  return (
    <div className="app">
      <ScrollBox>
        {COLORS.map(({ color, id }) => (
          <ColorCard color={color} key={id} />
        ))}
      </ScrollBox>
    </div>
  );
}

export default App;
