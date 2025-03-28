import React, { FormEvent, useState } from 'react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response from server
        setError(data.message || 'Sign in failed');
        return;
      }

      alert('Sign in successful!');
      window.location.href = '/home';
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dark bg-gray-900 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit} 
          className="bg-gray-800 shadow-xl rounded-xl px-8 pt-6 pb-8 mb-4 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
            Sign In
          </h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Email Address
              </label>
              <input 
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label 
                htmlFor="password" 
                className="block text-gray-300 text-sm font-medium mb-2"
              >
                Password
              </label>
              <input 
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md 
              transition duration-300 ease-in-out transform hover:scale-[1.02]
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          
          <div className="text-center text-gray-400 text-sm mt-4">
            <a href="#" className="hover:text-blue-500 transition duration-300">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;