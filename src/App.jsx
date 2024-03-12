import { Routes, Route, BrowserRouter} from "react-router-dom";
import Navbar from "./components/navbar.jsx";
import UserAuth from "./pages/userAuth.jsx";
import { createContext,useEffect, useState } from "react";
import { lookInSession } from "./common/session.jsx"
import Editor from "./pages/editor.jsx";
import HomePage from "./pages/homepage.jsx";
import SearchPage from "./pages/searchpage.jsx";
import Error404 from "./pages/404error.jsx";
import ProfilePage from "./pages/profilepage.jsx";
import BlogPage from "./pages/blogpage.jsx";

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
      <Route path='/editor' element={<Editor/>}/>
      <Route path='/' element={ <Navbar/> }>
        <Route index element={<HomePage />} />
        <Route path='signin' element={ <UserAuth type = "sign-in"/>  }/>
        <Route path='signup' element={ <UserAuth type = "sign-up"/> }/>
        <Route path="search/:query" element={ <SearchPage />}/>
        <Route path="*" element={<Error404/>} />
        <Route path="blog/:blog_id" element = {<BlogPage />}/>
        <Route path="user/:id" element={<ProfilePage />}/>

      </Route>
    </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;