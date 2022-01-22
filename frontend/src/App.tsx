import React from 'react';
import logo from './logo.svg';
import './App.css';

//Components
import Header from './components/Header'

//Styles
import { GlobalStyle } from './GlobalStyle';

const App = () =>  {
  return (
    <div className='App'>
      <Header />
      <GlobalStyle />
    </div>
  );
};

export default App;
