'use client';

import { useState } from "react";
import { Mail, X, Loader2, CheckCircle2 } from "lucide-react";
import { sendApplicationEmail } from "@/app/actions/email"; // Import Server Action

export default function ApplyButton({ jobTitle }: { jobTitle: string }) {
  const [showPopup, setShowPopup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Tarik semua data dari elemen input di form (menggunakan atribut 'name')
    const formData = new FormData(e.currentTarget);
    formData.append('jobTitle', jobTitle); // Menyisipkan nama posisi pekerjaan

    // Kirim ke backend untuk diemail via Resend
    const result = await sendApplicationEmail(formData);

    if (result.success) {
      setSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setShowPopup(false);
        setSuccess(false);
      }, 3000); // Popup tertutup otomatis setelah 3 detik
    } else {
      setSubmitting(false);
      alert("Maaf, gagal mengirim lamaran. Silakan coba lagi.");
      console.error(result.error);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowPopup(true)}
        className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-sm font-medium hover:bg-opacity-80 transition-all uppercase tracking-widest text-[13px]"
      >
        <Mail size={16} /> Apply for this position
      </button>

      {/* POPUP MODAL APPLY FORM */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-sm w-full max-w-lg p-8 md:p-10 relative shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors">
              <X size={24} />
            </button>
            
            {success ? (
              <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in">
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <h3 className="text-2xl font-bold text-black mb-2 uppercase">Success!</h3>
                <p className="text-gray-500 text-[14px]">Lamaran berhasil dikirimkan.</p>
              </div>
            ) : (
              <>
                <h3 className="text-[18px] font-bold uppercase tracking-tight mb-8 pr-6">Apply: {jobTitle}</h3>
                
                <form onSubmit={handleApply} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-[#999999] uppercase tracking-widest font-medium">Nama Lengkap</label>
                    <input required type="text" name="name" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-[14px]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-[#999999] uppercase tracking-widest font-medium">WhatsApp</label>
                    <input required type="tel" name="phone" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-[14px]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] text-[#999999] uppercase tracking-widest font-medium">Email</label>
                    <input required type="email" name="email" className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-black transition-colors text-[14px]" />
                  </div>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[11px] text-[#999999] uppercase tracking-widest font-medium">Upload CV (PDF Max 10MB)</label>
                    <input required type="file" name="cv" accept=".pdf" className="text-[13px] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:font-medium file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer" />
                  </div>
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-[11px] text-[#999999] uppercase tracking-widest font-medium">Upload Portfolio (PDF Max 10MB)</label>
                    <input required type="file" name="portfolio" accept=".pdf" className="text-[13px] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:font-medium file:bg-gray-100 file:text-black hover:file:bg-gray-200 cursor-pointer" />
                  </div>
                  
                  <button type="submit" disabled={submitting} className="w-full bg-black text-white py-4 mt-4 rounded-sm font-medium hover:bg-opacity-90 flex items-center justify-center gap-2 uppercase tracking-widest text-[13px] transition-all">
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : "Submit Application"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}