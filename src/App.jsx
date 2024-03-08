import { Routes, Route, BrowserRouter} from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import UserAuth from "./pages/userAuth.jsx";
import { createContext,useEffect, useState } from "react";
import { lookInSession } from "./common/session.jsx"

export const UserContext = createContext({})

function App() {

  const [userAuth, setUserAuth] = useState({
    access_token: null,
  });
 
  useEffect(() =>{
  
    let userInSession = lookInSession("user");

    userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null })
  }, [])

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <BrowserRouter>
    <Routes>
      <Route path='/' element={ <Navbar/> }>
      <Route path='signin' element={ <UserAuth type = "sign-in"/>  }/>
      <Route path='signup' element={ <UserAuth type = "sign-up"/> }/>
      </Route>
    </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;