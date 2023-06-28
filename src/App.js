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
          <Route path="table" element={<RoomIdCheckpoint />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>





    </>
  );
}


const RoomIdCheckpoint = () => {
  // const { userState } = useContext(UserContext);

  // const navigate = useNavigate();
  // const [loading, setLoading] = useState(true)

  // useEffect(() => {
  //   userState.room.room_id === null && navigate('/');
  //   setLoading(false)
  // }, [])

  return (
    <>
      {/* {loading ? <div className="loader1"></div> : <CardTable />} */}
      <CardTable />
    </>
  )
}


export default App;
