import { useContext, useState, createContext } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import BlogEditor from "../components/blogeditor";
import PublishForm from "../components/publishform";


const blogStructure = {
    title: '',
    banner:'',
    content: [],
    tags: [],
    des: '',
    author: { personal_info : { } }
  }

export const EditorContext = createContext({ });

const Editor = () =>{
    
   const  [ blog, setBlog ] = useState(blogStructure); 
  
   const [ editorState, setEditorState ] = useState("editor");

   const [ textEditor, setTextEditor ] = useState({ isReady: false })

    let { userAuth: { access_token, username }} = useContext(UserContext);
    
    return(
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState,textEditor, setTextEditor }}>
        
        {
            access_token === null ? <Navigate to='/signin'/>
            : editorState == "editor" ? <BlogEditor /> : <PublishForm />
        }

        </EditorContext.Provider>
        
        
    )
}

export default Editor;