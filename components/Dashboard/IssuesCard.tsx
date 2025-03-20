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
  Avatar,
  useDisclosure,
} from "@heroui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { getAllIssues } from '@/app/api/utils/issue';
import ImageModal from "./ImageModal";


interface issueData {
  _id: string;
  title: string;
  hostelNumber: string;
  description: string;
  status: string;
  images: string[];
}

const IssuesCard = () => {
  const router = useRouter();
  const [issues, setIssues] = useState<issueData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIssue, setSelectedIssue] = useState<issueData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalImageURI, setModalImageURI] = useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [pageSize, setPageSize] = useState(4);


  const getIssues = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {

      const response = await getAllIssues(page, pageSize);

      setIssues(response.ref);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    getIssues();
  }, [page]);

  const openModal = (issue: issueData) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedIssue(null);
    setIsModalOpen(false);
  };


  const handleImageClick = (imageURI: string) => {
    setModalImageURI(imageURI);
    onOpen();
  }


  const handlePageChange = (page:any) => {
    setPage(page);
  };

  return (
    <>
      <div className="p-6 backdrop-brightness-50 rounded-2xl">
        {modalImageURI &&
          <ImageModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Photo"
            src={modalImageURI}
          />
        }
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
                {selectedIssue.images.map((imageURI: string) => (
                  <div key={imageURI} className="relative group">
                    <Avatar
                      showFallback
                      className="bg-[#05686E] text-white border-white border-2 h-16 w-16 rounded-md"
                      src={imageURI}
                      onClick={() => handleImageClick(imageURI)}
                    />
                  </div>
                ))}
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
                  <strong>Raised By:</strong> {selectedIssue?.raisedBy.fullName}{" "}
                  ({selectedIssue?.raisedBy.userRole})
                </p>
                {selectedIssue?.assignedTo && (
                  <>
                    <p>
                      <strong>Assigned To:</strong>{" "}
                      {selectedIssue?.assignedTo.fullName} (
                      {selectedIssue?.assignedTo.role})
                    </p>
                    <p>
                      <strong>Assigned By:</strong>{" "}
                      {selectedIssue?.assignedBy.fullName}
                    </p>
                    <p>
                      <strong>Date Assigned:</strong>{" "}
                      {new Date(selectedIssue?.dateAssigned).toLocaleString()}
                    </p>
                    {selectedIssue?.isCompleted && (
                      <p>
                        <strong>Completed On:</strong>{" "}
                        {new Date(
                          selectedIssue?.dateCompleted
                        ).toLocaleString()}
                      </p>
                    )}
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <Button onPress={closeModal}>Close</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">
          {issues.length > 0 ? (
            issues.map((issue) => (

              <Card key={issue._id} className="max-w-[400px] shadow-lg h-[300px]">

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

                  <p className="text-xs text-gray-500">
                    Status: {issue.status}
                  </p>
                  <Button
                    size="sm"
                    variant="flat"
                    onClick={() => openModal(issue)}
                  >

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

        <div className="flex gap-3 mt-8">
          <Button disabled={page === 1} onPress={() => setPage(page - 1)}>
            Previous
          </Button>
          <div className="flex flex-col items-center">
            {/* Pagination Section */}
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <Button
                  key={index + 1}
                  onPress={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg border border-gray-300 ${
                    page === index + 1
                      ? "bg-gray-500 text-white"
                      : "bg-white text-gray-700"
                  } hover:bg-gray-400 hover:text-white transition`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
          <Button
            disabled={page === totalPages}
            onPress={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default IssuesCard;
