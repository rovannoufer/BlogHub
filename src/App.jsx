import { Routes, Route, BrowserRouter} from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import UserAuth from "./pages/userAuth.jsx";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={ <Navbar/> }>
      <Route path='signin' element={ <UserAuth type = "sign-in"/>  }/>
      <Route path='signup' element={ <UserAuth type = "sign-up"/> }/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;