
import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "@/context/AuthContext";

export function MainLayout() {
  const navigate = useNavigate();
  const auth = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-gray-950 transition-colors duration-200">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
