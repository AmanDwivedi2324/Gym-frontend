'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { CheckCircle2, QrCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MembershipPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPlans();
    fetchPaymentSettings();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/plans/all`);
      setPlans(res.data);
    } catch (err) {
      toast.error('Failed to load plans');
    }
  };

  const fetchPaymentSettings = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/payment-settings`);
      setPaymentSettings(res.data);
    } catch (err) {
      console.log('Payment settings not found');
    }
  };

  const handleSelectPlan = (plan) => {
    if (!session) {
      toast.error("Please login to select a plan");
      router.push("/login");
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${apiUrl}/api/payment-requests/create`, {
        planId: selectedPlan._id,
        amount: selectedPlan.price,
        transactionReference: transactionRef
      }, {
        headers: { Authorization: `Bearer ${session?.accessToken}` }
      });
      toast.success("Payment request submitted for verification!");
      setIsModalOpen(false);
      setTransactionRef("");
      router.push("/profile");
    } catch (error) {
       toast.error("Failed to submit payment request");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
          Choose Your <span className="text-amber-500">Titan Plan</span>
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto mb-16 text-lg">
          No automated subscriptions. Scan the QR code, pay the exact amount, and get instant access once verified.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
             <div key={plan._id} className={`bg-[#1a1a1a] rounded-3xl p-8 border ${plan.isBestValue ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.2)] scale-105' : 'border-white/10'} relative flex flex-col`}>
               {plan.isBestValue && (
                 <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                   Best Value
                 </span>
               )}
               <h3 className="text-2xl font-bold text-white mb-2">{plan.planName}</h3>
               <div className="text-4xl font-black text-amber-500 mb-6 flex items-baseline justify-center">
                 <span className="text-2xl mr-1">₹</span>{plan.price}
                 <span className="text-sm text-zinc-400 mb-2 font-normal ml-2">/{plan.durationDays} Days</span>
               </div>
               
               <ul className="space-y-4 mb-8 text-left flex-1 text-slate-300">
                  {(Array.isArray(plan.features) ? plan.features : (plan.features || '').toString().split(',')).map((feat, i) => (
                    <li key={i} className="flex flex-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                      <span>{feat.trim()}</span>
                    </li>
                  ))}
               </ul>
               
               <button onClick={() => handleSelectPlan(plan)} className={`w-full py-4 rounded-xl font-bold uppercase tracking-wide transition-all ${plan.isBestValue ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 active:scale-95' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}>
                 Select Plan
               </button>
             </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedPlan && paymentSettings && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
           <div className="relative w-full max-w-lg bg-[#0F172A] rounded-3xl border border-slate-700 p-8">
              <h2 className="text-2xl font-black text-white text-center mb-6">Complete Payment</h2>
              
              <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 text-center border border-slate-700">
                <p className="text-slate-400 mb-2">Total Amount Due</p>
                <p className="text-4xl font-black text-amber-500">₹{selectedPlan.price}</p>
              </div>
              
              <div className="flex flex-col items-center justify-center mb-8">
                {paymentSettings.qrCodeBase64 ? (
                   <img src={paymentSettings.qrCodeBase64} alt="Pay QR" className="w-48 h-48 rounded-xl bg-white p-2 shadow-lg mb-4" />
                ) : (
                   <div className="w-48 h-48 bg-slate-800 rounded-xl flex items-center justify-center mb-4 border border-slate-700">
                     <QrCode className="w-12 h-12 text-slate-500" />
                   </div>
                )}
                
                <div className="text-center text-sm text-slate-300">
                   <p className="mb-1"><span className="text-slate-500 font-mono">UPI ID:</span> <span className="font-bold">{paymentSettings.upiId || 'Not Configured'}</span></p>
                   <p className="mb-1"><span className="text-slate-500 font-mono">A/C No:</span> <span className="font-bold">{paymentSettings.accountNumber || 'Not Configured'}</span></p>
                   <p><span className="text-slate-500 font-mono">IFSC:</span> <span className="font-bold">{paymentSettings.ifscCode || 'Not Configured'}</span></p>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">Transaction ID / UPI Ref No. (Optional)</label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full bg-[#0B1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="e.g. 123456789012"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-wide rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all active:scale-95"
                >
                  I Have Paid ₹{selectedPlan.price}
                </button>
              </form>
           </div>
         </div>
      )}
    </div>
  );
}
