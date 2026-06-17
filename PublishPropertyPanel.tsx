import { useEffect, useRef, useState } from 'react';
import { Property } from '@/lib/data';
import { MapView } from '@/components/Map';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Euro, BedDouble, Bath, Square, X } from 'lucide-react';

interface InteractiveMapProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
}

export default function InteractiveMap({ properties, onSelectProperty }: InteractiveMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Coordenadas aproximadas para simular en el mapa basado en ciudades
  const getCoordinates = (city: string, zone: string) => {
    const coords: Record<string, { lat: number; lng: number }> = {
      'Madrid-Salamanca': { lat: 40.4259, lng: -3.6826 },
      'Madrid-La Moraleja': { lat: 40.5135, lng: -3.6406 },
      'Madrid-Ciudalcampo': { lat: 40.6358, lng: -3.6128 },
      'Barcelona-Pedralbes': { lat: 41.3894, lng: 2.1156 },
      'Barcelona-Eixample': { lat: 41.3931, lng: 2.1648 },
      'Málaga-Marbella': { lat: 36.5099, lng: -4.8863 },
    };

    const key = `${city}-${zone}`;
    return coords[key] || coords['Madrid-Salamanca']; // Fallback
  };

  const onMapReady = (map: any) => {
    mapInstanceRef.current = map;
    updateMarkers(map);
  };

  const updateMarkers = (map: any) => {
    // Limpiar marcadores antiguos
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    if (!map || !properties.length) return;

    const bounds = new google.maps.LatLngBounds();

    properties.forEach((prop) => {
      const { lat, lng } = getCoordinates(prop.city, prop.zone);
      const position = new google.maps.LatLng(lat, lng);

      // Crear marcador personalizado con la API de Google Maps
      const marker = new google.maps.Marker({
        position,
        map,
        title: prop.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#C8A96B', // Dorado
          fillOpacity: 1,
          strokeColor: '#0F172A', // Azul marino
          strokeWeight: 2,
        },
      });

      marker.addListener('click', () => {
        setSelectedProperty(prop);
        map.panTo(position);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    });

    // Ajustar el zoom para ver todos los marcadores si hay más de uno
    if (properties.length > 1) {
      map.fitBounds(bounds);
    } else if (properties.length === 1) {
      const { lat, lng } = getCoordinates(properties[0].city, properties[0].zone);
      map.setCenter({ lat, lng });
      map.setZoom(14);
    }
  };

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers(mapInstanceRef.current);
    }
  }, [properties]);

  const formatPrice = (price: number, operation: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(price) + (operation === 'alquiler' ? '/mes' : '');
  };

  return (
    <div className="relative w-full h-[500px] border border-border overflow-hidden">
      {/* Google Map */}
      <MapView className="w-full h-full" onMapReady={onMapReady} />

      {/* Info Card de Propiedad Seleccionada */}
      {selectedProperty && (
        <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 z-20 animate-editorial-slide-up">
          <Card className="bg-card border-border shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setSelectedProperty(null)}
              className="absolute right-3 top-3 z-30 bg-primary/80 hover:bg-secondary text-primary-foreground hover:text-primary w-6 h-6 flex items-center justify-center transition-all duration-300 border border-secondary"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={selectedProperty.image}
                alt={selectedProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="bg-secondary text-primary font-bold tracking-widest uppercase text-[8px] px-2 py-0.5">
                  {selectedProperty.operation === 'venta' ? 'Venta' : 'Alquiler'}
                </span>
                <h4 className="text-sm font-serif font-medium mt-1 drop-shadow-md truncate">
                  {selectedProperty.title}
                </h4>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="flex items-center text-[10px] font-semibold text-secondary gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {selectedProperty.location}
              </div>

              {/* Características */}
              <div className="grid grid-cols-3 gap-1 py-2 border-y border-border text-[10px] text-muted-foreground text-center">
                <div>
                  <span className="font-semibold text-primary block">{selectedProperty.bedrooms}</span>
                  Dorm.
                </div>
                <div className="border-x border-border">
                  <span className="font-semibold text-primary block">{selectedProperty.bathrooms}</span>
                  Baños
                </div>
                <div>
                  <span className="font-semibold text-primary block">{selectedProperty.area} m²</span>
                  Superf.
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-sm font-serif font-semibold text-primary">
                  {formatPrice(selectedProperty.price, selectedProperty.operation)}
                </span>
                <button
                  onClick={() => onSelectProperty(selectedProperty)}
                  className="text-[10px] font-bold tracking-widest uppercase text-secondary hover:text-primary transition-colors"
                >
                  Ver Detalles
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
