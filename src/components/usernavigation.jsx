import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePen, faUser, faGear } from '@fortawesome/free-solid-svg-icons';
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigation = () =>{

    const { userAuth: { username }, setUserAuth} = useContext(UserContext);

    const signoutUser = () =>{
        removeFromSession("user");
        setUserAuth({ access_token : null })
    }   
    
    return (
        <div className="bg-white absolute right-0 border border-grey
        w-60 overflow-hidden duration-200">
            <Link to='/editor' className="flex gap-2 link md:hidden pl-8 py-4">
            <FontAwesomeIcon icon={faFilePen} />
            Write 
            </Link>

            <Link to={`/user/${ username }`} className="flex gap-2 link pl-8 py-4">
            <FontAwesomeIcon icon={faUser} className="mt-1"  />
            Profile
            </Link>

            <Link to='/dashboard/blogs' className="link pl-8 py-4">
             Dashboard
            </Link>

            <Link to='/settings/edit-profile' className="flex gap-2 link pl-8 py-4">
            <FontAwesomeIcon icon={faGear} className="mt-1" />
             Settings
            </Link>

            <span className="absolute border-t border-grey w-[100%]"></span>
             
             <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
             onClick={signoutUser}
             >
                <h1 className="font-bold text-xl mg-1"> Sign Out</h1>
                <p className="text-dark-grey"> @{username}</p>
             </button>
        </div>
    )
}

export default UserNavigation;