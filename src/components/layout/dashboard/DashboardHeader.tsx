import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl">Veld</span>
        </div>
        <div className="mx-6 hidden flex-1 md:flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-full rounded-md border bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon-sm">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;