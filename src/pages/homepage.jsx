import axios from "axios";
import InPageNavigation from "../components/inpagenavigation";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import BlogPostCard from "../components/blogpostcard";
import Trendingpostcard from "../components/trendingpostcard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { activeTabLineRef, activeTabRef } from "../components/inpagenavigation";
const HomePage = () =>{
 
    let [ blogs, setBlog ] = useState(null);
    let [ trendingBlogs, setTrendingBlogs ] = useState(null);
    let [ pageState, setPageState ] = useState("home");

    let categories = ["Programming", "Machine learning", "Social media", "Web technology", "Neuralnetwoks"]

    const serverUrl = "http://localhost:3000" ;

    const fetchLatestBlogs = () =>{
       axios.get(serverUrl + "/latest-blogs")
       .then(({ data }) =>{
        setBlog(data.blogs)
       }).catch(err =>{
        console.log(err);
       })
    }

    const fetchTrendingBlogs = () =>{
        axios.get(serverUrl + "/trending-blogs")
        .then(({ data }) =>{
         setTrendingBlogs(data.blogs)
        }).catch(err =>{
         console.log(err);
        })
     }

     const loadblogcategory = (e) =>{
         
      let category = e.target.innerText.toLowerCase();
      setBlog(null);
       
      if(pageState == category){
        setPageState("home");
        return;
      }

      setPageState(category);

     }

     const fetchBlogsByCategory = (e) =>{
        axios.post(serverUrl + "/search-blogs", { tag: pageState })
        .then(({ data }) =>{
            setBlog(data.blogs);
        }).catch((err) =>{
            console.log(err);
        })
     }
    

    useEffect(() =>{
        activeTabRef.current.click();

        if(pageState == "home"){
            fetchLatestBlogs();
        }else{
            fetchBlogsByCategory();
        }
        if(!trendingBlogs){
            fetchTrendingBlogs();
        }

        
    
    },[pageState])


    return(
       <section className="h-cover flex justify-center gap-10">

        <div className="w-full">
           <InPageNavigation routes={[ pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>

          <>
          {
            blogs == null ? 
            <Loader /> 
            : blogs.map((blog,i) =>{
                return <h1 key={i}> <BlogPostCard content={blog} author={blog.author.personal_info}/> </h1>
            }) 
            
          }
          </>

           {
             trendingBlogs == null ? <Loader /> 
             : trendingBlogs.map((blog,i) =>{
                 return <h1 key={i}> <Trendingpostcard blog={ blog } index={i} /> </h1>
             }) 
           }

           </InPageNavigation>

       </div>

       <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

            <div className="flex flex-col gap-10">
                <h1 className="font-medium text-xl mb-8">
                   Stories form all interests
                </h1>
                <div className="flex gap-3 flex-wrap">
                   {
                      categories.map((category, i) =>{
                        return <button onClick ={loadblogcategory} className={"tag " + (pageState == category ? " bg-black text-white " : " ") } key={i} >
                            { category }
                        </button>
                      })
                   }
                </div>


                <div >
                 <h1 className="font-medium text-xl mb-8"> Trending <FontAwesomeIcon icon={faFire}/> </h1>
                {
                    trendingBlogs == null ? <Loader /> 
                    : trendingBlogs.map((blog,i) =>{
                        return <h1 key={i}> <Trendingpostcard blog={ blog } index={i} /> </h1>
                    }) 
                }
                </div>

            </div>
        </div>     
 </section>
    )
}

export default HomePage;