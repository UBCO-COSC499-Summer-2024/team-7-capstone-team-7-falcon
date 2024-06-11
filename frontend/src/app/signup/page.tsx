"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error) {}
  };

  return (
    <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-screen py-">
      <form className="w-full max-w-sm mx-auto bg-white p-8 rounded-md shadow-md ">
        <h1 className="text-center font-bold mb-3">FALCON MS LOGIN PORTAL</h1>
        <h2 className="text-md mb-6 text-center text-gray-400">Login</h2>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="first-name"
          >
            First Name
          </label>
          <input
            className="w-full px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="firstname"
            type="text"
            value={user.firstname}
            onChange={(e) => setUser({ ...user, firstname: e.target.value })}
            placeholder="John"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="last-name"
          >
            Last Name
          </label>
          <input
            className="w-full px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="lastname"
            type="text"
            value={user.lastname}
            onChange={(e) => setUser({ ...user, lastname: e.target.value })}
            placeholder="Adams"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            email
          </label>
          <input
            className="w-full px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="email"
            type="password"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="john123@gmail.com"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            password
          </label>
          <input
            className="w-full px-3 py-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="********"
          />
        </div>

        <button
          onClick={onSignup}
          className="w-full bg-purple-700 text-whote text-sm text-white font-bold py-3 rounded-md hover:bg-purple-700 transition duration-300"
        >
          Register
        </button>

        <Link
          href="/login"
          className="text-purple-500  font-medium text-primary-600 hover:underline dark:text-primary-500 flex items-center justify-center"
        >
          Login
        </Link>
      </form>
    </div>
  );
}
