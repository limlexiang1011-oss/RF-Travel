import React, { useState } from 'react';
import { BookingForm } from './components/BookingForm';
import { PriceTable } from './components/PriceTable';
import { VEHICLES, TESTIMONIALS, FAQS, WHATSAPP_NUMBER } from './constants';
import { Check, Star, ShieldCheck, Map, Phone, MessageCircle, Menu, X, Facebook, Instagram } from 'lucide-react';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prefillRoute, setPrefillRoute] = useState<{from: string, to: string} | undefined>(undefined);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickBook = (from: string, to: string) => {
    setPrefillRoute({ from, to });
    scrollToSection('booking');
  };

  const handleWhatsAppFloat = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi, I would like to enquire about a private car booking.`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-lg md:text-2xl text-primary-700 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
            RF Travel<span className="text-gray-800"> & Transport Agency</span>
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

        {/* Mobile Menu */}
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
      <section id="home" className="relative min-h-[90vh] flex items-center py-20 bg-slate-900">
        <div className="absolute inset-0 z-0 hero-bg"></div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            
            {/* Hero Text */}
            <div className="lg:w-1/2 text-white space-y-6 text-center lg:text-left">
              <div className="inline-block bg-primary-600/20 border border-primary-400/30 backdrop-blur-sm px-4 py-1 rounded-full text-primary-200 text-sm font-semibold tracking-wide uppercase">
                Premium Cross-Border Service
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Travel from <span className="text-primary-400">Singapore</span> to <span className="text-primary-400">Malaysia</span> with Ease.
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

              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm font-medium text-white/80">
                {/* Popular Links */}
                <button onClick={() => handleQuickBook('Singapore', 'Johor Bahru')} className="hover:text-white hover:underline text-left">→ SG to JB City</button>
                <button onClick={() => handleQuickBook('Singapore', 'Legoland')} className="hover:text-white hover:underline text-left">→ SG to Legoland</button>
                <button onClick={() => handleQuickBook('Singapore', 'Genting')} className="hover:text-white hover:underline text-left">→ SG to Genting</button>
                <button onClick={() => handleQuickBook('Singapore', 'Kuala Lumpur')} className="hover:text-white hover:underline text-left">→ SG to KL</button>
                <button onClick={() => handleQuickBook('Singapore', 'Malacca')} className="hover:text-white hover:underline text-left">→ SG to Malacca</button>
                <button onClick={() => handleQuickBook('Johor Bahru', 'Singapore')} className="hover:text-white hover:underline text-left">→ JB to SG</button>
              </div>
            </div>

            {/* Booking Form Container (Floating) */}
            <div id="booking" className="lg:w-1/2 w-full max-w-lg mx-auto lg:mr-0">
               <BookingForm prefillRoute={prefillRoute} />
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
              { icon: <Star size={40} className="text-primary-600"/>, title: "Stay in Car", desc: "Pass through immigration checkpoints without dragging your luggage out." },
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
                    <span>Max {v.maxPax} Pax</span>
                    <span>Max {v.maxLuggage} Bags</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-primary-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-primary-800 p-8 rounded-2xl relative">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(t.stars)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                </div>
                <p className="italic text-primary-100 mb-6">"{t.text}"</p>
                <div>
                  <div className="font-bold">{t.name}</div>
                  <div className="text-xs text-primary-300 uppercase tracking-wider">{t.route}</div>
                </div>
              </div>
            ))}
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

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold text-white mb-4">RF Travel<span className="text-primary-500"> & Transport</span></div>
              <p className="max-w-xs text-sm leading-relaxed">
                Professional private car charter service connecting Singapore and Malaysia. We prioritize safety, comfort, and punctuality.
              </p>
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
                <li className="flex items-center gap-2 cursor-pointer hover:text-primary-400" onClick={handleWhatsAppFloat}><MessageCircle size={16}/> WhatsApp Us</li>
                <li className="flex gap-4 mt-4">
                  <Facebook size={20} className="hover:text-primary-500 cursor-pointer" />
                  <Instagram size={20} className="hover:text-primary-500 cursor-pointer" />
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            &copy; 2024 RF Travel & Transport Agency. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Sticky WhatsApp Button */}
      <button 
        onClick={handleWhatsAppFloat}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all hover:scale-110 flex items-center justify-center"
        aria-label="Contact via WhatsApp"
      >
        <MessageCircle size={32} fill="white" className="text-white" />
      </button>

    </div>
  );
};

export default App;