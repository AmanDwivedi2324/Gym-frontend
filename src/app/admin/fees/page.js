'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { CreditCard, Check, X, Bell, Search, Filter } from 'lucide-react';

export default function FeeTrackingPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMonth, setFilterMonth] = useState("all");
  const [filterYear, setFilterYear] = useState("all");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (session?.accessToken) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [usersRes, reqsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/auth/users`, { headers: { Authorization: `Bearer ${session.accessToken}` }}),
        axios.get(`${apiUrl}/api/payment-requests/all`, { headers: { Authorization: `Bearer ${session.accessToken}` }})
      ]);
      
      // Sort users by next due date ascending
      const sortedUsers = usersRes.data.sort((a, b) => {
        if (!a.nextDueDate) return 1;
        if (!b.nextDueDate) return -1;
        return new Date(a.nextDueDate) - new Date(b.nextDueDate);
      });
      
      setUsers(sortedUsers);
      setRequests(reqsRes.data);
    } catch (err) {
      toast.error('Failed to load fee tracking data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestStatus = async (id, status) => {
    try {
      await axios.put(`${apiUrl}/api/payment-requests/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success(`Request ${status}`);
      fetchData(); // reload all data to see updated due dates
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  const filteredUsers = users.filter(user => {
    if (user.role === 'admin') return false;

    const q = searchQuery.toLowerCase();
    const matchQuery = 
       (user.name && user.name.toLowerCase().includes(q)) || 
       (user.memberId && user.memberId.toLowerCase().includes(q)) || 
       (user.email && user.email.toLowerCase().includes(q));

    let matchMonth = true;
    let matchYear = true;

    if (filterMonth !== 'all') {
       if (!user.nextDueDate) matchMonth = false;
       else matchMonth = new Date(user.nextDueDate).getMonth() === parseInt(filterMonth);
    }

    if (filterYear !== 'all') {
       if (!user.nextDueDate) matchYear = false;
       else matchYear = new Date(user.nextDueDate).getFullYear() === parseInt(filterYear);
    }

    return matchQuery && matchMonth && matchYear;
  });

  const availableYears = [2024, 2025, 2026, 2027, 2028];
  const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <CreditCard className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Fee Tracking</h1>
          <p className="text-slate-400 mt-1">Manage payment requests and view member due dates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment Approvals Queue */}
        <div className="lg:col-span-1">
           <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Bell className="text-amber-500 w-5 h-5" /> Pending Approvals ({pendingRequests.length})
           </h2>
           <div className="space-y-4">
              {isLoading ? (
                <div className="text-slate-500 p-4 bg-[#0F172A] rounded-2xl border border-slate-800 text-center">Loading...</div>
              ) : pendingRequests.length === 0 ? (
                <div className="text-slate-500 p-8 bg-[#0F172A] rounded-2xl border border-slate-800 text-center">No pending requests!</div>
              ) : (
                pendingRequests.map(req => (
                  <div key={req._id} className="bg-[#0F172A] p-5 rounded-2xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
                     <div className="mb-3">
                        <p className="text-white font-bold">{req.user?.name || 'Unknown'}</p>
                        <p className="text-sm text-slate-400">{req.user?.email}</p>
                     </div>
                     <div className="bg-[#0B1120] p-3 rounded-lg mb-4 text-sm border border-slate-800">
                        <p><span className="text-slate-500">Plan:</span> <span className="text-amber-500 font-bold">{req.plan?.planName}</span></p>
                        <p><span className="text-slate-500">Amount:</span> <span className="text-white">₹{req.amount}</span></p>
                        <p><span className="text-slate-500">Ref:</span> <span className="font-mono text-slate-300">{req.transactionReference || 'N/A'}</span></p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => handleRequestStatus(req._id, 'approved')} className="flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-sm">
                           <Check className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => handleRequestStatus(req._id, 'rejected')} className="flex-1 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white py-2 rounded-xl flex items-center justify-center gap-2 transition-colors font-bold text-sm">
                           <X className="w-4 h-4" /> Reject
                        </button>
                     </div>
                  </div>
                ))
              )}
           </div>
        </div>

        {/* Member Expiry Sorted List */}
        <div className="lg:col-span-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
             <h2 className="text-xl font-bold text-white">Member Due Tracking</h2>
             
             {/* Filter Controls */}
             <div className="flex gap-2">
               <div className="relative">
                 <Search className="absolute left-3 top-2.5 text-slate-500 w-4 h-4 pointer-events-none" />
                 <input 
                   type="text" 
                   placeholder="Search ID/Name..." 
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                   className="pl-9 pr-3 py-2 bg-[#0F172A] border border-slate-800 rounded-xl text-sm text-white focus:border-amber-500 focus:outline-none w-40 md:w-48"
                 />
               </div>
               <select 
                 value={filterMonth} 
                 onChange={e => setFilterMonth(e.target.value)} 
                 className="bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-amber-500 focus:outline-none"
               >
                 <option value="all">All Months</option>
                 {monthsList.map((m, i) => <option key={i} value={i}>{m}</option>)}
               </select>
               <select 
                 value={filterYear} 
                 onChange={e => setFilterYear(e.target.value)} 
                 className="bg-[#0F172A] border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-300 focus:border-amber-500 focus:outline-none"
               >
                 <option value="all">All Years</option>
                 {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
               </select>
             </div>
          </div>
          
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-300">
                    <th className="px-6 py-4 font-semibold text-sm">Member</th>
                    <th className="px-6 py-4 font-semibold text-sm">Current Plan</th>
                    <th className="px-6 py-4 font-semibold text-sm">Due Date</th>
                    <th className="px-6 py-4 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading...</td></tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No members match your filter criteria</td></tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isExpired = user.nextDueDate && new Date(user.nextDueDate) < new Date();
                      const daysUntilExpiry = user.nextDueDate ? Math.ceil((new Date(user.nextDueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
                      const expiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                      
                      return (
                        <tr key={user._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-white">{user.name}</p>
                            {user.memberId && <p className="text-xs font-mono text-amber-500 mt-1">{user.memberId}</p>}
                          </td>
                          <td className="px-6 py-4 text-slate-300 text-sm">
                            {user.currentPlan?.planName || <span className="text-slate-500">No Plan</span>}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold">
                            {user.nextDueDate ? new Date(user.nextDueDate).toLocaleDateString() : <span className="text-slate-600 font-sans font-normal">N/A</span>}
                          </td>
                          <td className="px-6 py-4">
                            {isExpired ? (
                              <span className="px-2 py-1 bg-red-500/10 text-red-500 border border-red-500/20 rounded text-xs font-bold uppercase tracking-wide">Expired</span>
                            ) : expiringSoon ? (
                              <span className="px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded text-xs font-bold uppercase tracking-wide">Due Soon ({daysUntilExpiry}d)</span>
                            ) : user.nextDueDate ? (
                              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-bold uppercase tracking-wide">Active</span>
                            ) : (
                              <span className="px-2 py-1 bg-slate-700 text-slate-400 rounded text-xs font-bold uppercase tracking-wide">Inactive</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
