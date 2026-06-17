import { Home, ShoppingCart, Tag, DollarSign, FileText, MessageSquare, Eye, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickAccessCardsProps {
  onViewProperties: () => void;
  onBuy: () => void;
  onSell: () => void;
  onRent: () => void;
  onValuation: () => void;
  onBlog: () => void;
  onContact: () => void;
}

export default function QuickAccessCards({
  onViewProperties,
  onBuy,
  onSell,
  onRent,
  onValuation,
  onBlog,
  onContact
}: QuickAccessCardsProps) {
  const quickAccess = [
    {
      icon: Eye,
      title: 'Ver Propiedades',
      description: 'Explora nuestro catálogo completo de pisos y casas en el Maresme',
      action: onViewProperties,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: ShoppingCart,
      title: 'Comprar Vivienda',
      description: 'Encuentra tu hogar ideal en el Maresme con nuestros expertos',
      action: onBuy,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Tag,
      title: 'Vender Propiedad',
      description: 'Vende tu inmueble al mejor precio con nuestro equipo profesional',
      action: onSell,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: DollarSign,
      title: 'Alquilar Inmueble',
      description: 'Alquila tu propiedad o encuentra el alquiler perfecto',
      action: onRent,
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Solicitar Valoración',
      description: 'Obtén una tasación profesional de tu propiedad',
      action: onValuation,
      color: 'from-red-500 to-red-600'
    },
    {
      icon: FileText,
      title: 'Leer Blog',
      description: 'Consejos, guías y análisis del mercado inmobiliario del Maresme',
      action: onBlog,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      icon: MessageSquare,
      title: 'Contactar Asesor',
      description: 'Habla directamente con uno de nuestros expertos en el Maresme',
      action: onContact,
      color: 'from-cyan-500 to-cyan-600'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted">
      <div className="container space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.3em] uppercase text-secondary">Acceso Rápido</span>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-primary">
            ¿Qué necesitas hoy?
          </h2>
          <p className="text-sm text-muted-foreground font-light">
            Accede directamente a los servicios que buscas. Todo lo que necesitas a un solo clic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {quickAccess.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card
                key={index}
                className="group cursor-pointer border-border hover:border-secondary bg-card hover:shadow-xl transition-all duration-500 overflow-hidden"
                onClick={item.action}
              >
                <CardContent className="p-6 space-y-4 h-full flex flex-col">
                  {/* Icono con fondo degradado */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Contenido */}
                  <div className="space-y-2 flex-grow">
                    <h3 className="text-base font-serif font-semibold text-primary group-hover:text-secondary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Botón de acción */}
                  <div className="pt-2 border-t border-border">
                    <button className="text-[10px] font-bold tracking-widest uppercase text-secondary hover:text-primary transition-colors flex items-center gap-1 group/btn">
                      Acceder
                      <span className="transform group-hover/btn:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
