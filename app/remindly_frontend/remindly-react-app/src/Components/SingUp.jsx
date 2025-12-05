import React from "react";
import logo from './r_logo.png';
import { Link } from "react-router-dom";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  
  const [formData, setFormData] = useState({username : "", email : "", password : ""})
  
  const ADD_USER = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!) {
    createUser(input: { username: $username, email: $email, password: $password }) {
      user {
        id
        username
        email
      }
    }
  }
`;

 const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    });
  };

  const [createUser, { data, loading, error }] = useMutation(ADD_USER, {
    onCompleted: () => {
      alert("✅ Account created successfully!");
      navigate("/signin");
    },
  });
  
  const handleSubmit = (e) =>{
    e.preventDefault()
    console.log(formData);
     createUser({
    variables: {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    },
  });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <header className="mb-6 flex flex-col items-center">
        <img src={logo} alt="Remindly Logo" className="w-16 h-16 mb-2" />
        <p className="text-gray-500">Sign Up</p>
      </header>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              User Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
