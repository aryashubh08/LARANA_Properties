import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../redux/slices/state";
import { useDispatch } from "react-redux";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4400/api/v1/user/login", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-type": "application/json" },
      });

      const loggedIn = await response.json();

      if (loggedIn && loggedIn.token) {
        // 1️⃣ Save in Redux
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );

        // 2️⃣ Save manually in localStorage
        localStorage.setItem("user", JSON.stringify(loggedIn.user));
        localStorage.setItem("token", loggedIn.token);

        navigate("/"); // redirect
      }
    } catch (error) {
      console.log("Login failed", error.message);
    }
  };

  return (
    <div className="w-full  flex items-center  justify-center ">
      <img
        src="assets/login.jpg"
        alt=""
        className="w-full h-screen relative  object-cover"
      />
      <div className="md:w-1/3 w-9/10 border-none outline-none  mx-auto  border p-6 md:p-8 absolute rounded-xl bg-white">
        <h1 className="text-xl font-semibold text-black">LogIn Your Account</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4 text-center text-gray-700 outline-none"
        >
          <input
            onChange={handleChange}
            value={formData.email}
            className="border border-gray-300  px-3 py-1 rounded outline-none"
            type="email"
            placeholder="Email"
            name="email"
            required
          />
          <input
            onChange={handleChange}
            value={formData.password}
            className="border border-gray-300  px-3 py-1 rounded outline-none"
            type="password"
            placeholder="Password"
            name="password"
            required
          />

          <button
            className="bg-red-600 cursor-pointer mt-5 rounded px-4 py-2 text-white"
            type="submit"
          >
            LogIn
          </button>
        </form>
        <a href="/register" className="text-sm mt-2 text-blue-600">
          Don't have an account? Sign In Here
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;
