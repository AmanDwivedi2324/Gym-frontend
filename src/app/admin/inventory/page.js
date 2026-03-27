'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ShoppingBag, Edit2, Trash2, Plus, AlertCircle } from 'lucide-react';

export default function InventoryPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Other',
    quantity: 1,
    condition: 'Good',
    purchasePrice: '',
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (session?.accessToken) fetchInventory();
  }, [session]);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${apiUrl}/api/inventory/all`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      setItems(res.data);
    } catch (error) {
      toast.error('Failed to fetch inventory');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        itemName: item.itemName,
        category: item.category || 'Other',
        quantity: item.quantity,
        condition: item.condition || 'Good',
        purchasePrice: item.purchasePrice || '',
      });
    } else {
      setEditingItem(null);
      setFormData({ itemName: '', category: 'Other', quantity: 1, condition: 'Good', purchasePrice: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${apiUrl}/api/inventory/${editingItem._id}`, formData, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        toast.success("Item updated successfully!");
      } else {
        await axios.post(`${apiUrl}/api/inventory/add`, formData, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        });
        toast.success("Item added successfully!");
      }
      closeModal();
      fetchInventory();
    } catch (error) {
      toast.error('Failed to save item');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this specific item trace?')) return;
    try {
      await axios.delete(`${apiUrl}/api/inventory/${id}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      toast.success("Item deleted");
      fetchInventory();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <ShoppingBag className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Gym Inventory</h1>
            <p className="text-slate-400 mt-1">Manage physical hardware, supplies, and gym machinery.</p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-800 text-slate-300">
                <th className="px-6 py-4 font-semibold text-sm">Item Name</th>
                <th className="px-6 py-4 font-semibold text-sm">Category</th>
                <th className="px-6 py-4 font-semibold text-sm">Condition</th>
                <th className="px-6 py-4 font-semibold text-sm">Quantity</th>
                <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Loading inventory...</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Inventory is empty.</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4 font-medium text-white">{item.itemName}</td>
                    <td className="px-6 py-4 text-slate-400 text-sm">{item.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${
                         item.condition === 'New' || item.condition === 'Good' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                         item.condition === 'Needs Repair' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                         'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {item.condition}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white font-mono">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal(item)} className="p-2 text-slate-400 hover:text-blue-400 transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-rose-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
              {editingItem ? 'Edit Inventory Item' : 'Add Inventory Item'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Item Name</label>
                <input required type="text" value={formData.itemName} onChange={(e) => setFormData({...formData, itemName: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500" placeholder="E.g. Treadmill Pro"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm text-slate-300 mb-2">Quantity</label>
                   <input required type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono" />
                </div>
                <div>
                   <label className="block text-sm text-slate-300 mb-2">Category</label>
                   <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="Machine">Machine</option>
                      <option value="Free Weight">Free Weight</option>
                      <option value="Accessory">Accessory</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Merchandise">Merchandise</option>
                      <option value="Other">Other</option>
                   </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm text-slate-300 mb-2">Condition</label>
                   <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="New">New</option>
                      <option value="Good">Good</option>
                      <option value="Needs Repair">Needs Repair</option>
                      <option value="Out of Service">Out of Service</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm text-slate-300 mb-2">Cost (Optional)</label>
                   <input type="number" step="0.01" value={formData.purchasePrice} onChange={(e) => setFormData({...formData, purchasePrice: e.target.value})} className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500 font-mono" placeholder="250.00" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-300 hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/20">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
