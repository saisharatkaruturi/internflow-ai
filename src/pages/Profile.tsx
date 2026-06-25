import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LogOut, Mail, Save, ShieldCheck, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

const Profile = () => {
  const { user, isAuthenticated, isReady, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUniversity(user.university ?? "");
      setMajor(user.major ?? "");
      setGraduationYear(user.graduationYear ?? "");
    }
  }, [user]);

  if (isReady && !isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!user) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    updateProfile({
      name: name.trim() || user.name,
      university: university.trim() || undefined,
      major: major.trim() || undefined,
      graduationYear: graduationYear.trim() || undefined,
    });
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated");
    }, 250);
  };

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out — see you soon!");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account details and academic information.
          </p>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-semibold">
                {initials(user.name) || "IG"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="h-5 w-5 text-primary" />
                {user.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Academic information</CardTitle>
              <CardDescription>
                We use these details to personalize internship recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Full name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-university">University</Label>
                  <Input
                    id="profile-university"
                    placeholder="e.g. IIT Bombay"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="profile-major">Major</Label>
                  <Input
                    id="profile-major"
                    placeholder="e.g. Computer Science"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-year">Expected graduation</Label>
                <Input
                  id="profile-year"
                  placeholder="e.g. 2027"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Member since</p>
                <p className="font-medium">{formatDate(user.joinedAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">User ID</p>
                <p className="break-all font-mono text-xs">{user.id}</p>
              </div>
              <div className="rounded-md border border-success/30 bg-success/5 p-3 text-xs text-success">
                Your data is stored locally on this device. Nothing is sent to a
                server.
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Profile;
