import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  BarChart3,
  HardHat,
  Mail as MailIcon,
  Phone,
  Building2,
} from "lucide-react";
import loginBg from "../assets/images/login-bg.png";
import RentProLogo from "../assets/logo/rentpro-logo.png";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      // TODO: replace with real API call
      // const res = await api.post("/auth/login", { email, password, remember });
      await new Promise((resolve) => setTimeout(resolve, 900)); // simulate request

      navigate("/admin/dashboard");
    } catch {
      setError("Login failed. Please check your email and password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left — brand / image panel */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between">
        {/* Background image */}
        <img
          src={loginBg}
          alt="Rent & Construction Management System"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark/95 via-secondary-dark/75 to-secondary-dark/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/60 via-transparent to-transparent" />

        {/* Logo */}
        <div className="relative z-10 px-12 pt-12">
          <div className="flex items-center gap-3">
            {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg">
              <HardHat className="h-6 w-6 text-secondary" strokeWidth={2.3} />
            </div> */}
            {/* Logo Image */}
            <div className="flex h-15 w-15 items-center justify-center">
              <img
                src={RentProLogo}
                alt="Quantrova RentPro Logo"
                className="h-15 w-15 object-contain"
              />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight text-white">
                Quantrova RentPro
              </p>
              <p className="text-xs leading-tight text-white/60">
                Rent & Construction Management
              </p>
            </div>
          </div>
        </div>

        {/* Headline + features */}
        <div className="relative z-10 px-15 pb-40">
          <h1 className="max-w-md text-[2.1rem] font-semibold leading-tight text-white">
            Manage Rentals & Construction Projects{" "}
            <span className="text-primary">with Confidence</span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            Smart tracking, better control. Grow your business with a complete
            management solution.
          </p>

          <div className="mt-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <BarChart3
                  className="h-4.5 w-4.5 text-primary"
                  strokeWidth={2}
                />
              </div>
              <span className="text-sm text-white/80">
                Real-time reports and analytics
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <Building2
                  className="h-4.5 w-4.5 text-primary"
                  strokeWidth={2}
                />
              </div>
              <span className="text-sm text-white/80">
                Manage properties and rentals
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <HardHat className="h-4.5 w-4.5 text-primary" strokeWidth={2} />
              </div>
              <span className="text-sm text-white/80">
                Track construction projects
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                <ShieldCheck
                  className="h-4.5 w-4.5 text-primary"
                  strokeWidth={2}
                />
              </div>
              <span className="text-sm text-white/80">
                Secure role-based access
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:w-1/2 lg:px-20 xl:px-28">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          {/* Mobile-only logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
              <HardHat className="h-5.5 w-5.5 text-primary" strokeWidth={2.3} />
            </div>
            <div>
              <p className="text-base font-bold leading-tight text-secondary">
                RentPro
              </p>
              <p className="text-[11px] leading-tight text-text-muted">
                Rent & Construction Management
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-secondary">Sign in</h2>
          <p className="mt-1.5 text-sm text-text-muted">
            Access your Rent & Construction Management System.
          </p>

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-text"
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted"
                  strokeWidth={2}
                />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-muted/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-primary-dark hover:underline"
                  onClick={() => setForgotOpen(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-text-muted"
                  strokeWidth={2}
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-10 text-sm text-text placeholder:text-text-muted/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-secondary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-border-dark text-primary accent-primary focus:ring-2 focus:ring-primary/25"
              />
              Remember me
            </label>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-secondary py-2.5 text-sm font-semibold text-white transition-all hover:bg-secondary-light active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mx-auto w-full max-w-sm pt-8">
          <p className="text-center text-xs text-text-muted">
            © {new Date().getFullYear()} RentPro. All rights reserved.
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-[11px] text-text-muted/80">
            <span>Developed by Dhanushka Jayarathna</span>

            <a
              href="mailto:dhanushka.jayarathna01@gmail.com"
              className="inline-flex items-center gap-1 transition-colors hover:text-primary-dark"
            >
              <MailIcon className="h-3 w-3" />
              dhanushka.jayarathna01@gmail.com
            </a>

            <a
              href="tel:0766640384"
              className="inline-flex items-center gap-1 transition-colors hover:text-primary-dark"
            >
              <Phone className="h-3 w-3" />
              0766640384
            </a>
          </div>
        </div>
      </div>
      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
    </div>
  );
}

export default LoginPage;
