import axios from 'axios';
import Cookies from "js-cookie";
import { apiUrlForRequest } from '@/lib/apiHelper'
const PROD_ENDPOINT = 'https://hostel-saathi-backend.onrender.com'
const LOCAL_ENDPOINT = 'http://localhost:4000'
const apiURL = `${apiUrlForRequest(false, LOCAL_ENDPOINT, PROD_ENDPOINT)}/`;
const axiosInstance = axios.create({
    baseURL: apiURL,
});


export const loginAdmin = async (body) => {
    try {
        const response = await axiosInstance.post(`api/v1/admin/login`, body, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.NEXT_PUBLIC_xApiKey,
            },
        });
        return response.data;
    } catch (err) {
        console.error('Error during login:', err);
        alert(err.response?.data?.message || "Something went wrong!")
        throw err;
    }
};


export const getAdminList = async (pageNumber, pageSize) => {
    try {
        const params = new URLSearchParams();
        params.append('pageSize', pageSize);
        params.append('pageNumber', pageNumber);

        const token = Cookies.get("accessToken");
        const response = await axiosInstance.get(`api/v1/admin/all?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (err) {
        console.error('Error during login:', err);
        alert(err.response?.data?.message || "Something went wrong!")
        throw err;
    }
};


export const registerAdmin = async (body) => {
    try {
        const token = Cookies.get("accessToken");
        const response = await axiosInstance.post(`api/v1/admin/register`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
                'x-api-key': process.env.NEXT_PUBLIC_xApiKey,
            }
        });
        return response.data;
    } catch (err) {
        console.error('Error during registration:', err);
        alert(err.response?.data?.message || "Something went wrong!")
        throw err;
    }
};

export const logoutAdmin = async () => {
    try {
        const token = Cookies.get("accessToken");
        const response = await axiosInstance.post(`api/v1/admin/logout`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (err) {
        console.error('Error during registration:', err);
        alert(err.response?.data?.message || "Something went wrong!")
        throw err;
    }
};
