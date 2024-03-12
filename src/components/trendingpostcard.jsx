import { Link } from "react-router-dom";
import getDay from "../common/date";

const Trendingpostcard = ({ blog, index }) =>{

    let { title, blog_id: id, author: {personal_info: { fullname, username, profile_img }}, publishedAt } = blog;
    return(
        <h1>
            <Link className="flex gap-5 mb-4">
                 <h1 className="blog-index"> {index + 1} </h1>

                 <div>
                        <div className="flex gap-2 items-center">
                        <img src={ profile_img } className="w-6 h-6 rounded-full"/>
                        <p className="line-clamp-1 "> @{ fullname } @{ username }</p>
                        <p className="min-w-fit"> {getDay(publishedAt)} </p>

                        </div>

                        <h3 className="blog-title"> { title } </h3> 
                 </div>
            </Link>
        </h1>
    )
}

export default Trendingpostcard;