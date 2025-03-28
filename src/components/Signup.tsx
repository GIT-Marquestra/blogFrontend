import React, { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { backend } from "../backendString";

interface SignupProps {
  email?: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
}

const Signup: React.FC<SignupProps> = ({ email: initialEmail }) => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>(initialEmail || "");
  const [password, setPassword] = useState<string>("");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${backend}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      alert('Signup successful!');

    } catch (error) {
      console.error("Signup Error:", error);
      alert('An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-gray-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-xl shadow-lg shadow-purple-900/30">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-300 mb-2">
            Create Your Account
          </h2>
          <p className="text-sm text-purple-200/70 mb-6">
            Sign up to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Username
            </label>
            <input 
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              className="w-full px-3 py-2 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-gray-200"
            />
            {errors.username && (
              <p className="text-xs text-red-400 mt-1">
                {errors.username}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Email
            </label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={!!initialEmail}
              className="w-full px-3 py-2 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-gray-200 disabled:bg-gray-700 disabled:cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Password
            </label>
            <div className="relative">
              <input 
                type={isPasswordVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-3 py-2 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10 bg-gray-800 text-gray-200"
              />
              <button 
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100 focus:outline-none"
              >
                {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-purple-700 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isSubmitting ? "Signing Up..." : "Create Account"}
          </button>
        </form>
        <a href="/signin" className='flex justify-center'>
          <div className='text-purple-400 hover:text-purple-300 transition-colors duration-300'>
            Already have an account? Sign In
          </div>
        </a>
      </div>
    </div>
  );
};

export default Signup;