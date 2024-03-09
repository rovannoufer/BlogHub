import { Toaster, toast } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { EditorContext } from '../pages/editor';
import { Tag } from './tags';
import axios from 'axios';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { toolbarClasses } from '@mui/material';

const PublishForm = () =>{

    let { blog, blog: { banner, title, tags, des, content }, setEditorState, setBlog } = useContext(EditorContext);

    let characterLimit = 200;
    let tagLimit = 10;
    const serverUrl = "http://localhost:3000";

    let { userAuth : { access_token } } = useContext(UserContext);
    let navigate = useNavigate();


    const handleCloseEvent = () =>{
        setEditorState("editor")

    }

    const handleblogtitlechange =(e) =>{
         let input = e.target.value;
         setBlog({ ...blog, title: input})
    }
 
    const handleblogdeschange = (e) =>{
        let input = e.target.value;

        setBlog({ ...blog, des:input })
    }


    const handleKeyDown = (e) =>{
        if(e.keyCode == 13){
            e.preventDefault();
        }
    } 
    const handlekeydown = (e) =>{
        if(e.keyCode == 13 || e.keyCode == 188){
            e.preventDefault();

            let tag = e.target.value;
         
            
               if(tags.length < tagLimit){
                if(!tags.includes(tag) && tag.length){
                    setBlog({ ...blog, tags:[ ...tags, tag ]})
                }
               }else{
                toast.error("Limit exceeded")
               }
            e.target.value = ""
        }
    }

    const publishBlog = (e) =>{
 
        if(e.target.className.includes("disable")){
            return;
        }

        if(!title.length){
            return toast.error("Write Blog Title before publishing.")
        }
        if(!des.length || des.length > characterLimit){
            return toast.error(`You must provide a blog description under ${characterLimit} characters`)
        }
        if(!tags.length){
            return toast.error("There must be some tags for blog")
        }

        let loadingToast = toast.loading("Publishing..");
        e.target.classList.add('disable');


        let blogObj = {
            title, banner, des, content, tags, draft: false
        }

        
        axios.post(serverUrl + "/create-blog",  blogObj, {
            headers:{
                'Authorization' : `Bearer ${access_token}`
            }
        })
        .then(() =>{
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Published");
            setTimeout(() =>{
                navigate("/")
            }, 500);
        }).catch(( { response } ) =>{
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);

            return toast.error(response.data.error)
        })
    }



    return (
        <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
            <Toaster />
            <button className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]'
            onClick={handleCloseEvent}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className='max-w-[550px] center'>
              <p className='text-dark-grey mb-1'>
                  Preview
              </p>       

              <div className='w-full ascpect-video rounded-lg
              overflow-hidden bg-grey mt-4'>
               <img  src={banner} />  
              </div>     

              <h1 className='text-4xl font-medium mt-2 leading-tight-line-clamp-2'>  { title } </h1>    
            
              <p className='text-xl leading-7 mt-4'> { des } </p>
            </div>
 
            <div className='border-grey lg-border-1 lg:pl-8'>
                <p className='text-dark-grey mb-2 mt-9'> Blog title </p>
                <input type = "text" placeholder='Blog Title'
                defaultValue={title} className='input-box pl-4' onChange={handleblogtitlechange}/>
                <p className='text-dark-grey mb-2 mt-9'> Short Description </p>
                <textarea maxLength={characterLimit}
                 defaultValue={des}
                 className='h-40 resize-none leading-7 input-box pl-4'
                 onChange={handleblogdeschange}
                 onKeyDown={handleKeyDown}
                />

                <p className='mt-1 text-dark-grey text-sm text-right'>
                     {characterLimit -des.length} characters left</p>

                <p className='text-dark-grey mb-2 mt-9' >Topics </p>

                <div className='relative input-box pl-2 py-2 pb-4'>
                    <input type="text" placeholder='Topic'
                    className='sticky input-box 
                    bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
                    onKeyDown={handlekeydown}
                    />
                    {
                        tags.map((tag,i) =>{
                            return <Tag tag={tag} key={i}/>
                        })
                    }
                     
                </div>
                <p className='mt-1 text-dark-grey text-sm text-right'>
                     { tagLimit -tags.length } tags left</p>

                <button className='btn-dark px-8' onClick={publishBlog}>
                           Publish
                </button>
            </div>
            
        </section>
    )
}

export default PublishForm;