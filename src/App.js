import { BrowserRouter, Routes, Route } from "react-router-dom";


import './App.css';

import CardTable from './pages/CardTable';
import Home from './pages/Home';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'



const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_CENTER,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}


function App() {

 


  return (
    <>
    <AlertProvider template={AlertTemplate} {...options}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="table" element={ <CardTable />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
      </AlertProvider>
    </>
  );
}



export default App;
