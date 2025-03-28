import { FormEvent, useState } from 'react';
import { useAuth } from './SignStateContext';
import { backend } from '../backendString';
import toast from 'react-hot-toast';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setIsSignedIn } = useAuth()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${backend}/signin`, {
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

      if (data.message === "Incorrect Credentials!") {
        // Handle error response from server
        toast.error(data.message)
        return;
      }

      // Store authentication token in local storage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('email', data.email);

      toast.success('Sign in successful!');

      setIsSignedIn(true)
      window.location.href = '/home';
    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit} 
          className="bg-gray-900 shadow-lg shadow-purple-900/30 rounded-xl px-8 pt-6 pb-8 mb-4 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-purple-300 mb-6">
            Sign In
          </h2>
          
          {error && (
            <div className="bg-red-900/20 border border-red-800/30 text-red-300 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block text-purple-200 text-sm font-medium mb-2"
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
                className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label 
                htmlFor="password" 
                className="block text-purple-200 text-sm font-medium mb-2"
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
                className="w-full px-3 py-2 bg-gray-800 border border-purple-900 rounded-md text-gray-200 
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
          </div>
          
          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-md 
              transition duration-300 ease-in-out transform hover:scale-102
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
          <a href="/signup" className='flex justify-center'>
          <div className='text-purple-400 hover:text-purple-300 transition-colors duration-300'>
            Don't have an account? Sign Up
          </div>
          </a>
          
        </form>
      </div>
    </div>
  );
}

export default SignIn;