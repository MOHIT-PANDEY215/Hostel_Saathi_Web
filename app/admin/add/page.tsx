"use client";

import { registerAdmin } from "@/app/api/utils/admin";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AdminFormData {
    fullName: string;
    username: string;
    mobileNumber: string;
    hostelNumber: string;
    password: string;
}



const Page = () => {
    const router = useRouter()
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
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
        try {
            setLoading(true)
            const res=await registerAdmin(registerData)
            setLoading(false)
            if(res){
                router.push('/admin/dashboard');
            }
        } catch (error) {
            setLoading(false)
            console.log(error)
        }

    };


    return (

        <div className="md:p-12 flex flex-col gap-12">
            <div className="flex justify-between bg-[#343a40] w-[100%] p-3 rounded">
                <div className="text-3xl text-white text-centerflex  align-center justify-center">Register new Admin</div>
                <div className="text-3xl text-white text-center">
                </div>
            </div>
            <Loader loading={loading} />
            <div className="flex justify-center align-center">
                <div className="bg-[#343a40] rounded-lg shadow-lg p-6 w-[100%] max-w-md relative">


                    {/* <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
                    ✖
                </button> */}


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
        </div>

    );
};

export default Page;
