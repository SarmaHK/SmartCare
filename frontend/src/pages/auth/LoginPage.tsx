import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Input } from '../../components/forms/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { parseApiFieldErrors, type FieldErrors } from '../../utils/apiErrors';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: e.target.value }));
    setError('');
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateClient = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors below before continuing.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateClient()) return;

    setIsLoading(true);

    try {
      await login({ email: formData.email.trim(), password: formData.password });
      const fromPath = ((location.state as { from?: { pathname: string } })?.from?.pathname) || '/';
      navigate(fromPath, { replace: true });
    } catch (err: unknown) {
      const { message, fieldErrors: serverErrors } = parseApiFieldErrors(err);

      // Login failures are usually credential-related — show on both fields when generic
      const loginMessage = message.toLowerCase().includes('invalid email or password')
        ? 'Incorrect email or password. Please check your credentials and try again.'
        : message;

      setError(loginMessage);
      setFieldErrors({
        ...serverErrors,
        ...(loginMessage.includes('Incorrect email or password')
          ? { email: 'Email or password is incorrect', password: 'Email or password is incorrect' }
          : {}),
      });
      toast.error(loginMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-secondary-900">Welcome back</h2>
        <p className="mt-2 text-sm text-secondary-500">
          Sign in to access your healthcare portal.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            role="alert"
          >
            <svg className="mt-0.5 h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>{error}</p>
          </div>
        )}

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          leftIcon={<Mail className="h-4 w-4" />}
          error={fieldErrors.email}
        />

        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={fieldErrors.password}
          />
          <div className="mt-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500/20"
              />
              <span className="text-sm text-secondary-600">Remember me</span>
            </label>
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Forgot password?
            </a>
          </div>
        </div>

        <Button type="submit" className="mt-2 w-full" size="lg" isLoading={isLoading}>
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-secondary-500">
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" className="font-semibold text-primary-600 hover:text-primary-700">
          Create an account
        </Link>
      </p>
    </div>
  );
};
