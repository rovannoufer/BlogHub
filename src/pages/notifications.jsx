import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import filterPaginationData from "../common/filter-pagination";
import Loader from "../components/loader";
import NoDaTaMessage from "../components/nodata";
import NotificationCard from "../components/notificationcard";
import LoadMoreDataButton from "../components/loadmoredatabutton";

const Notification = () => {
    let { userAuth, setUserAuth, userAuth: { access_token, new_notification_avaialble } } = useContext(UserContext); 

    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null);

    let filters = ['all'];
    const serverUrl = "http://localhost:3000";

    const fetchNotifications = ({ page, deletedDocCount = 0 }) => {
        axios.post(serverUrl + "/notifications", {
            page,
            filter,
            deletedDocCount
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(async ({ data: { notifications: data } }) => {

            if(new_notification_avaialble){
            setUserAuth({ ...userAuth, new_notification_avaialble: false })
            }
            let formatedData = await filterPaginationData({
                state: notifications,
                data,
                page,
                countRoute: "/all-notifications-count",
                data_to_send: { filter },
                user: access_token
            })
            setNotifications(formatedData);
            console.log(formatedData);
        }).catch(error => {
            console.log(error)
        })
    }

    const handleFilter = (e) => {
        let btn = e.target;
        let filterName = btn.innerHTML;
        
        console.log( filterName);
        setFilter(filterName);
        console.log(filter);
    }

    useEffect(() => {
        if (access_token) {
            fetchNotifications({ page: 1 });
        }
    }, [filter, access_token]);

    return (
        <div>
            <h1 className="max-md:hidden">Recent Notification</h1>

            <div className="my-8 flex gap-6">
                {filters.map((filterName, i) => (
                    <button key={i} className={"py-2 " + (filter === filterName ? "btn-dark" : "btn-light")}
                        onClick={(e) => handleFilter(e)}
                    >
                        {filterName}
                    </button>
                ))}
            </div>

            {
                notifications == null ? <Loader/> : 
                <>
                  {
                    notifications.results.length ? notifications.results.map((notification,i) =>{
                        return <div key={i}> <NotificationCard  data={notification} index={i} notificationState={{ notifications, setNotifications }}/> </div>
                    }) : <NoDaTaMessage message={"Nothing Available"}/>
                  }

                  <LoadMoreDataButton state={notifications} fetchDataFun={fetchNotifications} additionalParam = {{ deletedDocCount: notifications.deletedDocCount }}/>
                </>
            }

        </div>
    );
}

export default Notification;
