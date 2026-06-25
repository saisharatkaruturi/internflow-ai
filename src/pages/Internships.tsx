import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InternshipCard from "@/components/features/InternshipCard";
import InternshipDetailModal from "@/components/features/InternshipDetailModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  useInternshipCatalog,
  VerificationStatus,
} from "@/contexts/InternshipCatalogContext";
import {
  getApplications,
  hasApplied,
  recordApplication,
} from "@/hooks/use-applications";

const PAGE_SIZE = 6;

const Internships = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isReady } = useAuth();
  const { internships } = useInternshipCatalog();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const [pendingApplyId, setPendingApplyId] = useState<string | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const [activeInternshipId, setActiveInternshipId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [appliedIds, setAppliedIds] = useState<string[]>(
    user ? getApplications(user.id) : [],
  );

  // Reset pagination whenever the filters change.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedType, selectedCategory, selectedDomain, verifiedOnly]);

  const filteredInternships = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return internships.filter((internship) => {
      const matchesSearch =
        !query ||
        internship.title.toLowerCase().includes(query) ||
        internship.company.toLowerCase().includes(query) ||
        internship.domain.toLowerCase().includes(query);

      const matchesType = selectedType === "all" || internship.type === selectedType;
      const matchesCategory =
        selectedCategory === "all" || internship.category === selectedCategory;
      const matchesDomain =
        selectedDomain === "all" || internship.domain === selectedDomain;
      const matchesVerified =
        !verifiedOnly ||
        internship.verificationStatus === VerificationStatus.VERIFIED;

      return (
        matchesSearch && matchesType && matchesCategory && matchesDomain && matchesVerified
      );
    });
  }, [internships, searchQuery, selectedType, selectedCategory, selectedDomain, verifiedOnly]);

  const visibleInternships = filteredInternships.slice(0, visibleCount);
  const hasMore = visibleCount < filteredInternships.length;

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSelectedDomain("all");
    setVerifiedOnly(false);
  };

  const triggerApply = (id: string) => {
    if (!isReady) return;
    if (!isAuthenticated || !user) {
      setPendingApplyId(id);
      setAuthDialogOpen(true);
      return;
    }
    if (hasApplied(user.id, id)) {
      toast.info("You've already applied to this internship.");
      return;
    }
    const next = recordApplication(user.id, id);
    setAppliedIds(next);
    toast.success("Application submitted! Track your progress in the Dashboard.");
  };

  const handleView = (id: string) => {
    setActiveInternshipId(id);
    setDetailOpen(true);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    // Tiny artificial delay so the loading state is perceptible & feels intentional
    window.setTimeout(() => {
      setVisibleCount((count) => count + PAGE_SIZE);
      setLoadingMore(false);
    }, 350);
  };

  const pendingInternship = pendingApplyId
    ? internships.find((i) => i.id === pendingApplyId)
    : null;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Verified Internship Opportunities</h1>
            <p className="text-muted-foreground">
              Browse {internships.length} hand-vetted internships with
              real-time application tracking.
            </p>
          </div>
          {isAuthenticated && appliedIds.length > 0 && (
            <Link to="/dashboard">
              <Button variant="secondary" className="gap-2">
                <Sparkles className="h-4 w-4" />
                View your {appliedIds.length} application
                {appliedIds.length === 1 ? "" : "s"}
              </Button>
            </Link>
          )}
        </div>

        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, company, or domain…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Work Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="on-site">On-site</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="stipend">Stipend</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Research">Research</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={verifiedOnly ? "default" : "outline"}
              onClick={() => setVerifiedOnly((v) => !v)}
              className="gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              {verifiedOnly ? "Verified only" : "All listings"}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={resetFilters}
              aria-label="Reset filters"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {verifiedOnly && (
              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="h-3 w-3" />
                Verified Only
              </Badge>
            )}
            {selectedType !== "all" && <Badge variant="outline">{selectedType}</Badge>}
            {selectedCategory !== "all" && (
              <Badge variant="outline">{selectedCategory}</Badge>
            )}
            {selectedDomain !== "all" && (
              <Badge variant="outline">{selectedDomain}</Badge>
            )}
            {searchQuery && <Badge variant="outline">“{searchQuery}”</Badge>}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {visibleInternships.length} of {filteredInternships.length}{" "}
            internship{filteredInternships.length !== 1 ? "s" : ""}
          </p>
        </div>

        {visibleInternships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No internships found matching your criteria.
            </p>
            <Button variant="outline" className="mt-4" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleInternships.map((internship) => (
                <InternshipCard
                  key={internship.id}
                  internship={internship}
                  onApply={triggerApply}
                  onView={handleView}
                  applied={
                    isAuthenticated && user
                      ? appliedIds.includes(internship.id)
                      : false
                  }
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="gap-2"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading…
                    </>
                  ) : (
                    <>
                      Load more internships
                      <span className="text-xs text-muted-foreground">
                        ({filteredInternships.length - visibleCount} remaining)
                      </span>
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail modal — opened by View Details */}
      <InternshipDetailModal
        internshipId={activeInternshipId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onApply={(id) => {
          triggerApply(id);
          // Don't auto-close — let user see updated state in the modal.
        }}
        isApplied={
          isAuthenticated && user && activeInternshipId
            ? appliedIds.includes(activeInternshipId)
            : false
        }
        canApply={isAuthenticated}
      />

      {/* Sign-in prompt for unauthenticated applicants */}
      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to apply</DialogTitle>
            <DialogDescription>
              {pendingInternship
                ? `Create a free account to apply for "${pendingInternship.title}" at ${pendingInternship.company} and track it in your dashboard.`
                : "Create a free account to apply and track your applications."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setAuthDialogOpen(false);
                setPendingApplyId(null);
              }}
            >
              Maybe later
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setAuthDialogOpen(false);
                navigate("/signin", { state: { from: "/internships" } });
              }}
            >
              I have an account
            </Button>
            <Button
              onClick={() => {
                setAuthDialogOpen(false);
                navigate("/signup", { state: { from: "/internships" } });
              }}
            >
              Create account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Internships;