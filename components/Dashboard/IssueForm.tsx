import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Avatar, useDisclosure } from "@heroui/react";
import { submitIssue } from "@/app/api/utils/issue";
import ImageModal from "./ImageModal";
import { Trash2 } from "lucide-react";

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
  const [files, setFiles] = useState<File[]>([]);
  const [image, setImage] = useState({
    title: '',
    src: ''
  })
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // Form State
  const [formValues, setFormValues] = useState<IssueFormData>({
    title: "",
    description: "",
    hostelNumber: "",
    tags: "",
  });

  useEffect(() => {
    setMounted(true);
    const storedUsername = Cookies.get("accessToken") || null;
    const storedRole = Cookies.get("role") || null;

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const uniqueFiles = newFiles.filter(
        (newFile) => !files.some((existingFile) =>
          existingFile.name === newFile.name && existingFile.size === newFile.size
        )
      );

      if (uniqueFiles.length !== newFiles.length) {
        alert("This file was already uploaded!");
      }

      setFiles((prev) => [...prev, ...uniqueFiles]);
    }
  };

  const handleImageClick = (name: string, src: string) => {
    setImage({ title: name, src });
    onOpen();
  };
  const handleDeleteFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

      const response = await submitIssue(requestBody, files);

      if (response.status === 200) {
        setFormValues({ title: "", description: "", hostelNumber: "", tags: "" });
        setFiles([]);
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
      {errors.general && (
        <p className="text-red-500 text-sm">{errors.general}</p>
      )}

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

      <div className="flex flex-col gap-2 items-center justify-center w-full">
        <p className="self-start">Upload Images</p>
        <div className="self-start flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <Avatar
                showFallback
                name={file.name.substring(0, 2).toUpperCase()}
                className="bg-[#05686E] text-white border-white border-2 h-16 w-16 rounded-md"
                src={URL.createObjectURL(file)}
                onClick={() => handleImageClick(file.name, URL.createObjectURL(file))}
              />

              <button
                onClick={() => handleDeleteFile(index)}
                className="absolute top-[-10px] right-[-10px] bg-white rounded-full  p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Trash2 size={16} color="red" />
              </button>
            </div>
          ))}
        </div>

        {
          image?.src &&
          <ImageModal isOpen={isOpen} onOpenChange={onOpenChange} title={image?.title} src={image.src} />
        }
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-[#27272a] hover:bg-[#45454b]"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              aria-hidden="true"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, or GIF</p>
          </div>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleFileUpload}
          />
        </label>
      </div>

      <Button type="submit" variant="flat" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  );
};

export default IssueForm;
