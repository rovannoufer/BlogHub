import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blogpage";


const CommentField = ({ action }) =>{

   

    let { blog, setBlog, blog: { _id, author: { _id: blog_author}, comments, activity, activity: { total_comments, total_parent_comments} } 
         , setTotalParentComments, 
          } = useContext(BlogContext)

    let { userAuth: { access_token, username, fullname , profile_img }} = useContext(UserContext);

    const [ comment, setComment ] = useState('');

    const serverUrl = "http://localhost:3000" ;
    const handleComment = ( ) =>{
         if(!access_token){
            return toast.error("Login to comment");
         }

         if(!comment.length){
            return toast.error("Write something to leave a comment...")
         }

         axios.post(serverUrl+ "/add-comment", {
            _id, blog_author, comment
         }, {
            headers:{
                'Authorization': `Bearer ${access_token}`
            }
         }).then(( { data }) =>{
             
            setComment("");

            data.commented_by = { personal_info : {
                username, profile_img, fullname
            } }

            let newCommentArr;

            data.childrenLevel = 0;
            newCommentArr = [ data ];
            let parentCommentIncrementvalue = 1;
            setBlog({ ...blog, comment: { ...comments, results: newCommentArr },activity: { ...activity, total_comments: total_comments+ 1 , 
                total_parent_comments : parentCommentIncrementvalue + total_parent_comments } })

            setTotalParentComments(preval => preval+parentCommentIncrementvalue)

         }).catch(error=>{
             console.log(error.message);
         })

    }

    return (
        <>

        <Toaster />
          <textarea value={comment} 
          onChange={(e) =>{
            setComment(e.target.value)
          }}
          placeholder="Leave a comment.."
          className="input-box pl-5 placeholder:text-dark-grey resize none h-[150px] overflow-auto"
          />

          <button 
          onClick = {handleComment}
          className="btn-dark mt-5 px-10"> {action} </button>
        </>
    )
}

export default CommentField;