import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BedDouble, Bath, Square, MapPin, Calendar, MessageSquare, Phone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '@/lib/data';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onBookVisit: (property: Property) => void;
}

export default function PropertyDetailsModal({ property, isOpen, onClose, onBookVisit }: PropertyDetailsModalProps) {
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  if (!property) return null;

  const formatPrice = (price: number, operation: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price) + (operation === 'alquiler' ? '/mes' : '');
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hola, estoy interesado en la propiedad "${property.title}" (${property.location}). Me gustaría recibir más información.`);
    window.open(`https://wa.me/34611780603?text=${text}`, '_blank');
  };

  const gallery = property.gallery || [];
  const currentSection = gallery[currentGalleryIndex];
  const currentImage = currentSection?.images[currentImageIndex] || property.image;

  const handleNextImage = () => {
    if (currentSection && currentImageIndex < currentSection.images.length - 1) {
      const nextIdx = currentImageIndex + 1;
      setCurrentImageIndex(nextIdx);
      setFullscreenImage(currentSection.images[nextIdx]);
    } else if (currentGalleryIndex < gallery.length - 1) {
      const nextSectionIdx = currentGalleryIndex + 1;
      setCurrentGalleryIndex(nextSectionIdx);
      setCurrentImageIndex(0);
      setFullscreenImage(gallery[nextSectionIdx]?.images[0] || null);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      const prevIdx = currentImageIndex - 1;
      setCurrentImageIndex(prevIdx);
      setFullscreenImage(currentSection?.images[prevIdx] || null);
    } else if (currentGalleryIndex > 0) {
      const prevSectionIdx = currentGalleryIndex - 1;
      const prevSection = gallery[prevSectionIdx];
      const lastImageIdx = prevSection?.images.length - 1 || 0;
      setCurrentGalleryIndex(prevSectionIdx);
      setCurrentImageIndex(lastImageIdx);
      setFullscreenImage(prevSection?.images[lastImageIdx] || null);
    }
  };

  const handleCloseModal = () => {
    setCurrentGalleryIndex(0);
    setCurrentImageIndex(0);
    setFullscreenImage(null);
    onClose();
  };

  const handleSelectImage = (sectionIdx: number, imageIdx: number) => {
    setCurrentGalleryIndex(sectionIdx);
    setCurrentImageIndex(imageIdx);
    setFullscreenImage(gallery[sectionIdx]?.images[imageIdx] || null);
  };

  // Modal de Fullscreen
  if (fullscreenImage) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <img
          src={fullscreenImage}
          alt="Fullscreen"
          className="w-full h-full object-contain"
        />
        <button
          onClick={() => setFullscreenImage(null)}
          className="absolute top-4 right-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-primary w-12 h-12 flex items-center justify-center transition-all duration-300 border-2 border-secondary"
        >
          <X className="w-6 h-6" />
        </button>
        <button
          onClick={handlePrevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-secondary text-primary-foreground hover:text-primary w-14 h-14 flex items-center justify-center transition-all duration-300 border-2 border-secondary"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/90 hover:bg-secondary text-primary-foreground hover:text-primary w-14 h-14 flex items-center justify-center transition-all duration-300 border-2 border-secondary"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCloseModal()}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background border-border max-h-[95vh] flex flex-col">
        <DialogTitle className="sr-only">{property.title}</DialogTitle>
        <DialogDescription className="sr-only">
          Detalles de la propiedad {property.title} ubicada en {property.location}
        </DialogDescription>

        {/* Panel con Scroll - Ocupando todo */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-secondary scrollbar-track-muted">
            <div className="p-6 space-y-6">
              {/* Encabezado */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3 flex-1">
                  <h2 className="text-2xl font-serif font-semibold text-primary">
                    {property.title}
                  </h2>
                  <div className="flex items-center text-sm font-medium text-secondary gap-2">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </div>

                  {/* Características */}
                  <div className="flex gap-6 pt-2">
                    <div className="flex items-center gap-2">
                      <BedDouble className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-muted-foreground">{property.bedrooms} Hab.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-muted-foreground">{property.bathrooms} Baños</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="w-5 h-5 text-secondary" />
                      <span className="text-sm text-muted-foreground">{property.area} m²</span>
                    </div>
                  </div>
                </div>

                {/* Botón Cerrar */}
                <button
                  onClick={handleCloseModal}
                  className="ml-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-primary w-10 h-10 flex items-center justify-center transition-all duration-300 border-2 border-secondary flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Precio - Separado */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-2">Precio</p>
                <p className="text-3xl font-serif font-bold text-secondary">
                  {formatPrice(property.price, property.operation)}
                </p>
              </div>

              {/* Descripción */}
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground leading-relaxed font-light">
                  {property.description}
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="border-t border-border pt-4 flex gap-3">
                <Button
                  onClick={() => onBookVisit(property)}
                  className="flex-1 h-11 bg-primary hover:bg-secondary hover:text-primary text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all duration-300 border-2 border-secondary"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Reservar
                </Button>
                <Button
                  onClick={handleWhatsApp}
                  className="flex-1 h-11 bg-secondary hover:bg-primary text-primary hover:text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all duration-300 border-2 border-secondary"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>

              {/* Galería de Fotos */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-bold tracking-widest uppercase text-secondary mb-4">
                  Galería de Fotos - Haz clic para ver en detalle
                </h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {gallery.map((section, sectionIdx) =>
                    section.images.map((image, imageIdx) => (
                      <button
                        key={`${sectionIdx}-${imageIdx}`}
                        onClick={() => handleSelectImage(sectionIdx, imageIdx)}
                        className="relative aspect-square overflow-hidden border-2 border-border hover:border-secondary transition-all duration-300 group"
                      >
                        <img
                          src={image}
                          alt={`${section.sectionLabel} ${imageIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-bold tracking-widest uppercase text-center px-2">
                            {section.sectionLabel}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Contacto */}
              <div className="border-t border-border pt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3.5 h-3.5" />
                <span>Llámenos al +34 611 780 603</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
