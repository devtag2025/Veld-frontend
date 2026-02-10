import { Edit2, Search, Trophy } from "lucide-react";

const TrophyTable = () => {
  return (
    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-600" /> Species Pricing Master
        </h3>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-background border rounded-md py-1.5 pl-8 pr-4 text-xs"
            placeholder="Search species..."
          />
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-muted/30 text-[11px] font-bold uppercase text-muted-foreground">
          <tr>
            <th className="p-4">Species Name</th>
            <th className="p-4">Category</th>
            <th className="p-4">Price (USD)</th>
            <th className="p-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {[
            { name: "Greater Kudu", cat: "Plains Game", price: 2850 },
            { name: "Cape Buffalo", cat: "Big Five", price: 12500 },
            { name: "Sable Antelope", cat: "Rare Species", price: 6500 },
          ].map((item, i) => (
            <tr key={i} className="hover:bg-slate-50">
              <td className="p-4 font-medium">{item.name}</td>
              <td className="p-4">
                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">
                  {item.cat}
                </span>
              </td>
              <td className="p-4 font-bold text-emerald-600">
                ${item.price.toLocaleString()}
              </td>
              <td className="p-4 text-right">
                <button className="p-2 border border-slate-200 rounded-md hover:bg-primary hover:text-white cursor-pointer">
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrophyTable;
