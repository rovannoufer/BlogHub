import { useContext, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";



const NotificationCommentField = ({ _id, blog_author, index=undefined, replyingTo=undefined, setReplying, notification_id, notificationData}) =>{

    let [ comment, setComment ] = useState('');
    let { _id: user_id } = blog_author;
    let { userAuth: { access_token } } = useContext(UserContext);
    let { notifications, notifications: { results }, setNotifications } = notificationData;
    const serverUrl = "http://localhost:3000" ;


    const handleComment = () =>{

         if(!comment.length){
            return toast.error("Write something to leave a comment...")
         }

         axios.post(serverUrl+ "/add-comment", {
            _id, blog_author: user_id, blog_author, comment, replying_to: replyingTo,
            notification_id
         }, {
            headers:{
                'Authorization': `Bearer ${access_token}`
            }
         }).then(( { data }) =>{
             
           setReplying(false);
           results[index].reply = { comment, _id: data._id }
           setNotifications({ ...notifications, results })
            

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
          placeholder="Leave a Reply.."
          className="input-box pl-5 placeholder:text-dark-grey resize none h-[150px] overflow-auto"
          />

          <button 
          onClick = {handleComment}
          className="btn-dark mt-5 px-10"> Reply </button>
        </>
    )

}


export default NotificationCommentField;