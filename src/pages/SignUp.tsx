import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth, type SignUpPayload } from "@/contexts/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import { toast } from "sonner";

const SignUp = () => {
  const { signUp, isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpPayload>({
    name: "",
    email: "",
    password: "",
    university: "",
    major: "",
    graduationYear: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isReady && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const updateField = <K extends keyof SignUpPayload>(key: K, value: SignUpPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signUp(form);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success("Account created! Welcome to InternGuard 👋");
    navigate("/dashboard", { replace: true });
  };

  return (
    <AuthLayout
      title="Create your free account"
      subtitle="It takes 30 seconds. No credit card required."
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="name"
              required
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-email">Email address</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@university.edu"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Use 6+ characters with a mix of letters & numbers for a strong password.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              placeholder="IIT Bombay"
              value={form.university}
              onChange={(e) => updateField("university", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="major">Major</Label>
            <Input
              id="major"
              placeholder="Computer Science"
              value={form.major}
              onChange={(e) => updateField("major", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="gradYear">Expected graduation</Label>
          <Input
            id="gradYear"
            placeholder="e.g. 2027"
            value={form.graduationYear}
            onChange={(e) => updateField("graduationYear", e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" disabled={submitting}>
          <UserPlus className="mr-2 h-4 w-4" />
          {submitting ? "Creating account…" : "Create account"}
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
