import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalContent,
} from "@heroui/react";
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";

const IssuesCard = () => {
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getIssues = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await axios.get(
        `https://hostel-saathi-backend.onrender.com/api/v1/issue/all?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(response.data.data.ref);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    getIssues();
  }, [page]);

  const openModal = (issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedIssue(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="p-6 backdrop-brightness-50 rounded-2xl">
        {isModalOpen && selectedIssue && (
          <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            placement="center"
            backdrop="blur"
            className="z-50"
          >
            <ModalContent>
              <ModalHeader>{selectedIssue?.title}</ModalHeader>
              <ModalBody>
                <p>
                  <strong>Hostel:</strong> {selectedIssue?.hostelNumber}
                </p>
                <p>
                  <strong>Description:</strong> {selectedIssue?.description}
                </p>
                <p>
                  <strong>Status:</strong> {selectedIssue?.status}
                </p>
                <p>
                  <strong>Priority:</strong> {selectedIssue?.priority}
                </p>
                <p>
                  <strong>Raised By:</strong> {selectedIssue?.raisedBy.fullName} (
                  {selectedIssue?.raisedBy.userRole})
                </p>
                {selectedIssue?.assignedTo && (
                  <>
                    <p>
                      <strong>Assigned To:</strong> {selectedIssue?.assignedTo.fullName} (
                      {selectedIssue?.assignedTo.role})
                    </p>
                    <p>
                      <strong>Assigned By:</strong> {selectedIssue?.assignedBy.fullName}
                    </p>
                    <p>
                      <strong>Date Assigned:</strong>{" "}
                      {new Date(selectedIssue?.dateAssigned).toLocaleString()}
                    </p>
                    {selectedIssue?.isCompleted && (
                      <p>
                        <strong>Completed On:</strong>{" "}
                        {new Date(selectedIssue?.dateCompleted).toLocaleString()}
                      </p>
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onClick={closeModal}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
          {issues.length > 0 ? (
            issues.map((issue) => (
              <Card key={issue._id} className="max-w-[400px] shadow-lg">
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md font-bold">{issue.title}</p>
                    <p className="text-small text-gray-400">
                      Hostel: {issue.hostelNumber}
                    </p>
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
                  <Button size="sm" variant="flat" onClick={() => openModal(issue)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <p>No issues found.</p>
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex gap-3 mt-5">
          <Button disabled={page === 1} onPress={() => setPage(page - 1)}>
            Previous
          </Button>
          <Button disabled={page === totalPages} onPress={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default IssuesCard;
