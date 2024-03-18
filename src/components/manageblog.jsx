import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import filterPaginationData from "../common/filter-pagination";
import { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import InPageNavigation from "./inpagenavigation";
import Loader from "./loader";
import NoDaTaMessage from "./nodata";
import { ManageDraftBlogPost, ManagePublishedBlogCard } from "./managepublishcard";

const ManageBlog = () =>{


    const [ blogs, setBlogs ] = useState(null);
    const [ drafts, setDrafts ]= useState(null);
    const [ query, setQuery ] = useState("");

    let { userAuth: { access_token } } = useContext(UserContext);
    const serverUrl = "http://localhost:3000" ;


   const getBlogs = ({ page, draft, deleteDocCount = 0}) =>{
    axios.post(serverUrl+"/user-written-blogs",{
        page, draft, query, deleteDocCount
    },{
        headers:{
            'Authorization' : `Bearer ${ access_token }`
        }
    }).then( async ( { data }) =>{


        let formatedData = await filterPaginationData({
            state: draft ? drafts : blogs,
            data: data.blogs,
            page,
            user: access_token,
            countRoute: '/user-written-blogs-count',
            data_to_send: { draft, query }
        })

        console.log('draft -> '+ draft , formatedData);
        if(draft){
            setDrafts(formatedData);
        }else{
            setBlogs(formatedData);
        }
    }).catch(err=>{
        console.log(err);
    })
   }
    

    useEffect(() =>{
      if(access_token){
         if(blogs == null){
            getBlogs({ page:1, draft: false });
         }
         if(drafts == null){
            getBlogs({ page:1, draft: true });
         }
      }

    },[access_token, blogs, drafts, query])

    const handleSearch = (e) =>{


        let searchQuery = e.target.value;
        setQuery(searchQuery);
        if(e.keyCode == 13 && searchQuery.length){
            setBlogs(null);
            setDrafts(null);
        }

    }
 
    const handleChange = (e) =>{
        if(!e.target.value.length){
            setQuery("");
            setBlogs(null);
            setDrafts(null);
        }

    }

    return (
       <>
       <h1 className="max-md:hidden"> Manage Blogs</h1>
          <Toaster />
          <div className="relative max-md:mt-5 md:mt-8 mb-10">

            <input type="search"
            className="w-full bg-grey p-4 pl-12 pr-6 rounded-full"
            placeholder="Search Blogs"
            onChange={ handleChange }
            onKeyDown={ handleSearch }
            />
            <FontAwesomeIcon className="absolute right-[10%] md:pointer-events-none
            md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey
            " icon={ faSearch } />

          </div>

          <InPageNavigation routes={[ "Published Blogs", "Drafts"]} >
              
              {
                blogs == null ? <Loader /> :
                blogs.results.length ? 

                <>
                {
                    blogs.results.map((blog,i) =>{
                        return <div key={i}>
                           <ManagePublishedBlogCard blog={{ ...blog, index:i, setStateFunc: setBlogs}}/>
                        </div>
                    })
                }
                </>
                  
                 
                : <NoDaTaMessage message={"No published blogs"}/>
              }
                    {
                        drafts == null ? <Loader /> :
                        drafts.results.length ? 

                        <>
                        {
                            drafts.results.map((blog,i) =>{
                                return <div key={i}>
                                <ManageDraftBlogPost blog={{ ...blog, index:i+1, setStateFunc: setDrafts}}/>
                                </div>
                            })
                        }
                        </>
                        
                        
                        : <NoDaTaMessage message={"No Draft blogs"}/>
                    }
          </InPageNavigation>
       </>
    )
}

export default ManageBlog;