import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger the initial animation
    setAnimate(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/su/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ username, password }),
      });

      let responseData;
      try {
        responseData = await response.json();
      } catch {
        const text = await response.text();
        throw new Error(text || 'Login failed');
      }

      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }

      if (responseData.token) {
        localStorage.setItem('token', responseData.token);
        localStorage.setItem('role', responseData.role);
        
        // Add animation before navigation
        setAnimate(false);
        setTimeout(() => {
          switch (responseData.role) {
            case 'ADMIN': navigate('/admin'); break;
            case 'TEACHER': navigate('/teacher'); break;
            case 'STUDENT': navigate('/student'); break;
            default: setError('Unknown user role');
          }
        }, 500); // Match this with the animation duration
      } else {
        throw new Error('No token received');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-blue-200 opacity-20"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Login Form */}
      <form 
        onSubmit={handleLogin} 
        className={`relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-200 transition-all duration-500 ease-in-out transform ${
          animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="flex justify-center mb-6">
          <div className={`bg-blue-100 p-3 rounded-full transition-all duration-700 ease-in-out ${
            animate ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
          }`}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 text-blue-800" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" 
              />
            </svg>
          </div>
        </div>
        
        <h2 className={`text-3xl font-bold text-center mb-6 text-blue-800 transition-all duration-700 ease-in-out ${
          animate ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'
        }`}>
          Welcome
        </h2>
        
        {error && (
          <div className={`mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center transition-all duration-300 ease-in-out ${
            error ? 'scale-100' : 'scale-95'
          }`}>
            {error}
          </div>
        )}
      
        <div className={`mb-4 transition-all duration-500 ease-in-out delay-100 ${
          animate ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
        }`}>
          <label className="block text-gray-700 font-medium mb-2">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-sm"
            placeholder="Enter your username"
          />
        </div>

        <div className={`mb-6 transition-all duration-500 ease-in-out delay-150 ${
          animate ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
        }`}>
          <label className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:shadow-sm"
            placeholder="••••••••"
          />
        </div>

        <div className={`transition-all duration-500 ease-in-out delay-200 ${
          animate ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
        }`}>
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-800 hover:bg-blue-900 hover:shadow-lg'
            } transform hover:scale-[1.01] active:scale-[0.99]`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Login'}
          </button>
        </div>

        <div className={`mt-4 text-center text-sm text-gray-600 transition-all duration-500 ease-in-out delay-300 ${
          animate ? 'opacity-100' : 'opacity-0'
        }`}>
          Don't have an account?{' '}
          <a href="/" className="text-blue-800 hover:underline font-medium">Contact admin</a>
        </div>
      </form>

      {/* Add the floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
}