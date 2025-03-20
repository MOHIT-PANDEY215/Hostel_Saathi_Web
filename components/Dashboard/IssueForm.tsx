import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Form, Input, Button } from "@heroui/react";
import { submitIssue } from "@/app/api/utils/issue";

interface IssueFormData {
  title: string;
  description: string;
  hostelNumber: string;
  tags?: string;
  status?: string;
  isCompleted?: boolean;
}

const IssueForm: React.FC = () => {
  const [errors, setErrors] = useState<{ general?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const router = useRouter();

  // Form State
  const [formValues, setFormValues] = useState<IssueFormData>({
    title: "",
    description: "",
    hostelNumber: "",
    tags: "",
  });

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

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!formValues.title || !formValues.description || !formValues.hostelNumber) {
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

      const requestBody: IssueFormData = {
        ...formValues,
        tags: formValues.tags ? formValues.tags.split(",").map((tag) => tag.trim()).join(",") : "",
        status: "pending",
        isCompleted: false,
      };

      const response = await submitIssue(requestBody);

      if (response.status === 200) {
        setFormValues({
          title: "",
          description: "",
          hostelNumber: "",
          tags: "",
        });
      } else {
        setErrors({ general: response.message || "Something went wrong" });
      }
    } catch (error) {
      setErrors({ general: "Failed to connect to the server" });
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Form
      className="w-full max-w-md flex flex-col gap-3 p-6 backdrop-brightness-50 rounded-2xl overflow-hidden"
      validationErrors={errors}
      onSubmit={onSubmit}
    >
      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}

      <Input
        label="Title"
        labelPlacement="outside"
        name="title"
        placeholder="Enter issue title"
        value={formValues.title}
        onChange={handleChange}
        required
      />
      <Input
        label="Description"
        labelPlacement="outside"
        name="description"
        placeholder="Describe the issue"
        value={formValues.description}
        onChange={handleChange}
        required
      />
      <Input
        label="Hostel Number"
        labelPlacement="outside"
        name="hostelNumber"
        placeholder="Hostel Number"
        value={formValues.hostelNumber}
        onChange={handleChange}
        required
      />
      <Input
        label="Tags (comma-separated)"
        labelPlacement="outside"
        name="tags"
        placeholder="electricity, sanitation, etc."
        value={formValues.tags}
        onChange={handleChange}
      />

      <Button type="submit" variant="flat" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  );
};

export default IssueForm;
