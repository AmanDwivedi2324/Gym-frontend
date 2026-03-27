"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { LayoutDashboard, Users, CreditCard, Activity, TrendingDown, Clock } from "lucide-react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [timeframe, setTimeframe] = useState("all-time");
  const [statsData, setStatsData] = useState({
    totalMembers: 0,
    activePlans: 0,
    totalExpense: 0,
    totalIncome: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!session?.accessToken) return;
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/admin/stats?timeframe=${timeframe}`, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        setStatsData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, [timeframe, session]);

  const stats = [
    { title: "Total Members", value: statsData.totalMembers, icon: Users, color: "amber" },
    { title: "Active Plans", value: statsData.activePlans, icon: Activity, color: "emerald" },
    { title: "Total Income", value: `₹${statsData.totalIncome}`, icon: CreditCard, color: "amber" },
    { title: "Total Expenses", value: `₹${statsData.totalExpense}`, icon: TrendingDown, color: "rose" },
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'amber': return 'bg-amber-500/10 text-amber-500 shadow-amber-500/20 shadow-lg';
      case 'emerald': return 'bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20 shadow-lg';
      case 'rose': return 'bg-rose-500/10 text-rose-400 shadow-rose-500/20 shadow-lg';
      default: return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-amber-600/20 to-yellow-500/10 rounded-2xl border border-amber-500/20 backdrop-blur-sm self-start">
            <LayoutDashboard className="h-7 w-7 text-amber-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent tracking-tight">Dashboard Overview</h1>
            <p className="text-slate-400 mt-1.5 text-sm font-medium">Welcome back to your gym management console.</p>
          </div>
        </div>
        
        {/* Timeframe Toggle Filter */}
        <div className="flex bg-[#0F172A] p-1.5 rounded-full border border-slate-800 shadow-inner">
          {["monthly", "yearly", "all-time"].map((type) => (
            <button
              key={type}
              onClick={() => setTimeframe(type)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                timeframe === type
                  ? "bg-amber-500 text-black shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {type.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="group bg-[#0F172A] p-6 rounded-3xl border border-slate-800 hover:border-slate-700 shadow-sm relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Glow effect */}
            <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-20 transform translate-x-1/4 -translate-y-1/4 transition-all duration-700`}>
               <div className={`w-32 h-32 rounded-full blur-3xl ${stat.color === 'amber' ? 'bg-amber-500' : stat.color === 'emerald' ? 'bg-emerald-500' : 'bg-purple-500'}`}></div>
            </div>
            
            <div className="flex justify-between items-start mb-6 align-top">
              <div className={`p-3 rounded-2xl ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" strokeWidth={2} />
              </div>
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
