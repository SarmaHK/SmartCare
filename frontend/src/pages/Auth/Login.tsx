import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success('Login successful');

      const { user } = useAuthStore.getState();
      const from = (location.state as any)?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else {
        if (user.role === 'DOCTOR') navigate('/doctor', { replace: true });
        else if (user.role === 'ADMIN') navigate('/admin', { replace: true });
        else navigate('/patient', { replace: true });
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* Left Panel — Image */}
      <div className="hidden lg:block lg:w-[45%] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/auth-bg.png')" }}
        />
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-[600px]">
          <h1 className="text-[28px] font-bold text-slate-900 mb-2">Sign In</h1>
          <div className="w-8 h-1 bg-slate-800 mb-10"></div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {/* Email */}
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Email</label>
                <input
                  name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Password */}
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Password</label>
                <input
                  name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#1055e5] hover:bg-blue-700 text-white rounded-full font-bold text-[15px] flex items-center justify-center relative transition-colors shadow-lg shadow-blue-500/30"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
                {!isLoading && (
                  <ArrowRight className="absolute right-6 w-5 h-5" />
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="pt-4 text-center sm:text-left">
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Registration
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
