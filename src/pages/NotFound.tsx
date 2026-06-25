import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-3">
        <ShieldCheck className="h-12 w-12 text-primary opacity-50" />
        <p className="text-7xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          404
        </p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="outline">
          <Link to="/internships">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Browse internships
          </Link>
        </Button>
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;