
import React, { useState, useEffect, useRef } from 'react';
import { BookingForm } from './components/BookingForm';
import { PriceTable } from './components/PriceTable';
import { VEHICLES, TESTIMONIALS, FAQS, WHATSAPP_NUMBER } from './constants';
import { Check, Star, ShieldCheck, Map, Phone, MessageCircle, Menu, X, Facebook, ChevronLeft, ChevronRight } from 'lucide-react';

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

const XiaohongshuIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
 <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="5" width="90" height="90" rx="20" stroke="currentColor" strokeWidth="8" fill="none" />
    <text x="50" y="70" fontSize="32" fontWeight="900" textAnchor="middle" fill="currentColor" fontFamily="sans-serif">小红书</text>
  </svg>
);

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefillRoute, setPrefillRoute] = useState<{from: string, to: string} | undefined>(undefined);
  const [heroIndex, setHeroIndex] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const animState = useRef({
    currentPos: 0,
    isDragging: false,
    startX: 0,
    startPos: 0,
    velocity: 0.5 
  });

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
           const cardWidth = firstCard.offsetWidth;
           const style = window.getComputedStyle(track);
           const gap = parseFloat(style.gap || '0');
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
    if (!('touches' in e)) { e.preventDefault(); }
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
    // Trigger Google Conversion tracking
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-17810501351/ic3rCKj_w9QbEOfd2qxC'
      });
    }
    
    const msg = `
Hi RF Travel, I’m interested in your Private Chauffeur & Transfer Service. 你好 RF Travel，我想咨询关于私人专车接送服务的详情。

My Trip Details / 我的行程详情:
Date / 日期: 
Pickup / 出发地: 
Destination / 目的地: 
Pax / 人数: 
    `.trim();

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-lg md:text-2xl text-primary-700 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
            RF Charter Car<span className="text-gray-800"> & Travel Service</span>
          </div>
          
          <div className="hidden md:flex gap-8 font-medium text-gray-600">
            <button onClick={() => scrollToSection('home')} className="hover:text-primary-600 transition">Home</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-primary-600 transition">Rates</button>
            <button onClick={() => scrollToSection('fleet')} className="hover:text-primary-600 transition">Fleet</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-primary-600 transition">FAQ</button>
          </div>

          <div className="hidden md:block">
            <button onClick={() => scrollToSection('booking')} className="bg-primary-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-primary-700 transition shadow-md hover:shadow-lg">
              Get Quote
            </button>
          </div>

          <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg animate-fadeIn">
            <button onClick={() => scrollToSection('home')} className="block w-full text-left font-medium text-gray-700 py-2">Home</button>
            <button onClick={() => scrollToSection('pricing')} className="block w-full text-left font-medium text-gray-700 py-2">Rates</button>
            <button onClick={() => scrollToSection('fleet')} className="block w-full text-left font-medium text-gray-700 py-2">Fleet</button>
            <button onClick={() => scrollToSection('booking')} className="block w-full text-center bg-primary-600 text-white font-bold py-3 rounded-lg">Book Now</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center py-20 bg-slate-900 overflow-hidden">
        {HERO_IMAGES.map((img, index) => (
          <div 
            key={img}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out z-0
              ${index === heroIndex ? 'opacity-100' : 'opacity-0'}
            `}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 to-black/70 pointer-events-none"></div>

        <div className="container mx-auto px-4 z-10 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 text-white space-y-6 text-center lg:text-left">
              <div className="inline-block bg-primary-600/20 border border-primary-400/30 backdrop-blur-sm px-4 py-1 rounded-full text-primary-200 text-sm font-semibold tracking-wide uppercase">
                Premium Cross-Border Service
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Charter Car in <span className="text-primary-400">Malaysia</span> with Ease.
              </h1>
              <p className="text-lg text-gray-200 max-w-xl mx-auto lg:mx-0">
                Door-to-door private car charter. No need to alight at customs. Fixed prices, trusted Chinese-speaking drivers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                 <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                    <ShieldCheck className="text-primary-400" /> Safe & Secure
                 </div>
                 <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                    <Check className="text-primary-400" /> All-Inclusive
                 </div>
              </div>
              <div className="pt-6 flex items-center justify-center lg:justify-start gap-4">
                <span className="text-white/80 text-sm font-medium">Follow us on:</span>
                <a href="https://www.facebook.com/rftravel.transport" target="_blank" rel="noopener noreferrer" className="bg-[#1877F2] hover:bg-[#155db2] text-white px-4 py-2 rounded-full flex items-center gap-2 transition-transform hover:scale-105 shadow-lg">
                  <Facebook size={18} fill="currentColor" /> <span className="text-sm font-bold">Facebook</span>
                </a>
                <a href="https://www.xiaohongshu.com/user/profile/63668abe000000001f01fa4b?xsec_token=AB-O3DJ-0VZk_bABXT94MmM16GvJIxz3dsLdbVufJZ2WM=&xsec_source=pc_search" target="_blank" rel="noopener noreferrer" className="bg-[#FF2442] hover:bg-[#d91f3a] text-white px-4 py-2 rounded-full flex items-center gap-2 transition-transform hover:scale-105 shadow-lg">
                  <span className="font-bold text-lg leading-none tracking-tight">小红书</span>
                </a>
              </div>
            </div>

            <div id="booking" className="lg:w-1/2 w-full max-w-lg mx-auto lg:mr-0">
               <BookingForm prefillRoute={prefillRoute} />
               <div 
                  onClick={handleWhatsAppContact}
                  className="mt-4 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform group bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20"
               >
                  <div className="bg-[#25D366] text-white p-1.5 rounded-full shadow-sm group-hover:bg-[#20bd5a] transition-colors">
                     <WhatsAppIcon size={20} />
                  </div>
                  <span className="text-white font-medium text-sm drop-shadow-md">
                    If you have any questions about the website or options, please click here to contact us.
                  </span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-gray-600">We make cross-border travel simple, comfortable, and affordable.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck size={40} className="text-primary-600"/>, title: "Fixed Pricing", desc: "No hidden costs. Price includes toll fees, petrol, driver, and vehicle." },
              { icon: <Map size={40} className="text-primary-600"/>, title: "Door to Door", desc: "We pick you up from your doorstep and drop you exactly where you need to be." },
              { icon: <Star size={40} className="text-primary-600"/>, title: "Customizable Trips", desc: "Every journey can be tailored to your needs—any destination, any requirement." },
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
            <p className="text-gray-600">Popular routes and their starting rates.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <PriceTable onBook={handleQuickBook} />
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section id="fleet" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Premium Fleet</h2>
            <p className="text-gray-600">Clean, well-maintained vehicles for every group size.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VEHICLES.map((v) => (
              <div key={v.type} className="group rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                <div className="h-48 overflow-hidden">
                  <img src={v.image} alt={v.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{v.type}</h3>
                  <p className="text-sm text-gray-500 mb-4 h-10">{v.description}</p>
                  <div className="flex justify-between text-sm text-gray-600 font-medium bg-gray-50 p-2 rounded-lg">
                    <span>{v.paxLabel || `Max ${v.maxPax} Pax`}</span>
                    <span>Max {v.maxLuggage} Bags</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
             <p className="text-sm text-gray-500 italic">Disclaimer: Vehicle images are for reference only. Actual vehicle models are subject to company arrangement.</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden select-none">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
             <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
             <div className="hidden md:flex gap-2"><span className="text-sm text-slate-400 flex items-center gap-1"><ChevronLeft size={16}/> Drag to Scroll <ChevronRight size={16}/></span></div>
          </div>
          <div 
             className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
             onMouseDown={handleDragStart} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}
             onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}
          >
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

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
         <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
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
              <div className="text-2xl font-bold text-white mb-4">RF Charter Car<span className="text-primary-500"> & Travel Service</span></div>
              <p className="max-w-xs text-sm leading-relaxed">Professional private car charter service connecting Singapore and Malaysia. We prioritize safety, comfort, and punctuality.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('home')} className="hover:text-primary-400">Home</button></li>
                <li><button onClick={() => scrollToSection('pricing')} className="hover:text-primary-400">Pricing</button></li>
                <li><button onClick={() => scrollToSection('booking')} className="hover:text-primary-400">Book Now</button></li>
                <li><button onClick={() => scrollToSection('faq')} className="hover:text-primary-400">Terms of Service</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Phone size={16}/> +60 18-870 6966</li>
                <li className="flex items-center gap-2 cursor-pointer hover:text-primary-400" onClick={handleWhatsAppContact}><WhatsAppIcon size={16}/> WhatsApp Us</li>
                <li className="flex gap-4 mt-4">
                  <a href="https://www.facebook.com/rftravel.transport" target="_blank" rel="noopener noreferrer"><Facebook size={20} className="hover:text-primary-500 cursor-pointer" /></a>
                  <a href="https://www.xiaohongshu.com/user/profile/63668abe000000001f01fa4b?xsec_token=AB-O3DJ-0VZk_bABXT94MmM16GvJIxz3dsLdbVufJZ2WM=&xsec_source=pc_search" target="_blank" rel="noopener noreferrer"><XiaohongshuIcon size={20} className="hover:text-primary-500 cursor-pointer" /></a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">&copy; 2024 RF Charter Car & Travel Service. All rights reserved.</div>
        </div>
      </footer>

      <button onClick={handleWhatsAppContact} className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center" aria-label="Contact via WhatsApp">
        <WhatsAppIcon size={32} />
      </button>
    </div>
  );
};

export default App;
