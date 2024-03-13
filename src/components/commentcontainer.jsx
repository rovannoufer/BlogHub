import { useContext } from "react";
import { BlogContext } from "../pages/blogpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CommentField from "./commentfield";
import axios from "axios";
import NoDaTaMessage from "./nodata";
import CommentCard from "./commentcard";



export const fetchComments = async ({ skip = 0, blog_id, setParentCommentCountFun, comment_array = null }) => {
    try {
        const serverUrl = "http://localhost:3000";
        const response = await axios.post(serverUrl + "/get-blog-comments", { blog_id, skip });

        const data = response.data.map(comment => {
            comment.childrenLevel = 0;
            return comment;
        });

        setParentCommentCountFun(preVal => preVal + data.length);

        if (comment_array == null) {
            return { results: data };
        } else {
            return { results: [...comment_array, ...data] };
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        return { error: error.message };
    }
};


const  CommentContainer = () =>{


    let { blog: { title , comments: { results: commentsArr } }, commentsWrapper, setCommentsWrapper } = useContext(BlogContext);

    return(
     <>
        <div className={"max-sm:w-full fixed " + (commentsWrapper ? " top-0 sm:right-0" : 
        " top-[100%] sm:right-[-100%] ") + " duration-700 max-sm:tight-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden "}>
             
             <div className="relative">
                <h1 className="text-xl font-medium"> Comments </h1>
                <p className="text-lg mt-2 w-[70%] text-dark-grey line clamp-1">
                   { title }
                </p>

                <button 
                onClick={() => setCommentsWrapper(preval => !preval)}
                className="absolute top-0 right-0 flex jusitfy-center items-center w-12 h-12 rounded-full bg-grey">
                     <FontAwesomeIcon icon={faXmark}  className="items-center ml-4"/>
                </button>
             </div>

             <hr className="border-grwy my-8 w-[120%] -ml-10"/>
             <CommentField  action={ "comment" }/>

             {
                  commentsArr && commentsArr.length ?
                  commentsArr.map((comment,i) =>{
                    return <div key={i}>
                         <CommentCard index={i} leftVal={ i.childrenLevel *4 } commentData = {comment}/>
                        </div>
                  }) : <NoDaTaMessage message="No Comments" />
             }
             
            </div>
     </>
    );

}

export default CommentContainer;