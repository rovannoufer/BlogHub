import { useParams,  } from "react-router-dom";
import InPageNavigation from "../components/inpagenavigation";
import LoadMoreDataButton from "../components/loadmoredatabutton";
import BlogPostCard from "../components/blogpostcard";
import Loader from "../components/loader";
import NoDaTaMessage from "../components/nodata";
import { useEffect, useState } from "react";
import axios from "axios";
import filterPaginationData from "../common/filter-pagination";
import UserCard from "../components/usercard";



const SearchPage = (props) =>{
  
    let { query } =useParams();
    let [blogs, setBlogs ] = useState(null);
    let[ users, setUsers ] = useState(null);

    const serverUrl = "http://localhost:3000" ;


    const searchBlogs = ({ page = 1, create_new_arr = false}) =>{
             
        axios.post(serverUrl + "/search-blogs" ,{ query, page  })
        .then( async ({ data }) =>{

        
            let formatedData = await filterPaginationData({
                state: blogs,
                data:data.blogs,
                page,
                countRoute:"/search-blogs-count",
                data_to_send: {query},
                create_new_arr 
            })
            // blog is now in object not in array
         
            setBlogs(formatedData);
           }).catch(err =>{
            console.log(err);
           })

    }

    const fetchuser = () =>{
        axios.post(serverUrl+"/search-user", { query })
        .then(({ data:{ users }}) =>{
            console.log(users)
            setUsers(users);
        })
    }

    useEffect(()=>{
        searchBlogs({ page : 1, create_new_arr : true });
        fetchuser();

    },[query])

    
const Usercard = () =>{
        return(
            <>
            {
                users == null ? <Loader /> : 
                users.length ? 
                users.map((user,i)=>{
                         return <>
                            <div key={i}>
                               <UserCard user = { user }/>
                            </div>
                           </>;
                }) : <NoDaTaMessage message ={ "No users found" }/>
            }
            
            </>
        )
    }


    return(
    <section className="h-cover flex justify-center gap-10"> 

        <div className="w-full">
             <InPageNavigation routes={[`Search Results from "${query}"`, "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                  <>
                  {
                        blogs == null ? 
                        <Loader /> 
                        : (
                            blogs.results.length ? blogs.results.map((blog,i) =>{
                                return <h1 key={i}> <BlogPostCard content={blog} author={blog.author.personal_info}/> </h1>
                            }) : <NoDaTaMessage message={ "No Blogs Published" } />
                        )
                   }

                        <LoadMoreDataButton state={ blogs } fetchDataFun={searchBlogs}/>
                  </>

                  <Usercard />
             </InPageNavigation>
        </div> 

        <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
           <h1 className="font-medium text-xl mb-8"> User related to search </h1>
           <Usercard />
        </div>

    </section>
  )
}

export default SearchPage;