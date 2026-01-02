
import React, { useState, useEffect, useRef } from 'react';
import { BookingForm } from './components/BookingForm.tsx';
import { PriceTable } from './components/PriceTable.tsx';
import { VEHICLES, TESTIMONIALS, FAQS, WHATSAPP_NUMBER } from './constants.ts';
import { Check, ShieldCheck, Map, Phone, Menu, X, Facebook, ChevronLeft, ChevronRight } from 'lucide-react';
import { translations } from './translations.ts';
import { Language } from './types.ts';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?q=80&w=2000&auto=format&fit=crop", // KL Twin Towers
  "https://i.pinimg.com/1200x/ca/4c/df/ca4cdfde2f707ed2648f2649d50a047e.jpg", // Singapore
  "https://i.ibb.co/mC1QN17V/3.png", // Genting
  "https://i.pinimg.com/1200x/0a/8b/30/0a8b30d52af52a239464cceae3369f78.jpg"  // Malacca
];

const WhatsAppIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
  const t = translations[lang];

  const trackRef = useRef<HTMLDivElement>(null);
  const animState = useRef({
    currentPos: 0,
    isDragging: false,
    startX: 0,
    startPos: 0,
    velocity: 0.5 
  });

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', newLang);
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      console.error("Failed to update URL", e);
    }
  };

  const displayTestimonials = Array(8).fill(TESTIMONIALS).flat();

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (trackRef.current) {
        const track = trackRef.current;
        const state = animState.current;
        if (!state.isDragging) {
           state.currentPos += state.velocity;
        }
        if (track.children.length > 0) {
           const firstCard = track.children[0] as HTMLElement;
           const cardWidth = firstCard.offsetWidth || 320;
           const style = window.getComputedStyle(track);
           const gap = parseFloat(style.gap || '0') || 24;
           const stride = cardWidth + gap;
           const cycleDist = stride * TESTIMONIALS.length;
           if (state.currentPos >= cycleDist) {
             state.currentPos -= cycleDist;
           }
           if (state.currentPos < 0) {
             state.currentPos += cycleDist;
           }
        }
        track.style.transform = `translate3d(-${state.currentPos}px, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
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
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickBook = (from: string, to: string) => {
    setPrefillRoute({ from, to });
    scrollToSection('booking');
  };

  const handleWhatsAppContact = () => {
    try {
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'conversion', { 'send_to': 'AW-17810501351/ic3rCKj_w9QbEOfd2qxC' });
      }
      if (typeof (window as any).fbq === 'function') {
        (window as any).fbq('track', 'Contact');
      }
    } catch (e) {
      console.warn("Tracking failed", e);
    }
    const msg = `Hi, I’m interested in your Charter Car Service form Website. 我想咨询关于包车服务的有关详情`.trim();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
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
              <button onClick={() => handleLanguageChange('en')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>EN</button>
              <button onClick={() => handleLanguageChange('cn')} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'cn' ? 'bg-primary-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>中文</button>
            </div>
            <button onClick={() => scrollToSection('booking')} className="bg-primary-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-primary-700 transition shadow-md hover:shadow-lg">{t.nav.getQuote}</button>
          </div>
          <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg animate-fadeIn">
            <div className="flex gap-2 justify-center pb-2 border-b border-gray-50">
               <button onClick={() => handleLanguageChange('en')} className={`flex-1 py-2 rounded-lg font-bold border ${lang === 'en' ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>English</button>
               <button onClick={() => handleLanguageChange('cn')} className={`flex-1 py-2 rounded-lg font-bold border ${lang === 'cn' ? 'bg-primary-600 text-white border-primary-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>简体中文</button>
            </div>
            <button onClick={() => scrollToSection('home')} className="block w-full text-left font-medium text-gray-700 py-2">{t.nav.home}</button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left font-medium text-gray-700 py-2">{t.nav.rates}</button>
            <button onClick={() => scrollToSection('fleet')} className="block w-full text-left font-medium text-gray-700 py-2">{t.nav.fleet}</button>
            <button onClick={() => scrollToSection('booking')} className="block w-full text-center bg-primary-600 text-white font-bold py-3 rounded-lg">{t.nav.bookNow}</button>
          </div>
        )}
      </nav>
      <section id="home" className="relative min-h-[90vh] flex items-center py-20 bg-slate-900 overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <div key={img} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out z-0 ${index === heroIndex ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: `url('${img}')` }} />
        ))}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 to-black/70 pointer-events-none"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 text-white space-y-6 text-center lg:text-left">
              <div className="inline-block bg-primary-600/20 border border-primary-400/30 backdrop-blur-sm px-4 py-1 rounded-full text-primary-200 text-sm font-semibold tracking-wide uppercase">{t.hero.badge}</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">{lang === 'en' ? (<>Charter Car in <span className="text-primary-400">Malaysia</span> with Ease.</>) : (<>轻松<span className="text-primary-400">游览</span>马来西亚</>)}</h1>
              <p className="text-lg text-gray-200 max-w-xl mx-auto lg:mx-0">{t.hero.subtitle}</p>
              <div className="flex items-center gap-4 justify-center lg:justify-start">
                 <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10"><ShieldCheck className="text-primary-400" /> {t.hero.safe}</div>
                 <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10"><Check className="text-primary-400" /> {t.hero.allInclusive}</div>
              </div>
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <span className="text-white/80 text-sm font-medium">{t.hero.follow}</span>
                <div className="flex gap-4">
                  <a href="https://www.facebook.com/rftravel.transport" target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] hover:bg-[#155db2] text-white px-4 py-2 rounded-full flex items-center gap-2 transition-transform hover:scale-105 shadow-lg"><Facebook size={18} fill="currentColor" /> <span className="text-sm font-bold">Facebook</span></a>
                  <a href="https://www.xiaohongshu.com/user/profile/63668abe000000001f01fa4b" target="_blank" rel="noopener noreferrer" className="bg-[#FF2442] hover:bg-[#d91f3a] text-white px-4 py-2 rounded-full flex items-center gap-2 transition-transform hover:scale-105 shadow-lg"><span className="font-bold text-lg leading-none tracking-tight">{lang === 'en' ? 'Red' : '小红书'}</span></a>
                </div>
              </div>
            </div>
            <div id="booking" className="lg:w-1/2 w-full max-w-lg mx-auto lg:mr-0">
               <BookingForm prefillRoute={prefillRoute} lang={lang} />
               <button id="whatsapp-help-button" type="button" onClick={handleWhatsAppContact} className="w-full mt-4 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform group bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                  <div className="bg-[#25D366] text-white p-1.5 rounded-full shadow-sm group-hover:bg-[#20bd5a] transition-colors flex-shrink-0"><WhatsAppIcon size={20} /></div>
                  <span className="text-white font-medium text-xs md:text-sm drop-shadow-md text-left leading-snug">{t.booking.whatsappHelp}</span>
               </button>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.features.title}</h2>
            <p className="text-gray-600">{t.features.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck size={40} className="text-primary-600"/>, title: t.features.f1_title, desc: t.features.f1_desc },
              { icon: <Map size={40} className="text-primary-600"/>, title: t.features.f2_title, desc: t.features.f2_desc },
              { icon: <Check size={40} className="text-primary-600"/>, title: t.features.f3_title, desc: t.features.f3_desc },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition text-center group">
                <div className="inline-block p-4 bg-white rounded-full shadow-sm mb-6 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
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
      <section id="fleet" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.fleet.title}</h2>
            <p className="text-gray-600">{t.fleet.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VEHICLES.map((v) => (
              <div key={v.type} className="group rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                <div className="h-48 overflow-hidden"><img src={v.image} alt={v.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{lang === 'en' ? v.type : (v.type === 'Sedan' ? '轿车' : v.type === 'Standard MPV' ? '标准MPV' : v.type === 'Luxury MPV' ? '豪华MPV' : '大型MPV')}</h3>
                  <p className="text-sm text-gray-500 mb-4 h-12 leading-tight">{lang === 'en' ? v.description : (v.type === 'Sedan' ? '适合夫妻或行李较少的小家庭。舒适且经济。' : v.type === 'Standard MPV' ? '丰田 Innova 或 Perodua Aruz。适合家庭，行李空间更大。' : v.type === 'Luxury MPV' ? '丰田 Alphard / Vellfire。配备航空座椅和豪华配置。' : '大型多用途车，适合大型团队或带大量行李。')}</p>
                  <div className="flex justify-between text-sm text-gray-600 font-medium bg-gray-50 p-2 rounded-lg">
                    <span>{lang === 'en' ? (v.paxLabel || `Max ${v.maxPax} Pax`) : `最高 ${v.maxPax} 位乘客`}</span>
                    <span>{lang === 'en' ? `Max ${v.maxLuggage} Bags` : `最多 ${v.maxLuggage} 件行李`}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center"><p className="text-sm text-gray-500 italic">{t.fleet.disclaimer}</p></div>
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
      <section id="faq" className="py-20 bg-gray-50">
         <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">{t.faq.title}</h2>
            <div className="space-y-4">
              {(lang === 'en' ? FAQS : [
                { q: "价格包含过路费和油费吗？", a: "包含！我们的报价包含所有费用。这涵盖了车辆、司机、汽油以及所有路税/海关费用。没有任何隐藏费用。" },
                { q: "行程可以临时调整或加点吗？", a: "可以的。在不影响整体时间与司机安全驾驶的情况下，行程可灵活调整或加点。我们会尽量配合您的实际需求，让行程更自由、不赶时间。" },
                { q: "如何付款？", a: "我们接受 PayNow、银行转账或到达目的地后以现金形式支付给司机（马币或新币均可）。高峰期预订可能需要支付少量定金。" }
              ]).map((faq, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
         </div>
      </section>
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">RF Travel<span className="text-primary-500"> & Charter Agency</span></div>
              <p className="max-w-xs text-sm leading-relaxed">{t.footer.desc}</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t.footer.links}</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-primary-400">{t.nav.home}</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary-400">{t.nav.rates}</button></li>
                <li><button onClick={() => scrollToSection('booking')} className="hover:text-primary-400">{t.nav.bookNow}</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-primary-400">{t.nav.faq}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t.footer.contact}</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 font-mono"><Phone size={16}/><a href="tel:+60188706966" className="hover:text-primary-400 transition-colors">+60188706966</a></li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-primary-400" onClick={handleWhatsAppContact}><WhatsAppIcon size={16}/> {lang === 'en' ? 'WhatsApp Us' : '通过WhatsApp联系'}</li>
                <li className="flex gap-4 mt-4">
                  <a href="https://www.facebook.com/rftravel.transport" target="_blank" rel="noopener noreferrer"><Facebook size={20} className="hover:text-primary-500 cursor-pointer" /></a>
                  <a href="https://www.xiaohongshu.com/user/profile/63668abe000000001f01fa4b" target="_blank" rel="noopener noreferrer" className="hover:text-primary-500 cursor-pointer text-xs flex items-center bg-white/10 px-2 py-1 rounded-md font-bold">{lang === 'en' ? 'RED' : '小红书'}</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">{t.footer.copy}</div>
        </div>
      </footer>
      <button id="whatsapp-floating-button" type="button" onClick={handleWhatsAppContact} className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center" aria-label="Contact via WhatsApp">
        <WhatsAppIcon size={32} />
      </button>
    </div>
  );
};

export default App;
