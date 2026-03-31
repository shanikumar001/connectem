import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useSelectedMentors } from "../hooks/useQueries";
import { MentorCard } from "../components/MentorCard";

export function MentorsPage() {
  const { data: mentors, isLoading } = useSelectedMentors();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 rounded-full text-foreground/60 border-foreground/10 uppercase tracking-widest text-[10px]">
            Selected Mentors
          </Badge>
          <h1 className="font-serif text-4xl sm:text-6xl text-foreground mb-6">World-Class Expertise</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Connect with industry-leading mentors who are dedicated to helping startups scale through personalized guidance and strategic networking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentors?.map((u, i) => (
            <MentorCard key={u._id} user={u} index={i} />
          ))}

          {(!mentors || mentors.length === 0) && (
            <div className="col-span-full py-24 text-center border rounded-[3rem] border-dashed bg-muted/20">
              <p className="text-muted-foreground">No mentors have been selected yet. Stay tuned!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
