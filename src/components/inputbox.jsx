
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";


const InputBox = ({name, type, id, value, placeholder, icon, disable= false}) => {


    const [password, setpassword] = useState(false);
       return(
        <>
        
        <div className="relative w-[100%] mb-4">
           <input 
             name={name}
             type={type == "password" ? password ? "text" : "password" : type}
             placeholder={placeholder}
             defaultValue={value}
             disabled = {disable}
             id={id}
             className="input-box"
           />
           <FontAwesomeIcon icon={ icon } className="input-icon" />
        {
            type == "password" ?
            <FontAwesomeIcon icon = { password ? faEye : faEyeSlash } 
            className="input-icon left-[auto] right-4 cursor-pointer" 
            onClick={() => setpassword(value => !value)}
            />
            :""
        }
        </div>
        </>
       );
}

export default InputBox