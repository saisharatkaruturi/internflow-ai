import { ShieldCheck, ShieldAlert, ShieldOff, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export enum VerificationStatus {
  VERIFIED = "verified",
  WARNING = "warning",
  UNVERIFIED = "unverified",
}

interface FakeDetectionBadgeProps {
  status: VerificationStatus;
  score?: number;
  className?: string;
}

const FakeDetectionBadge = ({ status, score, className }: FakeDetectionBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case VerificationStatus.VERIFIED:
        return {
          icon: ShieldCheck,
          label: "Verified",
          description: "This opportunity has been verified and is legitimate",
          bgClass: "bg-gradient-verified",
          iconClass: "text-success-foreground",
        };
      case VerificationStatus.WARNING:
        return {
          icon: ShieldAlert,
          label: "Caution",
          description: "Some verification checks pending. Proceed with caution",
          bgClass: "bg-warning",
          iconClass: "text-warning-foreground",
        };
      case VerificationStatus.UNVERIFIED:
        return {
          icon: ShieldOff,
          label: "Unverified",
          description: "This opportunity has not been verified yet",
          bgClass: "bg-unverified",
          iconClass: "text-muted-foreground",
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105",
              config.bgClass,
              config.iconClass,
              className
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{config.label}</span>
            {score && (
              <span className="text-[10px] opacity-80">
                {score}%
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-semibold mb-1">{config.label}</p>
              <p className="text-xs text-muted-foreground">{config.description}</p>
              {score && (
                <p className="text-xs mt-1">
                  Trust Score: <span className="font-semibold">{score}%</span>
                </p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FakeDetectionBadge;