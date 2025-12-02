import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // ⬅ ADD THIS

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

    if (!passwordMatch) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.profileImage) {
      toast.error("Please upload a profile image");
      return;
    }

    try {
      const register_form = new FormData();

      register_form.append("profileImage", formData.profileImage);
      register_form.append("firstName", formData.firstName);
      register_form.append("lastName", formData.lastName);
      register_form.append("email", formData.email);
      register_form.append("password", formData.password);

      const response = await fetch(
        "https://larana-properties-server.vercel.app/api/v1/user/register",
        {
          method: "POST",
          body: register_form,
        }
      );

      const data = await response.json();
      // toast.dismiss(loadingToast);

      if (response.ok) {
        toast.success("Account created successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again!");
      console.log("Registration failed", error.message);
    }
  };

  return (
    <div className="w-full pt-15 flex items-center justify-center">
      <img
        src="assets/register.jpg"
        alt=""
        className="w-full h-screen relative object-cover"
      />

      <div className="md:w-1/3 w-9/10 mx-auto p-6 md:p-8 absolute rounded-xl bg-white">
        <h1 className="text-xl font-semibold text-black">
          Create Your Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4 text-center text-gray-700"
        >
          <input
            onChange={handleChange}
            value={formData.firstName}
            className="border border-gray-300 px-3 py-1 rounded"
            type="text"
            placeholder="First Name"
            name="firstName"
            required
          />
          <input
            value={formData.lastName}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-1 rounded"
            type="text"
            placeholder="Last Name"
            name="lastName"
            required
          />
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

          {!passwordMatch && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}

          <input
            value={formData.confirmPassword}
            onChange={handleChange}
            className="border border-gray-300 px-3 py-1 rounded"
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
            className="flex items-center justify-center gap-3 cursor-pointer"
          >
            <img
              src="/assets/addImage.png"
              alt="add profile photo"
              className="w-6 h-6 invert brightness-75"
            />
            <p>Upload Your Photo</p>
            {formData.profileImage && (
              <img
                src={URL.createObjectURL(formData.profileImage)}
                alt="profile preview"
                className="w-15 h-15 rounded-full bg-contain"
              />
            )}
          </label>

          <button
            disabled={!passwordMatch}
            className={`${
              !passwordMatch
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }  my-5 rounded px-4 py-2 text-white`}
            type="submit"
            style={{
              background: "linear-gradient(90deg,#B8860B,#D4AF37)",
            }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
