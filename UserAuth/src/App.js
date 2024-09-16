import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginComponent from './components/LoginComponent.js';
import HomeComponent from './components/HomeComponent.js';

function App() {
  return <>
    <Routes>
      <Route path='/' element={<LoginComponent />}></Route>
      <Route path='/homepage' element={<HomeComponent />}></Route>
    </Routes>
{/* <LoginComponent/> */}
  </>
}

export default App;
