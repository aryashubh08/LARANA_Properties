import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: name === "profileImage" ? files[0] : value,
    });
  };
  useEffect(() => {
    setPasswordMatch(
      formData.password === formData.confirmPassword ||
        formData.confirmPassword === ""
    );
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const register_form = new FormData();

      register_form.append("profileImage", formData.profileImage);
      register_form.append("firstName", formData.firstName);
      register_form.append("lastName", formData.lastName);
      register_form.append("email", formData.email);
      register_form.append("password", formData.password);

      const response = await fetch(
        "http://localhost:4400/api/v1/user/register",
        {
          method: "POST",
          body: register_form,
        }
      );
      if (response.ok) {
        navigate("/login");
      }
    } catch (error) {
      console.log("Registration failed", error.message);
    }
  };

  console.log(formData);

  return (
    <div className="w-full  flex items-center  justify-center ">
      <img
        src="assets/login.jpg"
        alt=""
        className="w-full h-screen relative  object-cover"
      />
      <div className="md:w-1/3 w-9/10 border-none outline-none  mx-auto  border p-6 md:p-8 absolute rounded-xl bg-white">
        <h1 className="text-xl font-semibold text-black">
          Create Your Account
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4 text-center text-gray-700 outline-none"
        >
          <input
            onChange={handleChange}
            value={formData.firstName}
            className="border border-gray-300  px-3 py-1 rounded outline-none"
            type="text"
            placeholder="First Name"
            name="firstName"
            required
          />
          <input
            value={formData.lastName}
            onChange={handleChange}
            className="border border-gray-300  px-3 py-1 rounded outline-none"
            type="text"
            placeholder="Last Name"
            name="lastName"
            required
          />
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
          {!passwordMatch && (
            <p className="text-red-500">Password are not matched</p>
          )}
          <input
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border border-gray-300  px-3 py-1 rounded outline-none"
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            required
          />
          <input
            id="image"
            onChange={handleChange}
            type="file"
            name="profileImage"
            accept="image/*"
            required
            style={{ display: "none" }}
          />
          <label
            htmlFor="image"
            className="flex items-center justify-center gap-3"
          >
            {" "}
            <img
              src="/assets/addImage.png"
              alt="add profile photo"
              className="w-6 h-6 invert brightness-75"
            />
            <p>Upload Your Photo</p>
            {formData.profileImage && (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="profile photo"
                className="w-15 h-15 rounded-full bg-contain"
              />
            )}
          </label>

          <button
            disabled={!passwordMatch}
            className="bg-red-600 cursor-pointer my-5 rounded px-4 py-2 text-white"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
