import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', gender: 'female'
  });
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      await register({
        name: formData.name, email: formData.email,
        phone: formData.phone, password: formData.password, role: 'PATIENT',
      });
      toast.success('Account created successfully');
      navigate('/patient', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
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

      {/* Right Panel — Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-[600px]">
          <h1 className="text-[28px] font-bold text-slate-900 mb-2">Registration</h1>
          <div className="w-8 h-1 bg-slate-800 mb-10"></div>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Full name</label>
                <input
                  name="name" required value={formData.name} onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Email</label>
                <input
                  name="email" type="email" required value={formData.email} onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Phone number</label>
                <input
                  name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Password</label>
                <input
                  name="password" type="password" required value={formData.password} onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[13px] font-bold text-slate-800 mb-2">Confirm password</label>
                <input
                  name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Confirm password"
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-100 text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="pt-2">
              <label className="block text-[13px] font-bold text-slate-800 mb-4">Gender</label>
              <div className="flex flex-wrap gap-8">
                {['Male', 'Female', 'Other', 'Prefer not to say'].map((g) => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g.toLowerCase()}
                      checked={formData.gender === g.toLowerCase()}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-[14px] text-slate-700">{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-[#1055e5] hover:bg-blue-700 text-white rounded-full font-bold text-[15px] flex items-center justify-center relative transition-colors shadow-lg shadow-blue-500/30"
              >
                {isLoading ? 'Creating...' : 'Next Step'}
                {!isLoading && (
                  <ArrowRight className="absolute right-6 w-5 h-5" />
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="pt-4 text-center sm:text-left">
              <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wide">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
