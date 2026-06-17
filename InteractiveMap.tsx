import { useState } from 'react';
import React from 'react';
import { Property } from '@/lib/data';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Calendar, User, Phone, Mail, Clock, X, Upload, AlertCircle } from 'lucide-react';

interface BookVisitModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  type: 'visit' | 'valuation';
  onAppointmentCreated?: (property: Property, type: 'visit' | 'valuation', date: string, name: string, phone: string, email: string) => void;
}

export default function BookVisitModal({ property, isOpen, onClose, type, onAppointmentCreated }: BookVisitModalProps) {
  // Cargar datos guardados del localStorage
  const loadSavedData = () => {
    const saved = localStorage.getItem('cya_user_data');
    return saved ? JSON.parse(saved) : { name: '', phone: '', email: '' };
  };

  const savedData = loadSavedData();
  const [name, setName] = useState(savedData.name);
  const [phone, setPhone] = useState(savedData.phone);
  const [email, setEmail] = useState(savedData.email);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      toast.error('Por favor, complete los campos obligatorios (Nombre, Teléfono y Email).');
      return;
    }

    // Guardar datos del usuario en localStorage
    localStorage.setItem('cya_user_data', JSON.stringify({ name, phone, email }));

    setIsSubmitting(true);

    // Simular envío a CRM
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Llamar al callback para guardar la cita
      if (onAppointmentCreated && property) {
        const visitDate = date || new Date().toISOString().split('T')[0];
        onAppointmentCreated(property, type, visitDate, name, phone, email);
      }
      
      toast.success(
        type === 'visit'
          ? 'Solicitud de visita recibida. Un asesor premium se pondrá en contacto con usted en menos de 24 horas.'
          : 'Solicitud de valoración enviada con éxito. Nuestro tasador experto le contactará en breve.'
      );
      // Limpiar formulario (pero mantener los datos guardados)
      setDate('');
      setTime('');
      setPropertyType('');
      setMessage('');
      onClose();
    }, 1500);
  };

  // Cargar datos guardados cuando el modal se abre
  React.useEffect(() => {
    if (isOpen) {
      const saved = loadSavedData();
      setName(saved.name);
      setPhone(saved.phone);
      setEmail(saved.email);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 bg-card border-border">
        <DialogTitle className="sr-only">
          {type === 'visit' ? 'Solicitar Visita Privada' : 'Solicitar Valoración Profesional'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {type === 'visit'
            ? `Está solicitando una cita exclusiva para visitar: ${property?.title || 'la propiedad seleccionada'}.`
            : 'Complete el formulario para que uno de nuestros expertos realice un estudio de mercado y valoración de su inmueble.'}
        </DialogDescription>
        {/* Cabecera personalizada para cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 bg-primary text-primary-foreground hover:bg-secondary hover:text-primary w-8 h-8 flex items-center justify-center transition-all duration-300 border border-secondary"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-semibold text-primary">
              {type === 'visit' ? 'Solicitar Visita Privada' : 'Solicitar Valoración Profesional'}
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {type === 'visit'
                ? `Está solicitando una cita exclusiva para visitar: ${property?.title || 'la propiedad seleccionada'}.`
                : 'Complete el formulario para que uno de nuestros expertos realice un estudio de mercado y valoración de su inmueble.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-secondary" /> Nombre Completo *
              </label>
              <Input
                type="text"
                required
                placeholder="Ej. Don Juan Carlos Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-secondary" /> Teléfono de Contacto *
              </label>
              <Input
                type="tel"
                required
                placeholder="Ej. +34 600 000 000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-secondary" /> Correo Electrónico *
              </label>
              <Input
                type="email"
                required
                placeholder="Ej. juan.perez@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary h-11"
              />
            </div>

            {/* Campos específicos para Visita */}
            {type === 'visit' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary" /> Fecha Preferida
                  </label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-11"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-secondary" /> Horario
                  </label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-11">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mañana">Mañana (10:00 - 14:00)</SelectItem>
                      <SelectItem value="tarde">Tarde (16:00 - 20:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              /* Campos específicos para Valoración */
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                  Tipo de Propiedad a Valorar
                </label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="bg-transparent border-border hover:border-secondary focus:ring-1 focus:ring-secondary h-11">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="villa">Villa / Chalet</SelectItem>
                    <SelectItem value="piso">Ático / Piso de Lujo</SelectItem>
                    <SelectItem value="local">Local Comercial / Oficina</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Carga de Fotos/Videos - Solo para Valoración */}
            {type === 'valuation' && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-secondary" /> Fotos o Videos de la Propiedad
                </label>
                <div className="border-2 border-dashed border-border hover:border-secondary transition-colors rounded p-4 text-center cursor-pointer bg-white/2">
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setUploadedFiles(Array.from(e.target.files));
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <p className="text-xs text-muted-foreground">Haz clic para seleccionar fotos o videos</p>
                    <p className="text-[9px] text-muted-foreground/70 mt-1">PNG, JPG, MP4, MOV (máx 10MB cada uno)</p>
                  </label>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-semibold text-secondary">{uploadedFiles.length} archivo(s) seleccionado(s):</p>
                    <ul className="text-[9px] text-muted-foreground space-y-1">
                      {uploadedFiles.map((file, idx) => (
                        <li key={idx} className="truncate">• {file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Aviso de Estimación - Solo para Valoración */}
            {type === 'valuation' && (
              <div className="bg-secondary/10 border border-secondary/30 rounded p-3 space-y-2">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[9px] font-bold text-secondary uppercase tracking-wide">Importante</p>
                    <p className="text-[9px] text-muted-foreground leading-relaxed">
                      Esta valoración es una <strong>estimación preliminar</strong> basada en los datos proporcionados. Para obtener una valoración exacta y profesional, uno de nuestros expertos debe visitar la propiedad en persona y realizar un análisis completo del inmueble.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mensaje */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
                Mensaje o Comentarios Adicionales
              </label>
              <Textarea
                placeholder="Cuéntenos más sobre sus necesidades..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-transparent border-border hover:border-secondary transition-colors focus:ring-1 focus:ring-secondary min-h-[80px] resize-none"
              />
            </div>

            {/* Botón Enviar */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary hover:bg-secondary hover:text-primary text-primary-foreground font-bold tracking-widest uppercase text-xs transition-all duration-300 flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? 'Enviando...' : type === 'visit' ? 'Confirmar Cita' : 'Solicitar Tasación'}
            </Button>

            <p className="text-[9px] text-center text-muted-foreground leading-normal pt-2">
              Al enviar este formulario, acepta que C&A trate sus datos para gestionar su solicitud. Nos comprometemos a responder en un plazo máximo de 24 horas hábiles.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
