import axios from 'axios';
import { apiUrlForRequest } from '@/lib/apiHelper'
const PROD_ENDPOINT = 'https://hostel-saathi-backend.onrender.com'
const LOCAL_ENDPOINT = 'http://localhost:4000'
const apiURL = `${apiUrlForRequest(false, PROD_ENDPOINT, LOCAL_ENDPOINT)}/`;
const axiosInstance = axios.create({
  baseURL: apiURL,
});

export const createUpdateIssue = async (body) => {
  try {
    const response = await axiosInstance.post(`/api/v1/issue`, body, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_xApiKey,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}