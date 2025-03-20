"use client";
import Login from "@/components/Login";
import { HeroUIProvider } from "@heroui/react";
import React from "react";

const page = () => {
  return (
    <div className="relative h-screen w-full">
    {/* Background Image with Overlay */}
    <div className="absolute inset-0 bg-[url('/bitSindri.webp')]  bg-no-repeat bg-cover before:absolute before:inset-0 before:bg-black before:opacity-50"></div>
    
    {/* Centered Login Component */}
    <div className="relative flex items-center justify-center h-full ">
      <Login />
    </div>
  </div>
  
  );
};

export default page;
