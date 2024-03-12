import { Link } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import { getFullDay } from "../common/date";

const AboutUser = ({ className: classa, bio, social_links, joinedAt }) =>{
    return (
    <>
    <div className={"md:w-[90%] md:mt-7 " + classa}>
        <p className="text-xl leading-7">
          { bio.length ? bio : "Nothing to display " } 
        </p>
        {/* <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
           {
            Object.keys(social_links).map((key) => {
                let link = social_links[key];

                return link ? <Link to={link} key={key} target="_blank">
               {
                key!='website' ? <{key} +{Icon}/> : LanguageIcon 
               }
                </Link> : " "
            })
           }
        </div> */}

        <p className="text-xl leading-7 text-dark-grey">
            Joined on {getFullDay(joinedAt)}
        </p>

    </div>
    
    </>)
}

export default AboutUser;