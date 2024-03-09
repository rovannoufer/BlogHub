import React, { useContext } from 'react'
import InputBox from '../components/inputbox'
import { faUser, faEnvelope, faKey  } from "@fortawesome/free-solid-svg-icons";
import GoogleIcon from '@mui/icons-material/Google';
import { Link, Navigate } from 'react-router-dom';
import { useRef } from 'react';
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeSession } from '../common/session';
import { UserContext } from '../App';
import { authWithGoogle } from '../common/firebase';

export default function UserAuth({type}) {

  const authForm = useRef();

  let { userAuth, setUserAuth } = useContext(UserContext)

  // console.log(userAuth.access_token);
  const serverUrl = "http://localhost:3000" ;
  const userauthServer = (serverRoute, formData) =>{
    // console.log(serverUrl + serverRoute, formData);
      axios.post(serverUrl + serverRoute, formData)
      .then(({data}) =>{
        storeSession("user",JSON.stringify(data))
        // console.log(sessionStorage);

        setUserAuth(data)
      }).catch(({ response }) =>{
        toast.error(response.data.error);
      })
  }

  const handleSubmit = (e) =>{
 
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";
    let form = new FormData(authForm.current);
    
    let formData = {};


    for(let [key, value] of form.entries()){
      formData[key] = value;
    }
    // console.log(formData);
    let { fullname, email, password } = formData;

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password 
    if(fullname){
      if(fullname.length < 3){
        return toast.error("Full name must be atleast 3 letters long...")
      }
    }

    if(!email.length){
        return toast.error("Email is invalid")
    }
    if(!emailRegex.test(email)){
        return toast.error("Email is invalid")
    }
    if(!passwordRegex.test(password)){
        return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase")
    }
   
    userauthServer(serverRoute, formData);
  }


  const handleGoogleAuth = (e) =>{
     
    e.preventDefault();

    authWithGoogle().then(user =>{
       let serverRoute = "/google-auth";

       let formData = {
        access_token : user.accessToken
       }

       userauthServer(serverRoute, formData)
    
    }).catch(err =>{
      toast.error("Trouble in logging");
      return console.log(err);
    })
  }
  
  return (
    userAuth.access_token ? <Navigate to='/' />
    :
    <section className='h-cover flex items-center justify-center'> 
    <Toaster />
      <form ref={authForm} className='w-[80%] max-w-[400px]'>
              <h1 className='text-3xl capitalize text-center mb-24'> 
                {type === "sign-in" ? "Welcome back" : "Join us today"}
              </h1>
              {
                type !== "sign-in" ?
                <InputBox 
                 name="fullname"
                 type="text"
                 placeholder="Full name"
                 icon= {faUser}
                />
                : " "
              }
              <InputBox 
                 name="email"
                 type="email"
                 placeholder="E-mail"
                 icon= {faEnvelope}
                />

              <InputBox 
                 name="password"
                 type="password"
                 placeholder="Password"
                 icon= { faKey }
                />

                <button className='btn-dark center mt-14'
                type="submit"
                onClick={handleSubmit}> 
                   { type.replace("-", " ")}
                </button>


                <div className='relative w-full flex items-center gap-2
                my-10 opacity-10 uppercase text-black font-bold'>
                    <hr className='w-1/2 border-black'/>
                    <p className='text-black'> OR </p>
                    <hr className='w-1/2 border-black'/>
                </div>

                <button className='btn-light center'
                onClick={handleGoogleAuth}
                >
                  <GoogleIcon  className='mr-3'/>
                    Continue With Google
                </button>

                {
                    type === "sign-in" ?  
                     
                      <Link to="/signup" className="underline text-black
                      text-xl ml-1">
                        <p className='mt-6 text-dark-grey text-xl text-center'>
                      Don't have an account ?
                      </p>
                      </Link>
                    
                    : <Link to="/signin" className="underline text-black
                    text-xl ml-1">
                      <p className='mt-6 text-dark-grey text-xl text-center'>
                    Already have an account
                    </p>
                    </Link>
                }

      </form>
    </section>
  )
}
