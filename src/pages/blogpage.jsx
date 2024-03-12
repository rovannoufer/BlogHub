import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader";
import getDay from "../common/date";


export const blogstruc = {
    title: '',
    des: '',
    content: [],
    tags: [],
    author: { personal_info: { } },
    banner: '',
    publishedAt: ''

}

const BlogPage = () =>{

    let { blog_id } = useParams();
    const [ blog, setBlog ] = useState(blogstruc);
    const [ loading, setLoading ] = useState(true);

    let { title, content, banner, author: {personal_info:{ fullname, username: author_username , profile_img }}, publishedAt} = blog;

    const serverUrl = "http://localhost:3000" ;
    const fetchBlog= () =>{
        axios.post(serverUrl +"/get-blog", { blog_id })
        .then(({ data : { blog } }) => {
            setBlog(blog);
            setLoading(false);
        }).catch(error =>{
            console.log(error);
        })
    }

    useEffect(() =>{
      fetchBlog();
    },[])


    return (
        <>
        {
            loading ? <Loader /> :
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
            </div>
        }
        
        </>
    )

}


export default BlogPage;