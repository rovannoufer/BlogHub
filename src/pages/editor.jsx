import { useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blogeditor";

const Editor = () =>{
    
    const [ editorState, setEditorState ] = useState("editor");

    let { userAuth: { access_token, username }} = useContext(UserContext);
    
    return(
        access_token === null ? <Navigate to='/signin'/>
        : editorState == "editor" ? <BlogEditor /> : <h1> Publish {username }</h1>
    )
}

export default Editor;