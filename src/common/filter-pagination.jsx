import axios from "axios";

const filterPaginationData = async({ create_new_arr = false, state, data, page, countRoute, 
    data_to_send={ } }) =>{
    
    const serverUrl = "http://localhost:3000";

    let obj;
    if( state!=null && !create_new_arr ){
            obj = { ...state, results: [...state.results, ...data ], page:page }
    }else{
        await axios.post(serverUrl+ countRoute, data_to_send)
        .then(({ data: { totalDocs }}) => {
            obj = { results: data, page:1, totalDocs }
        }).catch(error =>{
            console.log(error)
        })
    }

    return obj;


}


export default filterPaginationData;