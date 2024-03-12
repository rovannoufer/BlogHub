import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../components/loader";
import { UserContext } from "../App";

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

    let { userAuth : { username }} = useContext(UserContext)


    let { personal_info : { fullname, username: profile_username, profile_img, bio}, account_info: { total_posts, total_reads },
     social_links, joinedAt } = profile;


    const serverUrl = "http://localhost:3000";

    const fetchUserProfile = () =>{
        axios.post(serverUrl+"/get-profile",{ username: profileId})
        .then(({ data: user }) =>{
            console.log(user);
            setProfile(user);
            setloading(false);
        }).catch(error =>{
            console.log(error);
            setloading(false);
        })
    }
  
    useEffect(()=>{
       
        resetStates();
        fetchUserProfile();
    },[profileId])

    const resetStates = () =>{
        setProfile(profiledatastruc);
        setloading(true);
    }

    return (
       <>
        {
            loading ? <Loader /> :  
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
                </div>

            </section>
        }
       </>
    )
}

export default ProfilePage;