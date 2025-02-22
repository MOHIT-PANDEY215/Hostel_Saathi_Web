import axios from 'axios';
import {apiUrlForRequest} from '@/lib/apiHelper'
const PROD_ENDPOINT='https://hostel-saathi-backend.onrender.com'
const LOCAL_ENDPOINT='http://localhost:4000'
const apiURL = `${apiUrlForRequest(false,LOCAL_ENDPOINT,PROD_ENDPOINT)}/`;
const axiosInstance = axios.create({
    baseURL: apiURL,
  });

export const loginStudent = async (body) => {
  try {
    const response = await axiosInstance.post(`api/v1/student/login`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_xApiKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error; 
  }
};
