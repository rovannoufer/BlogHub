import axios from "axios";
import InPageNavigation from "../components/inpagenavigation";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import BlogPostCard from "../components/blogpostcard";

const HomePage = () =>{
 

    let [ blogs, setBlog ] = useState(null);

    const serverUrl = "http://localhost:3000" ;

    const fetchLatestBlogs = () =>{
       axios.get(serverUrl + "/latest-blogs")
       .then(({ data }) =>{
        setBlog(data.blogs)
       }).catch(err =>{
        console.log(err);
       })
    }

    useEffect(() =>{
        fetchLatestBlogs();
    },[])


    return(
       <section className="h-cover flex justify-center gap-10">

       <div className="w-full">
           <InPageNavigation routes={[ "home", "trending blogs"]} defaultHidden={["trending blogs"]}>

          <>
          {
            blogs == null ? <Loader /> 
            : blogs.map((blog,i) =>{
                return <h1 key={i}> <BlogPostCard content={blog} author={blog.author.personal_info}/> </h1>
            }) 
            
          }
          </>

           <h1> Trending blogs here</h1>


           </InPageNavigation>

       </div>

       <div>

       </div>
       
       </section>
    )
}

export default HomePage;