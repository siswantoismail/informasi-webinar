import React, { useState } from 'react';
import { X, Settings, RotateCcw, Check, Clock, Sparkles, Image, Upload } from 'lucide-react';
import { EventDetails } from '../types';
import { INITIAL_EVENT_DETAILS } from '../data/initialData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventDetails;
  onSave: (updated: EventDetails) => void;
  onReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  event,
  onSave,
  onReset
}) => {
  const [formData, setFormData] = useState<EventDetails>({ ...event });
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Preset quick helpers for panitia testing
  const setQuickTime = (minutesFromNow: number) => {
    const target = new Date();
    target.setMinutes(target.getMinutes() + minutesFromNow);
    setFormData((prev) => ({
      ...prev,
      targetDateTime: target.toISOString()
    }));
  };

  const handleTestFinish = () => {
    const target = new Date();
    target.setSeconds(target.getSeconds() - 5);
    setFormData((prev) => ({
      ...prev,
      targetDateTime: target.toISOString()
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logoUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  const toLocalInputValue = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-blue-100 p-6 sm:p-7 shadow-2xl text-slate-900">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Pengaturan Panitia Webinar
            </h3>
            <p className="text-xs text-slate-500">
              Atur waktu hitung mundur dan logo kementerian.
            </p>
          </div>
        </div>

        {/* Quick Simulation Presets Strip */}
        <div className="mb-5 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            Preset Waktu Hitung Mundur:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setQuickTime(5)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white hover:bg-blue-100/60 text-blue-900 border border-blue-200 font-medium transition-colors"
            >
              + 5 Menit
            </button>
            <button
              type="button"
              onClick={() => setQuickTime(15)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white hover:bg-blue-100/60 text-blue-900 border border-blue-200 font-medium transition-colors"
            >
              + 15 Menit
            </button>
            <button
              type="button"
              onClick={() => setQuickTime(60)}
              className="px-3 py-1.5 text-xs rounded-lg bg-white hover:bg-blue-100/60 text-blue-900 border border-blue-200 font-medium transition-colors"
            >
              + 1 Jam
            </button>
            <button
              type="button"
              onClick={handleTestFinish}
              className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Mulai Sekarang
            </button>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Target Countdown Date/Time */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Waktu Hitung Mundur
            </label>
            <input
              type="datetime-local"
              value={toLocalInputValue(formData.targetDateTime)}
              onChange={(e) => {
                const val = e.target.value;
                if (val) {
                  setFormData({ ...formData, targetDateTime: new Date(val).toISOString() });
                }
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-blue-500 focus:bg-white"
              required
            />
          </div>

          {/* Logo Kementerian Slot */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Logo Kementerian (Beserta Nama)</span>
              {formData.logoUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, logoUrl: '' }))}
                  className="text-[11px] text-rose-600 hover:underline"
                >
                  Hapus Logo Kustom
                </button>
              )}
            </label>
            
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="URL Gambar Logo (atau pilih file di kanan)"
                value={formData.logoUrl || ''}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              />
              <label className="px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Unggah File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            {formData.logoUrl && (
              <div className="mt-2 p-2 bg-blue-50/60 border border-blue-200 rounded-lg flex items-center gap-2.5">
                <img
                  src={formData.logoUrl}
                  alt="Preview Logo"
                  className="h-8 w-auto max-w-[140px] object-contain border border-blue-100 rounded bg-white p-1"
                />
                <span className="text-[11px] text-blue-800 font-medium flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Logo berhasil dimuat
                </span>
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-1">
              Unggah gambar logo kementerian berformat PNG/SVG/JPG yang sudah memuat lambang dan nama kementerian.
            </p>
          </div>

          {/* Judul Kegiatan Webinar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Kegiatan Webinar
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              required
            />
          </div>

          {/* Tulisan Sambutan / Selamat Datang */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tulisan Sambutan / Selamat Datang
            </label>
            <input
              type="text"
              value={formData.welcomeMessage}
              onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-500 focus:bg-white"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onReset();
                setFormData({ ...INITIAL_EVENT_DETAILS });
              }}
              className="px-3 py-1.5 text-xs rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Awal</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Perubahan</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
