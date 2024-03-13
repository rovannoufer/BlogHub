import { useContext, useState, createContext, useEffect } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blogeditor";
import PublishForm from "../components/publishform";
import Loader from "../components/loader";
import axios from "axios";


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

    let { blog_id } = useParams();
    
   const  [ blog, setBlog ] = useState(blogStructure); 
  
   const [ editorState, setEditorState ] = useState("editor");

   const [ textEditor, setTextEditor ] = useState({ isReady: false });

   const [ Loading, setLoading ] = useState(true);

    let { userAuth: { access_token, username }} = useContext(UserContext);

    const serverUrl = "http://localhost:3000" ;

    useEffect(() =>{
 
        if(!blog_id){
            return setLoading(false);
        }

        axios.post(serverUrl+ "/get-blog", {
          blog_id, draft: true, mode : 'edit'})
          .then(({ data : { blog }} ) =>{
            setBlog(blog);
            setLoading(false);
          }).catch(error =>{

            setBlog(null);
            setLoading(false);
            console.log(error);
          })
    },[])
    
    return(
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState,textEditor, setTextEditor }}>
        {
            access_token === null ? <Navigate to='/signin'/>
            :
            Loading ? <Loader /> : 
            editorState == "editor" ? <BlogEditor /> : <PublishForm />
        }

        </EditorContext.Provider>
        
        
    )
}

export default Editor;