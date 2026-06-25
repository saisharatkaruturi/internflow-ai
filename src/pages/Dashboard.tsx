import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import ApplicationTracker, {
  ApplicationStatus,
} from "@/components/features/ApplicationTracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  FileText,
  Calendar,
  Award,
  Target,
  Briefcase,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useInternshipCatalog } from "@/contexts/InternshipCatalogContext";
import { getApplications } from "@/hooks/use-applications";

const recentActivity = [
  {
    icon: Eye,
    text: "Your resume was viewed by TechCorp",
    time: "2 hours ago",
    type: "view" as const,
  },
  {
    icon: CheckCircle,
    text: "Application accepted at Investment Bank",
    time: "3 days ago",
    type: "success" as const,
  },
  {
    icon: Calendar,
    text: "Interview scheduled with AI Innovations",
    time: "4 days ago",
    type: "interview" as const,
  },
  {
    icon: FileText,
    text: "Applied to Design Studios",
    time: "5 days ago",
    type: "applied" as const,
  },
];

// Synthetic status data per internship — keyed by catalog id.
const STATUS_OVERRIDES: Record<
  string,
  Pick<
    ApplicationStatus,
    "status" | "resumeViews" | "lastViewed" | "responseDeadline" | "progress" | "appliedDate"
  >
> = {
  "1": {
    status: "reviewed",
    resumeViews: 3,
    lastViewed: "2 hours ago",
    responseDeadline: "Jul 10, 2026",
    progress: 60,
    appliedDate: "Jun 28, 2026",
  },
  "2": {
    status: "interview",
    resumeViews: 5,
    lastViewed: "1 day ago",
    progress: 80,
    appliedDate: "Jun 26, 2026",
  },
  "3": {
    status: "pending",
    resumeViews: 0,
    progress: 20,
    appliedDate: "Jun 25, 2026",
  },
  "4": {
    status: "reviewed",
    resumeViews: 2,
    lastViewed: "3 hours ago",
    progress: 45,
    appliedDate: "Jun 24, 2026",
  },
  "5": {
    status: "pending",
    resumeViews: 0,
    progress: 20,
    appliedDate: "Jun 25, 2026",
  },
  "6": {
    status: "accepted",
    resumeViews: 8,
    lastViewed: "3 days ago",
    progress: 100,
    appliedDate: "Jun 20, 2026",
  },
  "7": {
    status: "reviewed",
    resumeViews: 1,
    lastViewed: "1 day ago",
    progress: 35,
    appliedDate: "Jun 22, 2026",
  },
  "8": {
    status: "reviewed",
    resumeViews: 4,
    lastViewed: "5 hours ago",
    responseDeadline: "Jul 28, 2026",
    progress: 55,
    appliedDate: "Jun 27, 2026",
  },
  "11": {
    status: "interview",
    resumeViews: 6,
    lastViewed: "yesterday",
    progress: 75,
    appliedDate: "Jun 23, 2026",
  },
  "17": {
    status: "reviewed",
    resumeViews: 3,
    lastViewed: "4 hours ago",
    progress: 50,
    appliedDate: "Jun 26, 2026",
  },
};

const DEFAULT_STATUS: Pick<
  ApplicationStatus,
  "status" | "resumeViews" | "progress" | "appliedDate"
> = {
  status: "pending",
  resumeViews: 0,
  progress: 15,
  appliedDate: "Jun 24, 2026",
};

const Dashboard = () => {
  const { user, isAuthenticated, isReady } = useAuth();
  const { getById } = useInternshipCatalog();
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setAppliedIds(getApplications(user.id));
    }
  }, [user]);

  if (isReady && !isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (!user) return null;

  const applications: ApplicationStatus[] = appliedIds
    .map((id) => {
      const entry = getById(id);
      if (!entry) return null;
      const override = STATUS_OVERRIDES[id] ?? {};
      return {
        id,
        company: entry.company,
        position: entry.title,
        appliedDate: override.appliedDate ?? DEFAULT_STATUS.appliedDate,
        status: override.status ?? DEFAULT_STATUS.status,
        resumeViews: override.resumeViews ?? DEFAULT_STATUS.resumeViews,
        lastViewed: override.lastViewed,
        responseDeadline: override.responseDeadline,
        progress: override.progress ?? DEFAULT_STATUS.progress,
      };
    })
    .filter((a): a is ApplicationStatus => a !== null);

  const stats = {
    totalApplications: Math.max(applications.length, 12),
    underReview:
      applications.filter((a) => a.status === "reviewed" || a.status === "pending")
        .length || 4,
    interviews: applications.filter((a) => a.status === "interview").length || 2,
    offers: applications.filter((a) => a.status === "accepted").length || 1,
    profileViews: 156,
    profileScore: 85,
  };

  const firstName = user.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {firstName} 👋</h1>
            <p className="text-muted-foreground">
              Track your applications and monitor your profile performance.
            </p>
          </div>
          <Link to="/internships">
            <Button className="gap-2">
              <Briefcase className="h-4 w-4" />
              Find more internships
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Applications"
            value={stats.totalApplications}
            icon={FileText}
            tone="text-primary"
          />
          <StatCard
            label="Under Review"
            value={stats.underReview}
            icon={Clock}
            tone="text-warning"
          />
          <StatCard
            label="Interviews"
            value={stats.interviews}
            icon={Calendar}
            tone="text-secondary"
          />
          <StatCard
            label="Offers Received"
            value={stats.offers}
            icon={Award}
            tone="text-success"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {applications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
                  <div className="rounded-full bg-primary/10 p-4">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">No applications yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start exploring verified internships and apply to your
                      first one.
                    </p>
                  </div>
                  <Link to="/internships">
                    <Button>Browse internships</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <ApplicationTracker applications={applications} />
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Overall Score
                      </span>
                      <span className="text-sm font-semibold">
                        {stats.profileScore}%
                      </span>
                    </div>
                    <Progress value={stats.profileScore} className="h-2" />
                  </div>

                  <div className="space-y-2 text-sm">
                    <ChecklistItem checked>Profile completed</ChecklistItem>
                    <ChecklistItem checked>Resume uploaded</ChecklistItem>
                    <ChecklistItem checked>Skills added</ChecklistItem>
                    <ChecklistItem checked={false}>Add certifications</ChecklistItem>
                  </div>

                  <Link to="/profile">
                    <Button variant="outline" className="w-full">
                      Edit profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={index} className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.type === "success"
                              ? "bg-success/10"
                              : activity.type === "interview"
                                ? "bg-warning/10"
                                : activity.type === "view"
                                  ? "bg-primary/10"
                                  : "bg-muted"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 ${
                              activity.type === "success"
                                ? "text-success"
                                : activity.type === "interview"
                                  ? "text-warning"
                                  : activity.type === "view"
                                    ? "text-primary"
                                    : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{activity.text}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Views</p>
                    <p className="text-2xl font-bold">{stats.profileViews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-primary opacity-20" />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-success" />
                  <span className="text-success">+23%</span>
                  <span className="text-muted-foreground">from last week</span>
                </div>
                <Badge variant="secondary" className="mt-4">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Top 5% this week
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${tone} opacity-50`} />
      </div>
    </CardContent>
  </Card>
);

const ChecklistItem = ({
  checked,
  children,
}: {
  checked: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2">
    {checked ? (
      <CheckCircle className="h-4 w-4 text-success" />
    ) : (
      <Clock className="h-4 w-4 text-warning" />
    )}
    <span className={checked ? "" : "text-muted-foreground"}>{children}</span>
  </div>
);

export default Dashboard;