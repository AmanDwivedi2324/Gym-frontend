'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

export default function PlansPage() {
  const { data: session } = useSession();
  const [plans, setPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    planName: '',
    price: '',
    durationDays: 30,
    features: '',
    isBestValue: false
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiUrl}/api/plans/all`);
      setPlans(res.data);
    } catch (error) {
      toast.error('Failed to fetch plans');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        planName: plan.planName,
        price: plan.price,
        durationDays: plan.durationDays,
        features: plan.features ? plan.features.join(', ') : '',
        isBestValue: plan.isBestValue || false
      });
    } else {
      setEditingPlan(null);
      setFormData({
        planName: '',
        price: '',
        durationDays: 30,
        features: '',
        isBestValue: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      };

      if (editingPlan) {
        await axios.put(`${apiUrl}/api/plans/${editingPlan._id}`, payload, {
          headers: { Authorization: `Bearer ${session?.accessToken}` }
        });
        toast.success("Plan updated successfully!");
      } else {
        await axios.post(`${apiUrl}/api/plans/create`, payload, {
          headers: { Authorization: `Bearer ${session?.accessToken}` }
        });
        toast.success("Plan created successfully!");
      }
      
      closeModal();
      fetchPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    
    try {
      await axios.delete(`${apiUrl}/api/plans/${id}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` }
      });
      toast.success("Plan deleted successfully");
      fetchPlans();
    } catch (error) {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Membership Plans</h1>
          <p className="text-slate-400 mt-1">Manage pricing tiers and packages offered to members.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create New Plan
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-300">
                <th className="px-6 py-4 font-semibold text-sm">Plan Name</th>
                <th className="px-6 py-4 font-semibold text-sm">Price</th>
                <th className="px-6 py-4 font-semibold text-sm">Duration</th>
                <th className="px-6 py-4 font-semibold text-sm">Features</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="flex justify-center mb-4">
                      <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></div>
                    </div>
                    Loading plans...
                  </td>
                </tr>
              ) : plans.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-50" />
                    <p>No plans found. Create one to get started.</p>
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{plan.planName}</div>
                      {plan.isBestValue && (
                         <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                           Best Value
                         </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium text-emerald-400">
                      ${plan.price}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {plan.durationDays} Days
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">
                      {plan.features?.join(', ') || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                          onClick={() => openModal(plan)}
                          className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(plan._id)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg bg-[#0F172A] rounded-2xl border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold tracking-tight text-white">
                {editingPlan ? 'Edit Plan' : 'Create New Plan'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-2">
                  <label className="block text-sm font-medium tracking-wide text-slate-300 mb-2">Plan Name</label>
                  <input
                    type="text"
                    name="planName"
                    value={formData.planName}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="e.g. Monthly Standard"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium tracking-wide text-slate-300 mb-2">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    placeholder="49.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium tracking-wide text-slate-300 mb-2">Duration (Days)</label>
                  <input
                    type="number"
                    name="durationDays"
                    value={formData.durationDays}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    placeholder="30"
                    required
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium tracking-wide text-slate-300 mb-2">Features (comma separated)</label>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleInputChange}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all min-h-[100px] resize-none"
                    placeholder="Gym Access, Free WiFi, Group Classes"
                  ></textarea>
                </div>

                <div className="col-span-2">
                  <label className="flex items-center gap-3 p-4 border border-slate-700 rounded-xl bg-[#0B1120] cursor-pointer hover:border-slate-600 transition-colors">
                    <input
                      type="checkbox"
                      name="isBestValue"
                      checked={formData.isBestValue}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-slate-600 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 bg-slate-800"
                    />
                    <div>
                      <span className="block text-sm font-medium text-white">Mark as Best Value</span>
                      <span className="block text-xs text-slate-400 mt-0.5">Highlight this plan on the pricing page</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-500 hover:bg-amber-400 text-black transition-colors shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-2"
                >
                  {editingPlan ? 'Update Plan' : 'Save Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
