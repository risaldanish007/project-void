import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://void-server-bwya.onrender.com',
    headers:{
        'Content-Type' : 'application/json',
    }
})

export default apiClient;