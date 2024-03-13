import { useContext } from "react";
import { BlogContext } from "../pages/blogpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faX } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../App";
import { Link } from "react-router-dom";


const BlogInteraction = () =>{

    let{ blog: { blog_id, activity, activity:{ total_likes, total_comments },
        author: { personal_info : { username :auth_username }}
        }, setBlog } = useContext(BlogContext);

        let { userAuth: { username } } =useContext(UserContext);
  
  
    return(
        <>
         <hr className="border-grey my-2"/>

           <div className="flex gap-6 justify-between"> 
               <div>
                    <div className="flex gap-3 items-center mb-3">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                            <FontAwesomeIcon icon={ faHeart } />

                        </button>
            
                        <p className="text-xl text-dark-grey"> { total_likes } </p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                            <FontAwesomeIcon icon={ faComment } />
                            
                        </button>
            
                        <p className="text-xl text-dark-grey"> { total_comments } </p>
                    </div>
                </div>
                
                <div className="flex gap-6 items-center">
                    {
                        username == auth_username ?
                        <Link to={`/editor/${blog_id}`} > Edit </Link> : " "
                    }
                </div>

           </div>

         <hr className="border-grey my-2"/>
        </>
    )
}

export default BlogInteraction;