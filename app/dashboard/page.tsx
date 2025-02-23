"use client";

import React from "react";
import IssueForm from "@/components/Dashboard/IssueForm";
import IssuesCard from "@/components/Dashboard/IssuesCard";


const page = () => {

  return (
    <div className="p-6">
      <p className='text-3xl text-white text-center'>Issue Dashboard</p>
      <div className="flex flex-col-reverse md:grid md:grid-cols-[2fr_1fr] pt-6 gap-10">
        <IssuesCard />
        <IssueForm />
      </div>
    </div>

  );
};

export default page;