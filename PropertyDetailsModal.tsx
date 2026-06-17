import { useState } from 'react';
import { Menu, X, Heart, Phone, LogOut, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  onContactClick: () => void;
  favoritesCount: number;
  appointmentsCount: number;
  onLoginClick: () => void;
  onFavoritesClick: () => void;
  onAppointmentsClick: () => void;
}

export default function Header({ onContactClick, favoritesCount, appointmentsCount, onLoginClick, onFavoritesClick, onAppointmentsClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Inicio', href: '#inicio' },
    { label: 'Propiedades', href: '#propiedades' },
    { label: 'Blog', href: '#blog' },
    { label: 'Sobre Nosotros', href: '#nosotros' },
  ];

  const contactItem = { label: 'Contacto', href: '#contacto' };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#1a1410] to-[#2a2420] text-primary-foreground border-b border-secondary/20 shadow-lg">
      <div className="container h-20 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-2 group shrink-0 hover:opacity-80 transition-opacity duration-300">
          <img 
            src="/manus-storage/logo-ca_d6773a75.png" 
            alt="C&A Inmobiliaria" 
            className="h-20 md:h-24 w-auto"
          />
          <div className="w-px h-8 bg-secondary/40" />
          <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-white/80 group-hover:text-secondary transition-colors duration-300 hidden sm:inline">
            Inmobiliaria
          </span>
        </a>

        {/* Navegación Desktop */}
        <nav className="hidden lg:flex items-center gap-0.5 text-xs font-semibold tracking-widest uppercase">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item.href);
              }}
              className="px-3 py-2 hover:text-secondary transition-colors duration-300 relative group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <a
            href={contactItem.href}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick(contactItem.href);
            }}
            className="px-3 py-2 hover:text-secondary transition-colors duration-300 relative group"
          >
            {contactItem.label}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300" />
          </a>
        </nav>

        {/* Acciones Derecha */}
        <div className="flex items-center gap-3 md:gap-4">
          {/* Mis Citas */}
          <button
            onClick={onAppointmentsClick}
            className="hidden md:flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white/90 px-3 py-2 bg-white/5 hover:bg-secondary/20 rounded border border-white/10 hover:border-secondary transition-all duration-300 cursor-pointer"
            title="Ver mis citas"
          >
            <Calendar className="w-4 h-4 text-secondary" />
            <span>{appointmentsCount}</span>
          </button>

          {/* Favoritos */}
          <button
            onClick={onFavoritesClick}
            className="hidden md:flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-white/90 px-3 py-2 bg-white/5 hover:bg-secondary/20 rounded border border-white/10 hover:border-secondary transition-all duration-300 cursor-pointer"
            title="Ver favoritos"
          >
            <Heart className="w-4 h-4 text-secondary fill-secondary" />
            <span>{favoritesCount}</span>
          </button>

          {/* Botón Login/Logout */}
          {user ? (
            <Button
              onClick={logout}
              variant="outline"
              className="hidden sm:flex h-10 px-4 md:px-6 border-secondary text-secondary hover:bg-secondary hover:text-primary font-bold tracking-widest uppercase text-[10px] transition-all duration-300 items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Salir</span>
            </Button>
          ) : (
            <Button
              onClick={onLoginClick}
              variant="outline"
              className="hidden sm:flex h-10 px-4 md:px-6 border-secondary text-secondary hover:bg-secondary hover:text-primary font-bold tracking-widest uppercase text-[10px] transition-all duration-300 items-center gap-2"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Iniciar Sesión</span>
            </Button>
          )}

          {/* Botón Teléfono */}
          <a
            href="tel:+34611780603"
            className="hidden sm:flex h-10 px-3 md:px-4 bg-secondary hover:bg-white text-primary hover:text-primary transition-all duration-300 items-center justify-center"
            title="Llamar"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Botón Menú Móvil */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:text-secondary transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gradient-to-r from-[#1a1410] to-[#2a2420] border-t border-secondary/20 py-6 px-4 space-y-4 animate-editorial-slide-up">
          <nav className="flex flex-col gap-3">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className="text-xs font-bold tracking-widest uppercase text-white/90 hover:text-secondary transition-colors px-3 py-2"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="h-px bg-secondary/20" />
          {user ? (
            <>
              <div className="px-3 py-2 text-xs font-bold tracking-widest uppercase text-secondary">
                {user.name}
              </div>
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                variant="outline"
                className="w-full h-11 border-secondary text-secondary hover:bg-secondary hover:text-primary font-bold tracking-widest uppercase text-xs"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLoginClick();
              }}
              variant="outline"
              className="w-full h-11 border-secondary text-secondary hover:bg-secondary hover:text-primary font-bold tracking-widest uppercase text-xs"
            >
              <User className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
          )}
          <Button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onContactClick();
            }}
            className="w-full h-11 bg-secondary hover:bg-white text-primary hover:text-primary font-bold tracking-widest uppercase text-xs"
          >
            Contactar Ahora
          </Button>
        </div>
      )}
    </header>
  );
}
