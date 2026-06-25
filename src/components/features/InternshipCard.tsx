import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import FakeDetectionBadge from "./FakeDetectionBadge";
import { VerificationStatus } from "./FakeDetectionBadge";
import {
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  Eye,
  Users,
  Check,
} from "lucide-react";

export { VerificationStatus };

export interface InternshipData {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "remote" | "on-site" | "hybrid";
  duration: string;
  stipend?: string;
  category: "paid" | "unpaid" | "stipend";
  domain: string;
  companyType: "government" | "private" | "startup" | "ngo";
  verificationStatus: VerificationStatus;
  trustScore: number;
  applicants: number;
  views: number;
  postedDate: string;
  deadline: string;
  description: string;
  logoUrl?: string;
}

interface InternshipCardProps {
  internship: InternshipData;
  onApply?: (id: string) => void;
  onView?: (id: string) => void;
  applied?: boolean;
}

const InternshipCard = ({ internship, onApply, onView, applied = false }: InternshipCardProps) => {
  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "paid":
        return "default";
      case "stipend":
        return "secondary";
      case "unpaid":
        return "outline";
      default:
        return "default";
    }
  };

  const getCompanyTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "government":
        return "default";
      case "private":
        return "secondary";
      case "startup":
        return "outline";
      case "ngo":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card className="group flex h-full flex-col hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            {internship.logoUrl ? (
              <img
                src={internship.logoUrl}
                alt={internship.company}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-lg line-clamp-1">{internship.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {internship.company}
              </p>
            </div>
          </div>
          <FakeDetectionBadge
            status={internship.verificationStatus}
            score={internship.trustScore}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge variant={getCategoryBadgeVariant(internship.category)}>
            {internship.category}
          </Badge>
          <Badge variant={getCompanyTypeBadgeVariant(internship.companyType)}>
            {internship.companyType}
          </Badge>
          <Badge variant="outline">{internship.domain}</Badge>
          <Badge variant="outline">{internship.type}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {internship.description}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{internship.location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{internship.duration}</span>
          </div>
          {internship.stipend && (
            <div className="flex items-center gap-1.5 text-success min-w-0">
              <DollarSign className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium truncate">{internship.stipend}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Deadline: {internship.deadline}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {internship.applicants} applied
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {internship.views} views
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Posted {internship.postedDate}
          </span>
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onView?.(internship.id)}
        >
          View Details
        </Button>
        <Button
          variant={applied ? "success" : "hero"}
          className="flex-1"
          onClick={() => onApply?.(internship.id)}
          disabled={applied}
        >
          {applied ? (
            <>
              <Check className="h-4 w-4" />
              Applied
            </>
          ) : (
            "Apply Now"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InternshipCard;
