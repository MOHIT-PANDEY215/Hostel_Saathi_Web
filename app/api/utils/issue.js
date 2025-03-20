import axios from 'axios';
import Cookies from 'js-cookie';
import { apiUrlForRequest } from '@/lib/apiHelper';

const PROD_ENDPOINT = 'https://hostel-saathi-backend.onrender.com';
const LOCAL_ENDPOINT = 'http://localhost:4000';
const apiURL = `${apiUrlForRequest(false, LOCAL_ENDPOINT, PROD_ENDPOINT)}/api/v1/issue`;

const axiosInstance = axios.create({
  baseURL: apiURL,
});

export const getAllIssues = async (page) => {
  try {
    const token = Cookies.get('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }

    const response = await axiosInstance.get(`/all?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching issues:', error);
    throw error;
  }
};

export const submitIssue = async (issueData, files) => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) {
      throw new Error("No access token found");
    }

    const formData = new FormData();
    formData.append("title", issueData.title);
    formData.append("description", issueData.description);
    formData.append("hostelNumber", issueData.hostelNumber);
    formData.append("tags", issueData.tags ? issueData.tags.split(",").map((tag) => tag.trim()).join(",") : "");
    formData.append("status", "pending");
    formData.append("isCompleted", "false");

    files.forEach((file) => {
      formData.append("issueImage", file);
    });

    const response = await axiosInstance.post("/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting issue:", error);
    throw error;
  }
};
