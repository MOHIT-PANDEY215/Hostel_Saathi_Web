"use client";

import { registerAdmin } from "@/app/api/utils/admin";
import { useState } from "react";

interface AdminFormData {
    fullName: string;
    username: string;
    mobileNumber: string;
    hostelNumber: string;
    password: string;
}

interface AdminRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    adminRegisterFunction: (registerData: any) => Promise<void>;
}

const AdminRegisterModal: React.FC<AdminRegisterModalProps> = ({ isOpen, onClose, adminRegisterFunction }) => {
    const [error, setError] = useState<string>("");
    const [formData, setFormData] = useState<AdminFormData>({
        fullName: "",
        username: "",
        mobileNumber: "",
        hostelNumber: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Admin Data:", formData);
        const { fullName, username, mobileNumber, hostelNumber, password } = formData;
        if (!hostelNumber || !password || !username || !mobileNumber || !fullName) {
            setError("All fields are required.");
            return;
        }
        const registerData = {
            fullName: fullName,
            password: password,
            username: username,
            mobileNumber: mobileNumber,
            hostelNumber: hostelNumber,
        }

        await adminRegisterFunction(registerData)
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black 
        w-[100%] bg-opacity-50 z-50">
            <div className="bg-[#343a40] rounded-lg shadow-lg p-6 w-[100%] max-w-md relative">


                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    ✖
                </button>


                <h2 className="text-xl font-bold mb-4 text-center">Register Admin</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="fullName" placeholder="Full Name" className="w-full p-2 border rounded" onChange={handleChange} required />
                    <input type="text" name="username" placeholder="Username" className="w-full p-2 border rounded" onChange={handleChange} required />
                    <input type="text" name="mobileNumber" placeholder="Mobile Number" className="w-full p-2 border rounded" onChange={handleChange} required />
                    <input type="number" name="hostelNumber" placeholder="Hostel Number" className="w-full p-2 border rounded" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded" onChange={handleChange} required />

                    <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-grey-900">
                        Register Admin
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegisterModal;
