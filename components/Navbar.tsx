"use client"
import { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="p-4 bg-gray-400 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold">Hostel Saathi</div>

        {/* Desktop Logout Button */}
        <div className="hidden md:flex">
          <button className="bg-red-500 px-4 py-2 flex items-center gap-2 rounded-md hover:bg-red-600 transition">
            <LogOut size={20} /> Logout
          </button>
        </div>

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
