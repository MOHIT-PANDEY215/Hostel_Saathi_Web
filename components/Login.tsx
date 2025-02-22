"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Tab, Input, Link, Button, Card, CardBody } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import {loginStudent} from '@/app/api/utils/student'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation';

interface StudentFormData {
  regNo: string;
  password: string;
  fullName: string;
  hostelNumber: string;
  mobileNumber: string;
}

interface AdminFormData {
  username: string;
  password: string;
}

interface FormData {
  student: StudentFormData;
  admin: AdminFormData;
}

export default function Login() {
  const router = useRouter()
  const [selected, setSelected] = useState<"student" | "admin">("student");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [status, setStatus] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string>("");

  const [mounted, setMounted] = useState<boolean>(false);

  

  const [formData, setFormData] = useState<FormData>({
    student: {
      regNo: "",
      password: "",
      fullName: "",
      hostelNumber: "",
      mobileNumber: "",
    },
    admin: {
      username: "",
      password: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    role: "student" | "admin"
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [role]: { ...prev[role], [name]: value },
    }));
    setError("");
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>,
    role: "student" | "admin"
  ) => {
    e.preventDefault();

    if (role === "student") {
      const { regNo, password } = formData.student;
      if (!regNo || !password) {
        setError("All fields are required.");
        return;
      }
      const loginData={
        registrationNumber:regNo,
        password:password
      }
      const res = await loginStudent(loginData)
      if(res){
        Cookies.set('accessToken',res?.data?.accessToken)
        router.push('/dashboard')
      }
      console.log("Student Login:", formData.student);
    } else {
      const { username, password } = formData.admin;
      if (!username || !password) {
        setError("All fields are required.");
        return;
      }
      console.log("Admin Login:", formData.admin);
    }

    resetForm(role);
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { fullName, regNo, password, hostelNumber, mobileNumber } =
      formData.student;

    if (!fullName || !regNo || !password || !hostelNumber || !mobileNumber) {
      setError("All fields are required.");
      return;
    }

    console.log("Student Signup:", formData.student);
    resetForm("student");
    setStatus("login");
  };

  const resetForm = (role: "student" | "admin") => {
    setFormData((prev) => ({
      ...prev,
      [role]:
        role === "student"
          ? {
              regNo: "",
              password: "",
              fullName: "",
              hostelNumber: "",
              mobileNumber: "",
            }
          : { username: "", password: "" },
    }));
    setError("");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col items-center w-full mt-10">
      <Card className="max-w-full w-[340px] shadow-lg">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            size="md"
            onSelectionChange={(key) => setSelected(key as "student" | "admin")}
          >
            <Tab key="student" title="Student">
              {status === "login" ? (
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(e) => handleLogin(e, "student")}
                >
                  <Input
                    isRequired
                    label="Reg. No"
                    name="regNo"
                    placeholder="Enter your Registration No."
                    type="text"
                    value={formData.student.regNo}
                    onChange={(e) => handleChange(e, "student")}
                  />
                  <Input
                    isRequired
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={formData.student.password}
                    onChange={(e) => handleChange(e, "student")}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    }
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <p className="text-center text-small">
                    Need an account?{" "}
                    <Link
                      className="cursor-pointer"
                      size="sm"
                      onPress={() => setStatus("signup")}
                    >
                      Sign Up
                    </Link>
                  </p>
                  <Button type="submit" fullWidth color="primary">
                    Login
                  </Button>
                </form>
              ) : (
                <form className="flex flex-col gap-4" onSubmit={handleSignup}>
                  <Input
                    isRequired
                    label="Full Name"
                    name="fullName"
                    placeholder="Enter your Full Name"
                    type="text"
                    value={formData.student.fullName}
                    onChange={(e) => handleChange(e, "student")}
                  />
                  <Input
                    isRequired
                    label="Reg. No"
                    name="regNo"
                    placeholder="Enter your Registration No."
                    type="text"
                    value={formData.student.regNo}
                    onChange={(e) => handleChange(e, "student")}
                  />
                  <Input
                    isRequired
                    label="Password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={formData.student.password}
                    onChange={(e) => handleChange(e, "student")}
                    endContent={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {!showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    }
                  />
                  <Input
                    isRequired
                    label="Hostel No."
                    name="hostelNumber"
                    placeholder="Enter your Hostel No."
                    type="text"
                    value={formData.student.hostelNumber}
                    onChange={(e) => handleChange(e, "student")}
                  />
                  <Input
                    isRequired
                    label="Mobile Number"
                    name="mobileNumber"
                    placeholder="Enter your Mobile No."
                    type="text"
                    value={formData.student.mobileNumber}
                    onChange={(e) => handleChange(e, "student")}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <p className="text-center text-small">
                    Already have an account?{" "}
                    <Link
                      className="cursor-pointer"
                      size="sm"
                      onPress={() => setStatus("login")}
                    >
                      Login
                    </Link>
                  </p>
                  <Button type="submit" fullWidth color="primary">
                    Signup
                  </Button>
                </form>
              )}
            </Tab>

            <Tab key="admin" title="Admin">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => handleLogin(e, "admin")}
              >
                <Input
                  isRequired
                  label="Username"
                  name="username"
                  placeholder="Enter your username"
                  type="text"
                  value={formData.admin.username}
                  onChange={(e) => handleChange(e, "admin")}
                />
                <Input
                  isRequired
                  label="Password"
                  name="password"
                  endContent={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                  }
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={formData.admin.password}
                  onChange={(e) => handleChange(e, "admin")}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button type="submit" fullWidth color="primary">
                  Login
                </Button>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
