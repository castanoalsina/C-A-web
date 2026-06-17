import { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface TestimonialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (testimonial: { name: string; role: string; content: string; rating: number; image: string; userId?: string }) => void;
}

export default function TestimonialForm({ isOpen, onClose, onSubmit }: TestimonialFormProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Debes iniciar sesión para añadir un comentario');
      return;
    }
    
    const finalName = name.trim() || user?.name || '';
    
    if (finalName && role.trim() && content.trim()) {
      onSubmit({
        name: finalName,
        role,
        content,
        rating,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${finalName}`,
        userId: user.id
      });
      setName('');
      setRole('');
      setContent('');
      setRating(5);
      toast.success('Comentario añadido exitosamente');
      onClose();
    } else {
      toast.error('Por favor completa todos los campos');
    }
  };

  // Pre-rellenar nombre si el usuario está autenticado
  const displayName = name || user?.name || '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">Añadir Comentario</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {user ? `Hola ${user.name}, comparte tu experiencia con C&A Inmobiliaria` : 'Debes iniciar sesión para comentar'}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">Necesitas iniciar sesión para añadir un comentario</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pr-4">
            {/* Nombre - Pre-rellenado si está autenticado */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                Nombre
              </label>
              <Input
                type="text"
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted border-border text-foreground"
                required
              />
            </div>

            {/* Trabajo/Rol */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                Profesión / Rol
              </label>
              <Input
                type="text"
                placeholder="Ej: Empresario, Estudiante, Profesional"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-muted border-border text-foreground"
                required
              />
            </div>

            {/* Valoración */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                Valoración
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-all"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-secondary text-secondary'
                          : 'text-border'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comentario */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                Tu Comentario
              </label>
              <Textarea
                placeholder="Comparte tu experiencia con nosotros..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-muted border-border text-foreground min-h-[100px] resize-none"
                required
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-secondary text-primary-foreground hover:text-primary flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar Comentario
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
