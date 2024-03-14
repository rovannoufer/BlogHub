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
import SideNavbar from "./components/sidenavbar.jsx";

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
      <Route path='/editor/:blog_id' element={<Editor/>}/>
      <Route path='/' element={ <Navbar/> }>
        <Route index element={<HomePage />} />
        <Route path="settings" element= {<SideNavbar />}>
              <Route path="edit-profile" element={ <h1>Edit profile </h1>}/>
              <Route path="change-password" element={ <h1>Change-password </h1>}/>
        </Route>
        <Route path='signin' element={ <UserAuth type = "sign-in"/>  }/>
        <Route path='signup' element={ <UserAuth type = "sign-up"/> }/>
        <Route path="search/:query" element={ <SearchPage />}/>
       
        <Route path="blog/:blog_id" element = {<BlogPage />}/>
        <Route path="user/:id" element={<ProfilePage />}/>
        <Route path="*" element={<Error404/>} />

      </Route>
    </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;