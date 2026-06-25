import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Eye,
  Bot,
  Lock,
  TrendingUp,
  Users,
  ArrowRight,
  GraduationCap,
  Zap,
  Star,
  Quote,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: ShieldCheck,
      title: "Fake Internship Detection",
      description:
        "Our AI models analyze every listing across 30+ fraud signals to keep scams out of your feed.",
      color: "text-success",
    },
    {
      icon: Eye,
      title: "Resume Tracking",
      description:
        "Get notified the moment a recruiter opens your resume — no more guessing games.",
      color: "text-primary",
    },
    {
      icon: Bot,
      title: "AI Mock Interviews",
      description:
        "Practice with role-specific questions and get instant feedback on your answers.",
      color: "text-secondary",
    },
    {
      icon: Lock,
      title: "Data Privacy",
      description:
        "Your profile and personal data are encrypted and never shared with recruiters without consent.",
      color: "text-accent",
    },
  ];

  const stats = [
    { value: "10K+", label: "Verified Internships" },
    { value: "98%", label: "Fraud Detection Rate" },
    { value: "50K+", label: "Active Students" },
    { value: "500+", label: "Partner Companies" },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CS Senior, IIT Delhi",
      quote:
        "I almost applied to a fake listing asking for an upfront fee. InternGuard flagged it instantly and pointed me to a real role I ended up landing.",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Data Science Intern @ AI Innovations",
      quote:
        "The mock interview bot felt like practicing with a real mentor. I got more confident and cracked my interview in the first attempt.",
      rating: 5,
    },
    {
      name: "Ananya Iyer",
      role: "Product Intern @ Growth Agency",
      quote:
        "Loved seeing exactly when recruiters viewed my resume. The dashboard made it easy to stay on top of every opportunity.",
      rating: 5,
    },
  ];

  const faqs = [
    {
      q: "Is InternGuard really free for students?",
      a: "Yes — 100% free, forever. We're supported by partner companies who pay a small fee only after a successful hire.",
    },
    {
      q: "How do you verify internships?",
      a: "Our pipeline combines domain age checks, GST/PAN verification, recruiter email audits, AI text analysis, and student reports.",
    },
    {
      q: "Will my profile be public?",
      a: "Only verified recruiters can see your full profile. You control what details are visible and can hide your profile at any time.",
    },
    {
      q: "What if I find a suspicious listing?",
      a: "Use the ‘Report’ button on any card or chat with our AI assistant. We investigate every report within 24 hours.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Zap className="h-3 w-3 mr-1" />
            Trusted by 50,000+ students
          </Badge>

          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            Find <span className="bg-gradient-primary bg-clip-text text-transparent">Verified</span> Internships
            <br />
            With Complete Transparency
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            InternGuard protects you from fake opportunities with AI-powered
            verification, real-time application tracking, and an intelligent
            career assistant.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={isAuthenticated ? "/internships" : "/signup"}>
              <Button variant="hero" size="lg" className="w-full sm:w-auto gap-2">
                {isAuthenticated ? "Browse Internships" : "Get Started Free"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/chatbot">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Bot className="h-4 w-4 mr-2" />
                Try AI Assistant
              </Button>
            </Link>
          </div>

          {/* Mini stat strip */}
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose InternGuard?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge AI with a student-first design to create
              the safest internship platform on the internet.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How InternGuard Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple, secure process.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: GraduationCap,
                title: "1. Create Your Profile",
                text: "Sign up and build your professional profile with skills and preferences.",
              },
              {
                icon: ShieldCheck,
                title: "2. Browse Verified Listings",
                text: "Explore internships verified by our AI-powered fraud detection system.",
              },
              {
                icon: TrendingUp,
                title: "3. Track Applications",
                text: "Monitor your applications with real-time updates and notifications.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3">
              <Sparkles className="h-3 w-3 mr-1" />
              Loved by students
            </Badge>
            <h2 className="text-3xl font-bold mb-4">What students are saying</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real stories from students who found verified internships through
              InternGuard.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="relative">
                <CardContent className="p-6">
                  <Quote className="h-6 w-6 text-primary/30" />
                  <p className="mt-2 text-sm text-foreground/90">"{t.quote}"</p>
                  <div className="mt-4 flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-muted-foreground">
              Have a question we didn't cover? Chat with our AI assistant anytime.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((item) => (
              <Card key={item.q}>
                <CardContent className="p-6">
                  <h3 className="font-semibold flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                    {item.q}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground pl-7">
                    {item.a}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-primary">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Start Your Career Journey?
          </h2>
          <p className="text-primary-foreground/90 mb-8 text-lg">
            Join thousands of students finding legitimate internships with
            confidence.
          </p>
          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link to={isAuthenticated ? "/internships" : "/signup"}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                {isAuthenticated ? "Browse Internships" : "Get Started Free"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/dashboard" : "/signin"}>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
              >
                {isAuthenticated ? "View Dashboard" : "I already have an account"}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
