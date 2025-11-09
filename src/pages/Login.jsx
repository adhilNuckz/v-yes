import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Github, Mail, Lock, User, Code2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ThemeToggle from '../components/ThemeToggle';

export default function Login() {
  const navigate = useNavigate();
  const { login, loginWithGithub, loading } = useAuthStore();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const { signup } = useAuthStore.getState();
        await signup(formData);
        toast.success('Account created successfully!');
      } else {
        await login({ email: formData.email, password: formData.password });
        toast.success('Logged in successfully!');
      }
      navigate('/workspaces');
    } catch (error) {
      toast.error(error.message || 'Authentication failed');
    }
  };

  const handleGithubLogin = () => {
    loginWithGithub();
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-bg checker-background p-4 relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF9D00] opacity-10 rounded-full blur-3xl float-animation"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF9D00] opacity-5 rounded-full blur-3xl float-animation" style={{ animationDelay: '3s' }}></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8 fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Code2 className="w-12 h-12 text-[#FF9D00] glow-orange" />
              <div className="absolute inset-0 w-12 h-12 bg-[#FF9D00] opacity-20 blur-xl"></div>
            </div>
            <h1 className="text-5xl font-bold text-gradient-orange">
              V-yes Code
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Real-time collaborative coding platform</p>
        </div>

        {/* Auth Card */}
        <div className="glass-strong rounded-2xl p-8 glow-orange card-hover slide-in-left">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400">
              {isSignup
                ? 'Sign up to start collaborating'
                : 'Sign in to continue coding'}
            </p>
          </div>

          {/* GitHub OAuth Button */}
          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-2 glass hover:glass-strong text-white py-3 rounded-lg transition-all mb-6 border border-[#FF9D00]/20 hover:border-[#FF9D00]/50 hover-glow"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#FF9D00]/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 glass text-gray-400 rounded-full">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FF9D00]/60" />
                  <input
                    type="text"
                    required={isSignup}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 glass border border-[#FF9D00]/20 rounded-lg focus:border-[#FF9D00] focus:ring-2 focus:ring-[#FF9D00]/30 outline-none transition text-white placeholder-gray-500"
                    placeholder="Your name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FF9D00]/60" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 glass border border-[#FF9D00]/20 rounded-lg focus:border-[#FF9D00] focus:ring-2 focus:ring-[#FF9D00]/30 outline-none transition text-white placeholder-gray-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#FF9D00]/60" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 glass border border-[#FF9D00]/20 rounded-lg focus:border-[#FF9D00] focus:ring-2 focus:ring-[#FF9D00]/30 outline-none transition text-white placeholder-gray-500"
                  placeholder="••••••••"
                  minLength={8}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#FF9D00] to-[#FFB733] hover:from-[#FFB733] hover:to-[#FF9D00] text-black font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-orange-strong hover-glow"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 spinner"></div>
                  Loading...
                </div>
              ) : (
                isSignup ? 'Sign Up' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-[#FF9D00] hover:text-[#FFB733] font-semibold text-sm transition-colors"
            >
              {isSignup
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
