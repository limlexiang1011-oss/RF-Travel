
import React, { useState, useEffect, useRef } from 'react';
import { BookingForm } from './components/BookingForm.tsx';
import { PriceTable } from './components/PriceTable.tsx';
import { VEHICLES, TESTIMONIALS, FAQS, WHATSAPP_NUMBER } from './constants.ts';
import { Check, ShieldCheck, Map, Phone, Menu, X, Facebook, ChevronLeft, ChevronRight, Send, MessageCircle, CalendarDays, Users, Briefcase, ArrowUpRight, Plus, Minus, HelpCircle, Star, Clock, ArrowRight, ThumbsUp, Award, Eye } from 'lucide-react';
import { translations } from './translations.ts';
import { Language, VehicleType } from './types.ts';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop", // KL Twin Towers
  "https://i.pinimg.com/1200x/ca/4c/df/ca4cdfde2f707ed2648f2649d50a047e.jpg", // Singapore
  "https://i.ibb.co/mC1QN17V/3.png", // Genting
  "https://i.pinimg.com/1200x/0a/8b/30/0a8b30d52af52a239464cceae3369f78.jpg"  // Malacca
];

const DESTINATION_IMAGES = {
  genting: "https://i.ibb.co/mC1QN17V/3.png",
  malacca: "https://i.pinimg.com/1200x/0a/8b/30/0a8b30d52af52a239464cceae3369f78.jpg",
  kl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=1200&auto=format&fit=crop",
  penang: "https://i.ibb.co/FbRqC26F/Whats-App-Image-2026-01-08-at-5-33-37-PM.jpg"
};

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.613-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const App: React.FC = () => {
  const getInitialLanguage = (): Language => {
    try {
      const path = window.location.pathname.toLowerCase();
      const search = new URLSearchParams(window.location.search);
      if (path.includes('/en') || search.get('lang') === 'en') return 'en';
      if (path.includes('/cn') || search.get('lang') === 'cn') return 'cn';
    } catch (e) {
      console.warn("Language detection failed, using default", e);
    }
    return 'cn';
  };

  const [lang, setLang] = useState<Language>(getInitialLanguage());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefillRoute, setPrefillRoute] = useState<{from: string, to: string} | undefined>(undefined);
  const [heroIndex, setHeroIndex] = useState(0);
  const [isWAPopupOpen, setIsWAPopupOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const t = translations[lang];
  const trackRef = useRef<HTMLDivElement>(null);
  const animState = useRef({
    currentPos: 0,
    isDragging: false,
    startX: 0,
    startPos: 0,
    velocity: 0.5 
  });
  
  const metrics = useRef({ cycleDist: 0 });

  // Spotlight Effect Helper
  const handleSpotlightMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    try {
      if (window.location.protocol === 'blob:') return;
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.pushState({}, '', '?' + url.searchParams.toString());
    } catch (e) {
      console.debug("Navigation state update skipped", e);
    }
  };

  const displayTestimonials = Array(8).fill(TESTIMONIALS).flat();

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Optimized Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    const updateMetrics = () => {
      if (trackRef.current && trackRef.current.children.length > 0) {
         const track = trackRef.current;
         const firstCard = track.children[0] as HTMLElement;
         if (!firstCard) return;
         const cardWidth = firstCard.offsetWidth;
         const gap = 24; 
         const stride = cardWidth + gap;
         metrics.current.cycleDist = stride * TESTIMONIALS.length;
      }
    };
    
    setTimeout(updateMetrics, 500);
    window.addEventListener('resize', updateMetrics);

    const animate = () => {
      if (trackRef.current && metrics.current.cycleDist > 0) {
        const state = animState.current;
        if (!state.isDragging) {
           state.currentPos += state.velocity;
        }
        if (state.currentPos >= metrics.current.cycleDist) state.currentPos -= metrics.current.cycleDist;
        else if (state.currentPos < 0) state.currentPos += metrics.current.cycleDist;
        trackRef.current.style.transform = `translate3d(-${state.currentPos}px, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', updateMetrics);
    };
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    animState.current.isDragging = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    animState.current.startX = clientX;
    animState.current.startPos = animState.current.currentPos;
  };
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!animState.current.isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const diff = animState.current.startX - clientX;
    animState.current.currentPos = animState.current.startPos + diff;
  };
  const handleDragEnd = () => { animState.current.isDragging = false; };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleQuickBook = (from: string, to: string) => {
    setPrefillRoute({ from, to });
    scrollToSection('booking');
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleWhatsAppContact = (customMsg?: string) => {
    try {
      if (typeof (window as any).gtag === 'function') (window as any).gtag('event', 'conversion', { 'send_to': 'AW-17810501351/ic3rCKj_w9QbEOfd2qxC' });
      if (typeof (window as any).fbq === 'function') (window as any).fbq('track', 'Contact');
    } catch (e) {}
    const msg = customMsg || `Hi, I’m interested in your Charter Car Service form Website. 我想咨询关于包车服务的有关详情`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg.trim())}`, '_blank');
    setIsWAPopupOpen(false);
  };

  const getVehicleCategoryLabel = (type: VehicleType) => {
     if (lang === 'en') {
       switch(type) {
         case VehicleType.SEDAN: return 'Economy';
         case VehicleType.MPV_STD: return 'Family';
         case VehicleType.MPV_LUX: return 'Business Class';
         case VehicleType.VAN: return 'Large Group';
         default: return 'Premium';
       }
     } else {
       switch(type) {
         case VehicleType.SEDAN: return '经济型';
         case VehicleType.MPV_STD: return '家庭型';
         case VehicleType.MPV_LUX: return '商务/豪华型';
         case VehicleType.VAN: return '大型团体';
         default: return '精选';
       }
     }
  };

  const faqData = lang === 'en' ? FAQS : [
    { q: "价格包含过路费和油费吗？", a: "包含！我们的报价包含所有费用。这涵盖了车辆、司机、汽油以及所有路税/海关费用。没有任何隐藏费用。" },
    { q: "行程可以临时调整或加点吗？", a: "可以的。在不影响整体时间与司机安全驾驶的情况下，行程可灵活调整或加点。我们会尽量配合您的实际需求，让行程更自由、不赶时间。" },
    { q: "如何付款？", a: "我们接受 PayNow、银行转账或到达目的地后以现金形式支付给司机（马币或新币均可）。高峰期预订可能需要支付少量定金。" }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden pt-16">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-lg md:text-2xl text-primary-700 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
            RF Travel<span className="text-gray-800"> & Charter Agency</span>
          </div>
          <div className="hidden md:flex gap-8 font-medium text-gray-600">
            <button onClick={() => scrollToSection('home')} className="hover:text-primary-600 transition">{t.nav.home}</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-primary-600 transition">{t.nav.rates}</button>
            <button onClick={() => scrollToSection('fleet')} className="hover:text-primary-600 transition">{t.nav.fleet}</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-primary-600 transition">{t.nav.faq}</button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="flex bg-gray-100 rounded-full p-1 border border-gray-200">
              <button onClick={() => handleLanguageChange('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'btn-premium text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>EN</button>
              <button onClick={() => handleLanguageChange('cn')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'cn' ? 'btn-premium text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>中文</button>
            </div>
            <button onClick={() => scrollToSection('booking')} className="btn-premium btn-shine px-5 py-2 rounded-full font-semibold shadow-md">{t.nav.getQuote}</button>
          </div>
          <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg animate-fadeIn">
            <div className="flex gap-2 justify-center pb-2 border-b border-gray-50">
               <button onClick={() => handleLanguageChange('en')} className={`flex-1 py-2 rounded-lg font-bold border ${lang === 'en' ? 'btn-premium text-white border-transparent' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>English</button>
               <button onClick={() => handleLanguageChange('cn')} className={`flex-1 py-2 rounded-lg font-bold border ${lang === 'cn' ? 'btn-premium text-white border-transparent' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>简体中文</button>
            </div>
            <button onClick={() => scrollToSection('home')} className="block w-full text-left font-medium text-gray-700 py-2">{t.nav.home}</button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left font-medium text-gray-700 py-2">{t.nav.rates}</button>
            <button onClick={() => scrollToSection('fleet')} className="block w-full text-left font-medium text-gray-700 py-2">{t.nav.fleet}</button>
            <button onClick={() => scrollToSection('booking')} className="block w-full text-center btn-premium btn-shine text-white font-bold py-3 rounded-lg">{t.nav.bookNow}</button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[100dvh] flex items-center py-20 bg-slate-900 overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <img 
            key={img} 
            src={img}
            alt="Hero Background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out z-0 md:transform md:scale-105 ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`} 
          />
        ))}
        
        {/* RE-ADDED OVERLAYS: Balanced for visibility vs readability */}
        {/* 1. Base dark tint - clear enough to see bg, dark enough for text base */}
        <div className="absolute inset-0 z-0 bg-black/30 pointer-events-none"></div>

        {/* 2. Gradient focusing on the left (text area): Darker on left, fading to transparent on right */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-900/80 via-black/20 to-transparent pointer-events-none"></div>

        {/* 3. Gradient from bottom: Darker bottom for visual stability */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30 pointer-events-none"></div>
        
        <div className="container mx-auto px-4 z-10 relative pt-16 md:pt-0">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
            <div className="lg:w-1/2 text-white space-y-6 md:space-y-8 text-center lg:text-left animate-fadeIn">
              <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full text-teal-300 text-xs md:text-sm font-bold tracking-wide uppercase shadow-lg border border-white/10">
                <Star size={14} className="fill-current" />
                <span>{t.hero.badge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {lang === 'en' ? (
                  <>Charter Car in <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-200 to-emerald-500 drop-shadow-sm">Malaysia</span> with Ease.</>
                ) : (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-teal-200 to-emerald-500 drop-shadow-sm">轻松畅游马来西亚</span>
                )}
              </h1>
              <p className="text-lg text-white max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{t.hero.subtitle}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-4 border-t border-white/30 border-b lg:border-b-0 bg-black/10 md:bg-transparent rounded-xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
                  <div className="flex flex-col items-center lg:items-start gap-1">
                      <div className="flex items-center gap-1.5 text-yellow-400"><Star size={18} fill="currentColor" /><span className="font-bold text-white text-lg drop-shadow">5.0</span></div>
                      <span className="text-xs text-white uppercase tracking-wider font-semibold drop-shadow">{lang === 'en' ? 'Customer Rating' : '客户好评'}</span>
                  </div>
                  <div className="flex flex-col items-center lg:items-start gap-1">
                      <div className="flex items-center gap-1.5 text-teal-400"><Users size={18} /><span className="font-bold text-white text-lg drop-shadow">5000+</span></div>
                      <span className="text-xs text-white uppercase tracking-wider font-semibold drop-shadow">{lang === 'en' ? 'Happy Guests' : '服务人次'}</span>
                  </div>
                   <div className="hidden md:flex flex-col items-center lg:items-start gap-1">
                      <div className="flex items-center gap-1.5 text-blue-400"><ShieldCheck size={18} /><span className="font-bold text-white text-lg drop-shadow">100%</span></div>
                      <span className="text-xs text-white uppercase tracking-wider font-semibold drop-shadow">{lang === 'en' ? 'Safe Travel' : '安全出行'}</span>
                  </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <span className="text-white text-sm font-medium drop-shadow-md">{t.hero.follow}</span>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/rftravel.transport" target="_blank" rel="noopener noreferrer" className="bg-[#1877F2]/20 hover:bg-[#1877F2] text-white hover:text-white border border-[#1877F2]/50 hover:border-transparent px-5 py-2 rounded-full flex items-center gap-2 transition-all duration-300 backdrop-blur-sm"><Facebook size={18} fill="currentColor" /><span className="text-sm font-bold">Facebook</span></a>
                  <a href="https://www.xiaohongshu.com/user/profile/63668abe000000001f01fa4b" target="_blank" rel="noopener noreferrer" className="bg-[#FF2442]/20 hover:bg-[#FF2442] text-white hover:text-white border border-[#FF2442]/50 hover:border-transparent px-5 py-2 rounded-full flex items-center gap-2 transition-all duration-300 backdrop-blur-sm"><span className="font-bold text-sm tracking-tight">{lang === 'en' ? 'Red' : '小红书'}</span></a>
                </div>
              </div>
            </div>
            <div id="booking" className="lg:w-1/2 w-full max-w-lg mx-auto lg:mr-0 relative">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-teal-500/20 blur-[50px] rounded-full pointer-events-none"></div>
               <div className="relative"><BookingForm prefillRoute={prefillRoute} lang={lang} /></div>
               <button id="whatsapp-help-button" type="button" onClick={() => handleWhatsAppContact()} className="w-full mt-6 flex items-center justify-center gap-3 cursor-pointer hover:bg-white/10 transition-colors group bg-black/20 md:bg-transparent p-3 rounded-xl border border-white/20 backdrop-blur-sm">
                  <div className="text-teal-400 group-hover:scale-110 transition-transform"><WhatsAppIcon size={20} /></div>
                  <span className="text-slate-100 group-hover:text-white font-medium text-xs md:text-sm text-left leading-snug drop-shadow-sm">{t.booking.whatsappHelp}</span>
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - With Animated Gradient Blobs & Oversized Text */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
           <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
           <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
           <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Oversized Background Text */}
        <div className="absolute top-10 left-0 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
           <span className="text-[150px] md:text-[240px] font-black text-outline opacity-30 leading-none whitespace-nowrap">PREMIUM</span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight">{t.features.title}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{t.features.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: t.features.f1_title, desc: t.features.f1_desc },
              { icon: Map, title: t.features.f2_title, desc: t.features.f2_desc },
              { icon: Check, title: t.features.f3_title, desc: t.features.f3_desc },
            ].map((f, i) => (
              <div 
                key={i} 
                onMouseMove={handleSpotlightMove}
                className="spotlight-card group relative bg-white p-10 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:shadow-primary-500/10 hover:-translate-y-2 transition-all duration-500 ease-out overflow-hidden"
              >
                {/* Decorative BG Number */}
                <div className="absolute -right-6 -top-6 text-[10rem] font-bold text-gray-50/80 group-hover:text-primary-50/50 transition-colors duration-500 select-none pointer-events-none leading-none">
                  {i + 1}
                </div>
                
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-8 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-primary-500/30 group-hover:scale-110">
                    <f.icon size={36} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-700 transition-colors duration-300">{f.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations Section - With Spotlight */}
      <section id="popular-destinations" className="py-20 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
        {/* Oversized Background Text */}
        <div className="absolute top-20 right-0 w-full text-right pointer-events-none select-none z-0 overflow-hidden opacity-50">
           <span className="text-[120px] md:text-[200px] font-black text-outline leading-none whitespace-nowrap pr-10">EXPLORE</span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.popular.title}</h2>
            <p className="text-gray-600">{t.popular.subtitle}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-8">
            {[
              { id: 'genting', title: t.popular.d1_title, desc: t.popular.d1_desc, img: DESTINATION_IMAGES.genting, to: "Genting Highlands" },
              { id: 'malacca', title: t.popular.d2_title, desc: t.popular.d2_desc, img: DESTINATION_IMAGES.malacca, to: "Malacca" },
              { id: 'kl', title: t.popular.d3_title, desc: t.popular.d3_desc, img: DESTINATION_IMAGES.kl, to: "Kuala Lumpur - City Area" },
              { id: 'penang', title: t.popular.d4_title, desc: t.popular.d4_desc, img: DESTINATION_IMAGES.penang, to: "Penang" },
            ].map((dest, i) => (
              <div 
                key={i} 
                onMouseMove={handleSpotlightMove}
                className="spotlight-card group relative overflow-hidden rounded-2xl md:rounded-3xl bg-white shadow-md md:shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col h-full border border-gray-100"
              >
                <div className="w-full h-32 md:h-64 overflow-hidden relative">
                  <img src={dest.img} alt={dest.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-3 md:p-8 flex flex-col flex-1 relative z-10">
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900 mb-1.5 md:mb-4 group-hover:text-primary-600 transition-colors leading-tight">{dest.title}</h3>
                  <p className="text-[10px] md:text-base text-gray-600 leading-snug md:leading-relaxed mb-3 md:mb-6 flex-1 line-clamp-3 md:line-clamp-none">
                    {dest.desc}
                  </p>
                  <button 
                    onClick={() => handleQuickBook("Singapore", dest.to)}
                    className="w-full flex items-center justify-center gap-1 md:gap-2 btn-premium btn-shine px-2 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl text-[10px] md:text-base font-bold shadow-sm md:shadow-md"
                  >
                    <CalendarDays className="w-3 h-3 md:w-5 md:h-5" />
                    {t.popular.bookAction}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.pricing.title}</h2>
            <p className="text-gray-600">{t.pricing.subtitle}</p>
          </div>
          <div className="max-w-4xl mx-auto"><PriceTable onBook={handleQuickBook} lang={lang} /></div>
        </div>
      </section>

      {/* Fleet Section - With Oversized Text and Spotlight */}
      <section id="fleet" className="py-24 bg-white relative overflow-hidden">
        {/* Oversized Background Text */}
        <div className="absolute bottom-0 left-0 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
           <span className="text-[180px] md:text-[300px] font-black text-outline opacity-20 leading-none whitespace-nowrap">FLEET</span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.fleet.title}</h2>
            <p className="text-lg text-gray-600">{t.fleet.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VEHICLES.map((v) => (
              <div 
                key={v.type} 
                onMouseMove={handleSpotlightMove}
                className="spotlight-card group relative bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_-10px_rgba(13,148,136,0.15)] transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
              >
                
                {/* Image Section with Hover Effect */}
                <div className="relative h-48 md:h-64 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden flex items-center justify-center p-2 group-hover:bg-gray-200 transition-colors duration-700">
                   {/* Category Badge - Fades out on hover */}
                   <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary-700 uppercase tracking-wider shadow-sm flex items-center gap-1 border border-white transition-opacity duration-300 group-hover:opacity-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                      {getVehicleCategoryLabel(v.type)}
                   </div>
                   
                   {/* Interior Badge - Fades in on hover */}
                   <div className="absolute top-4 right-4 z-20 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm flex items-center gap-1 border border-white/20 transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none">
                      <Eye size={12} />
                      {lang === 'en' ? 'Interior View' : '内饰预览'}
                   </div>
                   
                   {/* Exterior Image (Default) */}
                   <img 
                      src={v.image} 
                      alt={v.type} 
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-lg transition-all duration-700 ease-in-out opacity-100 scale-100 group-hover:opacity-0 group-hover:scale-105 z-10" 
                   />

                   {/* Interior Image (Hover) */}
                   <img 
                      src={v.interiorImage} 
                      alt={`${v.type} Interior`} 
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-md transition-all duration-700 ease-in-out opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 z-10" 
                   />
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1 relative z-10 bg-white/50 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{lang === 'en' ? v.type : (v.type === 'Sedan' ? '轿车' : v.type === 'Standard MPV' ? '标准MPV' : v.type === 'Luxury MPV' ? '豪华MPV' : '大型MPV')}</h3>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100 group-hover:border-primary-100 transition-colors">
                       <div className="text-primary-600 mb-1"><Users size={20} /></div>
                       <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{lang === 'en' ? 'Capacity' : '载客量'}</span>
                       <span className="text-sm font-bold text-gray-800">{lang === 'en' ? (v.paxLabel?.replace("Max ", "") || `${v.maxPax} Pax`) : `${v.maxPax} 人`}</span>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 border border-slate-100 group-hover:border-primary-100 transition-colors">
                       <div className="text-primary-600 mb-1"><Briefcase size={20} /></div>
                       <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{lang === 'en' ? 'Luggage' : '行李'}</span>
                       <span className="text-sm font-bold text-gray-800">{lang === 'en' ? `Max ${v.maxLuggage}` : `${v.maxLuggage} 件`}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 border-t border-gray-50 pt-4">
                    {lang === 'en' ? v.description : (v.type === 'Sedan' ? '适合夫妻或行李较少的小家庭。舒适且经济。' : v.type === 'Standard MPV' ? '丰田 Innova 或 Perodua Aruz。适合家庭，行李空间更大。' : v.type === 'Luxury MPV' ? '丰田 Alphard / Vellfire。配备航空座椅和豪华配置。' : '大型多用途车，适合大型团队或带大量行李。')}
                  </p>

                  {/* Action Button */}
                  <button 
                    onClick={() => scrollToSection('booking')}
                    className="w-full py-3 rounded-xl border border-primary-200 text-primary-700 font-bold text-sm hover:bg-primary-50 hover:border-primary-300 transition-colors flex items-center justify-center gap-2 group-hover:bg-primary-600 group-hover:text-white group-hover:border-transparent"
                  >
                    <span>{lang === 'en' ? 'Book This Ride' : '预订此车型'}</span>
                    <ArrowUpRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center"><p className="text-xs text-gray-400 italic">{t.fleet.disclaimer}</p></div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white overflow-hidden select-none">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
             <h2 className="text-3xl md:text-4xl font-bold">{lang === 'en' ? 'What Our Customers Say' : '客户评价'}</h2>
             <div className="hidden md:flex gap-2"><span className="text-sm text-slate-400 flex items-center gap-1"><ChevronLeft size={16}/> {lang === 'en' ? 'Drag to Scroll' : '左右滑动查看'} <ChevronRight size={16}/></span></div>
          </div>
          <div className="w-full overflow-hidden cursor-grab active:cursor-grabbing" onMouseDown={handleDragStart} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd} onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}>
             <div ref={trackRef} className="flex gap-6 w-max will-change-transform" style={{ transform: 'translate3d(0,0,0)' }}>
                {displayTestimonials.map((t: any, i) => (
                  <div key={i} className="w-[240px] md:w-[320px] flex-shrink-0 transform transition-transform duration-300 hover:scale-[1.02]">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-800 h-full pointer-events-none">
                      <img src={t.image} alt={`Customer Review ${i + 1}`} className="w-full h-auto object-cover" loading="lazy" draggable="false" />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Improved FAQ Section - With Animated Gradient Blobs */}
      <section id="faq" className="py-24 bg-white relative overflow-hidden">
         <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
             <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
         </div>

         <div className="container mx-auto px-4 max-w-3xl relative z-10">
            <div className="text-center mb-16">
              <span className="inline-block bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3">FAQ</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.faq.title}</h2>
            </div>
            
            <div className="space-y-4">
              {faqData.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div 
                    key={i} 
                    className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-primary-200 shadow-lg shadow-primary-500/5' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200'}`}
                  >
                    <button 
                      onClick={() => toggleFaq(i)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <span className={`font-bold text-lg ${isOpen ? 'text-primary-700' : 'text-gray-800'}`}>{faq.q}</span>
                      <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </div>
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 bg-gray-900 rounded-3xl p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                    <HelpCircle size={32} className="text-primary-300" />
                 </div>
                 <h3 className="text-2xl font-bold mb-3">{lang === 'en' ? 'Still have questions?' : '还有其他问题？'}</h3>
                 <p className="text-gray-400 max-w-md mx-auto mb-8">{lang === 'en' ? 'Can’t find the answer you’re looking for? Please chat to our friendly team.' : '找不到您想要的答案？欢迎直接联系我们的客服团队。'}</p>
                 <button 
                    onClick={() => handleWhatsAppContact()}
                    className="btn-premium-green btn-shine px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2"
                 >
                    <MessageCircle size={18} />
                    {lang === 'en' ? 'Chat on WhatsApp' : 'WhatsApp 咨询'}
                 </button>
              </div>
            </div>
         </div>
      </section>

      <div className="relative py-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000&auto=format&fit=crop" alt="Road trip background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-slate-900/80"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
           <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
             <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">{lang === 'en' ? 'Ready to start your journey?' : '准备好开始您的旅程了吗？'}</h2>
                <p className="text-teal-50 text-lg md:text-xl leading-relaxed opacity-90 font-light">{lang === 'en' ? 'Book your premium private car charter today and travel with peace of mind.' : '立即预订您的专属包车服务，享受安心舒适的跨境体验。'}</p>
             </div>
             <div className="flex-shrink-0">
               <button onClick={() => scrollToSection('booking')} className="bg-white text-teal-800 hover:bg-teal-50 px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex items-center gap-3 group"><span>{lang === 'en' ? 'Book Now' : '立即预订'}</span><ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" /></button>
             </div>
           </div>
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 lg:col-span-2 space-y-6">
              <div className="text-3xl font-bold text-white tracking-tight">RF Travel <span className="text-primary-500 font-light">& Charter Agency</span></div>
              <p className="max-w-sm text-slate-400 leading-relaxed text-sm">{t.footer.desc}</p>
              <div className="flex gap-6 pt-2">
                 <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary-400"><ShieldCheck size={20} /></div><span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{lang === 'en' ? 'Safe' : '安全'}</span></div>
                 <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary-400"><Clock size={20} /></div><span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{lang === 'en' ? 'Punctual' : '准时'}</span></div>
                 <div className="flex flex-col items-center gap-2"><div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-primary-400"><Star size={20} /></div><span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{lang === 'en' ? 'Comfort' : '舒适'}</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">{t.footer.links}</h4>
              <ul className="space-y-3">
                {[{ label: t.nav.home, id: 'home' }, { label: t.nav.rates, id: 'pricing' }, { label: t.nav.fleet, id: 'fleet' }, { label: t.nav.bookNow, id: 'booking' }, { label: t.nav.faq, id: 'faq' }].map((link) => (
                  <li key={link.id}><button onClick={() => scrollToSection(link.id)} className="group flex items-center gap-2 text-slate-400 hover:text-primary-400 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary-500 transition-colors"></span>{link.label}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 text-lg">{t.footer.contact}</h4>
              <ul className="space-y-4">
                <li><a href="tel:+60188706966" className="group flex items-center gap-3 hover:text-white transition-colors"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all"><Phone size={16}/></div><span className="font-mono text-lg font-semibold tracking-wide">+60188706966</span></a></li>
                <li><button onClick={() => handleWhatsAppContact()} className="group flex items-center gap-3 hover:text-white transition-colors w-full text-left"><div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-green-500 group-hover:bg-green-600 group-hover:text-white transition-all"><WhatsAppIcon size={16}/></div><span>{lang === 'en' ? 'WhatsApp Us' : '通过WhatsApp联系'}</span></button></li>
                <li className="pt-4 flex gap-3">
                  <a href="https://www.facebook.com/rftravel.transport" target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] hover:bg-[#166fe5] text-white p-2.5 rounded-lg transition-transform hover:-translate-y-1" aria-label="Facebook"><Facebook size={20} /></a>
                  <a href="https://www.xiaohongshu.com/user/profile/63668abe000000001f01fa4b" target="_blank" rel="noopener noreferrer" className="bg-[#FF2442] hover:bg-[#d91f3a] text-white px-3 py-2.5 rounded-lg text-xs font-bold transition-transform hover:-translate-y-1 flex items-center" aria-label="Xiaohongshu">{lang === 'en' ? 'RED' : '小红书'}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div>{t.footer.copy}</div>
            <div className="flex gap-6"><span>Privacy Policy</span><span>Terms of Service</span></div>
          </div>
        </div>
      </footer>

      {isWAPopupOpen && (
        <div className="fixed bottom-24 right-6 z-[60] w-[320px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slideUp">
           <div className="bg-[#075e54] p-4 text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><WhatsAppIcon size={24} className="text-white" /></div>
              <div><h4 className="font-bold text-sm leading-tight">{t.whatsappPopup.header}</h4><p className="text-[10px] opacity-80">{t.whatsappPopup.status}</p></div>
              <button onClick={() => setIsWAPopupOpen(false)} className="ml-auto opacity-70 hover:opacity-100 transition-opacity"><X size={18} /></button>
           </div>
           <div className="p-4 bg-[#e5ddd5] min-h-[120px] relative">
              <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm inline-block max-w-[90%] relative mb-4"><p className="text-xs text-gray-800">{t.whatsappPopup.intro}</p><span className="text-[9px] text-gray-400 block mt-1 text-right">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              <div className="space-y-2 mt-2">{[t.whatsappPopup.q1, t.whatsappPopup.q2, t.whatsappPopup.q3].map((q, idx) => (<button key={idx} onClick={() => handleWhatsAppContact(q)} className="w-full text-left bg-white/80 hover:bg-white p-2.5 rounded-lg border border-gray-200 text-xs font-medium text-primary-700 transition-all hover:shadow-md flex items-center gap-2 group"><MessageCircle size={14} className="text-primary-500 group-hover:scale-110 transition-transform flex-shrink-0" /><span className="whitespace-pre-line leading-tight">{q}</span></button>))}</div>
           </div>
           <div className="p-3 bg-white border-t border-gray-100"><button onClick={() => handleWhatsAppContact()} className="w-full btn-premium-green btn-shine py-2.5 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-sm"><span className="text-white"><Send size={14} className="inline mr-2" /><span>{t.whatsappPopup.send}</span></span></button></div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-50 group">
        <button id="whatsapp-floating-button" type="button" onClick={() => setIsWAPopupOpen(!isWAPopupOpen)} className={`p-4 rounded-full shadow-2xl transition-all group-hover:scale-110 flex items-center justify-center ${isWAPopupOpen ? 'btn-premium-green' : 'btn-premium-green btn-shine'}`} aria-label="Contact via WhatsApp">
          {isWAPopupOpen ? <X size={32} /> : <WhatsAppIcon size={32} />}
        </button>
        {!isWAPopupOpen && <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 pointer-events-none group-hover:scale-110 transition-transform origin-bottom-left z-20"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ADE80] opacity-75"></span><span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white">1</span></span>}
      </div>
    </div>
  );
};

export default App;
