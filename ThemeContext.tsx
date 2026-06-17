import { Property } from '@/lib/data';
import { BedDouble, Bath, Square, MapPin, Heart, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PropertyCardProps {
  property: Property;
  onViewDetails: (property: Property) => void;
  onBookVisit: (property: Property) => void;
}

export default function PropertyCard({ property, onViewDetails, onBookVisit }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Cargar estado de favorito desde localStorage al montar el componente
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('cya_favorites') || '[]');
    setIsFavorite(favorites.includes(property.id));
  }, [property.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('cya_favorites') || '[]');
    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter((id: string) => id !== property.id);
      toast.success('Propiedad eliminada de favoritos');
    } else {
      updatedFavorites = [...favorites, property.id];
      toast.success('Propiedad añadida a favoritos');
    }
    localStorage.setItem('cya_favorites', JSON.stringify(updatedFavorites));
    setIsFavorite(!isFavorite);
    
    // Disparar un evento personalizado para actualizar otros componentes (ej. el contador en el Navbar)
    window.dispatchEvent(new Event('favorites-updated'));
  };

  const formatPrice = (price: number, operation: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price) + (operation === 'alquiler' ? '/mes' : '');
  };

  return (
    <div 
      className="group bg-card border border-border overflow-hidden relative flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:border-secondary"
      onClick={() => onViewDetails(property)}
    >
      {/* Imagen con badge y favorito */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Capa de degradado sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Badge de operación */}
        <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground border border-secondary px-3 py-1 text-[9px] font-bold tracking-widest uppercase z-10">
          {property.operation === 'venta' ? 'En Venta' : 'Alquiler Premium'}
        </div>

        {/* Botón Favorito */}
        <button
          type="button"
          onClick={toggleFavorite}
          className="absolute top-4 right-4 w-10 h-10 bg-card/80 hover:bg-card text-foreground hover:text-destructive flex items-center justify-center transition-all duration-300 z-10 border border-border/50"
        >
          <Heart 
            className={`w-4 h-4 transition-transform duration-300 active:scale-75 ${
              isFavorite ? 'fill-destructive text-destructive' : 'text-foreground'
            }`} 
          />
        </button>
      </div>

      {/* Contenido de la Tarjeta */}
      <div className="p-6 flex flex-col flex-grow space-y-4">
        {/* Ubicación y Precio */}
        <div className="space-y-1.5">
          <div className="flex items-center text-[10px] font-bold tracking-widest uppercase text-secondary gap-1">
            <MapPin className="w-3 h-3" />
            {property.location}
          </div>
          <h3 className="text-lg font-serif font-medium leading-snug text-primary group-hover:text-secondary transition-colors duration-300 line-clamp-1">
            {property.title}
          </h3>
        </div>

        {/* Características */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-border text-muted-foreground">
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <BedDouble className="w-4 h-4 text-primary/80 mb-1" />
            <span className="text-xs font-semibold text-primary">{property.bedrooms}</span>
            <span className="text-[9px] tracking-wider uppercase">Hab.</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 text-center border-x border-border">
            <Bath className="w-4 h-4 text-primary/80 mb-1" />
            <span className="text-xs font-semibold text-primary">{property.bathrooms}</span>
            <span className="text-[9px] tracking-wider uppercase">Baños</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 text-center">
            <Square className="w-4 h-4 text-primary/80 mb-1" />
            <span className="text-xs font-semibold text-primary">{property.area} m²</span>
            <span className="text-[9px] tracking-wider uppercase">Superf.</span>
          </div>
        </div>

        {/* Precio y Botón */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-widest uppercase text-muted-foreground">Precio</span>
            <span className="text-xl font-serif font-semibold text-primary">
              {formatPrice(property.price, property.operation)}
            </span>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onBookVisit(property);
            }}
            variant="outline"
            className="h-10 px-4 border-primary hover:bg-primary hover:text-primary-foreground text-xs font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-1"
          >
            Reservar
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
