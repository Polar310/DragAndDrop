// src/App.js
import React from 'react';
import DragAndDrop from './components/DragAndDrop';
import GlobalStyle from './GlobalStyle';

// change the heading text here. 

const App = () => {
  return (
    <div className="App">
      <GlobalStyle />
      <h1>PDF drop box </h1> 
      <DragAndDrop />
    </div>
  );
};

export default App;
