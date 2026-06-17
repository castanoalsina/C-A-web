import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register, resetPassword } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStep, setResetStep] = useState<'email' | 'reset'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast.success('¡Sesión iniciada correctamente!');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        await register(formData.email, formData.name, formData.password);
        toast.success('¡Registro completado! Bienvenido a C&A');
      }
      
      setFormData({
        email: '',
        name: '',
        password: '',
        confirmPassword: ''
      });
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error en la autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      name: '',
      password: '',
      confirmPassword: ''
    });
    setIsForgotPassword(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Por favor ingresa tu email');
      return;
    }
    
    // Verificar si el email existe
    const users = JSON.parse(localStorage.getItem('cya_users') || '[]');
    const userExists = users.some((u: any) => u.email === resetEmail);
    
    if (!userExists) {
      toast.error('Este email no está registrado');
      return;
    }
    
    setIsLoading(false);
    setResetStep('reset');
    toast.success('Ahora puedes establecer tu nueva contraseña');
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmNewPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setIsLoading(true);
    try {
      await resetPassword(resetEmail, newPassword);
      toast.success('¡Contraseña actualizada! Ahora puedes iniciar sesión');
      setResetEmail('');
      setNewPassword('');
      setConfirmNewPassword('');
      setResetStep('email');
      setIsForgotPassword(false);
      setIsLogin(true);
    } catch (error: any) {
      toast.error(error.message || 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {isForgotPassword ? '¿Olvidaste tu Contraseña?' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isForgotPassword
              ? 'Ingresa tu email para cambiar tu contraseña'
              : (isLogin 
                ? 'Accede a tu cuenta para gestionar tus comentarios'
                : 'Crea una cuenta para participar en la comunidad')}
          </DialogDescription>
        </DialogHeader>

        {isForgotPassword ? (
          <>
            {resetStep === 'email' ? (
              <form onSubmit={handleForgotPassword} className="space-y-4 pr-4">
                {/* Email para recuperación */}
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="bg-muted border-border text-foreground pl-10"
                      required
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-primary hover:bg-secondary text-primary-foreground hover:text-primary"
                  >
                    {isLoading ? 'Verificando...' : 'Continuar'}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pr-4">
                {/* Aviso */}
                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-secondary">Establece una nueva contraseña para {resetEmail}</p>
                </div>

                {/* Nueva Contraseña */}
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-muted border-border text-foreground pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar Nueva Contraseña */}
                <div>
                  <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="bg-muted border-border text-foreground pl-10 pr-10"
                      required
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setResetStep('email');
                      setNewPassword('');
                      setConfirmNewPassword('');
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Volver
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-primary hover:bg-secondary text-primary-foreground hover:text-primary"
                  >
                    {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pr-4">
            {/* Email */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  name="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-muted border-border text-foreground pl-10"
                  required
                />
              </div>
            </div>

            {/* Nombre (solo registro) */}
            {!isLogin && (
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="text"
                    name="name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-muted border-border text-foreground pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Contraseña */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-muted border-border text-foreground pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña (solo registro) */}
            {!isLogin && (
              <div>
                <label className="text-xs font-bold tracking-widest uppercase text-muted-foreground block mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-muted border-border text-foreground pl-10 pr-10"
                    required
                  />
                </div>
              </div>
            )}

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
                disabled={isLoading}
                className="flex-1 bg-primary hover:bg-secondary text-primary-foreground hover:text-primary"
              >
                {isLoading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
              </Button>
            </div>

            {/* Olvidé Contraseña y Toggle */}
            <div className="text-center pt-4 border-t border-border space-y-3">
              {isLogin && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(true)}
                  className="block w-full text-xs font-bold tracking-widest uppercase text-secondary hover:text-primary transition-colors"
                >
                  ¿Olvidaste tu Contraseña?
                </button>
              )}
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                </p>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-xs font-bold tracking-widest uppercase text-secondary hover:text-primary transition-colors"
                >
                  {isLogin ? 'Crear Cuenta' : 'Iniciar Sesión'}
                </button>
              </div>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
