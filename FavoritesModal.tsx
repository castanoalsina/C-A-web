import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Home, Euro, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdvancedSearchProps {
  onSearch: (filters: any) => void;
}

export default function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [operation, setOperation] = useState<'venta' | 'alquiler'>('venta');
  const [type, setType] = useState<string>('todos');
  const [city, setCity] = useState<string>('todos');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('todos');
  const [areaMin, setAreaMin] = useState<string>('');
  const [showMore, setShowMore] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      operation,
      type,
      city,
      priceMin: priceMin ? Number(priceMin) : null,
      priceMax: priceMax ? Number(priceMax) : null,
      bedrooms: bedrooms !== 'todos' ? Number(bedrooms) : null,
      areaMin: areaMin ? Number(areaMin) : null,
    });
  };

  return (
    <div className="w-full bg-card shadow-2xl border border-border relative z-20 -mt-16 max-w-6xl mx-auto">
      {/* Pestañas de Operación (Venta / Alquiler) */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setOperation('venta')}
          className={`px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-all duration-300 border-b-2 ${
            operation === 'venta'
              ? 'border-secondary text-secondary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Comprar Propiedad
        </button>
        <button
          type="button"
          onClick={() => setOperation('alquiler')}
          className={`px-8 py-4 text-xs font-semibold tracking-widest uppercase transition-all duration-300 border-b-2 ${
            operation === 'alquiler'
              ? 'border-secondary text-secondary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Alquilar Propiedad
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        {/* Campos Principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Ubicación */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-secondary" /> Ciudad
            </label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-12">
                <SelectValue placeholder="Seleccionar ciudad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Cualquier zona</SelectItem>
                {/* Barcelona */}
                <SelectItem value="Barcelona">Barcelona - Barcelona</SelectItem>
                <SelectItem value="Badalona">Badalona - Barcelona</SelectItem>
                <SelectItem value="Sabadell">Sabadell - Barcelona</SelectItem>
                <SelectItem value="Terrassa">Terrassa - Barcelona</SelectItem>
                <SelectItem value="Hospitalet">L'Hospitalet - Barcelona</SelectItem>
                {/* Maresme */}
                <SelectItem value="Mataró">Mataró - Maresme</SelectItem>
                <SelectItem value="Calella">Calella - Maresme</SelectItem>
                <SelectItem value="Premià de Mar">Premià de Mar - Maresme</SelectItem>
                <SelectItem value="Vilassar">Vilassar de Mar - Maresme</SelectItem>
                <SelectItem value="Teià">Teià - Maresme</SelectItem>
                <SelectItem value="Arenys de Mar">Arenys de Mar - Maresme</SelectItem>
                <SelectItem value="Cabrera">Cabrera de Mar - Maresme</SelectItem>
                {/* Vallès Occidental */}
                <SelectItem value="Manresa">Manresa - Vallès Occidental</SelectItem>
                <SelectItem value="Igualada">Igualada - Vallès Occidental</SelectItem>
                {/* Vallès Oriental */}
                <SelectItem value="Granollers">Granollers - Vallès Oriental</SelectItem>
                <SelectItem value="Mollet">Mollet del Vallès - Vallès Oriental</SelectItem>
                {/* Baix Llobregat */}
                <SelectItem value="Martorell">Martorell - Baix Llobregat</SelectItem>
                <SelectItem value="Castelldefels">Castelldefels - Baix Llobregat</SelectItem>
                {/* Garraf */}
                <SelectItem value="Vilanova">Vilanova i la Geltrú - Garraf</SelectItem>
                {/* Alt Penedès */}
                <SelectItem value="Vilafranca">Vilafranca del Penedès - Alt Penedès</SelectItem>
                {/* Tarragona */}
                <SelectItem value="Tarragona">Tarragona - Tarragona</SelectItem>
                <SelectItem value="Reus">Reus - Tarragona</SelectItem>
                {/* Lleida */}
                <SelectItem value="Lleida">Lleida - Lleida</SelectItem>
                {/* Girona */}
                <SelectItem value="Girona">Girona - Girona</SelectItem>
                <SelectItem value="Figueres">Figueres - Girona</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tipo de Propiedad */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-secondary" /> Tipo
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-12">
                <SelectValue placeholder="Tipo de propiedad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los tipos</SelectItem>
                {/* Pisos y Apartamentos */}

                <SelectItem value="apartamento">Apartamento (1-2 hab)</SelectItem>
                <SelectItem value="apartamento-medio">Apartamento Medio (3-4 hab)</SelectItem>
                <SelectItem value="apartamento-lujo">Apartamento de Lujo</SelectItem>
                <SelectItem value="penthouse">Ático / Penthouse</SelectItem>
                {/* Casas */}

                <SelectItem value="casa-adosada">Casa Adosada</SelectItem>
                <SelectItem value="casa-pareada">Casa Pareada</SelectItem>
                <SelectItem value="casa-unifamiliar">Casa Unifamiliar</SelectItem>
                <SelectItem value="casa-lujo">Casa de Lujo</SelectItem>
                <SelectItem value="villa">Villa / Chalet</SelectItem>

                {/* Otros */}
                <SelectItem value="duplex">Dúplex</SelectItem>
                <SelectItem value="loft">Loft</SelectItem>
                <SelectItem value="terraza">Piso con Terraza</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rango de Precios */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
              <Euro className="w-3.5 h-3.5 text-secondary" /> Presupuesto Máximo
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder={operation === 'venta' ? 'Ej. 2.000.000 €' : 'Ej. 5.000 €'}
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-12 pl-4 pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">€</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 items-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMore(!showMore)}
              className="h-12 px-4 border-border hover:border-secondary hover:text-secondary flex items-center gap-2 transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden lg:inline text-xs font-semibold tracking-wider uppercase">Filtros</span>
            </Button>
            <Button
              type="submit"
              className="h-12 flex-1 bg-primary hover:bg-secondary hover:text-primary text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              Buscar
            </Button>
          </div>
        </div>

        {/* Filtros Avanzados (Desplegable) */}
        {showMore && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-border animate-editorial-slide-up">
            {/* Precio Mínimo */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Euro className="w-3.5 h-3.5 text-secondary" /> Precio Mínimo
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ej. 500.000 €"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">€</span>
              </div>
            </div>

            {/* Habitaciones */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-secondary" /> Dormitorios
              </label>
              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-12">
                  <SelectValue placeholder="Dormitorios" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Cualquier número</SelectItem>
                  <SelectItem value="2">2+ Dormitorios</SelectItem>
                  <SelectItem value="3">3+ Dormitorios</SelectItem>
                  <SelectItem value="4">4+ Dormitorios</SelectItem>
                  <SelectItem value="5">5+ Dormitorios</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Superficie Mínima */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-secondary" /> Superficie Mínima
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Ej. 150 m²"
                  value={areaMin}
                  onChange={(e) => setAreaMin(e.target.value)}
                  className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">m²</span>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
