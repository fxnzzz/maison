import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Search, ArrowRight, ChevronLeft, ChevronRight, 
  ShoppingBag, Heart
} from 'lucide-react';

const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@200;300;400;500&display=swap');
    
    :root {
      --bg-primary: #FCFBF9;
      --text-primary: #111111;
      --text-muted: #777777;
      --border-light: #EAEAEA;
    }

    html {
      scroll-behavior: smooth;
    }
    
    ::selection {
      background: var(--text-primary);
      color: var(--bg-primary);
    }

    body {
      margin: 0;
      background-color: var(--bg-primary);
      color: var(--text-primary);
      overflow-x: hidden;
      font-family: 'Montserrat', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .font-serif {
      font-family: 'Cormorant Garamond', serif;
    }

    /* Invisible scrollbars for elegant horizontal scrolling */
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    /* Luxury motion easing */
    .ease-luxury {
      transition-timing-function: cubic-bezier(0.25, 1, 0.35, 1);
    }
    
    .ease-slow {
      transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Snap scrolling for carousel */
    .snap-x-mandatory {
      scroll-snap-type: x mandatory;
    }
    .snap-center-item {
      scroll-snap-align: center;
    }
    @media (min-width: 768px) {
      .snap-center-item {
        scroll-snap-align: start;
      }
    }
  `}} />
);

function useOnScreen(options = { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    const currentElement = ref.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [options]);

  return [ref, isVisible];
}

const Reveal = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const [ref, isVisible] = useOnScreen();
  
  let translateClass = 'translate-y-12';
  if (direction === 'left') translateClass = 'translate-x-12';
  if (direction === 'right') translateClass = '-translate-x-12';
  if (direction === 'none') translateClass = 'translate-y-0 scale-95';

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-[1800ms] ease-luxury ${isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : `opacity-0 ${translateClass}`} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Navigation = ({ cartCount, onOpenCart }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collections', href: '#collection' },
    { name: 'Maroquinerie', href: '#leather-goods' },
    { name: 'La Maison', href: '#maison' },
    { name: 'Campagne', href: '#campaign' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-[1200ms] ease-luxury ${isScrolled ? 'py-5 bg-[#FCFBF9]/95 backdrop-blur-xl border-b border-[#111111]/5' : 'py-8 bg-gradient-to-b from-black/40 to-transparent'}`}>
        <div className="px-6 md:px-12 mx-auto flex justify-between items-center max-w-[2400px]">
          
          {/* Left: Mobile Toggle & Desktop Links */}
          <div className="flex-1 flex items-center gap-10">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={`md:hidden p-2 -ml-2 transition-opacity duration-500 ${isScrolled ? 'text-[#111111] hover:opacity-60' : 'text-white hover:opacity-80'}`}
            >
              <Menu strokeWidth={1} size={28} />
            </button>
            <div className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-[9.5px] uppercase tracking-[0.25em] font-medium transition-all duration-700 hover:opacity-50 ${isScrolled ? 'text-[#111111]' : 'text-white'}`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Center: Brand Identity */}
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`flex-1 text-center font-serif text-2xl md:text-3xl tracking-[0.15em] uppercase transition-colors duration-[1200ms] ${isScrolled ? 'text-[#111111]' : 'text-white'}`}
          >
            Maison Aureline
          </a>

          {/* Right: Actions */}
          <div className={`flex-1 flex justify-end items-center gap-5 md:gap-8 transition-colors duration-[1200ms] ${isScrolled ? 'text-[#111111]' : 'text-white'}`}>
            <div className="hidden md:flex items-center">
              <div className={`overflow-hidden transition-all duration-700 ease-luxury ${isSearchOpen ? 'w-48 opacity-100 mr-4' : 'w-0 opacity-0'}`}>
                <input 
                  type="text" 
                  placeholder="RECHERCHE..." 
                  className={`w-full bg-transparent border-b text-[9.5px] uppercase tracking-[0.2em] py-2 outline-none ${isScrolled ? 'border-[#111111]/20 text-[#111111] placeholder:text-[#111111]/40' : 'border-white/30 text-white placeholder:text-white/60'}`}
                />
              </div>
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 hover:opacity-50 transition-opacity">
                <Search strokeWidth={1} size={20} />
              </button>
            </div>
            
            <button className="hidden md:block p-2 hover:opacity-50 transition-opacity">
              <Heart strokeWidth={1} size={20} />
            </button>
            
            <button onClick={onOpenCart} className="relative p-2 hover:opacity-50 transition-opacity flex items-center gap-2">
              <span className="hidden md:block text-[9.5px] uppercase tracking-[0.2em] font-medium mr-1">Panier</span>
              <div className="relative">
                <ShoppingBag strokeWidth={1} size={20} />
                {cartCount > 0 && (
                  <span className={`absolute -top-1 -right-1.5 text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium ${isScrolled ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}>
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>

        </div>
      </nav>

      <div className={`fixed inset-0 z-[100] bg-[#FCFBF9] transition-all duration-[1200ms] ease-luxury flex flex-col ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="px-6 py-6 flex justify-between items-center">
          <span className="font-serif text-xl tracking-[0.15em] uppercase text-[#111111]">Maison Aureline</span>
          <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-[#111111] hover:rotate-90 transition-transform duration-[1200ms] ease-luxury">
            <X strokeWidth={1} size={32} />
          </button>
        </div>
        <div className="flex-1 flex flex-col justify-center px-8 pb-24">
          {navLinks.map((link, i) => (
            <div key={link.name} className="overflow-hidden py-3">
              <a 
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`block text-4xl font-serif text-[#111111] hover:text-[#777777] transition-all duration-[1200ms] ease-luxury transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[120%] opacity-0'}`}
                style={{ transitionDelay: `${isMenuOpen ? 150 + (i * 120) : 0}ms` }}
              >
                {link.name}
              </a>
            </div>
          ))}
          <div className={`mt-16 space-y-4 transition-all duration-[1500ms] ease-luxury ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
            <p className="text-[9.5px] uppercase tracking-[0.25em] text-[#777777] mb-6">Service Client</p>
            <p className="text-sm font-light text-[#111111]">+33 1 40 20 50 50</p>
            <p className="text-sm font-light text-[#111111]">contact@maisonaureline.com</p>
          </div>
        </div>
      </div>
    </>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen w-full bg-[#111111] overflow-hidden">
      {/* Full bleed imagery with slow, continuous scale */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop" 
          alt="Campaign Hiver" 
          className="w-full h-full object-cover object-center scale-105 opacity-80 text-transparent"
          style={{ animation: 'heroZoom 30s cubic-bezier(0.25, 1, 0.35, 1) infinite alternate' }}
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      </div>

      <style>{`
        @keyframes heroZoom {
          0% { transform: scale(1.02); }
          100% { transform: scale(1.12); }
        }
        @keyframes scrollPulse {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          50.1% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
      `}</style>

      {/* Centered Typography block */}
      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-24 md:pb-28 px-6">
        <div className="text-center overflow-hidden w-full max-w-4xl">
          <Reveal delay={400} direction="none">
            <h1 className="text-white font-serif text-[3.5rem] sm:text-[6rem] md:text-[9rem] lg:text-[11rem] leading-[0.85] font-light mb-8 md:mb-12 tracking-[-0.02em]">
              L'Éternel<br/>Présent
            </h1>
          </Reveal>
        </div>
        <div className="text-center overflow-hidden mb-16 md:mb-20">
          <Reveal delay={800}>
            <p className="text-white text-[9px] md:text-[10.5px] uppercase tracking-[0.3em] font-medium">
              Collection Automne-Hiver 2026
            </p>
          </Reveal>
        </div>
        
        {/* Animated Scroll Indicator */}
        <Reveal delay={1200} className="absolute bottom-0 mb-8 flex flex-col items-center gap-4">
          <span className="text-white/60 text-[8px] uppercase tracking-[0.4em] rotate-90 mb-6">Scroll</span>
          <div className="w-[1px] h-16 bg-white/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-white" style={{ animation: 'scrollPulse 2.5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite' }} />
          </div>
        </Reveal>
      </div>
    </section>
  );
};

const EditorialMaison = () => {
  return (
    <section id="maison" className="py-32 md:py-48 px-6 md:px-12 bg-[#FCFBF9] max-w-[2000px] mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-0 items-center">
        
        {/* Left Side: Editorial Text */}
        <div className="lg:col-span-4 lg:col-start-2 flex flex-col justify-center order-2 lg:order-1">
          <Reveal direction="right">
            <h3 className="text-[9.5px] uppercase tracking-[0.25em] text-[#777777] mb-8 md:mb-12">La Maison</h3>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-10 text-[#111111]">
              L'Art de<br/>la Discrétion.
            </h2>
            <div className="space-y-6 text-[13px] md:text-[14px] text-[#444444] font-light leading-[1.8] max-w-md">
              <p>
                Maison Aureline is born from a desire to strip away the superfluous. We craft garments not for the moment, but for the archive. Rooted in the rigorous traditions of Parisian tailoring, our silhouettes speak through impeccable cuts.
              </p>
              <p>
                Exquisite materials and an unwavering commitment to the quiet poetry of restraint define our legacy. True luxury whispers.
              </p>
            </div>
            <a 
              href="#collection" 
              onClick={(e) => { e.preventDefault(); document.querySelector('#collection').scrollIntoView({ behavior: 'smooth' }); }}
              className="mt-14 inline-block border-b border-[#111111] pb-2 text-[9.5px] uppercase tracking-[0.25em] font-medium hover:text-[#777777] hover:border-[#777777] transition-all duration-500"
            >
              Explorer l'Héritage
            </a>
          </Reveal>
        </div>

        {/* Right Side: Asymmetrical Bleed Imagery */}
        <div className="lg:col-span-6 lg:col-start-7 relative order-1 lg:order-2">
          <Reveal delay={200} className="relative z-10 w-full aspect-[3/4] lg:aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop" 
              alt="Atelier Detail" 
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms] ease-luxury text-transparent"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop";
              }}
            />
          </Reveal>
          {/* Decorative architectural offset image - Parallax feel */}
          <Reveal delay={500} direction="up" className="hidden lg:block absolute -bottom-32 -left-24 w-72 aspect-[2/3] overflow-hidden z-20 shadow-2xl bg-[#F5F5F5]">
            <img 
              src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1600&auto=format&fit=crop" 
              alt="Maison Architecture" 
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms] ease-luxury text-transparent"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop";
              }}
            />
          </Reveal>
        </div>

      </div>
    </section>
  );
};

const StaggeredCollection = ({ onAddToCart }) => {
  const pieces = [
    {
      id: 1,
      name: "Le Manteau Structuré",
      desc: "Laine et Soie",
      price: "3 200 €",
      img: "https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=1600&auto=format&fit=crop",
      layout: "large-left"
    },
    {
      id: 2,
      name: "Robe Drapée Asymétrique",
      desc: "Crêpe de Chine",
      price: "2 850 €",
      img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
      layout: "small-center"
    },
    {
      id: 3,
      name: "Veste Tailleur",
      desc: "Coton Brut",
      price: "2 400 €",
      img: "https://images.unsplash.com/photo-1534126416832-a88fdf2911c2?q=80&w=1600&auto=format&fit=crop",
      layout: "large-right"
    }
  ];

  return (
    <section id="collection" className="py-24 md:py-40 bg-white">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        <Reveal>
          <div className="text-center mb-28 md:mb-48">
            <h2 className="font-serif text-4xl md:text-6xl mb-6 text-[#111111]">Sélection Prêt-à-Porter</h2>
            <p className="text-[9.5px] uppercase tracking-[0.25em] text-[#777777]">Automne-Hiver 2026</p>
          </div>
        </Reveal>

        <div className="space-y-32 md:space-y-64">
          {pieces.map((item, idx) => {
            const isLargeLeft = item.layout === 'large-left';
            const isLargeRight = item.layout === 'large-right';
            const isSmallCenter = item.layout === 'small-center';

            return (
              <div key={item.id} className={`flex flex-col ${isLargeRight ? 'lg:flex-row-reverse' : isSmallCenter ? 'lg:flex-col lg:items-center' : 'lg:flex-row'} items-center gap-10 lg:gap-24`}>
                
                {/* Image Container */}
                <div className={`relative overflow-hidden group w-full ${isSmallCenter ? 'lg:w-[45%]' : 'lg:w-[55%]'} aspect-[3/4] bg-[#F5F5F5]`}>
                  <Reveal delay={100} className="w-full h-full">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-[2500ms] ease-luxury text-transparent"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop";
                      }}
                    />
                    {/* Elegant overlay on hover */}
                    <div className="absolute inset-0 bg-[#111111]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  </Reveal>
                </div>

                {/* Text & Actions */}
                <div className={`w-full ${isSmallCenter ? 'lg:w-1/2 text-center mt-12' : 'lg:w-[35%]'} flex flex-col justify-center`}>
                  <Reveal delay={300} direction={isLargeRight ? 'left' : isLargeLeft ? 'right' : 'up'}>
                    <p className="text-[9.5px] uppercase tracking-[0.25em] text-[#777777] mb-5">{item.desc}</p>
                    <h3 className="font-serif text-3xl md:text-5xl mb-6 leading-tight text-[#111111]">{item.name}</h3>
                    <p className="text-[13px] text-[#444444] mb-12 font-light tracking-wide">{item.price}</p>
                    <button 
                      onClick={() => onAddToCart(item)}
                      className={`group inline-flex items-center gap-4 text-[9.5px] uppercase tracking-[0.25em] font-medium transition-colors ${isSmallCenter ? 'mx-auto' : ''}`}
                    >
                      <span className="border-b border-[#111111] pb-2 group-hover:text-[#777777] group-hover:border-[#777777] transition-colors duration-500">
                        Ajouter au Panier
                      </span>
                      <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-3 transition-transform duration-500 ease-luxury" />
                    </button>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-40 md:mt-56 text-center">
          <Reveal>
            <a 
              href="#collection" 
              onClick={(e) => e.preventDefault()}
              className="inline-block border border-[#111111] px-14 py-5 text-[9.5px] uppercase tracking-[0.25em] font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors duration-[800ms]"
            >
              Voir toute la collection
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

const HorizontalCarousel = ({ onImageClick }) => {
  const scrollRef = useRef(null);
  
  const accessories = [
    { id: 1, name: "Le Sac de Jour", img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1600&auto=format&fit=crop" },
    { id: 2, name: "Escarpins Sculpturaux", img: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1600&auto=format&fit=crop" },
    { id: 3, name: "Parfum Signature", img: "https://images.unsplash.com/photo-1523293115678-d2900f52f461?q=80&w=1600&auto=format&fit=crop" },
    { id: 4, name: "Sacoche Équestre", img: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=1600&auto=format&fit=crop" },
    { id: 5, name: "Ceinture Nœud", img: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=1600&auto=format&fit=crop" }
  ];

  const scroll = (dir) => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 500 : 300;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="leather-goods" className="py-24 md:py-40 bg-[#FCFBF9] overflow-hidden">
      <div className="px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 max-w-[2400px] mx-auto gap-8">
        <Reveal>
          <h2 className="font-serif text-4xl md:text-6xl text-[#111111] leading-tight">Maroquinerie &<br/>Accessoires</h2>
        </Reveal>
        <Reveal delay={200}>
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')} 
              className="p-4 border border-[#EAEAEA] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors duration-500 rounded-full flex items-center justify-center"
              aria-label="Previous item"
            >
              <ChevronLeft size={20} strokeWidth={1} />
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="p-4 border border-[#EAEAEA] text-[#111111] hover:bg-[#111111] hover:text-white transition-colors duration-500 rounded-full flex items-center justify-center"
              aria-label="Next item"
            >
              <ChevronRight size={20} strokeWidth={1} />
            </button>
          </div>
        </Reveal>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 md:gap-10 overflow-x-auto hide-scrollbar px-6 md:px-12 pb-12 snap-x-mandatory scroll-smooth"
      >
        {accessories.map((item, idx) => (
          <div key={item.id} className="snap-center-item min-w-[280px] sm:min-w-[360px] md:min-w-[440px] flex-shrink-0 group">
            <Reveal delay={idx * 100} className="h-full">
              <div 
                className="aspect-[4/5] bg-[#F5F5F5] mb-8 overflow-hidden relative cursor-pointer"
                onClick={() => onImageClick(item.img)}
              >
                <img 
                  src={item.img} 
                  alt={item.name} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2500ms] ease-luxury text-transparent"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop";
                  }}
                />
                <div className="absolute inset-0 bg-[#111111]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center backdrop-blur-[2px]">
                   <span className="bg-white px-8 py-4 text-[9px] uppercase tracking-[0.25em] font-medium text-[#111111]">Agrandir</span>
                </div>
              </div>
              <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-center text-[#111111]">{item.name}</h4>
            </Reveal>
          </div>
        ))}
        {/* Spacer for elegant ending */}
        <div className="min-w-[24px] md:min-w-[48px] flex-shrink-0"></div>
      </div>
    </section>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#111111] text-white pt-24 md:pt-40 pb-12">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12">
        
        {/* Newsletter Box */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 mb-24 md:mb-40 items-end">
          <Reveal>
            <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight">Rejoignez<br/>la Maison</h2>
            <p className="text-[13px] text-[#888888] font-light mb-0 max-w-md leading-[1.8]">
              Inscrivez-vous pour recevoir nos dernières actualités, des invitations à nos événements privés et l'accès anticipé à nos collections.
            </p>
          </Reveal>
          
          <Reveal delay={200} className="w-full">
            {isSubscribed ? (
              <div className="py-5 border-b border-white/20 text-[11px] uppercase tracking-[0.2em] text-white animate-fade-in">
                Merci. Vous êtes désormais inscrit(e).
              </div>
            ) : (
              <form className="w-full relative group" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="VOTRE ADRESSE E-MAIL" 
                  required
                  className="w-full bg-transparent border-b border-[#333333] py-5 text-[10px] uppercase tracking-[0.2em] outline-none focus:border-white transition-colors duration-500 text-white placeholder:text-[#555555]"
                />
                <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#555555] group-focus-within:text-white hover:text-white transition-colors duration-500" aria-label="Subscribe">
                  <ArrowRight size={20} strokeWidth={1} />
                </button>
              </form>
            )}
          </Reveal>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8 border-t border-[#222222] pt-20 mb-24">
          <Reveal delay={100}>
            <h4 className="text-[9px] uppercase tracking-[0.25em] font-medium mb-10 text-[#666666]">Services</h4>
            <ul className="space-y-5 text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA]">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Contactez-nous</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Livraison & Retours</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Suivi de commande</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Prendre rendez-vous</a></li>
            </ul>
          </Reveal>
          
          <Reveal delay={200}>
            <h4 className="text-[9px] uppercase tracking-[0.25em] font-medium mb-10 text-[#666666]">La Maison</h4>
            <ul className="space-y-5 text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA]">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Héritage</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Carrières</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Développement Durable</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Mentions Légales</a></li>
            </ul>
          </Reveal>

          <Reveal delay={300}>
            <h4 className="text-[9px] uppercase tracking-[0.25em] font-medium mb-10 text-[#666666]">Réseaux</h4>
            <ul className="space-y-5 text-[11px] uppercase tracking-[0.15em] text-[#AAAAAA]">
              <li><a href="#" className="hover:text-white transition-colors duration-300">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">Pinterest</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">YouTube</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-300">WeChat</a></li>
            </ul>
          </Reveal>

          <Reveal delay={400}>
             <h4 className="text-[9px] uppercase tracking-[0.25em] font-medium mb-10 text-[#666666]">Boutiques</h4>
             <p className="text-[12px] font-serif text-[#AAAAAA] leading-[2] tracking-wide">
               Paris<br/>
               Milan<br/>
               Londres<br/>
               New York<br/>
               Tokyo
             </p>
          </Reveal>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[8.5px] uppercase tracking-[0.25em] text-[#555555] border-t border-[#222222] pt-8">
           <p>© {new Date().getFullYear()} MAISON AURELINE. TOUS DROITS RÉSERVÉS.</p>
           <p className="mt-4 md:mt-0">FRANCE / EUR €</p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [lightboxImg, setLightboxImg] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Lock body scroll when modals open
  useEffect(() => {
    if (lightboxImg || isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxImg, isCartOpen]);

  const handleAddToCart = (item) => {
    setCartItems(prev => [...prev, item]);
    setIsCartOpen(true);
  };

  const removeFromCart = (indexToRemove) => {
    setCartItems(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const cartTotal = cartItems.reduce((sum, item) => {
    // Basic price parsing: remove non-numeric chars except standard digits
    const num = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
    return sum + (num || 0);
  }, 0);

  return (
    <div className="relative antialiased selection:bg-[#111111] selection:text-white">
      <CustomStyles />
      
      <Navigation cartCount={cartItems.length} onOpenCart={() => setIsCartOpen(true)} />
      
      <main>
        <Hero />
        <EditorialMaison />
        <StaggeredCollection onAddToCart={handleAddToCart} />
        <HorizontalCarousel onImageClick={setLightboxImg} />
      </main>

      <Footer />

      {/* Fullscreen Cinematic Image Lightbox */}
      <div 
        className={`fixed inset-0 z-[120] bg-[#FCFBF9]/95 backdrop-blur-xl transition-all duration-[800ms] ease-luxury flex items-center justify-center ${lightboxImg ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setLightboxImg(null)}
      >
        <button 
          className="absolute top-8 right-8 md:top-12 md:right-12 text-[#111111] hover:rotate-90 transition-transform duration-[800ms] ease-luxury p-2"
          onClick={() => setLightboxImg(null)}
          aria-label="Close Lightbox"
        >
          <X size={36} strokeWidth={0.5} />
        </button>
        {lightboxImg && (
          <img 
            src={lightboxImg} 
            alt="Vue détaillée" 
            className="max-w-[90vw] max-h-[85vh] object-contain shadow-2xl animate-fade-in-up text-transparent"
            onClick={(e) => e.stopPropagation()}
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop";
            }}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.25, 1, 0.35, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>

      {/* Shopping Bag Sidebar Drawer */}
      <div className={`fixed inset-0 z-[110] transition-all duration-[800ms] ${isCartOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
         {/* Dimmed Backdrop */}
         <div 
           className={`absolute inset-0 bg-[#111111]/30 backdrop-blur-sm transition-opacity duration-[800ms] ${isCartOpen ? 'opacity-100' : 'opacity-0'}`} 
           onClick={() => setIsCartOpen(false)}
         />
         
         {/* Drawer Panel */}
         <div className={`absolute top-0 right-0 h-full w-full sm:w-[480px] bg-[#FCFBF9] flex flex-col transition-transform duration-[800ms] ease-luxury shadow-2xl ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            
            {/* Header */}
            <div className="px-8 py-10 flex justify-between items-center">
              <h2 className="text-[10px] uppercase tracking-[0.25em] font-medium text-[#111111]">Votre Panier ({cartItems.length})</h2>
              <button onClick={() => setIsCartOpen(false)} className="hover:opacity-50 transition-opacity text-[#111111]">
                <X size={24} strokeWidth={1} />
              </button>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8 hide-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#777777] space-y-8">
                  <ShoppingBag size={40} strokeWidth={0.5} />
                  <p className="text-[9.5px] uppercase tracking-[0.25em]">Votre panier est vide</p>
                  <button onClick={() => setIsCartOpen(false)} className="border-b border-[#777777] pb-1 text-[10px] uppercase tracking-[0.2em] hover:text-[#111111] hover:border-[#111111] transition-colors duration-500">
                    Continuer vos achats
                  </button>
                </div>
              ) : (
                cartItems.map((item, i) => (
                  <div key={i} className="flex gap-6 group bg-white p-4">
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      loading="lazy"
                      className="w-24 h-32 object-cover bg-[#F5F5F5] text-transparent" 
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1600&auto=format&fit=crop";
                      }}
                    />
                    <div className="flex flex-col justify-center flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-serif text-xl leading-tight text-[#111111]">{item.name}</h4>
                        <button onClick={() => removeFromCart(i)} className="text-[#AAAAAA] hover:text-[#111111] transition-colors duration-300 p-1">
                          <X size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-[9px] text-[#777777] uppercase tracking-[0.2em] mt-3 mb-4">{item.desc}</p>
                      <p className="text-[13px] font-medium text-[#111111]">{item.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Footer */}
            {cartItems.length > 0 && (
              <div className="p-8 bg-white border-t border-[#EAEAEA]">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[9.5px] uppercase tracking-[0.25em] text-[#777777]">Sous-total</span>
                  <span className="text-2xl font-serif text-[#111111]">{cartTotal.toLocaleString('fr-FR')} €</span>
                </div>
                <p className="text-[8.5px] text-[#888888] mb-8 uppercase tracking-[0.15em] text-center">Taxes et frais de livraison calculés à l'étape suivante</p>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-[#111111] text-white py-6 text-[9.5px] uppercase tracking-[0.25em] font-medium hover:bg-[#333333] transition-colors duration-500"
                >
                  Valider la commande
                </button>
              </div>
            )}
         </div>
      </div>

    </div>
  );
}