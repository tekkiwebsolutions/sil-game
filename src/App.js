import { BrowserRouter, Routes, Route } from "react-router-dom";


import './App.css';

import CardTable from './pages/CardTable';
import Home from './pages/Home';




 


function App() {

 


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="table" element={ <CardTable />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}



export default App;
