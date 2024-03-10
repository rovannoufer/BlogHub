import { useEffect, useRef, useState } from "react";

const InPageNavigation = ({ routes, defaultActiveIndex = 0, defaultHidden, children }) =>{

    let [ inPageNavIndex, setInPageNavIndex ] = useState(defaultActiveIndex);

    let activeTabLineRef = useRef();
    let activeTabRef = useRef();

    const changePageState = (btn, i) => {
        const { offsetWidth, offsetLeft } = btn;
        console.log(offsetWidth);
      
        activeTabLineRef.current.style.width = `${ offsetWidth}px`;
        activeTabLineRef.current.style.left = `${ offsetLeft}px`;
      
        setInPageNavIndex(i);
      };

      useEffect(() =>{
          changePageState( activeTabRef.current, defaultActiveIndex );
      },[])
      

    return(
        <>
        <div className="realtive mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-autp">
           {
            routes.map((route,i) =>{
                return (
                    <button key={i} 
                    ref={i == defaultActiveIndex ? activeTabRef : null }
                    className={"p-4 px-5 capitalize " + (inPageNavIndex == i ? "text-black" : "text-dark-grey ") + (defaultHidden.includes(route) ? " md:hidden " : " ")}
                    onClick={(e) => { changePageState(e.target, i) }}
                    >
                        {route}
                    </button>
                )
            })
           }

           <hr ref={ activeTabLineRef } className= " absolute bottom-0 duration-300 " ></hr>
        </div>

         { Array.isArray(children) ? children[inPageNavIndex] : children }
        </>
    )
}

export default InPageNavigation;