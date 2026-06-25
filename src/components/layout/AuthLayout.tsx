import { Link } from "react-router-dom";
import { ShieldCheck, Sparkles, Lock, Users } from "lucide-react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const highlights = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description: "Every internship is screened by our AI fraud-detection engine.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your data is encrypted end-to-end and never sold to third parties.",
  },
  {
    icon: Users,
    title: "Built for Students",
    description: "Tools designed by students, for students — free, forever.",
  },
];

const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-2">
        {/* Left side — branding & value */}
        <div className="hidden lg:flex flex-col gap-8">
          <Link to="/" className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-9 w-9 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              InternGuard
            </span>
          </Link>

          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Your career journey, <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                protected from scams.
              </span>
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              Join 50,000+ students using InternGuard to find verified internships,
              practice AI mock interviews, and track every application in one place.
            </p>
          </div>

          <div className="space-y-4">
            {highlights.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Trusted by students from 200+ universities</span>
          </div>
        </div>

        {/* Right side — auth form */}
        <div className="flex w-full justify-center">
          <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl">
            <Link to="/" className="mb-6 flex items-center gap-2 lg:hidden">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                InternGuard
              </span>
            </Link>

            <div className="mb-6 space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
