// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from './RoleContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const { setRole: setContextRole } = useRole();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform any necessary validation here

    // Set the role in context and navigate based on the selected role
    if (role) {
      setContextRole(role);
      navigate(`/${role}/dashboard`);
    } else {
      alert('Please select a valid role');
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen flex">
      <div className="w-1/2 h-screen flex items-center justify-center p-0 m-0">
        <img
          src="/images/physio_login.jpg"
          alt="Medical Professional"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-1/2 h-screen flex items-center justify-center p-0 m-0">
        <div className="bg-stone-50 p-8 rounded-lg shadow-md w-full flex items-start justify-center">
          <div className="w-full max-w-md mt-[-4rem]">
            <div className="flex flex-col items-center mb-2">
              <img src="/images/logo_login.png" alt="Logo" className="h-23 mb-2" />
            </div>
            <h2 className="text-3xl font-semibold text-gray-700 text-center mb-2 mt-0">Sign In</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-full relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-full relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="role" className="sr-only">Role</label>
                  <select
                    id="role"
                    name="role"
                    required
                    className="appearance-none rounded-full relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select Role</option>
                    <option value="patient">Patient</option>
                    <option value="family">Family</option>
                    <option value="gp">GP</option>
                    <option value="physio">Physio</option>
                    <option value="surgeon">Surgeon</option>
                    <option value="occupational therapist">Occupational Therapist</option>
                    <option value="academic and research">Academic and Research</option>
                  </select>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Continue
                </button>
              </div>
            </form>
            <div className="mt-4 text-center">
              <p className="text-sm font-medium text-gray-700">or Connect with Social Media</p>
              <div className="flex flex-col space-y-4 mt-4">
                <button className="bg-[#51aedc] text-white p-3 rounded-full w-full flex items-center justify-center">
                  <img src="/images/twitter.png" alt="Twitter" className="inline-block h-6 w-6 mr-2" />
                  Sign In With Twitter
                </button>
                <button className="bg-[#399bdd] text-black p-3 rounded-full w-full flex items-center justify-center">
                  <img src="/images/facebook.png" alt="Facebook" className="inline-block h-6 w-6 mr-2" />
                  Sign In With Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
