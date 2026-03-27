import { LayoutDashboard, Users, CreditCard, Activity } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Members", value: "1,248", change: "+12%", trend: "up", icon: Users, color: "blue" },
    { title: "Active Plans", value: "12", change: "+2", trend: "up", icon: Activity, color: "emerald" },
    { title: "Monthly Revenue", value: "$24,500", change: "+8.4%", trend: "up", icon: CreditCard, color: "purple" },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-500/10 text-blue-400 shadow-blue-500/20 shadow-lg';
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20 shadow-lg';
      case 'purple': return 'bg-purple-500/10 text-purple-400 shadow-purple-500/20 shadow-lg';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 rounded-2xl border border-indigo-500/20 backdrop-blur-sm self-start">
            <LayoutDashboard className="h-7 w-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">Welcome back to your gym management console.</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-[#0F172A] p-6 rounded-3xl border border-slate-800 hover:border-slate-700 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Glow effect */}
            <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 transform translate-x-1/4 -translate-y-1/4 transition-all duration-700`}>
               <div className={`w-32 h-32 rounded-full blur-3xl ${stat.color === 'blue' ? 'bg-blue-500' : stat.color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>
            </div>
            
            <div className="flex justify-between items-start mb-6 align-top">
              <div className={`p-3 rounded-2xl ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                {stat.change}
              </span>
            </div>
            
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1 tracking-wide uppercase">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
