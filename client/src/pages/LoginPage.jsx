import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../redux/slices/state";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast"; // ⬅ ADD THIS

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
      const response = await fetch(
        "https://larana-properties-server.vercel.app/api/v1/user/login",
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-type": "application/json" },
        }
      );

      const loggedIn = await response.json();

      // toast.dismiss(loadingToast);

      if (!response.ok) {
        toast.error(loggedIn.message || "Invalid email or password");
        return;
      }

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

        toast.success("Login successful!");

        navigate("/"); // redirect
      }
    } catch (error) {
      toast.error("Login failed. Try again later.");
      console.log("Login failed", error.message);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <img
        src="assets/login.jpg"
        alt=""
        className="w-full h-screen relative object-cover"
      />
      <div className="md:w-1/3 w-9/10 mx-auto p-6 md:p-8 absolute rounded-xl bg-white">
        <h1 className="text-xl font-semibold text-black">LogIn Your Account</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4 text-center text-gray-700"
        >
          <input
            onChange={handleChange}
            value={formData.email}
            className="border border-gray-300 px-3 py-1 rounded"
            type="email"
            placeholder="Email"
            name="email"
            required
          />
          <input
            onChange={handleChange}
            value={formData.password}
            className="border border-gray-300 px-3 py-1 rounded"
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
          Don't have an account? Sign Up Here
        </a>
      </div>
    </div>
  );
};

export default RegisterPage;
