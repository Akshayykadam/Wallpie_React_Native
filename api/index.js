import axios from "axios";

const API_KEY ='45129367-a3ab32ab278cd966774a3e10e';

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`;

const formatUrl =(param) => { //{q, page, category, order}
    let url = apiUrl + "&per_page=25&safesearch=true&editor_choice=true"

    if(!param) return url;

    let paramKeys = Object.keys(param);
    paramKeys.map(key =>{
        let value = key =='q' ? encodeURIComponent(param[key]) : param[key];
        url += `&${key}=${value}`;
    });
    console.log('url: ' + url);
    return url;
}

export const apiCall = async(param) =>{
    try {
        const response = await axios.get(formatUrl(param))
        const {data} = response;
        return {success: true, data}
    } catch (error) {
        console.log('Something Went Wrong: ',error.message);
        return {success: false, error: error.message};
    }
}