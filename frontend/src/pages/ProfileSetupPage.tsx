import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { useSaveProfile } from "../hooks/useQueries";
import { UserRole } from "../types";
import type { CompanyProfile, MentorProfile } from "../types";

export function ProfileSetupPage() {
  const { user } = useAuth();
  const role = user?.role ?? UserRole.mentor;
  const { mutateAsync, isPending } = useSaveProfile();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState<MentorProfile>({
    fullName: user?.mentorProfile?.fullName ?? "",
    expertise: user?.mentorProfile?.expertise ?? "",
    title: user?.mentorProfile?.title ?? "",
    bio: user?.mentorProfile?.bio ?? "",
    yearsExperience: user?.mentorProfile?.yearsExperience ?? 0,
    skills: user?.mentorProfile?.skills ?? [],
    industries: user?.mentorProfile?.industries ?? [],
    linkedinUrl: user?.mentorProfile?.linkedinUrl ?? "",
    websiteUrl: user?.mentorProfile?.websiteUrl ?? "",
    location: user?.mentorProfile?.location ?? "",
    availability: user?.mentorProfile?.availability ?? "",
    phone: user?.mentorProfile?.phone ?? "",
  });

  const [company, setCompany] = useState<CompanyProfile>({
    companyName: user?.companyProfile?.companyName ?? "",
    industry: user?.companyProfile?.industry ?? "",
    description: user?.companyProfile?.description ?? "",
    teamSize: user?.companyProfile?.teamSize ?? 0,
    mentorRequirements: user?.companyProfile?.mentorRequirements ?? "",
    contactName: user?.companyProfile?.contactName ?? "",
    contactEmail: user?.companyProfile?.contactEmail ?? "",
    contactPhone: user?.companyProfile?.contactPhone ?? "",
    websiteUrl: user?.companyProfile?.websiteUrl ?? "",
    location: user?.companyProfile?.location ?? "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [industryInput, setIndustryInput] = useState("");

  function addTag(
    field: "skills" | "industries",
    value: string,
    inputSetter: (v: string) => void,
  ) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setMentor((prev) => ({ ...prev, [field]: [...prev[field], trimmed] }));
    inputSetter("");
  }

  function removeTag(field: "skills" | "industries", index: number) {
    setMentor((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await mutateAsync({
        role,
        mentorProfile: role === UserRole.mentor ? mentor : undefined,
        companyProfile: role === UserRole.company ? company : undefined,
      });
      toast.success("Profile saved!");
      navigate({ to: "/profile" });
    } catch {
      toast.error("Failed to save profile.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
            Step 1 of 1
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-foreground mb-2">
            Complete your profile
          </h1>
          <p className="text-muted-foreground text-sm">
            This information is kept private and used only for placement
            purposes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {role === UserRole.mentor ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    data-ocid="profile_setup.full_name.input"
                    value={mentor.fullName}
                    onChange={(e) =>
                      setMentor((p) => ({ ...p, fullName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="expertise">Expertise *</Label>
                  <Input
                    id="expertise"
                    data-ocid="profile_setup.expertise.input"
                    placeholder="e.g. Software Architecture, Product Growth"
                    value={mentor.expertise}
                    onChange={(e) =>
                      setMentor((p) => ({ ...p, expertise: e.target.value, title: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  data-ocid="profile_setup.bio.textarea"
                  rows={4}
                  placeholder="Briefly describe your background, expertise, and what you offer as a mentor…"
                  value={mentor.bio}
                  onChange={(e) =>
                    setMentor((p) => ({ ...p, bio: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="years">Years of Experience *</Label>
                  <Input
                    id="years"
                    type="number"
                    min={0}
                    data-ocid="profile_setup.years_experience.input"
                    value={mentor.yearsExperience}
                    onChange={(e) =>
                      setMentor((p) => ({
                        ...p,
                        yearsExperience: Number(e.target.value) || 0,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    data-ocid="profile_setup.location.input"
                    placeholder="New York, USA"
                    value={mentor.location}
                    onChange={(e) =>
                      setMentor((p) => ({ ...p, location: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Skills</Label>
                <div className="flex gap-2">
                  <Input
                    data-ocid="profile_setup.skill.input"
                    placeholder="Add a skill and press Enter"
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
                    data-ocid="profile_setup.add_skill.button"
                    onClick={() => addTag("skills", skillInput, setSkillInput)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mentor.skills.map((skill) => (
                    <Badge
                      key={`skill-${skill}`}
                      variant="secondary"
                      className="gap-1"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() =>
                          removeTag("skills", mentor.skills.indexOf(skill))
                        }
                        aria-label={`Remove ${skill}`}
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
                    data-ocid="profile_setup.industry.input"
                    placeholder="Add an industry and press Enter"
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
                    data-ocid="profile_setup.add_industry.button"
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
                        aria-label={`Remove ${ind}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    data-ocid="profile_setup.linkedin.input"
                    placeholder="https://linkedin.com/in/…"
                    value={mentor.linkedinUrl}
                    onChange={(e) =>
                      setMentor((p) => ({ ...p, linkedinUrl: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    type="url"
                    data-ocid="profile_setup.website.input"
                    placeholder="https://…"
                    value={mentor.websiteUrl}
                    onChange={(e) =>
                      setMentor((p) => ({ ...p, websiteUrl: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    data-ocid="profile_setup.availability.input"
                    placeholder="e.g. 2 hrs/week"
                    value={mentor.availability}
                    onChange={(e) =>
                      setMentor((p) => ({ ...p, availability: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    data-ocid="profile_setup.phone.input"
                    placeholder="+1 (555) 000-0000"
                    value={mentor.phone}
                    onChange={(e) =>
                      setMentor((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    data-ocid="profile_setup.company_name.input"
                    value={company.companyName}
                    onChange={(e) =>
                      setCompany((p) => ({ ...p, companyName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="industry">Industry *</Label>
                  <Input
                    id="industry"
                    data-ocid="profile_setup.company_industry.input"
                    placeholder="Technology, Finance, Healthcare…"
                    value={company.industry}
                    onChange={(e) =>
                      setCompany((p) => ({ ...p, industry: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Company Description *</Label>
                <Textarea
                  id="description"
                  data-ocid="profile_setup.description.textarea"
                  rows={4}
                  placeholder="Describe your company, team, and why you're seeking a mentor…"
                  value={company.description}
                  onChange={(e) =>
                    setCompany((p) => ({ ...p, description: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="mentorReq">Mentor Requirements *</Label>
                <Textarea
                  id="mentorReq"
                  data-ocid="profile_setup.mentor_requirements.textarea"
                  rows={3}
                  placeholder="Describe the type of mentor you need, key skills, industry experience, availability expectations…"
                  value={company.mentorRequirements}
                  onChange={(e) =>
                    setCompany((p) => ({
                      ...p,
                      mentorRequirements: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="teamSize">Team Size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min={1}
                    data-ocid="profile_setup.team_size.input"
                    value={company.teamSize}
                    onChange={(e) =>
                      setCompany((p) => ({
                        ...p,
                        teamSize: Number(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="companyLocation">Location *</Label>
                  <Input
                    id="companyLocation"
                    data-ocid="profile_setup.company_location.input"
                    placeholder="San Francisco, USA"
                    value={company.location}
                    onChange={(e) =>
                      setCompany((p) => ({ ...p, location: e.target.value }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    data-ocid="profile_setup.contact_name.input"
                    value={company.contactName}
                    onChange={(e) =>
                      setCompany((p) => ({ ...p, contactName: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    data-ocid="profile_setup.contact_email.input"
                    value={company.contactEmail}
                    onChange={(e) =>
                      setCompany((p) => ({
                        ...p,
                        contactEmail: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    data-ocid="profile_setup.contact_phone.input"
                    value={company.contactPhone}
                    onChange={(e) =>
                      setCompany((p) => ({
                        ...p,
                        contactPhone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="companyWebsite">Website URL</Label>
                <Input
                  id="companyWebsite"
                  type="url"
                  data-ocid="profile_setup.company_website.input"
                  placeholder="https://…"
                  value={company.websiteUrl}
                  onChange={(e) =>
                    setCompany((p) => ({ ...p, websiteUrl: e.target.value }))
                  }
                />
              </div>
            </>
          )}

          <Button
            type="submit"
            disabled={isPending}
            data-ocid="profile_setup.submit_button"
            className="w-full rounded-full bg-foreground text-primary-foreground hover:bg-foreground/85 py-5"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
