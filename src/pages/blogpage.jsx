import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader";
import getDay from "../common/date";
import BlogInteraction from "../components/bloginteraction";
import BlogPostCard from "../components/blogpostcard";
import BlogContent from "../components/blogcontent";


export const blogstruc = {
    title: '',
    des: '',
    content: [],
    author: { personal_info: { } },
    banner: '',
    publishedAt: ''

}

export const BlogContext = createContext({ })

const BlogPage = () =>{

    let { blog_id } = useParams();
    const [ blog, setBlog ] = useState(blogstruc);
    const [ loading, setLoading ] = useState(true);
    const [ similarBlogs, setSimilarBlogs ] = useState(null);

    let { title, content, banner, author: {personal_info:{ fullname, username: author_username , profile_img }}, publishedAt} = blog;

    const serverUrl = "http://localhost:3000" ;
    const fetchBlog= () =>{
        axios.post(serverUrl +"/get-blog", { blog_id })
        .then(({ data : { blog } }) => {


            setBlog(blog);

            axios.post(serverUrl+"/search-blogs", { tag: blog.tags[0], limit:6, eliminate_blog: blog_id })
            .then(({ data }) =>{
                setSimilarBlogs(data.blogs);
                console.log(data.blogs);
            })
           
            setLoading(false);
        }).catch(error =>{
            console.log(error);
        })
    }


    const resetStates = () =>{
        setBlog(blogstruc);
        setSimilarBlogs(null);
        setLoading(true);
    }  

    useEffect(() =>{ 
      fetchBlog();
      resetStates();

    },[blog_id])

  
    
   
    return (
        <>
        {
            loading ? <Loader /> :
            <BlogContext.Provider value={{ blog, setBlog }}>

                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                                
                                <img src={banner} className="aspect-video" />
                                <div className="mt-12">
                                        <h2> {title} </h2>
                                </div>

                                <div className="flex max-sm:flex-col justify-between my-8">
                                    <div className="flex gap-5 items-start">
                                        <img src= {profile_img} className="w-12 h-12 rounded-full"/>
                                        <p className="capitalize">{ fullname }
                                        <br />
                                        <Link to={`/user/${author_username}`}> @{ author_username } </Link>
                                        </p>
                                    </div>
                                    <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published on { getDay(publishedAt) }</p>
                                </div>

                                <BlogInteraction />
                                    
                                    <div className="my-12 blog-page-content">

                                        {
                                            content[0].blocks.map((block,i) =>{
                                                console.log(block)
                                                 return <div key={i} className="my-4 md:my-8">
                                                    
                                                    <BlogContent block = { block }/>
                                                    </div>
                                            })
                                        }

                                    </div>

                                <BlogInteraction />


                                { 
                                
                                 similarBlogs != null && similarBlogs.length ?
                                 <>
                                  <h1 className="text-2xl mt-14 mb-10 font-medium"> Similar blogs</h1>

                                  {
                                    similarBlogs.map((blog,i) =>{
                                        let { author : { personal_info } } = blog;
                                        console.log(blog)

                                        return <h1 key={i}>
                                              <BlogPostCard content={ blog } author = { personal_info }/>
                                        </h1>
                                    })
                                  }
                                 </> : " "
                                }
                    </div>
            </BlogContext.Provider>
            
        }
        
        </>
    )

}


export default BlogPage;