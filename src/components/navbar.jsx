import logo from "../images/blogging.png"
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faFilePen, faBell } from '@fortawesome/free-solid-svg-icons';

import { useContext, useState } from "react";
import { UserContext } from "../App";
import UserNavigation from "./usernavigation";
 
const Navbar = () =>{

    const [ search , setSearch ] = useState(false);

    const [ userNav , setUserNav ] = useState(false);

    let navigate = useNavigate();

    const handleuserNav = () =>{
        setUserNav(currentVal => !currentVal);
    }
    
    const handleSearch = (e) =>{
        
        let query = e.target.value;

        if(e.keyCode == 13 && query.length){
            navigate(`search/${query}`);
        }
    }



    const { userAuth, userAuth: {access_token, profile_img }} = useContext(UserContext)
    return (
        <>
        <nav className="navbar ">
           <Link to='/' className="flex-none w-10">
           <img src={logo} className="w-full"/>
           </Link>

           <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (search ? "show" : "hide")}>
                <input type="text" 
                onKeyDown={handleSearch}
                placeholder="Search" 
                className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full
                placeholder:text-dark-grey md:pl-12"/>
                <FontAwesomeIcon icon={ faMagnifyingGlass } className="absolute right-[10%] 
                md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-2xl"/>
           </div>

           <div className="flex items-center gap-3 md:gap-6 ml-auto">
                <button className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                onClick={() => setSearch(currentVal => !currentVal)}
                >
                <FontAwesomeIcon icon={ faMagnifyingGlass } />
                </button>

                <Link to='/editor' className="hidden md:flex gap-2 link">
                 <FontAwesomeIcon icon={faFilePen} />
                    <p> Write </p>
                </Link>
               
                {
                    access_token ? 
                    <>
                     <Link to='/dashboard/notification' >
                        <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                            <FontAwesomeIcon icon={faBell} />
                        </button>                       
                    </Link>

                    <div className="relative" onClick={handleuserNav}>
                        <button className="q-12 h-12 mt-1">
                            <img src={profile_img} className="w-full h-full
                            object-cover rounded-full "/>
                        </button>

                        {
                            userNav ? <UserNavigation /> :
                            ""
                        }
                    </div>
                    </>
                    :
                    <>
                     <Link to='/signin' className="btn-dark py-2">
                        Sign In
                    </Link>
                    <Link to='/signup' className="btn-light hidden md:block py-2">
                        Sign Up
                    </Link>
                    </>
                }

               
           </div>
         
           
        </nav>
        <Outlet />
        </>
    )
}

export  default Navbar;
