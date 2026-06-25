import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import FakeDetectionBadge, { VerificationStatus } from "./FakeDetectionBadge";
import { useInternshipCatalog, type InternshipData } from "@/contexts/InternshipCatalogContext";
import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Globe,
  Mail,
  MapPin,
  Users,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

interface InternshipDetailModalProps {
  internshipId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (id: string) => void;
  isApplied: boolean;
  canApply: boolean;
}

const InternshipDetailModal = ({
  internshipId,
  open,
  onOpenChange,
  onApply,
  isApplied,
  canApply,
}: InternshipDetailModalProps) => {
  const { getById } = useInternshipCatalog();
  const internship = internshipId ? getById(internshipId) : undefined;

  if (!internship) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Internship not found</DialogTitle>
            <DialogDescription>
              We couldn't find that listing. It may have been removed.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const verification = internship.verificationStatus as
    | "verified"
    | "warning"
    | "unverified";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl">{internship.title}</DialogTitle>
              <DialogDescription className="text-base">
                {internship.company} • {internship.location}
              </DialogDescription>
            </div>
            <FakeDetectionBadge status={verification} score={internship.trustScore} />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2">
            <Badge variant="default">{internship.category}</Badge>
            <Badge variant="secondary">{internship.companyType}</Badge>
            <Badge variant="outline">{internship.domain}</Badge>
            <Badge variant="outline">{internship.type}</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-lg bg-muted/40 p-4 text-sm">
            <Detail icon={MapPin} label="Location" value={internship.location} />
            <Detail icon={Clock} label="Duration" value={internship.duration} />
            {internship.stipend && (
              <Detail
                icon={DollarSign}
                label="Stipend"
                value={internship.stipend}
                tone="text-success"
              />
            )}
            <Detail
              icon={Calendar}
              label="Deadline"
              value={internship.deadline}
              tone="text-warning"
            />
          </div>

          <section>
            <h3 className="font-semibold mb-2">About this role</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {internship.fullDescription ?? internship.description}
            </p>
          </section>

          {internship.skills && internship.skills.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">Skills you'll use</h3>
              <div className="flex flex-wrap gap-1.5">
                {internship.skills.map((s) => (
                  <Badge key={s} variant="outline">
                    {s}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {internship.responsibilities && internship.responsibilities.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">What you'll do</h3>
              <ul className="space-y-2">
                {internship.responsibilities.map((r) => (
                  <li key={r} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {internship.perks && internship.perks.length > 0 && (
            <section>
              <h3 className="font-semibold mb-2">Perks</h3>
              <ul className="space-y-2">
                {internship.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {internship.eligibility && (
            <section>
              <h3 className="font-semibold mb-2">Eligibility</h3>
              <p className="text-sm text-muted-foreground">{internship.eligibility}</p>
            </section>
          )}

          <Separator />

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {internship.applicants} applied
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" /> {internship.views} views
              </span>
              <span>Posted {internship.postedDate}</span>
            </div>
            <div className="flex items-center gap-3">
              {internship.website && (
                <a
                  href={internship.website}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  <Globe className="h-3 w-3" /> Website <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {internship.recruiterEmail && (
                <a
                  href={`mailto:${internship.recruiterEmail}`}
                  className="flex items-center gap-1 hover:text-foreground"
                >
                  <Mail className="h-3 w-3" /> Recruiter
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              variant={isApplied ? "success" : "hero"}
              className="flex-1"
              disabled={isApplied || !canApply}
              onClick={() => onApply(internship.id)}
            >
              {isApplied ? "Already Applied" : "Apply Now"}
            </Button>
          </div>
          {!canApply && !isApplied && (
            <p className="text-xs text-muted-foreground text-center">
              You'll be asked to sign in before applying.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Detail = ({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: string;
}) => (
  <div>
    <p className="text-xs text-muted-foreground flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </p>
    <p className={`font-medium ${tone ?? ""}`}>{value}</p>
  </div>
);

export default InternshipDetailModal;

// Re-export so consumers can import VerificationStatus from a single place.
export { VerificationStatus };