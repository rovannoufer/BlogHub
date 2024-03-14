import { useContext, useRef, useState, useEffect } from "react";
import { NavLink, Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBell, faChain, faFile, faFilePen,faLock,faUser } from "@fortawesome/free-solid-svg-icons";

const SideNavbar = () =>{

    let { userAuth: { access_token }} = useContext(UserContext);

    let page = location.pathname.split("/")[2];
    let [ pageState, setPageState ] = useState(page.replace('-',' '));
    let [ showSideNav, setShowSideNav ] = useState();
    

    let activeTabLine = useRef();
    let sideBarIcon = useRef();
    let pageStateTab = useRef();

    const changePageState = (e) =>{
   
        let { offsetWidth, offsetLeft } = e.target;
        console.log("clicked")

        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if (e.target === sideBarIcon.current) {
            setShowSideNav(true); // Toggle showSideNav
        }
        else{
            setShowSideNav(false);
        }
    }

    useEffect(() =>{

        setShowSideNav(false);
        pageStateTab.current.click();
    }, [pageState])

    return(
        access_token === null ? <Navigate to={"/signin"}/> :
       <>
        <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
           
           <div className="sticky top-[80px] z-30">

            <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                <button 
                ref={ sideBarIcon }
                onClick={ changePageState }
                className="p-5 capitalize ">
                    <FontAwesomeIcon icon={ faBars } />
                </button>
                <button 
                ref={ pageStateTab }
                onClick={ changePageState }
                className="p-5 capitalize ">
                    { pageState }
                </button>
                <hr ref={ activeTabLine } className="absolute bottom-0 duration-200"/>
            </div>

            <div className={"min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500" + (!showSideNav ? " max-md:opacity-0 max-md:pointer-events-none" : " opacity-100 pointer-events-auto")}>
                    
                    <h1 className="text-xl text-dark-grey mb-3"> Dashboard </h1>
                    <hr className="border-grey -ml-6 mb-8 mr-6"></hr>

                    <NavLink to={"/dashboard/blogs"}  onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                        <FontAwesomeIcon icon={ faFile }/>
                      Blogs     
                    </NavLink>

                    <NavLink to="/dashboard/notification"  onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                        <FontAwesomeIcon icon={ faBell }/>
                      Notification     
                    </NavLink>

                    <NavLink to={"/editor"}  onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                        <FontAwesomeIcon icon={ faFilePen }/>
                      Write     
                    </NavLink>


                    <h1 className="text-xl text-dark-grey mt-20 mb-3"> Settings </h1>
                    <hr className="border-grey -ml-6 mb-8 mr-6"></hr>

                    <NavLink to={"/settings/edit-profile"}  onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                    <FontAwesomeIcon icon={ faUser }  />
                      Edit Profile     
                    </NavLink>

                    <NavLink to={"/settings/change-password"}  onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                        <FontAwesomeIcon icon={ faLock }/>
                      Change Password   
                    </NavLink>
              </div>
 

                        
           </div>

                        <div className="max-md:mt-8 mt-5 w-full">
                           <Outlet />
                        </div>

          
        </section>

        
       </>
    )
}


export default SideNavbar;