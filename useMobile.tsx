import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Home, Euro, Move, MapPin, Upload, X } from 'lucide-react';

interface PublishPropertyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded: (newProperty: any) => void;
}

export default function PublishPropertyPanel({ isOpen, onClose, onPropertyAdded }: PublishPropertyPanelProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [operation, setOperation] = useState('venta');
  const [bedrooms, setBedrooms] = useState('');
  const [bathrooms, setBathrooms] = useState('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !location || !city || !type || !bedrooms || !bathrooms || !area) {
      toast.error('Por favor, rellene todos los campos obligatorios.');
      return;
    }

    setIsSubmitting(true);

    // Imagen por defecto si no se proporciona una
    const defaultImage = image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

    const newProperty = {
      id: `prop-custom-${Date.now()}`,
      title,
      price: Number(price),
      location,
      city,
      zone: location.split(',')[0] || 'Zona Exclusiva',
      type: type as any,
      operation: operation as any,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      area: Number(area),
      image: defaultImage,
      featured: false,
      description: description || 'Preciosa propiedad de alta gama gestionada en exclusiva por C&A Inmobiliaria. Acabados premium, excelente ubicación y todas las comodidades.'
    };

    setTimeout(() => {
      onPropertyAdded(newProperty);
      setIsSubmitting(false);
      toast.success('¡Propiedad publicada con éxito! Ya está visible en el catálogo interactivo.');
      
      // Resetear campos
      setTitle('');
      setPrice('');
      setLocation('');
      setCity('');
      setType('');
      setBedrooms('');
      setBathrooms('');
      setArea('');
      setDescription('');
      setImage('');
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">Publicar Propiedad</DialogTitle>
        <DialogDescription className="sr-only">
          Añada un nuevo inmueble a nuestra cartera premium de C&A Inmobiliaria. Complete la ficha técnica detallada.
        </DialogDescription>
        {/* Cabecera personalizada para cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 bg-primary text-primary-foreground hover:bg-secondary hover:text-primary w-8 h-8 flex items-center justify-center transition-all duration-300 border border-secondary"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-1">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-semibold text-primary">Publicar Propiedad</h2>
            <p className="text-xs text-muted-foreground">
              Añada un nuevo inmueble a nuestra cartera premium de C&A Inmobiliaria. Complete la ficha técnica detallada.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título e Imagen */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Título del Inmueble *</label>
                <Input
                  type="text"
                  required
                  placeholder="Ej. Mansión Minimalista con Vistas"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">URL de la Imagen del Inmueble</label>
                <Input
                  type="text"
                  placeholder="Ej. https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
                />
              </div>
            </div>

            {/* Operación, Tipo y Precio */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Régimen *</label>
                <Select value={operation} onValueChange={setOperation}>
                  <SelectTrigger className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-11">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Tipo de Propiedad *</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-11">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa / Chalet</SelectItem>
                    <SelectItem value="penthouse">Ático / Penthouse</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="casa">Casa de Lujo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Precio (€) *</label>
                <Input
                  type="number"
                  required
                  placeholder="Ej. 1200000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
                />
              </div>
            </div>

            {/* Ubicación y Ciudad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-secondary" /> Dirección / Zona *
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Ej. La Moraleja, Alcobendas"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Ciudad *</label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-11">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Madrid">Madrid</SelectItem>
                    <SelectItem value="Barcelona">Barcelona</SelectItem>
                    <SelectItem value="Málaga">Marbella / Málaga</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Características técnicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-secondary" /> Dormitorios *
                </label>
                <Input
                  type="number"
                  required
                  placeholder="Ej. 4"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Baños *</label>
                <Input
                  type="number"
                  required
                  placeholder="Ej. 3"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1">
                  <Move className="w-3.5 h-3.5 text-secondary" /> Superficie (m²) *
                </label>
                <Input
                  type="number"
                  required
                  placeholder="Ej. 250"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
                />
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Descripción del Inmueble</label>
              <Textarea
                placeholder="Describa los acabados, distribución, servicios cercanos, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary min-h-[100px] resize-none"
              />
            </div>

            {/* Botón Publicar */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary hover:bg-secondary hover:text-primary text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all duration-300 flex items-center justify-center gap-2 mt-2"
            >
              <Upload className="w-4 h-4" />
              {isSubmitting ? 'Publicando...' : 'Publicar Inmueble'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
