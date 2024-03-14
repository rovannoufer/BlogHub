import { comment } from "postcss";
import getDay from "../common/date";
import { useContext, useState } from "react";
import  {UserContext} from '../App';
import toast, { Toaster } from "react-hot-toast";
import CommentContainer from "./commentcontainer";
import CommentField from "./commentfield";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faDeleteLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import { BlogContext } from "../pages/blogpage";
import axios from "axios";

const CommentCard = ({ index, leftVal, commentData }) => {

    let { commented_by : { personal_info : { profile_img, fullname, username: commented_by_username }}, 
    commentedAt, comment, _id, children } = commentData;

    let { userAuth: { access_token, username } } = useContext(UserContext);

    const [ isReplying, setReplying ] = useState(false);
    let { blog, setBlog, totalParentComments, setTotalParentComments, blog: { comments,activity, activity:{ total_parent_comments }, comments: { results: commentsArr }, author: { personal_info : { username: blog_author } }}} = useContext(BlogContext);


    const serverUrl = "http://localhost:3000" ;

    const handleReplyClick = () =>{

        if(!access_token){
           return toast.error("Need to be login")
        }

        setReplying(preVal => !preVal)
        
        
    }

    const loadReplies = ({ skip = 0, currentIndex = index}) =>{


        if(commentsArr[currentIndex].children.length){
            hideReplies();

            axios.post(serverUrl + "/get-replies", {
                _id: commentsArr[currentIndex]._id , skip
            }).then(({ data : { replies }}) =>{

                commentsArr[currentIndex].isReplyLoaded = true;
             
                console.log(replies);

                for(let i=0;i<replies.length;i++){
                    replies[i].childrenLevel = commentData.childrenLevel + 1;
                    commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
                }

                setBlog({ ...blog, comments: { ...comments, results: commentsArr }})
            }).catch(error =>{
                console.log(error);
            })
        }
    }

    const getParentIndex = () => {
        let startingPoint = index-1;

        try{
            while(commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel){
                startingPoint --;
            }
        }catch{
            startingPoint = undefined;
        }

        return startingPoint;
    }

    const removeCommentsCards = (startingPoint, isDelete =false) =>{

        if(commentsArr[startingPoint]){
            while(commentsArr[startingPoint].childrenLevel > commentData.childrenLevel){
                commentsArr.splice(startingPoint, 1)

                if(!commentsArr[startingPoint]){
                    break;
                }
            }
        }

        if(isDelete){
            let parentIndex = getParentIndex();

            if(parentIndex != undefined){
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(chilf => child != _id)

                if(!commentsArr[parentIndex].children.length){
                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }
            commentsArr.splice(index, 1);

        }

        if(commentData.childrenLevel == 0 && isDelete){
            setTotalParentComments(preVal => preVal - 1 )
        }

        setBlog({ ...blog, comments: { results: commentsArr}, activity:{
            ...activity, total_parent_comments: total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0)
        } })
    }

    const hideReplies = () =>{

        commentData.isReplyLoaded = false;
        removeCommentsCards(index + 1 )
    }

    // const deleteComment = (e) =>{
    //     e.target.setAttribute("disabled", true);

    //     axios.post(serverUrl + "/delete-comment" , { _id } ,
        
    //        {
    //           headers:{
    //             'Authorization' : `Bearer ${access_token}`
    //           }
    //         }).then(() =>{
    //             e.target.removeAttribute("disable");
    //             removeCommentsCards(index + 1 , true)
    //         }).catch(error =>{
    //             console.log(error);
    //         })
    // }


    const LoadMorePrepliesButton = () =>{

        let parentIndex = getParentIndex();
       
        if(commentsArr[index+1]){    //last load
            if(commentsArr[index+1].childrenLevel < commentsArr[index].childrenLevel){
                if((index-parentIndex) < commentsArr[parentIndex].children.length){
                    return ( 
                        <button 
                             onClick={()=>  loadReplies( { skip: index - parentIndex , currentIndex: parentIndex}) }
                            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-nmd flex items-center gap-2"> Load more </button>
                        )
                }
            }
        }
        else{
            if(parentIndex){
                if((index-parentIndex) < commentsArr[parentIndex].children.length){
                    return ( 
                        <button 
                             onClick={()=>  loadReplies( { skip: index - parentIndex , currentIndex: parentIndex}) }
                            className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-nmd flex items-center gap-2"> Load more </button>
                        )
                }
            }
        }

        
    }
   


    return(

      
        <>
          <Toaster />
        <div className="w-full " style={{ paddingLeft: `${leftVal * 10}px`}}>
              <div className="my-5 p-6 rounded-md border border-grey">
                  <div className="flex gap-3 items-center mb-8">
                        <img src={ profile_img } className="w-6 h-6 rounded-full" />
                        <p className="line-clamp-1">{ fullname }  @{ commented_by_username } </p>
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

                    {/* {
                        username == commented_by_username || username == blog_author ?
                        <button 
                        onClick={deleteComment}
                        className="p-2 px-3 rounded-md border border-grey ml-auto
                        hover:bg-red/30 hover:trxt-red flex items-center"
                        >

                            <FontAwesomeIcon icon={ faTrash }/>
                        </button>
                        : " "

                    } */}

                 </div>

                 {
                    isReplying ? 
                    <div className="mt-8">
                        <CommentField action ="reply" 
                        index={index} replyingTo={_id} setReplying={setReplying} />
                    </div> : " " 

                   
                 }

                  <LoadMorePrepliesButton /> 
              </div>
        </div>
        </>
    )
}

export default CommentCard;