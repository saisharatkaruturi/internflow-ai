import { Link } from "react-router-dom";
import { ShieldCheck, Mail, Github, Twitter, Linkedin } from "lucide-react";

const product = [
  { label: "Browse Internships", href: "/internships" },
  { label: "AI Assistant", href: "/chatbot" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Sign in", href: "/signin" },
];

const resources = [
  { label: "How verification works", href: "/" },
  { label: "Report a listing", href: "/chatbot" },
  { label: "Resume tips", href: "/chatbot" },
  { label: "Mock interviews", href: "/chatbot" },
];

const company = [
  { label: "About", href: "/" },
  { label: "Contact", href: "mailto:hello@internguard.app" },
  { label: "Privacy", href: "/" },
  { label: "Terms", href: "/" },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                InternGuard
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered internship verification for the next generation of
              students.
            </p>
            <div className="flex items-center gap-3 text-muted-foreground">
              <a
                href="mailto:hello@internguard.app"
                aria-label="Email InternGuard"
                className="hover:text-foreground"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub"
                className="hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Twitter"
                className="hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="hover:text-foreground"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn title="Product" links={product} />
          <FooterColumn title="Resources" links={resources} />
          <FooterColumn title="Company" links={company} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {year} InternGuard. All rights reserved.</p>
          <p>
            Made with <span className="text-primary">♥</span> for students everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div>
    <h4 className="mb-3 text-sm font-semibold">{title}</h4>
    <ul className="space-y-2 text-sm text-muted-foreground">
      {links.map((link) => (
        <li key={link.label}>
          {link.href.startsWith("/") ? (
            <Link to={link.href} className="hover:text-foreground">
              {link.label}
            </Link>
          ) : (
            <a href={link.href} className="hover:text-foreground">
              {link.label}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default Footer;
