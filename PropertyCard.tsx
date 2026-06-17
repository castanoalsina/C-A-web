import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, DollarSign, Bed, Bath, Maximize2, X } from 'lucide-react';
import { Property } from '@/lib/data';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Property[];
  onRemoveFavorite: (id: string) => void;
  onViewDetails: (property: Property) => void;
}

export default function FavoritesModal({ isOpen, onClose, favorites, onRemoveFavorite, onViewDetails }: FavoritesModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Mis Propiedades Favoritas</DialogTitle>
          <DialogDescription>
            {favorites.length === 0 
              ? 'No tienes propiedades favoritas aún. ¡Añade algunas!' 
              : `Tienes ${favorites.length} propiedad${favorites.length !== 1 ? 'es' : ''} marcada${favorites.length !== 1 ? 's' : ''} como favorita${favorites.length !== 1 ? 's' : ''}`}
          </DialogDescription>
        </DialogHeader>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-secondary/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Explora nuestras propiedades y marca tus favoritas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map((property) => (
              <div
                key={property.id}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all group"
              >
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => onRemoveFavorite(property.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                      title="Eliminar de favoritos"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 bg-secondary text-primary px-3 py-1 rounded text-xs font-bold">
                    {property.operation === 'venta' ? 'VENTA' : 'ALQUILER'}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <h3 className="font-serif text-lg font-semibold text-primary line-clamp-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{property.city}</span>
                  </div>

                  <div className="flex items-center gap-2 text-lg font-bold text-secondary">
                    <DollarSign className="w-5 h-5" />
                    <span>{property.price.toLocaleString('es-ES')}€</span>
                  </div>

                  <div className="flex gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                    {property.bedrooms && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms} hab</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span>{property.bathrooms} baños</span>
                      </div>
                    )}
                    {property.area && (
                      <div className="flex items-center gap-1">
                        <Maximize2 className="w-4 h-4" />
                        <span>{property.area} m²</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onViewDetails(property)}
                      className="flex-1 text-xs font-bold tracking-widest uppercase bg-primary hover:bg-secondary text-primary-foreground"
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      onClick={() => onRemoveFavorite(property.id)}
                      variant="outline"
                      className="flex-1 text-xs font-bold tracking-widest uppercase"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
