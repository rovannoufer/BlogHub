import { useParams } from "react-router-dom";


const BlogPage = () =>{

    let { blog_id } = useParams();


    return (
        <p>this is blog {blog_id}</p>
    )

}


export default BlogPage;