import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "@heroui/react";

const IssueForm = () => {
  const [errors, setErrors] = useState<{ general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const storedUsername = Cookies.get("accessToken");
    const storedRole = Cookies.get("role");

    if (!storedUsername) {
      router.push("/login");
    } else {
      setUsername(storedUsername);
      setRole(storedRole);
    }
  }, [router]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    const { title, description, hostelNumber, tags, status, isCompleted } = formData as {
      title: string;
      description: string;
      hostelNumber: string;
      tags: string;
      status: string;
      isCompleted: string;
    };

    // Validation
    if (!title || !description || !hostelNumber) {
      setErrors({ general: "Title, Description, and Hostel Number are required!" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const token = Cookies.get("accessToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const requestBody = {
        title,
        description,
        hostelNumber,
        tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
        status: "pending",
        isCompleted: false,
      };

      const response = await axios.post(
        "https://hostel-saathi-backend.onrender.com/api/v1/issue",
        requestBody,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setLoading(false);
        alert("Issue submitted successfully!");
        e.currentTarget.reset();
      } else {
        setErrors({ general: response.data.message || "Something went wrong" });
      }
    } catch (error) {
      setErrors({ general: "Failed to connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Form className="w-full max-w-md flex flex-col gap-3 p-6 backdrop-brightness-50 rounded-2xl overflow-hidden" validationErrors={errors} onSubmit={onSubmit}>
      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

      <Input label="Title" labelPlacement="outside" name="title" placeholder="Enter issue title" required />
      <Input label="Description" labelPlacement="outside" name="description" placeholder="Describe the issue" required />
      <Input label="Hostel Number" labelPlacement="outside" name="hostelNumber" placeholder="Hostel Number" required />
      <Input label="Tags (comma-separated)" labelPlacement="outside" name="tags" placeholder="electricity, sanitation, etc." />

      <Button type="submit" variant="flat" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  )
}

export default IssueForm