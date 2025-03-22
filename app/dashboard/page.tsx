"use client";

import React, { useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import IssueForm from "@/components/Dashboard/IssueForm";
import IssuesCard from "@/components/Dashboard/IssuesCard";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Button } from "@mui/material";

const Page = () => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [selectedFilters, setSelectedFilters] = useState([]);
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys),
    [selectedKeys]
  );

  const [filters, setFilters] = useState(false);
  const handleApplyFilters = () => {
    setFilters(false);
    setSelectedFilters(selectedValue);
  };
  const [hostelNo, setHostelNo] = useState(14);

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
                key={hostelNo}
                className="cursor-default"
                endContent={
                  <select
                    className="z-10 outline-none w-16 py-0.5 rounded-md text-tiny group-data-[hover=true]:border-default-500 border-small border-default-300 dark:border-default-200 bg-transparent text-default-500"
                    id="hostelNumber"
                    name="hostelNumber"
                    value={hostelNo}
                    onChange={(e) => {
                      const hostelValue = parseInt(e.target.value, 10);
                      setHostelNo(hostelValue);

                      setSelectedKeys((prevKeys) => {
                        const newKeys = new Set(prevKeys);

                        for (let key of newKeys) {
                          if (key.startsWith("hostel-")) {
                            newKeys.delete(key);
                          }
                        }

                        // Add new hostel selection
                        newKeys.add(`hostel-${hostelValue}`);

                        return newKeys;
                      });

                      setFilters(true);
                    }}
                  >
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
        <IssuesCard selectedFilters={selectedFilters} />
        <IssueForm />
      </div>
    </div>
  );
};

export default Page;
