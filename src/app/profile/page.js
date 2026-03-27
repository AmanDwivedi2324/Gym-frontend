'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { User, Calendar, CreditCard, ShieldCheck, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.accessToken) {
      if (session?.user?.role === 'admin') {
         router.push('/admin'); // Admins don't need a member profile
      } else {
         fetchProfile();
         fetchRequests();
      }
    }
  }, [session, status]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setProfile(res.data);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/payment-requests/my-requests`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.log('Failed to fetch requests');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f0f0f] pt-24 text-center text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
        
        <div className="bg-[#111111] rounded-3xl border border-white/5 p-8 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
          <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 shrink-0">
            <User className="w-12 h-12 text-amber-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white">{profile?.name}</h1>
            <p className="text-slate-400 mb-4">{profile?.email}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border ${profile?.membershipStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                 {profile?.membershipStatus === 'active' ? 'Active Member' : 'Inactive'}
               </span>
               <span className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border bg-slate-800 text-slate-300 border-slate-700">
                 Role: {profile?.role}
               </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
           {/* Current Plan Card */}
           <div className="bg-[#111111] p-6 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3 mb-6">
                <Activity className="text-amber-500" />
                <h2 className="text-xl font-bold text-white">Current Plan</h2>
             </div>
             {profile?.currentPlan ? (
               <div>
                  <h3 className="text-2xl font-black text-amber-500 mb-2">{profile.currentPlan.planName}</h3>
                  <p className="text-slate-400 mb-4">You are currently subscribed to the {profile.currentPlan.durationDays}-day cycle.</p>
                  <p className="font-mono text-xl text-white">₹{profile.currentPlan.price}</p>
               </div>
             ) : (
               <div className="text-center py-6">
                 <p className="text-slate-500 mb-4">No active plan found.</p>
                 <Link href="/membership" className="text-amber-500 hover:text-amber-400 font-bold border border-amber-500 px-4 py-2 rounded-xl transition-all hover:bg-amber-500 hover:text-black">
                    Choose a Plan
                 </Link>
               </div>
             )}
           </div>

           {/* Membership Status Card */}
           <div className="bg-[#111111] p-6 rounded-2xl border border-white/5">
             <div className="flex items-center gap-3 mb-6">
                <Calendar className="text-amber-500" />
                <h2 className="text-xl font-bold text-white">Next Due Date</h2>
             </div>
             <div>
                {profile?.nextDueDate ? (
                  <>
                    <h3 className="text-3xl font-black text-white mb-2">
                       {new Date(profile.nextDueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </h3>
                    <p className="text-slate-400">
                      {new Date(profile.nextDueDate) < new Date() ? (
                         <span className="text-red-400 font-bold">Your plan has expired. Please renew.</span>
                      ) : (
                         <span>Your account is in good standing.</span>
                      )}
                    </p>
                  </>
                ) : (
                  <p className="text-slate-500">N/A</p>
                )}
             </div>
           </div>
        </div>

        {/* Payment Requests History */}
        <div className="bg-[#111111] p-6 rounded-2xl border border-white/5">
           <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-amber-500" />
              <h2 className="text-xl font-bold text-white">Payment Requests</h2>
           </div>
           
           {requests.length === 0 ? (
             <p className="text-slate-500 text-center py-4">No recent payment requests.</p>
           ) : (
             <div className="space-y-4">
                {requests.map(req => (
                  <div key={req._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5">
                     <div>
                       <p className="text-white font-bold">{req.plan?.planName || 'Unknown Plan'} <span className="text-slate-400 font-normal">| ₹{req.amount}</span></p>
                       <p className="text-xs text-slate-500 mt-1">Ref: {req.transactionReference || 'N/A'} • {new Date(req.createdAt).toLocaleDateString()}</p>
                     </div>
                     <div className="mt-3 sm:mt-0">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                         req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                         req.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                         'bg-amber-500/10 text-amber-500 animate-pulse'
                       }`}>
                         {req.status}
                       </span>
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>

      </div>
    </div>
  );
}
