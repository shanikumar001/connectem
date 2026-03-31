import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle2,
  ChevronRight,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useUpdateUserStatus, useDeleteUser, useUsers } from "../hooks/useQueries";
import { UserRole, UserStatus, type UserProfile } from "../types";

export function AdminDashboardPage() {
  const { user: currentUser } = useAuth();
  const { data: users, isLoading } = useUsers();
  const { mutateAsync: updateStatus } = useUpdateUserStatus();
  const { mutateAsync: deleteUser } = useDeleteUser();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  if (!currentUser?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Access Denied. Admins only.</p>
      </div>
    );
  }

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
          .includes(search.toLowerCase()),
    );

  async function handleUpdateStatus(id: string, status: UserStatus) {
    try {
      await updateStatus({ id, status });
      toast.success(`User marked as ${status}`);
    } catch {
      toast.error("Failed to update status.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted.");
      if (selectedUser?._id === id) setSelectedUser(null);
    } catch {
      toast.error("Failed to delete user.");
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-3xl text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage mentors, companies, and system approvals.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email…"
              className="pl-9 rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="mentors" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-8">
            <TabsTrigger value="mentors">Mentors ({mentors.length})</TabsTrigger>
            <TabsTrigger value="companies">Companies ({companies.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors">
            <UserTable
              users={filterUsers(mentors)}
              onView={setSelectedUser}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          </TabsContent>

          <TabsContent value="companies">
            <UserTable
              users={filterUsers(companies)}
              onView={setSelectedUser}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDelete}
            />
          </TabsContent>
        </Tabs>
      </div>

      <UserDetailModal
        user={selectedUser}
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdateStatus={handleUpdateStatus}
        onDelete={handleDelete}
      />
    </div>
  );
}

function UserTable({
  users,
  onView,
  onUpdateStatus,
  onDelete,
}: {
  users: UserProfile[];
  onView: (u: UserProfile) => void;
  onUpdateStatus: (id: string, status: UserStatus) => void;
  onDelete: (id: string) => void;
}) {
  if (users.length === 0) {
    return (
      <div className="py-12 text-center border rounded-2xl border-dashed">
        <p className="text-muted-foreground">No users found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name / Email
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Joined
              </th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((u) => {
              const name = u.mentorProfile?.fullName ?? u.companyProfile?.companyName ?? "Unknown";
              const isApproved = u.isApproved;
              const isComplete = u.isProfileCompleted;

              return (
                <tr
                  key={u._id}
                  className="hover:bg-muted/20 transition-colors group cursor-pointer"
                  onClick={() => onView(u)}
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Badge variant={isComplete ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0">
                        {isComplete ? "Profile Complete" : "Incomplete"}
                      </Badge>
                      <StatusBadge status={u.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(u._id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UserDetailModal({
  user,
  open,
  onClose,
  onUpdateStatus,
  onDelete,
}: {
  user: UserProfile | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: UserStatus) => void;
  onDelete: (id: string) => void;
}) {
  if (!user) return null;

  const isMentor = user.role === UserRole.mentor;
  const mp = user.mentorProfile;
  const cp = user.companyProfile;
  const name = mp?.fullName ?? cp?.companyName ?? "User Details";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="font-serif text-2xl">{name}</DialogTitle>
            <Badge variant="outline" className="capitalize">{user.role}</Badge>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-8">
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            <InfoItem label="Email" icon={<Mail className="h-3.5 w-3.5" />} value={user.email} />
            {isMentor ? (
              <>
                <InfoItem label="Phone" icon={<Phone className="h-3.5 w-3.5" />} value={mp?.phone} />
                <InfoItem label="Expertise" value={mp?.expertise} />
                <InfoItem label="Experience" value={mp?.yearsExperience ? `${mp.yearsExperience} years` : undefined} />
                <InfoItem label="Location" icon={<MapPin className="h-3.5 w-3.5" />} value={mp?.location} />
              </>
            ) : (
              <>
                <InfoItem label="Contact Phone" icon={<Phone className="h-3.5 w-3.5" />} value={cp?.contactPhone} />
                <InfoItem label="Industry" value={cp?.industry} />
                <InfoItem label="Team Size" value={cp?.teamSize?.toString()} />
                <InfoItem label="Location" icon={<MapPin className="h-3.5 w-3.5" />} value={cp?.location} />
              </>
            )}
          </div>

          <div className="space-y-4">
            {isMentor ? (
              <>
                <Section label="Bio" content={mp?.bio} />
                <TagSection label="Skills" tags={mp?.skills} />
                <TagSection label="Industries" tags={mp?.industries} />
              </>
            ) : (
              <>
                <Section label="Description" content={cp?.description} />
                <Section label="Mentor Requirements" content={cp?.mentorRequirements} />
                <InfoItem label="Contact Name" value={cp?.contactName} />
                <InfoItem label="Contact Email" icon={<Mail className="h-3.5 w-3.5" />} value={cp?.contactEmail} />
              </>
            )}
          </div>

          <div className="pt-6 border-t flex flex-col gap-4">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Update Status</p>
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={user.status === UserStatus.interview ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => {
                    onUpdateStatus(user._id, UserStatus.interview);
                    onClose();
                  }}
                >
                  Interview
                </Button>
                <Button
                  size="sm"
                  variant={user.status === UserStatus.pass ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => {
                    onUpdateStatus(user._id, UserStatus.pass);
                    onClose();
                  }}
                >
                  Pass
                </Button>
                <Button
                  size="sm"
                  variant={user.status === UserStatus.selected ? "default" : "outline"}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                  onClick={() => {
                    onUpdateStatus(user._id, UserStatus.selected);
                    onClose();
                  }}
                >
                  <UserCheck className="mr-2 h-4 w-4" /> Selected
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/5 rounded-full"
                onClick={() => {
                  onDelete(user._id);
                  onClose();
                }}
              >
                Delete Account
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              ID: {user._id}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({ label, value, icon }: { label: string; value?: string; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-1.5 min-h-[1.25rem]">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <p className="text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}

function Section({ label, content }: { label: string; content?: string }) {
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <p className="text-sm text-foreground/80 leading-relaxed bg-muted/30 p-4 rounded-xl">
        {content || "No information provided."}
      </p>
    </div>
  );
}

function TagSection({ label, tags }: { label: string; tags?: string[] }) {
  if (!tags?.length) return null;
  return (
    <div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <Badge key={t} variant="secondary" className="font-normal">
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: UserStatus }) {
  switch (status) {
    case UserStatus.selected:
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 border-emerald-200 text-[10px] px-1.5 py-0">
          Selected
        </Badge>
      );
    case UserStatus.interview:
      return (
        <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 border-blue-200 text-[10px] px-1.5 py-0">
          Interview
        </Badge>
      );
    case UserStatus.pass:
      return (
        <Badge className="bg-gray-500/10 text-gray-600 hover:bg-gray-500/10 border-gray-200 text-[10px] px-1.5 py-0">
          Pass
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
          Pending
        </Badge>
      );
  }
}
