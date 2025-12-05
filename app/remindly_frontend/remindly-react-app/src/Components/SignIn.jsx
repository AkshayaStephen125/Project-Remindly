import React from "react";
import logo from './r_logo.png';
import { Link } from "react-router-dom";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
export default function SignIn() {

    const [formData, setFormData] = useState({username : "", password : ""})
      
      const LOGIN_USER = gql`
      mutation TokenAuth($username: String!, $password: String!) {
        tokenAuth(username: $username, password: $password) {
          token
          payload
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
    
      const [tokenAuth, { loading, error }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            localStorage.setItem("accessToken", data.tokenAuth.token);
            localStorage.setItem("username", data.tokenAuth.payload.username);
          alert("✅ Signed In successfully!");
          navigate("/");
        },
  onError: (error) => {
    console.log("GraphQL Error: ", error);
  },
      });
      
      const handleSubmit = (e) =>{
        e.preventDefault()
        console.log(formData);
         tokenAuth({
        variables: {
          username: formData.username,
          password: formData.password,
        },
      });
      };
    
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <header className="mb-6 flex flex-col items-center">
        <img src={logo} alt="Remindly Logo" className="w-16 h-16 mb-2" />
        <p className="text-gray-500">Sign In</p>
      </header>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              User Name
            </label>
            <input
            name="username"
              type="text"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div> */}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don't have Account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
