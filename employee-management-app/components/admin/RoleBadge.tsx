// components/admin/RoleBadge.tsx
import { Shield, HardHat, UserRound, Calculator } from "lucide-react";

const roleStyles: any = {
  "Security Guard": { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Shield },
  "Engineer": { color: "bg-amber-100 text-amber-700 border-amber-200", icon: HardHat },
  "HR": { color: "bg-purple-100 text-purple-700 border-purple-200", icon: UserRound },
  "Accountant": { color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Calculator },
};

export default function RoleBadge({ role }: { role: string }) {
  const style = roleStyles[role] || { color: "bg-slate-100 text-slate-600", icon: UserRound };
  const Icon = style.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-tighter ${style.color}`}>
      <Icon size={12} />
      {role}
    </div>
  );
}