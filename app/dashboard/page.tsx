"use client";

import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import IssueForm from "@/components/Dashboard/IssueForm";
import IssuesCard, { IssueData } from "@/components/Dashboard/IssuesCard";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getAllIssues } from "../api/utils/issue";

const Page = () => {
  const router = useRouter();
  
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [hostelNumber, setHostelNumber] = useState<number | null>(null);
  const [pageSize, setPageSize] = useState<number>(4);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isAssigned, setIsAssigned] = useState<boolean>(false);
  const [issues, setIssues] = useState<IssueData[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [filters, setFilters] = useState<boolean>(false);

  const selectedValue = React.useMemo(() => Array.from(selectedKeys), [selectedKeys]);

  const handleApplyFilters = () => {
    setFilters(false);
    setSelectedFilters(selectedValue);
  };
  const getIssues = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await getAllIssues(
        page,
        pageSize,
        isCompleted,
        isAssigned,
        hostelNumber || undefined
      );

      setIssues(response.ref);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };
  console.log(selectedFilters);
  useEffect(() => {
    setIsCompleted(selectedFilters?.includes("isCompleted"));
    setIsAssigned(selectedFilters?.includes("isAssigned"));
  }, [selectedFilters]);

  useEffect(() => {
    if (selectedFilters?.length > 0) {
      const hostelNumber = selectedFilters
        ?.find((item: any) => item.startsWith("hostel-"))
        ?.split("-")[1];
      if (hostelNumber) setHostelNumber(Number(hostelNumber));
    }
  }, []);

  useEffect(() => {
    getIssues();
  }, [isCompleted, isAssigned, hostelNumber, page, selectedFilters]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center w-full md:w-[60%]">
        <p className="text-xl font-semibold text-white text-left ml-8 md:text-3xl">
          Issue Dashboard
        </p>
        <div className="flex flex-col gap-4 relative">
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center cursor-pointer gap-2 text-lg font-semibold text-white">
                <span>Filters</span>
                <FilterAltIcon className="w-5 h-5 text-white" />
              </button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection={false}
              aria-label="Multiple selection example"
              closeOnSelect={false}
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              variant="flat"
              onSelectionChange={(keys: any) => {
                setSelectedKeys(keys);
                setFilters(true);
              }}
            >
              <DropdownItem key="isCompleted">Completed</DropdownItem>
              <DropdownItem key="isPending">Pending</DropdownItem>
              <DropdownItem key="isAssigned">Assigned</DropdownItem>
              <DropdownItem
                isReadOnly
                key={`${hostelNumber}`}
                className="cursor-default"
                endContent={
                  <select
                    className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                    id="hostelNumber"
                    name="hostelNumber"
                    value={hostelNumber ?? ""}
                    onChange={(e) => {
                      const hostelValue =
                        e.target.value === "All"
                          ? null
                          : parseInt(e.target.value, 10);
                      setHostelNumber(hostelValue);

                      setSelectedKeys((prevKeys) => {
                        const newKeys = new Set(prevKeys);

                        for (let key of newKeys) {
                          if (key.startsWith("hostel-")) {
                            newKeys.delete(key);
                          }
                        }

                        // Add new hostel selection
                        if (hostelValue !== null)
                          newKeys.add(`hostel-${hostelValue}`);

                        return newKeys;
                      });

                      setFilters(true);
                    }}
                  >
                    <option>All</option>
                    <option>20</option>
                    <option>14</option>
                    <option>18</option>
                  </select>
                }
              >
                Hostel Number
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {filters && (
            <div className="flex justify-center absolute top-[12rem] z-[1000] md:left-[-2rem] left-[-5rem] w-[150px] items-center gap-2 bg-gray-700 p-2 rounded-md text-white text-sm">
              <Button
                sx={{ color: "white", borderColor: "white" }}
                variant="outlined"
                size="small"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col-reverse md:grid md:grid-cols-[2fr_1fr] pt-6 gap-10">
        <IssuesCard
          selectedFilters={selectedFilters}
          issues={issues}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
        />
        <IssueForm />
      </div>
    </div>
  );
};

export default Page;
