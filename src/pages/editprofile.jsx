import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { profiledatastruc } from "./profilepage";
import Loader from "../components/loader";
import { Toaster, toast } from "react-hot-toast";
import InputBox from "../components/inputbox";
import { faAt, faEnvelope, faUser } from "@fortawesome/free-solid-svg-icons";
import { uploadImage } from "../common/aws";
import { storeSession } from "../common/session";

const EditProfile =  () => {



    let { userAuth, userAuth : {access_token}, setUserAuth } = useContext(UserContext);

    const [ profile, setProfile ] = useState(profiledatastruc);
    const [ loading, setLoading ] = useState(true);
    const [ charactersLeft, setCharactersLeft ] = useState(200);
    const [ updatedProfileImage, setUpdatedProfileImage ] = useState(null);

    let { personal_info: { fullname, username: profile_username, profile_img, email, bio, social_links }} = profile;

    let profileImgEle = useRef();
    let editProfileForm = useRef();

    const serverUrl = "http://localhost:3000" ;
    useEffect(() =>{

        if(access_token){
            axios.post(serverUrl+"/get-profile", { username: userAuth.username })
            .then(( { data }) =>{
                 setProfile(data);
                 setLoading(false);
            }).catch((error) =>{
                console.log(error);
            })
        }

    },[access_token])


    const handleCharacterChange = (e) =>{

        setCharactersLeft(200 - e.target.value.length)
    }

    const handleImagePreview = (e) =>{
        
        let img = e.target.files[0];
        profileImgEle.current.src = URL.createObjectURL(img);

        setUpdatedProfileImage(img);

    }
    const handleImageUpload = (e) =>{
        e.preventDefault();

        if(updatedProfileImage){

            let loadingToast = toast.loading("Uploading...");
            e.target.setAttribute("disabled", true);  //only one time user click the button and click after it recieves the response


            uploadImage(updatedProfileImage)
            .then((url) =>{
               if(url){
                axios.post(serverUrl+"/update-profile-img", { url },{
                    headers:{
                        'Authorization': `Bearer ${ access_token }`
                    }
                }).then(({ data }) =>{
                    let newUserAuth = { ...userAuth, profile_img: data.profile_img }

                    storeSession("user", JSON.stringify(newUserAuth))
                    setUserAuth(newUserAuth);
                    setUpdatedProfileImage(null);
                    toast.dismiss(loadingToast);
                    e.target.removeAttribute("disabled");
                    toast.success("Uploaded..");

                }).catch(({ response }) =>{
                    toast.dismiss(loadingToast);
                    e.target.removeAttribute("disabled");
                    toast.error(response.data.error);
                })
               }
            })
            .catch((error) =>{
                console.log(error)
            })
         }

    }

    const handleSubmit = (e) =>{

        e.preventDefault();

        let form = new FormData(editProfileForm.current);
        let formData = { };

        for(let [key, value] of form.entries()){
            formData[key] = value;
        }
        let { username, bio} = formData;
        if(username.length < 3){
            return toast.error("Username should be at least 3 letters long")
        }

        if(bio.length > 200){
            return toast.error("Bio should not be nore than 200 characters")
        }

        let loadingToast = toast.loading("Updating...");
        e.target.setAttribute("disabled", true);

        axios.post(serverUrl+"/update-profile",{
            username, bio
        },{
            headers:{
                'Authorization': `Bearer ${ access_token }`
            }
        }).then(( { data }) =>{
            
            if(userAuth.username != data.username){
                let newUserAuth = { ...userAuth, username: data.username };
                storeSession("user", JSON.stringify(newUserAuth));
                setUserAuth(newUserAuth);

            }

            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.success("Updated..");
        }).catch(({ response }) =>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.error(response.data.error);
        })
    } 

    return(
        <>
          {
            loading ? <Loader /> :
               <form ref={ editProfileForm }>
                  <Toaster />
                   <h1 className="max-md:hidden"> Edit Profile </h1>

                   <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                        <div className="max-lg:center mb-5">
                            <label htmlFor="uploadImg" id="profileImgLable"
                            className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden"
                            >
                                <div className="w-full h-full absolute top-0 left-0 flex items-center
                                justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer
                                "> Upload image </div>
                                 <img ref={profileImgEle}  src={ profile_img }/>
                            </label>

                            <input type="file" id="uploadImg" accept=".jpeg, .png, .jpg " onChange={ handleImagePreview } hidden/>
                            <button className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={ handleImageUpload }> Upload </button>
                        </div>

                        <div className="w-full">
                             <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                <div>
                                    <InputBox name={"fullname"} type={"text"} value={ fullname } placeholder={"Full Name"} icon = {faUser} disable={ true }/>
                                </div>
                                <div>
                                    <InputBox name={"email"} type={"email"} value={ email } placeholder={"Email"} icon = {faEnvelope} disable={ true }/>
                                </div>
                             </div>

                             <InputBox type={"text"} name={"username"} value={ profile_username } placeholder={"Username"} icon={faAt}/>
                             <p className="text-dark-grey -mt-3"> Username will use to search user and will be visible to all users</p>

                             <textarea name="bio" maxLength={200} defaultValue={bio} className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5" 
                             onChange={ handleCharacterChange } placeholder="Bio"/>
                             <p className="my-6 text-dark-grey">
                                { charactersLeft } characters left
                             </p>
                             {/* <p className="my-6 text-dark-grey">
                                Add your social media handles below
                             </p>

                             <div className="md:grid md:grid-cols-2 gap-x-6">
                              
                             {
                                social_links && Object.keys(social_links).map((key, i) => {
                                    let link = social_links[key];
                                    return <InputBox key={i} name={key} type={"text"} value={link} placeholder={"https://"} />;
                                })
                            }

                             </div> */}

                             <button className="btn-dark w-auto px-10" onClick={ handleSubmit } type="submit"> Update </button>
                        </div>
                   </div>
               </form>
          }
        </>
    )

}


export default EditProfile;