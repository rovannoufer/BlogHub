import { comment } from "postcss";
import getDay from "../common/date";
import { useContext, useState } from "react";
import  {UserContext} from '../App';
import toast, { Toaster } from "react-hot-toast";
import CommentContainer from "./commentcontainer";
import CommentField from "./commentfield";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { BlogContext } from "../pages/blogpage";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by : { personal_info : { profile_img, fullname, username }}, 
    commentedAt, comment, _id, children } = commentData;

    let { userAuth: { access_token } } = useContext(UserContext);

    const [ isReplying, setReplying ] = useState(false);
    let { blog, setBlog, blog: { comments, comments: { results: commentsArr }}} = useContext(BlogContext);


    const serverUrl = "http://localhost:3000" ;

    const handleReplyClick = () =>{

        if(!access_token){
           return toast.error("Need to be login")
        }

        setReplying(preVal => !preVal)
        
        
    }

    const loadReplies = ({ skip = 0}) =>{
        if(children.length){
            hideReplies();

            axios.post(serverUrl + "/get-replies", {
                _id, skip
            }).then(({ data : { replies }}) =>{

                commentData.isReplyLoaded = true;

                for(let i=0;i<replies.length;i++){
                    replies[i].childrenLevel = commentData.childrenLevel + 1;
                    commentsArr.splice(index + 1 + i + skip, 0, replies[i]);
                }

                setBlog({ ...blog, comments: { ...comments, results: commentsArr }})
            }).catch(error =>{
                console.log(error);
            })
        }
    }

    const removeCommentsCards = (startingPoint) =>{

        if(commentsArr[startingPoint]){
            while(commentsArr[startingPoint].childrenLevel > commentData.childrenLevel){
                commentsArr.splice(startingPoint, 1)

                if(!commentsArr[startingPoint]){
                    break;
                }
            }
        }

        setBlog({ ...blog, comments: { results: commentsArr} })
    }

    const hideReplies = () =>{

        commentData.isReplyLoaded = false;
        removeCommentsCards(index + 1 )
    }

   


    return(

      
        <>
          <Toaster />
        <div className="w-full " style={{ paddingLeft: `${leftVal * 10}px`}}>
              <div className="my-5 p-6 rounded-md border border-grey">
                  <div className="flex gap-3 items-center mb-8">
                        <img src={ profile_img } className="w-6 h-6 rounded-full" />
                        <p className="line-clamp-1">{ fullname }  @{ username } </p>
                        <p className="min-w-fit">  { getDay( commentedAt ) } </p>
                  </div>

                  <p className="text-xl ml-3"> { comment } </p>

                 <div className="flex gap-5 items-center mt-5">
                   {
                     commentData.isReplyLoaded ? 
                     <button 
                     onClick={ hideReplies }
                     className="text-dark-grey p-2 px-3
                     hover:bg-grey/30 rounded-md flex items-center gap-2
                     ">
                        <FontAwesomeIcon icon={ faComment }/> Hide Reply
                     </button> : 
                     <button onClick={ loadReplies }
                     className="text-dark-grey p-2 px-3
                     hover:bg-grey/30 rounded-md flex items-center gap-2
                     ">
                       <FontAwesomeIcon icon={ faComment }/>{ children.length } Replies
                     </button>
                   }
                    <button 
                    onClick={handleReplyClick}
                    className="underline"> Reply </button>

                 </div>

                 {
                    isReplying ? 
                    <div className="mt-8">
                        <CommentField action ="reply" 
                        index={index} replyingTo={_id} setReplying={setReplying} />
                    </div> : ""
                 }
              </div>
        </div>
        </>
    )
}

export default CommentCard;