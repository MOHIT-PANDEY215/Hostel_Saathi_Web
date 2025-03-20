"use client";

import React, { useEffect, useState } from "react";
import { getAdminList, registerAdmin } from "../../api/utils/admin";
import AdminCard from "@/components/admin/AdminCard";
import { Button, Pagination } from "@heroui/react";
import SkeletonCard from "@/components/admin/Skeleton";
import MenuIcon from '@mui/icons-material/Menu';
import AdminDropdown from "@/components/admin/AdminDropdown";
import CloseIcon from '@mui/icons-material/Close';


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
    const [dropDown, setDropDown] = useState<boolean>(false);
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

    useEffect(() => {
        getAdminListFunction();
    }, [pageNumber]);

    return (
        <div className="md:p-12 flex flex-col gap-12">
            <div className="flex justify-between bg-[#343a40] w-[100%] p-3 rounded">
                <div className="text-3xl text-white text-center">Welcome to the Admin Panel</div>
                <div className="text-3xl text-white text-center">
                    {/* <Button onClick={() => setIsModalOpen(true)}>
                        Add Admin
                    </Button> */}
                    {
                        dropDown ? <CloseIcon onClick={() => setDropDown(prev => !prev)} /> : <MenuIcon onClick={() => setDropDown(prev => !prev)} />
                    }


                    {
                        dropDown &&
                        <AdminDropdown onClose={() => setDropDown(false)} />
                    }
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


        </div>
    );
};

export default Page;
