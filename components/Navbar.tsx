"use client";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { logoutStudent } from "@/app/api/utils/student";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/app/api/utils/admin";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("accessToken"));
  }, []);

  const handleLogOut = async () => {
    console.log(pathname);
    try {
      let res;
      if (pathname.includes("admin")) {
        res = await logoutAdmin();
      } else {
        res = await logoutStudent();
      }
      Cookies.remove("accessToken");
      Cookies.remove("role");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="p-4 bg-gray-400 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">Hostel Saathi</div>

        {/* Desktop Logout Button */}
        {isLoggedIn && (
          <div className="hidden md:flex">
            <button
              className="bg-red-500 px-4 py-2 flex items-center gap-2 rounded-md hover:bg-red-600 transition"
              onClick={handleLogOut}
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-slate-700 p-4 rounded-md">
          <button className="bg-red-500 px-4 py-2 flex items-center gap-2 rounded-md hover:bg-red-600 transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
