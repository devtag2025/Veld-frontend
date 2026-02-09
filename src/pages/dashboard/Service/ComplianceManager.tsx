import { Button } from "@/components/ui/button";
import { Plane, Settings2 } from "lucide-react";

const ComplianceManager = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-card border rounded-xl space-y-4">
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Settings2 className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg">Option A: Company Rifles</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          These rifles will appear in the digital booking form for client
          selection.
        </p>
        <div className="space-y-2">
          {[".375 H&H Magnum", ".30-06 Springfield"].map((rifle) => (
            <div
              key={rifle}
              className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border"
            >
              <span className="text-sm font-medium">{rifle}</span>
              <span className="text-[10px] text-emerald-600 font-bold">
                Available
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-900 text-white rounded-xl space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-700 pb-4">
          <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
            <Plane className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg text-white">
            Option B: Own Rifle (Permits)
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Links embedded in automated emails/contracts for clients bringing
          their own firearms.
        </p>
        <div className="space-y-3">
          <div className="bg-slate-800 p-3 rounded border border-slate-700">
            <label className="text-[10px] text-slate-500 block mb-1">
              SAPS Permit Link
            </label>
            <div className="text-xs truncate text-blue-400 underline">
              https://saps.gov.za/permits/firearm-import.pdf
            </div>
          </div>
          <Button
            size="sm"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Update Permit Instructions
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceManager;
