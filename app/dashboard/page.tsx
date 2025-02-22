"use client";
import React, { useEffect, useState } from "react";

const page = () => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => {
      setMounted(true);
    }, []);
  
    if (!mounted) return null;
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        
        Dashboafrd
      </div>
    </>
  );
};

export default page;
