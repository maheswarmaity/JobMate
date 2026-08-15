import axios from "axios";

const API = axios.create({
    baseURL: "https://jobmate-backend-g3i7.onrender.com"
});

export default API;