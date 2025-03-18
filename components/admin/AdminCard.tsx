import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Divider, Button } from "@heroui/react";
interface Admin {
  _id: string;
  fullName: string;
  username: string;
  hostelNumber: number;
  mobileNumber: string;
  userRole: string;
  createdAt: string;
  updatedAt: string;
}

const AdminCard: React.FC<{ admin: Admin }> = ({ admin }) => {
  return (
    <Card key={admin?._id} className="min-w-[300px] max-w-[500px] shadow-lg">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md font-bold">{admin?.fullName}</p>
          <p className="text-small text-gray-400">Hostel: {admin?.hostelNumber}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p className="text-gray-200">Phone Number:</p>
        <p className="text-gray-300">{admin?.mobileNumber}</p>
      </CardBody>
      <Divider />
      <CardFooter className="flex justify-between">
        <p className="text-xs text-gray-500">UserName: {admin?.username}</p>
        <Button size="sm" variant="flat">View Details</Button>
      </CardFooter>
    </Card>
  );
};

export default AdminCard;
