import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  Clock,
  Edit2,
  ExternalLink,
  Loader2,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../types";
import type { CompanyProfile, MentorProfile } from "../types";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";

export function ProfilePage() {
  const { data: profile, isLoading } = useUserProfile();
  const { mutateAsync, isPending } = useSaveProfile();
  const [editing, setEditing] = useState(false);

  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");

  function startEdit() {
    if (profile?.mentorProfile) setMentor({ ...profile.mentorProfile });
    if (profile?.companyProfile) setCompany({ ...profile.companyProfile });
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setMentor(null);
    setCompany(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    try {
      await mutateAsync({
        role: profile.role,
        mentorProfile:
          profile.role === UserRole.mentor && mentor ? mentor : undefined,
        companyProfile:
          profile.role === UserRole.company && company ? company : undefined,
      });
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile.");
    }
  }

  function addTag(
    field: "skills" | "industries",
    value: string,
    setter: (v: string) => void,
  ) {
    const trimmed = value.trim();
    if (!trimmed || !mentor) return;
    setMentor((p) => (p ? { ...p, [field]: [...p[field], trimmed] } : p));
    setter("");
  }

  function removeTag(field: "skills" | "industries", index: number) {
    setMentor((p) =>
      p ? { ...p, [field]: p[field].filter((_, i) => i !== index) } : p,
    );
  }

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-ocid="profile.loading_state"
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        data-ocid="profile.empty_state"
      >
        <p className="text-muted-foreground">
          No profile found. Please complete setup first.
        </p>
        <Button asChild>
          <Link to="/profile/setup">Complete Profile</Link>
        </Button>
      </div>
    );
  }

  const isMentor = profile.role === UserRole.mentor;
  const mp = profile.mentorProfile;
  const cp = profile.companyProfile;

  const displayName = mp?.fullName ?? cp?.companyName ?? "Member";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-2xl bg-foreground flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-serif text-xl font-bold">
                {initials}
              </span>
            </div>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-foreground">
                {displayName}
              </h1>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="secondary" className="capitalize">
                  {profile.role}
                </Badge>
                {mp?.title && (
                  <span className="text-sm text-muted-foreground">
                    {mp.title}
                  </span>
                )}
                {cp?.industry && (
                  <span className="text-sm text-muted-foreground">
                    {cp.industry}
                  </span>
                )}
              </div>
            </div>
          </div>
          {!editing && (
            <Button
              variant="outline"
              onClick={startEdit}
              data-ocid="profile.edit.button"
              className="gap-2 rounded-full"
            >
              <Edit2 className="h-4 w-4" /> Edit
            </Button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-8">
            {isMentor && mp && (
              <>
                {mp.bio && (
                  <section>
                    <h2 className="font-serif text-lg text-foreground mb-3">
                      About
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {mp.bio}
                    </p>
                  </section>
                )}
                <Separator />
                <section className="grid sm:grid-cols-3 gap-6">
                  <div className="flex items-start gap-2.5">
                    <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        Experience
                      </p>
                      <p className="text-sm font-medium">
                        {Number(mp.yearsExperience)} years
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        Location
                      </p>
                      <p className="text-sm font-medium">
                        {mp.location || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        Availability
                      </p>
                      <p className="text-sm font-medium">
                        {mp.availability || "—"}
                      </p>
                    </div>
                  </div>
                </section>
                {mp.skills.length > 0 && (
                  <section>
                    <Separator className="mb-6" />
                    <h2 className="font-serif text-lg text-foreground mb-3">
                      Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {mp.skills.map((s) => (
                        <Badge key={`skill-${s}`} variant="secondary">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
                {mp.industries.length > 0 && (
                  <section>
                    <Separator className="mb-6" />
                    <h2 className="font-serif text-lg text-foreground mb-3">
                      Industries
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {mp.industries.map((ind) => (
                        <Badge key={`ind-${ind}`} variant="outline">
                          {ind}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
                {(mp.linkedinUrl || mp.websiteUrl) && (
                  <section>
                    <Separator className="mb-6" />
                    <h2 className="font-serif text-lg text-foreground mb-3">
                      Links
                    </h2>
                    <div className="flex gap-4">
                      {mp.linkedinUrl && (
                        <a
                          href={mp.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {mp.websiteUrl && (
                        <a
                          href={mp.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Website <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </section>
                )}
              </>
            )}

            {!isMentor && cp && (
              <>
                {cp.description && (
                  <section>
                    <h2 className="font-serif text-lg text-foreground mb-3">
                      About the Company
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {cp.description}
                    </p>
                  </section>
                )}
                <Separator />
                <section className="grid sm:grid-cols-3 gap-6">
                  <div className="flex items-start gap-2.5">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        Industry
                      </p>
                      <p className="text-sm font-medium">
                        {cp.industry || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        Team Size
                      </p>
                      <p className="text-sm font-medium">
                        {Number(cp.teamSize) || "—"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                        Location
                      </p>
                      <p className="text-sm font-medium">
                        {cp.location || "—"}
                      </p>
                    </div>
                  </div>
                </section>
                <Separator />
                <section>
                  <h2 className="font-serif text-lg text-foreground mb-3">
                    Mentor Requirements
                  </h2>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {cp.mentorRequirements || "—"}
                  </p>
                </section>
                <Separator />
                <section>
                  <h2 className="font-serif text-lg text-foreground mb-3">
                    Contact
                  </h2>
                  <p className="text-sm font-medium">{cp.contactName}</p>
                  <p className="text-sm text-muted-foreground">
                    {cp.contactEmail}
                  </p>
                  {cp.websiteUrl && (
                    <a
                      href={cp.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
                    >
                      Website <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </section>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-xl">Editing Profile</h2>
              <button
                type="button"
                onClick={cancelEdit}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isMentor && mentor && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input
                      data-ocid="profile.edit.full_name.input"
                      value={mentor.fullName}
                      onChange={(e) =>
                        setMentor((p) =>
                          p ? { ...p, fullName: e.target.value } : p,
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Title / Role</Label>
                    <Input
                      data-ocid="profile.edit.title.input"
                      value={mentor.title}
                      onChange={(e) =>
                        setMentor((p) =>
                          p ? { ...p, title: e.target.value } : p,
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Bio</Label>
                  <Textarea
                    data-ocid="profile.edit.bio.textarea"
                    rows={4}
                    value={mentor.bio}
                    onChange={(e) =>
                      setMentor((p) => (p ? { ...p, bio: e.target.value } : p))
                    }
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Years of Experience</Label>
                    <Input
                      type="number"
                      min={0}
                      data-ocid="profile.edit.years.input"
                      value={Number(mentor.yearsExperience)}
                      onChange={(e) =>
                        setMentor((p) =>
                          p
                            ? {
                                ...p,
                                yearsExperience: Number(e.target.value) || 0,
                              }
                            : p,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input
                      data-ocid="profile.edit.location.input"
                      value={mentor.location}
                      onChange={(e) =>
                        setMentor((p) =>
                          p ? { ...p, location: e.target.value } : p,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      data-ocid="profile.edit.skill.input"
                      placeholder="Add skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag("skills", skillInput, setSkillInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        addTag("skills", skillInput, setSkillInput)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mentor.skills.map((s) => (
                      <Badge
                        key={`skill-${s}`}
                        variant="secondary"
                        className="gap-1"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() =>
                            removeTag("skills", mentor.skills.indexOf(s))
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Industries</Label>
                  <div className="flex gap-2">
                    <Input
                      data-ocid="profile.edit.industry.input"
                      placeholder="Add industry"
                      value={industryInput}
                      onChange={(e) => setIndustryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag("industries", industryInput, setIndustryInput);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        addTag("industries", industryInput, setIndustryInput)
                      }
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mentor.industries.map((ind) => (
                      <Badge
                        key={`ind-${ind}`}
                        variant="secondary"
                        className="gap-1"
                      >
                        {ind}
                        <button
                          type="button"
                          onClick={() =>
                            removeTag(
                              "industries",
                              mentor.industries.indexOf(ind),
                            )
                          }
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>LinkedIn URL</Label>
                    <Input
                      type="url"
                      data-ocid="profile.edit.linkedin.input"
                      value={mentor.linkedinUrl}
                      onChange={(e) =>
                        setMentor((p) =>
                          p ? { ...p, linkedinUrl: e.target.value } : p,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Website URL</Label>
                    <Input
                      type="url"
                      data-ocid="profile.edit.website.input"
                      value={mentor.websiteUrl}
                      onChange={(e) =>
                        setMentor((p) =>
                          p ? { ...p, websiteUrl: e.target.value } : p,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Availability</Label>
                  <Input
                    data-ocid="profile.edit.availability.input"
                    value={mentor.availability}
                    onChange={(e) =>
                      setMentor((p) =>
                        p ? { ...p, availability: e.target.value } : p,
                      )
                    }
                  />
                </div>
              </>
            )}

            {!isMentor && company && (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Company Name</Label>
                    <Input
                      data-ocid="profile.edit.company_name.input"
                      value={company.companyName}
                      onChange={(e) =>
                        setCompany((p) =>
                          p ? { ...p, companyName: e.target.value } : p,
                        )
                      }
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Industry</Label>
                    <Input
                      data-ocid="profile.edit.company_industry.input"
                      value={company.industry}
                      onChange={(e) =>
                        setCompany((p) =>
                          p ? { ...p, industry: e.target.value } : p,
                        )
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Description</Label>
                  <Textarea
                    data-ocid="profile.edit.description.textarea"
                    rows={4}
                    value={company.description}
                    onChange={(e) =>
                      setCompany((p) =>
                        p ? { ...p, description: e.target.value } : p,
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Mentor Requirements</Label>
                  <Textarea
                    data-ocid="profile.edit.mentor_req.textarea"
                    rows={3}
                    value={company.mentorRequirements}
                    onChange={(e) =>
                      setCompany((p) =>
                        p ? { ...p, mentorRequirements: e.target.value } : p,
                      )
                    }
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Team Size</Label>
                    <Input
                      type="number"
                      data-ocid="profile.edit.team_size.input"
                      value={Number(company.teamSize)}
                      onChange={(e) =>
                        setCompany((p) =>
                          p
                            ? { ...p, teamSize: Number(e.target.value) || 0 }
                            : p,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Location</Label>
                    <Input
                      data-ocid="profile.edit.company_location.input"
                      value={company.location}
                      onChange={(e) =>
                        setCompany((p) =>
                          p ? { ...p, location: e.target.value } : p,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Contact Name</Label>
                    <Input
                      data-ocid="profile.edit.contact_name.input"
                      value={company.contactName}
                      onChange={(e) =>
                        setCompany((p) =>
                          p ? { ...p, contactName: e.target.value } : p,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      data-ocid="profile.edit.contact_email.input"
                      value={company.contactEmail}
                      onChange={(e) =>
                        setCompany((p) =>
                          p ? { ...p, contactEmail: e.target.value } : p,
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Website URL</Label>
                  <Input
                    type="url"
                    data-ocid="profile.edit.website.input"
                    value={company.websiteUrl}
                    onChange={(e) =>
                      setCompany((p) =>
                        p ? { ...p, websiteUrl: e.target.value } : p,
                      )
                    }
                  />
                </div>
              </>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isPending}
                data-ocid="profile.save.submit_button"
                className="flex-1 rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={cancelEdit}
                data-ocid="profile.cancel.button"
                className="rounded-full"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
