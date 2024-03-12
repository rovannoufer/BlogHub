import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader";
import { UserContext } from "../App";
import AboutUser from "../components/aboutuser";
import InPageNavigation from "../components/inpagenavigation";
import BlogPostCard from "../components/blogpostcard";
import NoDaTaMessage from "../components/nodata";
import LoadMoreDataButton from "../components/loadmoredatabutton";
import Trendingpostcard from "../components/trendingpostcard";
import Error404 from "./404error";
import { useStepContext } from "@mui/material";


export const profiledatastruc = {
    personal_info:{
        fullname: "",
        username: "",
        profile_img: "",
        bio:"",
    },
    account_info:{
        total_posts:0,
        total_blogs:0
    },
    social_links: { },
    joinedAt:" "
}


const ProfilePage = () =>{

    let { id: profileId } = useParams();
    let [ profile, setProfile ] = useState(profiledatastruc);
    let [ loading, setloading ] = useState(true);
    let [ blogs, setBlogs ] = useState(null);
    let [ profileLoaded, setProfileLoaded ] = useState(null);


    let { personal_info : { fullname, username: profile_username , profile_img, bio}, account_info: { total_posts, total_reads },
     social_links, joinedAt } = profile;

     let { userAuth : {  username }} = useContext(UserContext);


    const serverUrl = "http://localhost:3000";

    const fetchUserProfile = () =>{
        axios.post(serverUrl+"/get-profile",{ username: profileId})
        .then(({ data: user }) =>{
            if(user!=null){
                setProfile(user);
            }
            setProfileLoaded(profileId)
            getBlogs({ user_id : user._id });
            setloading(false);
        }).catch(error =>{
            console.log(error);
            setloading(false);
        })
    }

    const getBlogs = ({ page = 1, user_id }) =>{

        user_id = user_id == undefined ? blogs.user_id : user_id;
        axios.post(serverUrl+"/search-blogs", {
            author:user_id,
            page
        }).then(async({ data }) =>{
            let formatedData = await({
                state : blogs,
                data: data.blogs,
                page,
                countRoute: "/search-blogs-count",
                data_to_send: { author: user_id }
            })
            formatedData.user_id = user_id;
            // console.log(formatedData);
            setBlogs(formatedData);
        })

    }
  
    useEffect(()=>{
        if(profileId != profileLoaded){
            setBlogs(null);
        }
       
        if(blogs == null){
            resetStates();
            fetchUserProfile();
        }
    },[profileId])

    const resetStates = () =>{
        setProfile(profiledatastruc);
        setBlogs(null);
        setProfileLoaded(null);
        setloading(true);
    }

    return (
       <>
        {
            loading ? <Loader /> :  
               profile_username.length ?
            <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">

                <div className="flex flex-col max-md:items-center gap-5 min-w-[250px]">

                    <img src={ profile_img } className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"/>
                    <h1 className="text-2xl font-medium"> @{ profile_username }</h1>
                    <p className="text-xl capitalize h-6"> { fullname } </p>

                    <p>
                        { total_posts } Blogs - { total_reads } Reads
                    </p>
                    
                    <div className="flex gap-4 mt-2">
                      {
                        profileId == username ? 
                        <Link to="/settings/edit-profile" className="btn-light rounded-md"> Edit Profile </Link>
                        : " "  
                      }
                    </div>
                    <AboutUser bio={ bio } social_links={ social_links } joinedAt = { joinedAt } />
                </div>


                <div className="max-md:mt-12 w-full">
                 <InPageNavigation 
                  routes={[ "Blogs", "About"]} defaultHidden={["About"]}
                 >

                    <>
                    
                     {
                       
                        blogs == null ? <Loader />
                        : (
                            blogs.data.length ? blogs.data.map((blog,i) => {
                                return <h1 key={i}>
                                   <BlogPostCard content={blog} author={blog.author.personal_info}/>
                                </h1>
                            }) : <NoDaTaMessage message={ "No Blogs Published" } />
                        )
                     }
                      {/* <LoadMoreDataButton state={ blogs } fetchDataFun={getBlogs}/> */}
                    </>

                    <AboutUser bio={ bio } social_links={ social_links } joinedAt = { joinedAt } />
                </InPageNavigation>

                </div>
            </section> :
            <Error404 />
        }
       </>
    )
}

export default ProfilePage;