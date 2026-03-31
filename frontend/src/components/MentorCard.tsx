import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Star } from "lucide-react";
import { type UserProfile } from "../types";
import { motion } from "motion/react";

interface MentorCardProps {
  user: UserProfile;
  index?: number;
}

export function MentorCard({ user, index = 0 }: MentorCardProps) {
  const mp = user.mentorProfile;
  const name = mp?.fullName;
  const title = mp?.title || mp?.expertise;
  const image = mp?.profileImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative h-full"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[2.5rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative h-full bg-card border rounded-[2.5rem] p-8 transition-all duration-300 hover:translate-y-[-4px] overflow-hidden flex flex-col">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full translate-x-8 -translate-y-8"></div>
        
        <div className="flex flex-col items-center text-center flex-1">
          <div className="relative mb-6">
            <div className="h-24 w-24 rounded-[2rem] bg-muted flex items-center justify-center shrink-0 overflow-hidden border shadow-inner">
              {image ? (
                <img src={image} alt={name || ""} className="h-full w-full object-cover" />
              ) : (
                <span className="text-2xl font-serif text-muted-foreground uppercase">
                  {name?.charAt(0)}
                </span>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg">
              <Star className="h-4 w-4 fill-white" />
            </div>
          </div>

          <h3 className="font-serif text-2xl text-foreground mb-1 line-clamp-1">{name}</h3>
          <p className="text-emerald-600 font-medium text-sm mb-4 line-clamp-1">{title}</p>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3 italic">
            "{mp?.bio || "Expert mentor providing strategic guidance for scaling startups."}"
          </p>

          <div className="w-full space-y-3 mb-8 mt-auto">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>{mp?.location || "Remote"}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              <span className="truncate max-w-[200px]">{user.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 min-h-[50px]">
            {mp?.skills?.slice(0, 3).map((s) => (
              <Badge key={s} variant="outline" className="text-[10px] bg-muted/30 font-normal rounded-lg px-2 py-0 border-foreground/5 shadow-sm">
                {s}
              </Badge>
            ))}
            {(mp?.skills?.length ?? 0) > 3 && (
              <Badge variant="outline" className="text-[10px] bg-muted/30 font-normal rounded-lg px-2 py-0 border-foreground/5 shadow-sm">
                +{(mp?.skills?.length ?? 0) - 3}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
