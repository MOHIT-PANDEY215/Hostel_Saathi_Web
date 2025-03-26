"use client";
import { useEffect, useRef, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LogoutIcon from "@mui/icons-material/Logout";
import Person2Icon from '@mui/icons-material/Person2';
import { user } from "@heroui/react";
import Cookies from "js-cookie";
import { logoutAdmin } from "@/app/api/utils/admin";
import { useRouter } from 'next/navigation';


interface AdminDropdownProps {
    onClose: () => void;
}

export default function AdminDropdown({ onClose }: AdminDropdownProps) {
    const router = useRouter()
    const dropdownRef = useRef(null);
    const [user, setUser] = useState()
    const [loading, setLoading] = useState<boolean>(false)

    const handleLogout = async () => {
        try {
            setLoading(true)
            const res = await logoutAdmin()
            onClose()
            Cookies.remove("accessToken");
            Cookies.remove("role");
            localStorage.removeItem("user");
            router.push("/login");
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                console.log(JSON.parse(storedUser))
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }

        function handleClickOutside(event: React.FormEvent<HTMLFormElement>) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                if (onClose) onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose])
    return (
        <div
            ref={dropdownRef}
            className="absolute right-10 mt-2 w-48  shadow-lg rounded-md border bg-[#1b263b] border-gray-200"
            style={{ zIndex: 9999 }}
        >
            {/* Profile Section */}
            <div className="flex items-left gap-3 p-4 border-b border-gray-200">
                <Person2Icon
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col align-left text-left">
                    <p className="text-sm font-medium">Admin</p>
                    <p className="text-xs text-gray-500">{user?.username}</p>
                </div>
            </div>

            {/* Menu Items */}
            <button
                onClick={() => router.push('/admin/add')}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 hover:text-black"
            >
                <PersonAddIcon fontSize="small" className="text-gray-600" />
                <div className="text-lg">
                    Add Admin
                </div>
            </button>

            {/* <button
                onClick={() => handleLogout()}
                className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-gray-100 hover:text-black"
            >
                <LogoutIcon fontSize="small" />
                <div className="text-lg">
                    Logout
                </div>

            </button> */}
        </div>
    );
}
