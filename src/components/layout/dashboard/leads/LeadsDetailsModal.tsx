import { Modal } from "@/components/ui/modal";
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  ShieldCheck,
  StickyNote,
  Clock,
  CheckCircle2,
  ArrowRight,
  PlaneTakeoff,
  Sparkles,
} from "lucide-react";
import type { Lead } from "@/types/leads";
import { cn } from "@/lib/utils";

interface Props {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusMessages: Record<string, string> = {
  New: "Lead was created and added to the system.",
  Contacted: "Initial communication established.",
  Qualified: "Lead meets all qualification requirements.",
  Converted: "Successfully converted into a customer.",
};

const LeadDetailsModal = ({ lead, isOpen, onClose }: Props) => {
  if (!lead) return null;

  const steps = ["New", "Contacted", "Qualified", "Converted"];
  const currentStepIndex = steps.indexOf(lead.status);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="xl">
      <div className="flex flex-col gap-y-8">
        {/* --- 1. HEADER SECTION --- */}
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
            <User size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {lead.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                <Building2 size={12} /> {lead.company || "Individual"}
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground text-xs">
                <Globe size={12} /> {lead.country}
              </span>
            </div>
          </div>
        </div>

        <div className="px-2">
          <div className="relative flex justify-between w-full">
            <div className="absolute top-4 left-0 w-full h-[2px] bg-muted -z-10" />
            <div
              className="absolute top-4 left-0 h-[2px] bg-primary transition-all duration-700 -z-10"
              style={{
                width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
              }}
            />
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step} className="flex flex-col items-center gap-3">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-background shadow-sm",
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                          ? "border-primary text-primary ring-4 ring-primary/10"
                          : "border-muted text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      isCurrent ? "text-primary" : "text-muted-foreground/60",
                    )}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {lead.status === "Converted" && !lead.bookingId && (
          <div className="group relative overflow-hidden bg-zinc-900 rounded-3xl p-6 text-white shadow-xl">
            <Sparkles className="absolute right-[-10px] top-[-10px] size-24 opacity-10 group-hover:rotate-12 transition-transform duration-700" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <PlaneTakeoff className="text-emerald-400" />
                  Ready for Booking
                </h3>

                <p className="text-zinc-400 text-sm">
                  All qualifications met. Transition this lead to the next
                  stage.
                </p>
              </div>

              <button className="w-full md:w-auto bg-white text-black px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 shadow-lg">
                Proceed to Booking <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[11px] font-bold uppercase text-muted-foreground tracking-[0.2em]">
                Contact Details
              </h4>
              <div className="bg-secondary/5 rounded-3xl p-6 border border-border/50 space-y-6">
                <DetailItem
                  icon={<Mail size={16} />}
                  label="Email"
                  value={lead.email}
                />
                <DetailItem
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={lead.phone}
                />
                <DetailItem
                  icon={<ShieldCheck size={16} />}
                  label="Interest"
                  value={lead.huntInterest}
                />

                <div className="pt-4 mt-4 border-t border-border/40 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium text-foreground">
                      {new Date(lead.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Registered:</span>
                    <span className="font-medium">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-10">
            <div className="space-y-6">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-foreground">
                <Clock size={16} className="text-primary" /> Activity History
              </h3>

              <div className="relative space-y-2 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-muted">
                {lead.activity && lead.activity.length > 0 ? (
                  lead.activity.map((act, idx) => (
                    <div key={idx} className="relative pl-10 group py-2">
                      <div className="absolute left-0 top-3 h-9 w-9 rounded-xl bg-background border border-border flex items-center justify-center z-10">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                      <div className="flex flex-col p-3 rounded-2xl hover:bg-secondary/20 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-foreground uppercase tracking-tight">
                            {act.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-medium">
                            {new Date(act.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {statusMessages[act.status]}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="pl-10 py-4 text-sm text-muted-foreground italic">
                    No activity recorded yet.
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/60">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-foreground">
                <StickyNote size={16} className="text-amber-500" /> Lead Notes
              </h3>
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-5 text-sm leading-relaxed text-amber-900/80 shadow-sm relative">
                <div className="absolute top-4 right-4 text-amber-200">
                  <StickyNote size={40} strokeWidth={1} />
                </div>
                <p className="relative z-10 italic">
                  "
                  {lead.note ||
                    "No additional notes have been added to this lead yet."}
                  "
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 p-2 rounded-xl bg-background border border-border/50 text-muted-foreground shadow-sm">
      {icon}
    </div>
    <div className="flex flex-col">
      <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground/90">
        {value || "N/A"}
      </span>
    </div>
  </div>
);

export default LeadDetailsModal;
