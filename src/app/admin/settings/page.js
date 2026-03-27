'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { QrCode, CreditCard, Save } from 'lucide-react';

export default function PaymentSettingsPage() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    accountNumber: '',
    ifscCode: '',
    upiId: '',
    qrCodeBase64: '',
  });
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (session?.accessToken) fetchSettings();
  }, [session]);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/payment-settings`);
      if (res.data) setFormData(res.data);
    } catch (err) {
      toast.error('Failed to load payment settings');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, qrCodeBase64: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`${apiUrl}/api/payment-settings`, formData, {
        headers: { Authorization: `Bearer ${session?.accessToken}` }
      });
      toast.success('Payment settings updated!');
    } catch (err) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-500/10 rounded-xl">
          <CreditCard className="h-6 w-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Payment Settings</h1>
          <p className="text-slate-400 mt-1">Configure your bank and UPI details for members to pay you directly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">IFSC Code</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="HDFC0001234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">UPI ID</label>
              <input
                type="text"
                value={formData.upiId}
                onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="xyzgym@upi"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Upload QR Code</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 transition-all cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-5 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-bold text-white mb-6">QR Code Preview</h2>
          <div className="w-64 h-64 bg-[#0B1120] border border-slate-700 rounded-xl flex items-center justify-center overflow-hidden relative">
            {formData.qrCodeBase64 ? (
              <img src={formData.qrCodeBase64} alt="QR Code" className="w-full h-full object-contain p-4 bg-white" />
            ) : (
              <div className="text-slate-500 flex flex-col items-center gap-3">
                <QrCode size={48} className="opacity-50" />
                <span className="text-sm border border-slate-700 px-3 py-1 rounded-full">No QR Uploaded</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
