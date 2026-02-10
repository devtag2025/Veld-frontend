import { useState } from "react";
import { Trophy, Target, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import TrophyTable from "./Service/TrophyTable";
import ComplianceManager from "./Service/ComplianceManager";
import PackageManager from "./Service/PackageManager";

const ServicesPage = () => {
  const tabs = [
    {
      label: "Packages",
      value: "packages",
      icon: Target,
    },
    {
      label: "Trophy List",
      value: "trophies",
      icon: Trophy,
    },
    {
      label: "Compliance (Firearms)",
      value: "compliance",
      icon: ShieldAlert,
    },
  ];

  const [activeTab, setActiveTab] = useState("trophies");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            System Configuration
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your master data to ensure automated calculations in
            contracts and invoices.
          </p>
        </div>
        <Button className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" /> Add New Entry
        </Button>
      </div>

      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        {tabs.map((tab) => (
          <TabButton
            key={tab.label}
            active={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
            icon={tab.icon}
            label={tab.label}
          />
        ))}
      </div>

      {activeTab === "trophies" && <TrophyTable />}
      {activeTab === "packages" && <PackageManager />}
      {activeTab === "compliance" && <ComplianceManager />}
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all cursor-pointer ${
      active
        ? "bg-white shadow-sm text-primary"
        : "text-muted-foreground hover:text-slate-900"
    }`}
  >
    <Icon className="h-4 w-4" /> {label}
  </button>
);

export default ServicesPage;
