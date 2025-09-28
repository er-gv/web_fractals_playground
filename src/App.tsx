import React from 'react';
import {FractalsPlayground} from './components/fractalsPlayground';
import './App.css';
import './config/firebase.config';




const App: React.FC = () => {
  return (
    <div className="App">
      <FractalsPlayground />
    </div>
  );
};

export default App;