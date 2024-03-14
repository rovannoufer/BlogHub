import { faUnlock } from "@fortawesome/free-solid-svg-icons";
import InputBox from "../components/inputbox";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useContext, useRef } from "react";
import { UserContext } from "../App";

const ChangePassword = () => {

    let changePasswordForm = useRef();
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    const serverUrl = "http://localhost:3000" ;

    let { userAuth: { access_token } } = useContext(UserContext);
    const handleSubmit = (e) =>{

        e.preventDefault();

        let form = new FormData(changePasswordForm.current)
        let formData = { };
        
        for(let [key, value] of form.entries()){
            formData[key] = value
        }

        let { currentPassword, newPassword } = formData;
        if(!currentPassword.length || !newPassword.length){
            return toast.error("Fill all the inputs")
        }

        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase")
        }

        e.target.setAttribute("disabled", true);


        let loadingToast = toast.loading("Updating....");
        axios.post(serverUrl+"/change-password", formData,{
            headers:{
                'Authorization': `Bearer ${access_token}`
            }
        }).then(()=>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.success("Password Updated");
        }).catch(({ response})=>{
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.error(response.data.error);
        })
    }

    return(
        <>
        <Toaster />
        <form ref={ changePasswordForm }>

                <h1 className="max-md:hidden">Change Password</h1>

                <div className="py-10 w-full md:max-w-[400px]">
                    <InputBox name="currentPassword" type="password"
                    className ="profile-edit-input" placeholder={"Current Password"}
                    icon={ faUnlock }
                    />
                    <InputBox name="newPassword" type="password"
                    className ="profile-edit-input" placeholder={"New Password"}
                    icon={ faUnlock }
                    />

                    <button type="submit" onClick={ handleSubmit } className="btn-dark px-10 " >
                        Change Password
                    </button>
                </div>
        </form>
        
        </>
    )
}

export default ChangePassword;