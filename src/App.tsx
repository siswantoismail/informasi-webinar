import React, { useState, useEffect, useCallback } from "react";
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  Sparkles,
  Award,
} from "lucide-react";
import { EventDetails, TimeLeft } from "./types";
import { INITIAL_EVENT_DETAILS, INITIAL_SPEAKERS } from "./data/initialData";
import { CountdownCard } from "./components/CountdownCard";
import { SettingsModal } from "./components/SettingsModal";
import { soundEngine } from "./utils/audio";
import backgroundWebinar from "./assets/images/BG-COUNTDOWN-WEB.png";

const STORAGE_KEY = "webinar_event_white_blue_v3";

export default function App() {
  // Load saved event details from localStorage or use initial values
  const [event, setEvent] = useState<EventDetails>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: EventDetails = JSON.parse(saved);
        // If saved targetDateTime expired by more than 2 hours from an old test session, refresh it
        const targetTime = new Date(parsed.targetDateTime).getTime();
        const now = new Date().getTime();
        if (now - targetTime > 2 * 60 * 60 * 1000) {
          const freshDate = new Date();
          freshDate.setMinutes(freshDate.getMinutes() + 45);
          parsed.targetDateTime = freshDate.toISOString();
        }
        return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_EVENT_DETAILS;
  });

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTimeWIB, setCurrentTimeWIB] = useState("");

  // Keep fullscreen state in sync with native browser events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  // Real-time WIB clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setCurrentTimeWIB(`${timeStr} WIB`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Real-time Countdown Calculation
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const target = new Date(event.targetDateTime).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalMilliseconds: 0,
        isComplete: true,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return {
      days,
      hours,
      minutes,
      seconds,
      totalMilliseconds: difference,
      isComplete: false,
    };
  }, [event.targetDateTime]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

  // Update countdown clock every 1 second
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  // Audio ambient toggle
  const handleToggleAudio = async () => {
    const active = await soundEngine.toggleMusic();
    setIsPlayingAudio(active);
  };

  // Fullscreen toggle with fallback
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Save config from settings drawer
  const handleSaveConfig = (updated: EventDetails) => {
    setEvent(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable
    }
  };

  // Reset to default
  const handleResetConfig = () => {
    setEvent(INITIAL_EVENT_DETAILS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable
    }
  };

  const keynoteSpeaker = INITIAL_SPEAKERS[0];

  return (
    <div className="h-screen w-screen max-h-screen overflow-hidden bg-white text-slate-900 flex flex-col justify-between p-3 sm:p-5 lg:p-6 select-none relative font-sans">
      {/* TOP HEADER: Logo Kementerian (Beserta Nama Terpadu) & Kontrol */}
      <header className="relative z-10 flex items-center justify-between gap-3 shrink-0 pb-2 border-b border-blue-100">
        {/* Left: Slot Logo Kementerian Resmi (Beserta Nama dalam Logo) */}
        <div className="flex items-center">
          {event.logoUrl ? (
            <img
              src={event.logoUrl}
              alt="Logo Kementerian"
              referrerPolicy="no-referrer"
              className="h-10 sm:h-12 w-auto max-w-70 object-contain"
            />
          ) : (
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-blue-50/70 border border-blue-200">
              {/* Tut Wuri Handayani / Kementerian Education Emblem Lockup */}
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-600/30">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M12 2L14.5 7.5L20.5 8L16 12.5L17.5 18.5L12 15.5L6.5 18.5L8 12.5L3.5 8L9.5 7.5L12 2Z"
                    fill="currentColor"
                    fillOpacity="0.25"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <circle cx="12" cy="12" r="3" fill="currentColor" />
                  <path d="M12 9v6M9 12h6" stroke="#2563eb" strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-900 font-display">
                  LOGO KEMENTERIAN
                </span>
                <span className="text-[9px] text-blue-600 font-semibold tracking-tight">
                  REPUBLIK INDONESIA
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Kontrol Audio, Fullscreen, & Pengaturan Panitia */}
        <div className="flex items-center gap-2">
          {/* Audio Musik Santai Menunggu */}
          <button
            onClick={handleToggleAudio}
            title={
              isPlayingAudio
                ? "Matikan Musik Latar"
                : "Putar Musik Latar Menunggu"
            }
            className={`px-3 py-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
              isPlayingAudio
                ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20"
                : "bg-white border-blue-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50"
            }`}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden sm:inline text-[11px] font-medium">
                  Musik Aktif
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-[11px] font-medium">
                  Musik Latar
                </span>
              </>
            )}
          </button>

          {/* Layar Penuh Fullscreen */}
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? "Keluar Layar Penuh" : "Mode Layar Penuh"}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white border border-blue-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden lg:inline text-[11px] font-medium">
              {isFullscreen ? "Keluar" : "Layar Penuh"}
            </span>
          </button>

          {/* Pengaturan Panitia */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            title="Pengaturan Acara Panitia"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-white border border-blue-200 text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-[11px] font-medium">
              Panitia
            </span>
          </button>
        </div>
      </header>

      {/* CENTER STAGE: Sambutan, Judul Webinar, & Hitung Mundur */}
      <main
        className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-2 sm:px-4 py-3 w-full my-auto"
        style={{
          backgroundImage: `url(${backgroundWebinar})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Tulisan Selamat Datang */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">{event.welcomeMessage}</span>
        </div>

        {/* Judul Besar Webinar */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-display leading-[1.18] text-balance mb-2">
          {event.title}
        </h1>

        {/* Subjudul */}
        <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto mb-5 sm:mb-7 line-clamp-2 leading-relaxed">
          {event.subTitle}
        </p>

        {/* Hitung Mundur Real-Time (Fokus Utama Layar) */}
        <div className="w-full">
          <CountdownCard
            days={timeLeft.days}
            hours={timeLeft.hours}
            minutes={timeLeft.minutes}
            seconds={timeLeft.seconds}
            isComplete={timeLeft.isComplete}
            totalMilliseconds={timeLeft.totalMilliseconds}
          />
        </div>
      </main>

      {/* BOTTOM TICKER / INFORMATIONAL STRIP: 3 Kartu Kompak Putih & Biru */}
      <footer className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 shrink-0 pt-2 border-t border-blue-100">
        {/* Card 1: Keynote Speaker */}
        {/* <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-blue-100 shadow-sm">
          <img
            src={keynoteSpeaker.photoUrl}
            alt={keynoteSpeaker.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-lg object-cover border border-blue-200 shrink-0"
          />
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
              Narasumber Utama (Keynote)
            </span>
            <p className="text-xs font-bold text-slate-900 truncate">
              {keynoteSpeaker.name}
            </p>
            <p className="text-[10px] text-slate-500 truncate">
              {keynoteSpeaker.title}
            </p>
          </div>
        </div> */}

        {/* Card 2: Rundown Acara Singkat */}
        {/* <div className="hidden md:flex flex-col justify-center p-2.5 rounded-xl bg-white border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-bold text-blue-900 uppercase tracking-wider mb-1">
            <span>Rundown Singkat Kegiatan</span>
            <span className="text-blue-600 font-mono">Sesi Pleno</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-tight truncate">
            Pembukaan Resmi · Sesi Materi AI Adaptif · Live Q&A · Doorprize & Sertifikat 32 JP
          </p>
        </div> */}

        {/* Card 3: E-Sertifikat & Slido */}
        {/* <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-900">E-Sertifikat 32 JP Resmi</p>
              <p className="text-[10px] text-slate-500">Link presensi dibagikan 20 mnt sebelum selesai</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-slate-500 block">Tanya Jawab Slido</span>
            <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {event.slidoCode}
            </span>
          </div>
        </div> */}
      </footer>

      {/* Organizer Quick Settings Drawer */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        event={event}
        onSave={handleSaveConfig}
        onReset={handleResetConfig}
      />
    </div>
  );
}
