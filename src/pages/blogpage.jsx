import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


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

    let { title, content, banner, author: {personal_info:{ fullname, username, profile_img }}, publishedAt} = blog;

    const serverUrl = "http://localhost:3000" ;
    const fetchBlog= () =>{
        axios.post(serverUrl +"/get-blog", { blog_id })
        .then(({ data : { blog } }) => {
            console.log(blog);
            setBlog(blog);
        }).catch(error =>{
            console.log(error);
        })
    }

    useEffect(() =>{
      fetchBlog();
    },[])


    return (
        <p>this is blog { title } </p>
    )

}


export default BlogPage;