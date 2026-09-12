import { useEffect, useRef, useState } from "react";
import { Mail, Lock, KeyRound, CheckCircle2, ArrowLeft } from "lucide-react";
import Modal from "../ui/modal/Modal";
import Input from "../ui/input/Input";
import Button from "../ui/button/Button";

interface ForgotPasswordModalProps {
  open: boolean;
  onClose: () => void;
}

type Step = "email" | "otp" | "reset" | "success";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function ForgotPasswordModal({
  open,
  onClose,
}: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset everything whenever the modal is (re)opened
  useEffect(() => {
    if (open) {
      setStep("email");
      setEmail("");
      setOtp(Array(OTP_LENGTH).fill(""));
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
      setLoading(false);
    }
  }, [open]);

  // Resend OTP countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ---- Step 1: send OTP to email ----
  const handleSendOtp = async () => {
    setError(null);
    if (!email.trim()) return setError("Please enter your email address.");
    if (!/^\S+@\S+\.\S+$/.test(email))
      return setError("Please enter a valid email address.");

    setLoading(true);
    try {
      // TODO: replace with real API call e.g. POST /auth/forgot-password { email }
      await new Promise((r) => setTimeout(r, 900));

      setStep("otp");
      setResendTimer(RESEND_SECONDS);
      setTimeout(() => otpRefs.current[0]?.focus(), 50);
    } catch {
      setError("Couldn't send the OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---- Step 2: OTP input handling ----
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    setError(null);

    if (value && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerifyOtp = async () => {
    setError(null);
    const code = otp.join("");
    if (code.length !== OTP_LENGTH)
      return setError("Please enter the full 6-digit code.");

    setLoading(true);
    try {
      // TODO: replace with real API call e.g. POST /auth/verify-otp { email, otp: code }
      await new Promise((r) => setTimeout(r, 800));

      setStep("reset");
    } catch {
      setError("Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError(null);
    setLoading(true);
    try {
      // TODO: replace with real API call e.g. POST /auth/forgot-password { email }
      await new Promise((r) => setTimeout(r, 700));
      setOtp(Array(OTP_LENGTH).fill(""));
      setResendTimer(RESEND_SECONDS);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ---- Step 3: set new password ----
  const handleResetPassword = async () => {
    setError(null);
    if (!newPassword || newPassword.length < 8)
      return setError("Password must be at least 8 characters.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    try {
      // TODO: replace with real API call e.g. POST /auth/reset-password { email, otp: otp.join(""), newPassword }
      await new Promise((r) => setTimeout(r, 900));

      setStep("success");
    } catch {
      setError("Couldn't reset your password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const titleMap: Record<Step, string> = {
    email: "Forgot Password",
    otp: "Verify Code",
    reset: "Set New Password",
    success: "Password Reset",
  };

  return (
    <Modal open={open} onClose={onClose} title={titleMap[step]} size="sm">
      {/* Step 1 — Email */}
      {step === "email" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Enter your account email. We'll send a 6-digit verification code to
            reset your password.
          </p>
          <Input
            label="Email"
            type="email"
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4" />}
            value={email}
            error={error ?? undefined}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
          />
          <Button onClick={handleSendOtp} loading={loading} fullWidth>
            Send Code
          </Button>
        </div>
      )}

      {/* Step 2 — OTP */}
      {step === "otp" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            We've sent a 6-digit code to{" "}
            <span className="font-medium text-text">{email}</span>. Enter it
            below.
          </p>

          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                // ref={(el) => (otpRefs.current[i] = el)}
                ref={(el) => {
                  otpRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={handleOtpPaste}
                className="h-12 w-11 rounded-lg border border-border bg-surface text-center text-lg font-semibold text-text
                  transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/25"
              />
            ))}
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex items-center gap-1 font-medium text-text-muted hover:text-secondary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Change email
            </button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || loading}
              className="font-medium text-primary-dark hover:underline disabled:cursor-not-allowed disabled:text-text-muted disabled:no-underline"
            >
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend code"}
            </button>
          </div>

          <Button onClick={handleVerifyOtp} loading={loading} fullWidth>
            Verify Code
          </Button>
        </div>
      )}

      {/* Step 3 — New password */}
      {step === "reset" && (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-muted">
            Create a new password for your account.
          </p>

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="h-4 w-4" />}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            helperText="At least 8 characters"
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            icon={<KeyRound className="h-4 w-4" />}
            value={confirmPassword}
            error={error ?? undefined}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
          />

          <Button onClick={handleResetPassword} loading={loading} fullWidth>
            Reset Password
          </Button>
        </div>
      )}

      {/* Step 4 — Success */}
      {step === "success" && (
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <h3 className="text-base font-semibold text-secondary">
            Password reset successful
          </h3>
          <p className="text-sm text-text-muted">
            You can now sign in with your new password.
          </p>
          <Button onClick={onClose} fullWidth className="mt-2">
            Back to Sign In
          </Button>
        </div>
      )}
    </Modal>
  );
}
