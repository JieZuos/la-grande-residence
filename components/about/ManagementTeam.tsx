import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Users, UserCheck } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  category: "management" | "supervisor";
  image: string;
}

const teamData: TeamMember[] = [
  { id: 1, name: "CAROLINA BERNAL", role: "General Manager", category: "management", image: "/assets/Management/Carolina Bernal.webp" },
  { id: 2, name: "LAI VALIENTE", role: "Operations Manager", category: "management", image: "/assets/Management/Lai Valiente.webp" },
  { id: 3, name: "RYAN MANALOTO", role: "Assistant Operations Manager", category: "management", image: "/assets/Management/Ryan.webp" },
  { id: 4, name: "MIKE BORCHARDT", role: "Engineering Manager", category: "management", image: "/assets/Management/Mike Borchardt.webp" },
  { id: 5, name: "ROSWALD BASCO", role: "Deputy Housekeeper", category: "management", image: "/assets/Management/Roswald.webp" },
  { id: 6, name: "NEYKA DIMACALI", role: "Admin Manager", category: "management", image: "/assets/Management/Neyka Dimacali.webp" },
  { id: 7, name: "YAM MAGTOTO", role: "Accounting Manager", category: "management", image: "/assets/Management/Yam.webp" },
  { id: 8, name: "GINIEL MORALES", role: "Front Office Supervisor", category: "supervisor", image: "/assets/Management/Gin Morales.webp" },
  { id: 9, name: "MON FLORES", role: "Housekeeping Supervisor", category: "supervisor", image: "/assets/Management/Solomon.webp" },
  { id: 10, name: "ROBIN CALPITO", role: "Laundry Supervisor", category: "supervisor", image: "/assets/Management/Robin Calpito.webp" },
  { id: 11, name: "NOEL FLORENDO", role: "Facilities Supervisor", category: "supervisor", image: "/assets/Management/Noel Florendo.webp" },
  { id: 12, name: "ERROL ARIMBUYUTAN", role: "Internal Security Supervisor", category: "supervisor", image: "/assets/Management/Errol Arimbuyutan.webp" },
  { id: 13, name: "ROBIN DIMALANTA", role: "Wellness & Spa Supervisor", category: "supervisor", image: "/assets/Management/bhovin.webp" },
  { id: 14, name: "JOHN BELLEZA", role: "Engineering Supervisor", category: "supervisor", image: "/assets/Management/John Beleza.webp" },
  { id: 15, name: "OLIVIA DE LA VEGA", role: "Accounting Supervisor", category: "supervisor", image: "/assets/Management/Olivia.webp" },
  { id: 16, name: "LESLY CAYABAT", role: "Accounting Supervisor", category: "supervisor", image: "/assets/Management/Lesley.webp" },
  { id: 17, name: "JESSICA GAMBOA", role: "Admin Supervisor", category: "supervisor", image: "/assets/Management/Jessica Gamboa.webp" },
];

type TabType = "management" | "supervisor";
type Direction = "next" | "prev";

export function ManagementTeam() {
  const [activeTab, setActiveTab] = useState<TabType>("management");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const filteredTeam = useMemo<TeamMember[]>(() => 
    teamData.filter(member => member.category === activeTab),
    [activeTab]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const runAnimation = useCallback((newIndex: number): void => {
    if (isExiting || isEntering) return;
    
    setIsExiting(true);
    setPendingIndex(newIndex);
    
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsExiting(false);
      setIsEntering(true);
      
      timeoutRef.current = setTimeout(() => {
        setIsEntering(false);
        setPendingIndex(null);
      }, 400);
    }, 300);
  }, [isExiting, isEntering]);

  const handleTabChange = useCallback((newTab: TabType): void => {
    if (newTab === activeTab || isExiting || isEntering) return;
    runAnimation(0);
    timeoutRef.current = setTimeout(() => {
      setActiveTab(newTab);
    }, 300);
  }, [activeTab, isExiting, isEntering, runAnimation]);

  const animateSlide = useCallback((direction: Direction): void => {
    if (filteredTeam.length <= 1) return;
    const len = filteredTeam.length;
    const newIndex = direction === "next" 
      ? (currentIndex + 1) % len 
      : (currentIndex - 1 + len) % len;
    runAnimation(newIndex);
  }, [filteredTeam.length, currentIndex, runAnimation]);

  const getSlideIndex = useCallback((offset: number): number => {
    const len = filteredTeam.length;
    return (currentIndex + offset + len) % len;
  }, [currentIndex, filteredTeam.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>): void => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLDivElement>): void => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      animateSlide(diff > 0 ? "next" : "prev");
    }
    touchStartX.current = null;
  }, [animateSlide]);

  const currentMember = filteredTeam[currentIndex];
  const displayIndex = pendingIndex !== null ? pendingIndex : currentIndex;

  const getMainImageClasses = (): string => {
    if (isExiting) return "opacity-0 scale-[0.85] blur-md translate-y-4";
    if (isEntering) return "opacity-100 scale-100 blur-0 translate-y-0";
    return "opacity-100 scale-100 blur-0 translate-y-0";
  };

  const getPeekClasses = (): string => {
    if (isExiting) return "opacity-5 scale-90";
    if (isEntering) return "opacity-20 scale-100";
    return "opacity-20 scale-100";
  };

  const getTextClasses = (delay: number = 0): string => {
    const base = "transition-all duration-300 ease-out";
    if (isExiting) return `${base} opacity-0 translate-y-4`;
    if (isEntering) return `${base} opacity-100 translate-y-0 delay-[${delay}ms]`;
    return `${base} opacity-100 translate-y-0`;
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 overflow-hidden relative flex flex-col font-sans py-12 md:py-24">
      
      <div className="px-6 text-center z-20 mb-8 md:mb-12">
        <div className="inline-block px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm mb-6 shadow-sm border border-neutral-100">
          Our Team
        </div>
        <h2 className="text-3xl md:text-5xl font-light text-neutral-800 mb-10">
          Meet The Management
        </h2>

        <div className="flex justify-center items-center gap-2 p-1 bg-neutral-100 rounded-xl w-fit mx-auto">
          {[
            { id: "management" as TabType, icon: UserCheck, label: "Management" },
            { id: "supervisor" as TabType, icon: Users, label: "Supervisors" }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              disabled={isExiting || isEntering}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? "bg-white text-green-700 shadow-md"
                  : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="team-card-master flex-1 flex flex-col lg:flex-row items-center justify-center py-10 px-6 md:px-16 lg:px-24 gap-8 md:gap-12 touch-pan-y mt-20"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full lg:flex-1 h-[350px] md:h-[500px] flex items-center justify-center">
          
          <div 
            className={`absolute left-[-10%] md:left-0 top-1/2 -translate-y-1/2 w-[25%] h-[80%] pointer-events-none grayscale transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${getPeekClasses()}`}
          >
            <div className="w-full h-full rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden shadow-inner">
              <img 
                src={filteredTeam[getSlideIndex(-1)]?.image} 
                alt="" 
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>

          <div 
            className={`relative w-[65%] md:w-[45%] lg:w-[40%] z-10 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform ${getMainImageClasses()}`}
          >
            <div className="w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-neutral-100 bg-white flex items-center justify-center overflow-hidden">
              <img
                src={currentMember?.image}
                alt={currentMember?.name}
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
            </div>
          </div>

          <div 
            className={`absolute right-[-10%] md:right-0 top-1/2 -translate-y-1/2 w-[25%] h-[80%] pointer-events-none grayscale transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${getPeekClasses()}`}
          >
            <div className="w-full h-full rounded-xl bg-neutral-100 flex items-center justify-center overflow-hidden shadow-inner">
              <img 
                src={filteredTeam[getSlideIndex(1)]?.image} 
                alt="" 
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[450px] flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="space-y-3 w-full">
            <div className={getTextClasses(100)}>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="hidden md:block h-px w-8 bg-green-300" />
                {/* <span className="text-xs font-bold tracking-widest text-green-600 uppercase">
                  {activeTab} {String(displayIndex + 1).padStart(2, "0")}
                </span> */}
              </div>
            </div>

            <h1 className={`text-3xl md:text-5xl font-bold tracking-tight text-neutral-900 leading-tight uppercase will-change-transform ${getTextClasses(150)}`}>
              {currentMember?.name}
            </h1>

            <div className={getTextClasses(200)}>
              <p className="text-lg md:text-xl font-medium text-neutral-500 mb-4">
                {currentMember?.role}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 w-full pt-4">
            <div className="flex gap-3">
              <button
                onClick={() => animateSlide("prev")}
                disabled={isExiting || isEntering}
                className="w-12 h-12 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 active:scale-95 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => animateSlide("next")}
                disabled={isExiting || isEntering}
                className="w-12 h-12 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 active:scale-95 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="hidden md:block flex-1 h-[3px] bg-neutral-100 relative overflow-hidden rounded-full">
              <div
                className="absolute inset-y-0 left-0 bg-green-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${((currentIndex + 1) / filteredTeam.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-green-50/40 blur-[120px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-1/2 h-1/2 bg-neutral-100/60 blur-[100px] -z-10 rounded-full pointer-events-none" />
    </div>
  );
}