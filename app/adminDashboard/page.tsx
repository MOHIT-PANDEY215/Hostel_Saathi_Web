"use client";

import React, { useEffect, useState } from "react";
import { getAdminList, registerAdmin } from "../api/utils/admin";
import AdminCard from "@/components/admin/AdminCard";
import { Button, Pagination } from "@heroui/react";
import AdminRegisterModal from "@/components/admin/AdminRegisterModal";
import SkeletonCard from "@/components/admin/Skeleton";

interface Admin {
    _id: string;
    fullName: string;
    username: string;
    mobileNumber: string;
    hostelNumber: number;
    userRole: "admin";
    password: string;
    createdAt: string;
    updatedAt: string;
}

const Page = () => {
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [adminList, setAdminList] = useState<Admin[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const getAdminListFunction = async () => {
        try {
            setLoading(true);
            const res = await getAdminList(pageNumber, pageSize);
            setTotalPages(res?.data?.totalPages)
            setAdminList(res?.data?.ref);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const handleChangePagination = (value: number) => {
        setPageNumber(value);
    };

    const adminRegisterFunction = async (registerData: any) => {
        try {
            const res = await registerAdmin(registerData)
            setIsModalOpen(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getAdminListFunction();
    }, [pageNumber]);

    return (
        <div className="md:p-12 flex flex-col gap-12">
            <div className="flex justify-between bg-[#343a40] w-[100%] p-3 rounded">
                <div className="text-3xl text-white text-center">Admin List</div>
                <div className="text-3xl text-white text-center">
                    <Button onClick={() => setIsModalOpen(true)}>
                        Add Admin
                    </Button>
                </div>
            </div>
            <div className="flex  flex-wrap gap-5 p-3 align-center justify-center">
                {
                    adminList.length > 0 && !loading ?
                        adminList.map((ele) => (
                            <AdminCard key={ele._id} admin={ele} />
                        )) :
                        <div className="flex flex-wrap gap-5 align-center justify-center">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                }
            </div>
            <Pagination
                page={pageNumber}
                total={totalPages}
                onChange={handleChangePagination}
            />

            <AdminRegisterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} adminRegisterFunction={adminRegisterFunction} />
        </div>
    );
};

export default Page;
