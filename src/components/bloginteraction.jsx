import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blogpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faHeart, faX } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";


const BlogInteraction = () =>{

    let{ blog, blog: { _id, title,blog_id, activity, activity:{ total_likes, total_comments },
        author: { personal_info : { username :auth_username }}
        }, setBlog, isLikebyUser, setIsLikebyUser } = useContext(BlogContext);

        let { userAuth: { username, access_token } } =useContext(UserContext);


        const serverUrl = "http://localhost:3000" ;

        useEffect(() =>{
            if( access_token ){
                axios.post(serverUrl+ "/isliked_by_user" , { _id },{
                    headers:{
                        'Authorization' :`Bearer ${access_token}`
                    }
                }).then(({ data : { result }}) =>{
                    setIsLikebyUser(Boolean(result));
                }).catch((error) =>{
                    console.log(error);
                })
            }
        }, [])
          
        
        const handlelike = () =>{

            if(access_token){
                setIsLikebyUser(preVal => !preVal)
                !isLikebyUser ? total_likes++ : total_likes--;
                setBlog({ ...blog, activity:{ ...activity, total_likes }})

                axios.post(serverUrl + "/like-blog", {
                    _id, isLikebyUser}, {
                        headers : {
                            'Authorization' : `Bearer ${access_token}`
                        }
                    }).then(( { data }) =>{
                        console.log(data);
                    })
                    .catch(error =>{
                        console.log(error);
                    })
            }
            else{
                toast.error("Login to like this error")
            }
        }
  
    return(
        <>
        <Toaster />
         <hr className="border-grey my-2"/>

           <div className="flex gap-6 justify-between"> 
               <div>
                    <div className="flex gap-3 items-center mb-3">
                        <button 
                        onClick={handlelike}
                        className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikebyUser ? "bg-red/20 text-red" : " bg-grey/80") }>
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