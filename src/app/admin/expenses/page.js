'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { CircleDollarSign, Edit2, Trash2, Plus, X } from 'lucide-react';

export default function ExpensesPage() {
  const { data: session } = useSession();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Other',
    description: '',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (session?.accessToken) fetchExpenses();
  }, [session]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiUrl}/api/expenses/all`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setExpenses(res.data);
    } catch (error) {
      toast.error('Failed to fetch expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        title: expense.title,
        amount: expense.amount,
        category: expense.category || 'Other',
        description: expense.description || '',
      });
    } else {
      setEditingExpense(null);
      setFormData({ title: '', amount: '', category: 'Other', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await axios.put(`${apiUrl}/api/expenses/${editingExpense._id}`, formData, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        toast.success("Expense updated successfully!");
      } else {
        await axios.post(`${apiUrl}/api/expenses/add`, formData, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        toast.success("Expense logged successfully!");
      }
      closeModal();
      fetchExpenses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`${apiUrl}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 rounded-xl">
            <CircleDollarSign className="h-6 w-6 text-rose-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Financial Expenses</h1>
            <p className="text-slate-400 mt-1">Track gym maintenance, equipment, and utility costs.</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-rose-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Log Expense
        </button>
      </div>

      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-300">
                <th className="px-6 py-4 font-semibold text-sm">Title</th>
                <th className="px-6 py-4 font-semibold text-sm">Amount</th>
                <th className="px-6 py-4 font-semibold text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-sm">Date</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading expenses...</td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">No expenses logged yet.</td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{expense.title}</td>
                    <td className="px-6 py-4 text-rose-400 font-mono font-bold">${expense.amount}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-xs">{expense.category}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{new Date(expense.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(expense)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(expense._id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
            <h2 className="text-xl font-bold text-white mb-6">
              {editingExpense ? 'Modify Expense' : 'Log New Expense'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none" placeholder="E.g. Monthly Electricity"/>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Amount ($)</label>
                <input required type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-rose-500 outline-none font-mono" placeholder="150.00" />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none">
                  <option value="Equipment">Equipment</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-rose-500" placeholder="Details about this expense..."></textarea>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-500/20">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
