'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Users, Edit2, Trash2, X, AlertCircle, Search, UserPlus } from 'lucide-react';

export default function MembersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [plans, setPlans] = useState([]);
  const [offlineData, setOfflineData] = useState({ name: '', phone: '', planId: '', durationDays: 30, amount: '' });
  
  const [formData, setFormData] = useState({
    role: 'member',
    membershipStatus: 'active',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (session?.accessToken) fetchUsers();
  }, [session]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const [userRes, planRes] = await Promise.all([
        axios.get(`${apiUrl}/api/auth/users`, { headers: { Authorization: `Bearer ${session.accessToken}` }}),
        axios.get(`${apiUrl}/api/plans/all`)
      ]);
      setUsers(userRes.data);
      setPlans(planRes.data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (user) => {
    setEditingUser(user);
    setFormData({
      role: user.role,
      membershipStatus: user.membershipStatus || 'active',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/api/auth/${editingUser._id}`, formData, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success("User updated successfully!");
      closeModal();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleOfflineSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/admin/offline-member`, offlineData, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success("Offline member securely injected!");
      setIsOfflineModalOpen(false);
      setOfflineData({ name: '', phone: '', planId: '', durationDays: 30, amount: '' });
      fetchUsers();
    } catch (error) {
       toast.error("Failed to inject offline member");
    }
  };

  const filteredUsers = users.filter(user => {
    const q = searchQuery.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q)) ||
      (user.memberId && user.memberId.toLowerCase().includes(q))
    );
  });

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${apiUrl}/api/auth/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <Users className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Members</h1>
          <p className="text-slate-400 mt-1">View registered users and manage their statuses.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Name, Email, or Member ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#0F172A] border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
          />
        </div>
        <button
          onClick={() => setIsOfflineModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-3 rounded-2xl font-bold uppercase tracking-wide flex items-center gap-2 justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" /> Walk-In Member
        </button>
      </div>

      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-300">
                <th className="px-6 py-4 font-semibold text-sm">Name</th>
                <th className="px-6 py-4 font-semibold text-sm">Email</th>
                <th className="px-6 py-4 font-semibold text-sm">Role</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading members...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No members found matching "{searchQuery}".</td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                       <p className="font-medium text-white">{user.name}</p>
                       {user.memberId && <p className="text-xs font-mono text-amber-500 mt-1">{user.memberId}</p>}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-700 text-slate-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        user.membershipStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        user.membershipStatus === 'expired' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {user.membershipStatus || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-amber-500 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(user._id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-md bg-[#0F172A] rounded-2xl border border-slate-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Modify User: {editingUser?.name}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Role</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Membership Status</label>
                <select value={formData.membershipStatus} onChange={(e) => setFormData({...formData, membershipStatus: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white">
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 font-bold text-black rounded-xl">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isOfflineModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOfflineModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#0F172A] rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-widest text-amber-500">Inject Walk-in Member</h2>
            <form onSubmit={handleOfflineSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Full Name</label>
                <input required type="text" placeholder="John Doe" value={offlineData.name} onChange={(e) => setOfflineData({...offlineData, name: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"/>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Phone No. (Optional)</label>
                <input type="text" placeholder="+91 XXXX" value={offlineData.phone} onChange={(e) => setOfflineData({...offlineData, phone: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"/>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Enroll In Plan</label>
                <select required value={offlineData.planId} onChange={(e) => {
                   const plan = plans.find(p => p._id === e.target.value);
                   setOfflineData({...offlineData, planId: e.target.value, durationDays: plan ? plan.durationDays : 30, amount: plan ? plan.price : ''});
                }} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none">
                  <option value="" disabled>Select a Plan</option>
                  {plans.map(p => (
                    <option key={p._id} value={p._id}>{p.planName} (₹{p.price})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Revenue Tracked (₹)</label>
                <input required type="number" placeholder="Amount collected" value={offlineData.amount} onChange={(e) => setOfflineData({...offlineData, amount: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500"/>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsOfflineModalOpen(false)} className="px-4 py-2 text-slate-300 hover:text-white font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-amber-500 hover:bg-amber-400 font-bold text-black uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-all">Enroll Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
