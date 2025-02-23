"use client";
import Login from "@/components/Login";
import { HeroUIProvider } from "@heroui/react";
import React from "react";

const page = () => {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">

        <Login />
      </div>
    </>
  );
};

export default page;
