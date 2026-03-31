import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Loader2,
  Mail,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useDirectoryUsers } from "../hooks/useQueries";
import { UserRole, type UserProfile } from "../types";

export function DashboardPage() {
  const { data: users, isLoading } = useDirectoryUsers();
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const mentors = users?.filter((u) => u.role === UserRole.mentor) || [];
  const companies = users?.filter((u) => u.role === UserRole.company) || [];

  const filterUsers = (list: UserProfile[]) =>
    list.filter(
      (u) =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.mentorProfile?.fullName ?? u.companyProfile?.companyName ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (u.mentorProfile?.expertise ?? u.companyProfile?.industry ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()),
    );

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="font-serif text-4xl text-foreground mb-2">Network Directory</h1>
            <p className="text-muted-foreground">
              Connect with mentors and companies across the ecosystem.
            </p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, expertise, or industry…"
              className="pl-10 h-12 rounded-2xl bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-foreground/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="mentors" className="w-full">
          <TabsList className="bg-transparent border-b rounded-none h-auto p-0 mb-8 gap-8">
            <TabsTrigger
              value="mentors"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-2 py-4 text-sm font-medium transition-none"
            >
              Mentors ({mentors.length})
            </TabsTrigger>
            <TabsTrigger
              value="companies"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-2 py-4 text-sm font-medium transition-none"
            >
              Companies ({companies.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentors" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterUsers(mentors).map((u) => (
                <UserCard key={u._id} user={u} />
              ))}
              {filterUsers(mentors).length === 0 && (
                <EmptyState message="No mentors found matching your search." />
              )}
            </div>
          </TabsContent>

          <TabsContent value="companies" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterUsers(companies).map((u) => (
                <UserCard key={u._id} user={u} />
              ))}
              {filterUsers(companies).length === 0 && (
                <EmptyState message="No companies found matching your search." />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function UserCard({ user }: { user: UserProfile }) {
  const isMentor = user.role === UserRole.mentor;
  const mp = user.mentorProfile;
  const cp = user.companyProfile;

  const name = isMentor ? mp?.fullName : cp?.companyName;
  const subtext = isMentor ? mp?.title || mp?.expertise : cp?.industry;
  const location = isMentor ? mp?.location : cp?.location;
  const image = isMentor ? mp?.profileImage : cp?.profileImage;

  return (
    <div className="group bg-card hover:bg-muted/30 border rounded-3xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-foreground/5 overflow-hidden relative">
      <div className="flex items-start gap-4 mb-6">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center shrink-0 overflow-hidden border">
          {image ? (
            <img src={image} alt={name || ""} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xl font-serif text-muted-foreground uppercase">
              {name?.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg text-foreground truncate">{name}</h3>
          <p className="text-sm text-muted-foreground truncate">{subtext}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{location || "Remote"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3.5 w-3.5" />
          <span className="truncate">{user.email}</span>
        </div>
        {isMentor && mp?.yearsExperience ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{mp.yearsExperience} years experience</span>
          </div>
        ) : !isMentor && cp?.teamSize ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Team of {cp.teamSize}+</span>
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {isMentor
          ? mp?.skills?.slice(0, 3).map((s) => (
              <Badge key={s} variant="secondary" className="bg-muted/50 font-normal rounded-full px-3">
                {s}
              </Badge>
            ))
          : cp?.industry && (
              <Badge variant="secondary" className="bg-muted/50 font-normal rounded-full px-3">
                {cp.industry}
              </Badge>
            )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full py-16 text-center border rounded-3xl border-dashed">
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
