import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, Clock, CheckCircle, XCircle, AlertCircle, FileText, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ApplicationStatus {
  id: string;
  company: string;
  position: string;
  appliedDate: string;
  status: "pending" | "reviewed" | "interview" | "accepted" | "rejected";
  resumeViews: number;
  lastViewed?: string;
  responseDeadline?: string;
  progress: number;
}

interface ApplicationTrackerProps {
  applications: ApplicationStatus[];
}

const ApplicationTracker = ({ applications }: ApplicationTrackerProps) => {
  const getStatusConfig = (status: ApplicationStatus["status"]) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          label: "Pending Review",
          color: "text-muted-foreground",
          bgColor: "bg-muted",
        };
      case "reviewed":
        return {
          icon: Eye,
          label: "Resume Viewed",
          color: "text-primary",
          bgColor: "bg-primary/10",
        };
      case "interview":
        return {
          icon: AlertCircle,
          label: "Interview Scheduled",
          color: "text-warning",
          bgColor: "bg-warning/10",
        };
      case "accepted":
        return {
          icon: CheckCircle,
          label: "Accepted",
          color: "text-success",
          bgColor: "bg-success/10",
        };
      case "rejected":
        return {
          icon: XCircle,
          label: "Not Selected",
          color: "text-destructive",
          bgColor: "bg-destructive/10",
        };
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Application Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map((application) => {
              const statusConfig = getStatusConfig(application.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={application.id}
                  className="p-4 rounded-lg border bg-card-hover transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{application.position}</h4>
                      <p className="text-sm text-muted-foreground">{application.company}</p>
                    </div>
                    <Badge
                      className={cn(
                        "flex items-center gap-1",
                        statusConfig.bgColor,
                        statusConfig.color
                      )}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </Badge>
                  </div>

                  <Progress value={application.progress} className="mb-3" />

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Applied:</span>
                      <span className="font-medium">{application.appliedDate}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5">
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">Views:</span>
                      <span className="font-medium">{application.resumeViews}</span>
                    </div>

                    {application.lastViewed && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Last viewed:</span>
                        <span className="font-medium">{application.lastViewed}</span>
                      </div>
                    )}

                    {application.responseDeadline && (
                      <div className="flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-warning" />
                        <span className="text-muted-foreground">Deadline:</span>
                        <span className="font-medium text-warning">{application.responseDeadline}</span>
                      </div>
                    )}
                  </div>

                  {application.status === "reviewed" && (
                    <div className="mt-3 p-2 bg-primary/5 rounded-md">
                      <p className="text-xs text-primary flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Your resume was viewed! The company is actively reviewing applications.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationTracker;