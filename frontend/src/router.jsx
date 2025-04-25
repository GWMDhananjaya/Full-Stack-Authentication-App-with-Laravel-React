import React from "react";
import Home from "./home";
import Login from "./login";
import Register from "./register";
import Dashboard from "./dashboard";
import { Routes, Route } from "react-router-dom";

const router = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
};

export default router;
