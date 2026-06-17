import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Home, Trash2, X } from 'lucide-react';
import { Property } from '@/lib/data';

export interface Appointment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  propertyCity: string;
  date: string;
  type: 'visit' | 'valuation';
  status: 'pending' | 'confirmed' | 'cancelled';
  userName: string;
  userPhone: string;
  userEmail: string;
  createdAt: string;
}

interface MyAppointmentsProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  onCancelAppointment: (appointmentId: string) => void;
}

export default function MyAppointments({ isOpen, onClose, appointments, onCancelAppointment }: MyAppointmentsProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">A confirmar</span>;
      case 'confirmed':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Confirmada</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">Cancelada</span>;
      default:
        return null;
    }
  };

  const getAppointmentType = (type: string) => {
    return type === 'visit' ? 'Visita a la propiedad' : 'Solicitud de valoración';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Mis Citas Reservadas</DialogTitle>
          <DialogDescription>
            {appointments.length === 0
              ? 'No tienes citas reservadas aún.'
              : `Tienes ${appointments.length} cita${appointments.length !== 1 ? 's' : ''} reservada${appointments.length !== 1 ? 's' : ''}`}
          </DialogDescription>
        </DialogHeader>

        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-secondary/30 mx-auto mb-4" />
            <p className="text-muted-foreground">Reserva una cita para ver tus próximas visitas</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="flex flex-col md:flex-row gap-4 p-4">
                  {/* Imagen de la propiedad */}
                  <div className="md:w-32 h-32 flex-shrink-0">
                    <img
                      src={appointment.propertyImage}
                      alt={appointment.propertyTitle}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Información de la cita */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-primary">
                          {appointment.propertyTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="w-4 h-4 text-secondary" />
                          <span>{appointment.propertyCity}</span>
                        </div>
                      </div>
                      {getStatusBadge(appointment.status)}
                    </div>

                    {/* Tipo de cita */}
                    <div className="flex items-center gap-2 text-sm">
                      <Home className="w-4 h-4 text-secondary" />
                      <span className="font-medium text-foreground">{getAppointmentType(appointment.type)}</span>
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-secondary" />
                      <span className="text-foreground">{formatDate(appointment.date)}</span>
                    </div>

                    {/* Hora - A confirmar */}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span className="text-foreground font-medium">Hora: A confirmar por privado</span>
                    </div>

                    {/* Datos del usuario */}
                    <div className="bg-secondary/10 rounded p-3 text-xs space-y-1">
                      <p><span className="font-semibold">Nombre:</span> {appointment.userName}</p>
                      <p><span className="font-semibold">Teléfono:</span> {appointment.userPhone}</p>
                      <p><span className="font-semibold">Email:</span> {appointment.userEmail}</p>
                    </div>
                  </div>

                  {/* Botón de cancelar */}
                  <div className="flex flex-col gap-2 justify-start">
                    {appointment.status !== 'cancelled' && (
                      <Button
                        onClick={() => onCancelAppointment(appointment.id)}
                        variant="outline"
                        className="text-xs font-bold tracking-widest uppercase text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Cancelar
                      </Button>
                    )}
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
