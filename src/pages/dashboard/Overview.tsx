import {
  ArrowUpRight,
  Users,
  FileText,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardOverview = () => {
  const stats = [
    {
      title: "Total Users",
      value: "2,543",
      change: "+12.5%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Documents",
      value: "1,234",
      change: "+8.2%",
      icon: FileText,
      trend: "up",
    },
    {
      title: "Growth",
      value: "23.5%",
      change: "+4.1%",
      icon: TrendingUp,
      trend: "up",
    },
    {
      title: "Revenue",
      value: "$45,234",
      change: "+15.3%",
      icon: DollarSign,
      trend: "up",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Welcome back! Here's what's happening with your account.
          </p>
        </div>
        <Button className="w-full md:w-fit text-xs md:text-sm cursor-pointer">
          <ArrowUpRight className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className="text-sm font-medium text-green-600">
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <p className="text-sm text-muted-foreground">
                  Activity item {i} - Just now
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
          <div className="grid gap-3">
            <Button variant="outline" className="justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Create New Document
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="mr-2 h-4 w-4" />
              Invite Team Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
