import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, CardFooter, Divider, Button } from "@heroui/react";
import Cookies from "js-cookie";
import axios from 'axios';
import { useRouter } from "next/navigation";

const IssuesCard = () => {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getIssues = async (pageNum = 1) => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(`https://hostel-saathi-backend.onrender.com/api/v1/issue/all?page=${pageNum}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(response.data.data.ref);
      setTotalPages(response.data.data.totalPages);
      setPage(response.data.data.currentPage);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  return (
    <div className='p-6 backdrop-brightness-50 rounded-2xl overflow-hidden'>
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <Card key={issue._id} className="max-w-[400px] shadow-lg">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-md font-bold">{issue.title}</p>
                  <p className="text-small text-gray-400">Hostel: {issue.hostelNumber}</p>
                </div>
              </CardHeader>
              <Divider />
              <CardBody>
                <p className="text-gray-200">Description:</p>
                <p className="text-gray-300">{issue.description}</p>
              </CardBody>
              <Divider />
              <CardFooter className="flex justify-between">
                <p className="text-xs text-gray-500">Status: {issue.status}</p>
                <Button size="sm" variant="flat">View Details</Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p>No issues found.</p>
        )}

        {/* Pagination Controls */}

      </div>
      <div className="flex gap-3 mt-5">
        <Button
          disabled={page === 1}
          onClick={() => getIssues(page - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages}
          onClick={() => getIssues(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default IssuesCard;
