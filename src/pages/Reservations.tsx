import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Users, Clock, MapPin, CalendarDays, CheckCircle, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { reservationsAPI, Reservation } from "@/lib/api";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Reservations = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [userReservations, setUserReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState<any>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  
  // Reservation form state
  const [reservationData, setReservationData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    people: '',
    notes: '',
  });

  // Streamer Room specific form state
  const [streamerData, setStreamerData] = useState({
    fullName: '',
    contact: '',
    duration: '',
    participants: '',
    setup: {
      shureMic: false,
      rgbLighting: false,
      dslrCamera: false,
      auxiliaryMonitor: false,
      premiumHeadset: false,
      customPeripherals: '',
      thematicScenery: false,
    },
    extras: {
      technicalSupport: false,
      gamerBuffet: false,
      photoSession: false,
      quickEditing: false,
      scriptAssistance: false,
    },
    specialRequests: '',
    agreeTerms: false,
  });

  const spaces = [
    {
      id: 1,
      name: "Sala Gamer Premium",
      capacity: "4-8 pessoas",
      description: "Espaço completo com 8 PCs gamers high-end, cadeiras gamer e ar-condicionado",
      price: "R$ 80/hora",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=400&fit=crop",
      features: ["8 PCs RTX 4070", "Monitores 144Hz", "Cadeiras Gamer", "Ar-condicionado"]
    },
    {
      id: 2,
      name: "Arena Consoles",
      capacity: "6-12 pessoas",
      description: "PlayStation 5, Xbox Series X e Nintendo Switch com telão 75 polegadas",
      price: "R$ 60/hora",
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop",
      features: ["PS5 & Xbox Series X", "Nintendo Switch", "Telão 75\"", "Sistema de Som"]
    },
    {
      id: 3,
      name: "Mesa RPG & Board Games",
      capacity: "4-10 pessoas",
      description: "Espaço aconchegante com biblioteca de board games e RPGs",
      price: "R$ 40/hora",
      image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=600&h=400&fit=crop",
      features: ["100+ Board Games", "Material de RPG", "Mesa Grande", "Iluminação Ambiente"]
    },
    {
      id: 4,
      name: "Sala Streamer",
      capacity: "1-3 pessoas",
      description: "Espaço profissional para lives, gravações e podcasts, com equipamentos de alta qualidade e ambiente gamer imersivo.",
      price: "R$ 120/hora",
      image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=600&h=400&fit=crop",
      features: ["PC High-End RTX 4070", "Iluminação RGB", "Câmeras Full HD/4K", "Microfone Condensador"]
    }
  ];

  // Load user reservations
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserReservations();
    }
  }, [isAuthenticated, user]);

  const loadUserReservations = async () => {
    if (!user) return;
    
    try {
      const reservations = await reservationsAPI.getUserReservations(user.id);
      setUserReservations(reservations);
    } catch (error) {
      console.error('Error loading reservations:', error);
    }
  };

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para fazer uma reserva",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !reservationData.startTime || !reservationData.endTime || !reservationData.people) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const timeRange = `${reservationData.startTime} - ${reservationData.endTime}`;
      
      const reservation = await reservationsAPI.create({
        date: formattedDate,
        time: timeRange,
        people_count: parseInt(reservationData.people),
      });

      toast({
        title: "Reserva criada!",
        description: `Reserva confirmada para ${reservationData.people} pessoas`,
      });

      // Reset form and close dialog
      setReservationData({ date: '', startTime: '', endTime: '', people: '', notes: '' });
      setSelectedDate(undefined);
      setDialogOpen(false);
      setSelectedSpace(null);
      
      // Reload reservations
      await loadUserReservations();
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a reserva",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openReservationDialog = (space: any) => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Faça login para fazer uma reserva",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedSpace(space);
    setDialogOpen(true);
  };

  const openEditDialog = (reservation: Reservation) => {
    setEditingReservation(reservation);
    
    // Parse the time range if it contains " - "
    const times = reservation.time.includes(' - ') 
      ? reservation.time.split(' - ') 
      : [reservation.time, ''];
    
    setReservationData({
      date: reservation.date,
      startTime: times[0],
      endTime: times[1] || times[0],
      people: reservation.people_count.toString(),
      notes: '',
    });
    
    setEditDate(new Date(reservation.date));
    setEditDialogOpen(true);
  };

  const handleEditReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingReservation) return;

    try {
      setLoading(true);
      
      const formattedDate = editDate ? format(editDate, 'yyyy-MM-dd') : reservationData.date;
      const timeRange = `${reservationData.startTime} - ${reservationData.endTime}`;
      
      await reservationsAPI.update(editingReservation.id, {
        date: formattedDate,
        time: timeRange,
        people_count: parseInt(reservationData.people),
      });

      toast({
        title: "Reserva atualizada!",
        description: "Sua reserva foi atualizada com sucesso",
      });

      setEditDialogOpen(false);
      setEditingReservation(null);
      setEditDate(undefined);
      setReservationData({ date: '', startTime: '', endTime: '', people: '', notes: '' });
      
      await loadUserReservations();
    } catch (error) {
      console.error('Error updating reservation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a reserva",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm('Tem certeza que deseja cancelar esta reserva?')) return;

    try {
      setLoading(true);
      
      const result = await reservationsAPI.cancel(reservationId);

      toast({
        title: "Reserva cancelada",
        description: result.message,
      });

      await loadUserReservations();
    } catch (error) {
      console.error('Error canceling reservation:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cancelar a reserva",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Reserve Seu Espaço</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Alugue nossos espaços completos para eventos, torneios ou diversão com os amigos
            </p>
          </div>

          {/* Tournament Banner */}
          <Link to="/tournament">
            <Card className="p-6 mb-8 bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 border-2 border-secondary/50 hover:border-secondary hover:shadow-glow transition-all cursor-pointer group">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="h-7 w-7 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      Monte Seu Próprio Campeonato
                      <span className="text-xs bg-secondary/30 px-2 py-1 rounded-full">NOVO</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Crie torneios personalizados do seu jogo favorito com seus amigos
                    </p>
                  </div>
                </div>
                <Button className="shadow-glow" size="lg">
                  Criar Torneio
                </Button>
              </div>
            </Card>
          </Link>

          {/* Login prompt for non-authenticated users */}
          {!isAuthenticated && (
            <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Faça login para reservar</h3>
                  <p className="text-sm text-muted-foreground">
                    Entre ou crie uma conta para fazer suas reservas
                  </p>
                </div>
                <Link to="/auth">
                  <Button className="shadow-glow">
                    Fazer Login
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {spaces.map((space) => (
              <Card key={space.id} className="overflow-hidden hover-lift flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={space.image} 
                    alt={space.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {space.price}
                  </div>
                </div>
                
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{space.name}</h3>
                    <p className="text-muted-foreground text-sm">{space.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{space.capacity}</span>
                  </div>

                  {space.id === 4 ? (
                    // Sala Streamer - Layout compacto
                    <>
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-semibold">Recursos inclusos:</p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          <li className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>PC High-End (RTX 4070 / i7 / 32GB RAM)</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>Iluminação RGB profissional ajustável</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>Câmeras Full HD / 4K</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>Microfone condensador profissional</span>
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-primary mt-0.5">✓</span>
                            <span>Cenário temático e chroma key</span>
                          </li>
                        </ul>
                        <p className="text-xs text-muted-foreground italic pt-2">
                          📝 Personalize seu setup ao reservar
                        </p>
                      </div>

                      <Button 
                        className="w-full gap-2 shadow-glow mt-auto"
                        onClick={() => openReservationDialog(space)}
                      >
                        <Calendar className="h-4 w-4" />
                        Reservar Agora
                      </Button>
                    </>
                  ) : (
                    // Outros espaços - Layout padrão
                    <>
                      <div className="space-y-2 flex-1">
                        <p className="text-sm font-semibold">Recursos inclusos:</p>
                        <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          {space.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-1">
                              <span className="text-primary">✓</span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button 
                        className="w-full gap-2 shadow-glow mt-auto"
                        onClick={() => openReservationDialog(space)}
                      >
                        <Calendar className="h-4 w-4" />
                        Reservar Agora
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* User Reservations */}
          {isAuthenticated && userReservations.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Minhas Reservas</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userReservations.map((reservation) => (
                  <Card key={reservation.id} className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">Reserva #{reservation.id}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <CalendarDays className="h-4 w-4" />
                          <span>{new Date(reservation.date).toLocaleDateString('pt-BR')}</span>
                          <Clock className="h-4 w-4 ml-2" />
                          <span>{reservation.time}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        reservation.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : reservation.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {reservation.status === 'confirmed' ? 'Confirmada' :
                         reservation.status === 'pending' ? 'Pendente' : 'Cancelada'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{reservation.people_count} pessoas</span>
                    </div>

                    {reservation.status !== 'cancelled' && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openEditDialog(reservation)}
                          disabled={loading}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleCancelReservation(reservation.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* How it works */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Como Funciona</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Calendar, title: "1. Escolha a Data", desc: "Selecione o dia e horário" },
                { icon: MapPin, title: "2. Selecione o Espaço", desc: "Escolha o ambiente ideal" },
                { icon: Users, title: "3. Informe o Grupo", desc: "Quantas pessoas virão" },
                { icon: Clock, title: "4. Confirme", desc: "Faça o pagamento e aproveite" }
              ].map((step, index) => (
                <Card key={index} className="p-6 text-center space-y-3 hover-lift">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Reservation Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Reservar {selectedSpace?.name}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleReservationSubmit} className="space-y-6">
                {selectedSpace?.id === 4 ? (
                  // Formulário específico para Sala Streamer
                  <>
                    {/* Informações Básicas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">1. Informações Básicas</h3>
                      
                      <div>
                        <Label htmlFor="fullName" className="text-base font-semibold">Nome Completo / Nickname do Streamer *</Label>
                        <Input
                          id="fullName"
                          placeholder="Digite seu nome ou nome artístico"
                          value={streamerData.fullName}
                          onChange={(e) => setStreamerData(prev => ({ ...prev, fullName: e.target.value }))}
                          className="mt-2"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="contact" className="text-base font-semibold">Contato (WhatsApp ou Email) *</Label>
                        <Input
                          id="contact"
                          placeholder="(11) 99999-9999 ou email@exemplo.com"
                          value={streamerData.contact}
                          onChange={(e) => setStreamerData(prev => ({ ...prev, contact: e.target.value }))}
                          className="mt-2"
                          required
                        />
                      </div>
                    </div>

                    {/* Detalhes da Reserva */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">2. Detalhes da Reserva</h3>
                      
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Data e Horário *</Label>
                        <div className="flex justify-center p-4 bg-muted/30 rounded-lg border border-primary/20">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            locale={ptBR}
                            className="rounded-md"
                          />
                        </div>
                        {selectedDate && (
                          <p className="text-sm text-center mt-3 text-primary font-semibold bg-primary/10 py-2 rounded-md">
                            Data selecionada: {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startTime" className="text-base font-semibold">Horário Início *</Label>
                          <Select
                            value={reservationData.startTime}
                            onValueChange={(value) => setReservationData(prev => ({ ...prev, startTime: value }))}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Início" />
                            </SelectTrigger>
                            <SelectContent>
                              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="duration" className="text-base font-semibold">Duração da Sessão *</Label>
                          <Select
                            value={streamerData.duration}
                            onValueChange={(value) => setStreamerData(prev => ({ ...prev, duration: value }))}
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue placeholder="Ex: 2h" />
                            </SelectTrigger>
                            <SelectContent>
                              {['1h', '2h', '3h', '4h', '5h', '6h'].map((duration) => (
                                <SelectItem key={duration} value={duration}>{duration}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="participants" className="text-base font-semibold">Número de pessoas na gravação/live *</Label>
                        <Input
                          id="participants"
                          placeholder="Ex: 1 streamer + 2 convidados"
                          value={streamerData.participants}
                          onChange={(e) => setStreamerData(prev => ({ ...prev, participants: e.target.value }))}
                          className="mt-2"
                          required
                        />
                      </div>
                    </div>

                    {/* Setup Desejado */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">3. Setup Desejado</h3>
                      <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-primary/10">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="shureMic"
                            checked={streamerData.setup.shureMic}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                setup: { ...prev.setup, shureMic: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="shureMic" className="text-sm cursor-pointer">
                            🎙️ Microfone profissional Shure SM7B
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="rgbLighting"
                            checked={streamerData.setup.rgbLighting}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                setup: { ...prev.setup, rgbLighting: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="rgbLighting" className="text-sm cursor-pointer">
                            💡 Iluminação RGB personalizável
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="dslrCamera"
                            checked={streamerData.setup.dslrCamera}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                setup: { ...prev.setup, dslrCamera: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="dslrCamera" className="text-sm cursor-pointer">
                            🎥 Câmera DSLR / Webcam 4K
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="auxiliaryMonitor"
                            checked={streamerData.setup.auxiliaryMonitor}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                setup: { ...prev.setup, auxiliaryMonitor: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="auxiliaryMonitor" className="text-sm cursor-pointer">
                            🖥️ Tela de retorno / monitor auxiliar
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="premiumHeadset"
                            checked={streamerData.setup.premiumHeadset}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                setup: { ...prev.setup, premiumHeadset: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="premiumHeadset" className="text-sm cursor-pointer">
                            🎧 Headset Premium (Corsair / Logitech)
                          </label>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="customPeripherals"
                              checked={!!streamerData.setup.customPeripherals}
                              onCheckedChange={(checked) => 
                                setStreamerData(prev => ({ 
                                  ...prev, 
                                  setup: { ...prev.setup, customPeripherals: checked ? prev.setup.customPeripherals : '' }
                                }))
                              }
                            />
                            <label htmlFor="customPeripherals" className="text-sm cursor-pointer">
                              🖱️ Mouse / Teclado preferido
                            </label>
                          </div>
                          {streamerData.setup.customPeripherals !== '' && (
                            <Input
                              placeholder="Especifique o modelo desejado..."
                              value={streamerData.setup.customPeripherals}
                              onChange={(e) => setStreamerData(prev => ({ 
                                ...prev, 
                                setup: { ...prev.setup, customPeripherals: e.target.value }
                              }))}
                              className="ml-8"
                            />
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="thematicScenery"
                            checked={streamerData.setup.thematicScenery}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                setup: { ...prev.setup, thematicScenery: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="thematicScenery" className="text-sm cursor-pointer">
                            🎨 Cenário temático (LEDs, fundo verde, etc)
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Extras Opcionais */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">4. Extras Opcionais</h3>
                      <div className="space-y-3 p-4 bg-secondary/10 rounded-lg border border-secondary/20">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="technicalSupport"
                            checked={streamerData.extras.technicalSupport}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                extras: { ...prev.extras, technicalSupport: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="technicalSupport" className="text-sm cursor-pointer">
                            👕 Equipe de apoio técnico (setup, áudio, OBS, câmeras)
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="gamerBuffet"
                            checked={streamerData.extras.gamerBuffet}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                extras: { ...prev.extras, gamerBuffet: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="gamerBuffet" className="text-sm cursor-pointer">
                            🍕 Buffet Gamer (pizzas, snacks, bebidas)
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="photoSession"
                            checked={streamerData.extras.photoSession}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                extras: { ...prev.extras, photoSession: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="photoSession" className="text-sm cursor-pointer">
                            📸 Sessão de fotos profissionais / making-of
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="quickEditing"
                            checked={streamerData.extras.quickEditing}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                extras: { ...prev.extras, quickEditing: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="quickEditing" className="text-sm cursor-pointer">
                            🎬 Edição rápida do clipe / corte da live
                          </label>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="scriptAssistance"
                            checked={streamerData.extras.scriptAssistance}
                            onCheckedChange={(checked) => 
                              setStreamerData(prev => ({ 
                                ...prev, 
                                extras: { ...prev.extras, scriptAssistance: checked as boolean }
                              }))
                            }
                          />
                          <label htmlFor="scriptAssistance" className="text-sm cursor-pointer">
                            🎤 Assistência com roteirização ou gravação de vídeo curto
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Observações Personalizadas */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">5. Observações Personalizadas</h3>
                      <Textarea
                        placeholder="Tem algum pedido especial para o seu setup ou live?"
                        value={streamerData.specialRequests}
                        onChange={(e) => setStreamerData(prev => ({ ...prev, specialRequests: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>

                    {/* Termo de Uso */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-primary">6. Termo de Uso</h3>
                      <div className="flex items-start space-x-3 p-4 bg-muted/20 rounded-lg border border-primary/10">
                        <Checkbox
                          id="agreeTerms"
                          checked={streamerData.agreeTerms}
                          onCheckedChange={(checked) => 
                            setStreamerData(prev => ({ ...prev, agreeTerms: checked as boolean }))
                          }
                          required
                        />
                        <label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                          Concordo com as regras de uso da sala e do equipamento.{' '}
                          <a href="#" className="text-primary hover:underline">
                            (Ver termos completos e política de cancelamento)
                          </a>
                        </label>
                      </div>
                    </div>
                  </>
                ) : (
                  // Formulário padrão para outros espaços
                  <>
                    <div>
                      <Label className="text-base font-semibold mb-3 block">Escolha a Data</Label>
                      <div className="flex justify-center p-4 bg-muted/30 rounded-lg border border-primary/20">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          locale={ptBR}
                          className="rounded-md"
                        />
                      </div>
                      {selectedDate && (
                        <p className="text-sm text-center mt-3 text-primary font-semibold bg-primary/10 py-2 rounded-md">
                          Data selecionada: {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startTime" className="text-base font-semibold">Horário Início</Label>
                        <Select
                          value={reservationData.startTime}
                          onValueChange={(value) => setReservationData(prev => ({ ...prev, startTime: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Início" />
                          </SelectTrigger>
                          <SelectContent>
                            {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="endTime" className="text-base font-semibold">Horário Fim</Label>
                        <Select
                          value={reservationData.endTime}
                          onValueChange={(value) => setReservationData(prev => ({ ...prev, endTime: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Fim" />
                          </SelectTrigger>
                          <SelectContent>
                            {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((time) => (
                              <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="people" className="text-base font-semibold">Número de Pessoas</Label>
                      <Select
                        value={reservationData.people}
                        onValueChange={(value) => setReservationData(prev => ({ ...prev, people: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Quantas pessoas?" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                            <SelectItem key={num} value={num.toString()}>{num} pessoas</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="notes" className="text-base font-semibold">Observações (opcional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Alguma informação adicional sobre sua reserva..."
                        value={reservationData.notes}
                        onChange={(e) => setReservationData(prev => ({ ...prev, notes: e.target.value }))}
                        className="mt-2 min-h-[80px]"
                      />
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setDialogOpen(false);
                      setSelectedDate(undefined);
                      setReservationData({ date: '', startTime: '', endTime: '', people: '', notes: '' });
                      setStreamerData({
                        fullName: '',
                        contact: '',
                        duration: '',
                        participants: '',
                        setup: {
                          shureMic: false,
                          rgbLighting: false,
                          dslrCamera: false,
                          auxiliaryMonitor: false,
                          premiumHeadset: false,
                          customPeripherals: '',
                          thematicScenery: false,
                        },
                        extras: {
                          technicalSupport: false,
                          gamerBuffet: false,
                          photoSession: false,
                          quickEditing: false,
                          scriptAssistance: false,
                        },
                        specialRequests: '',
                        agreeTerms: false,
                      });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 shadow-glow"
                    disabled={loading || !selectedDate || !reservationData.startTime || 
                      (selectedSpace?.id === 4 && (!streamerData.fullName || !streamerData.contact || !streamerData.duration || !streamerData.participants || !streamerData.agreeTerms))}
                  >
                    {loading ? "Reservando..." : "Confirmar Reserva"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Reservation Dialog */}
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  Editar Reserva #{editingReservation?.id}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleEditReservation} className="space-y-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Escolha a Data</Label>
                  <div className="flex justify-center p-4 bg-muted/30 rounded-lg border border-primary/20">
                    <CalendarComponent
                      mode="single"
                      selected={editDate}
                      onSelect={setEditDate}
                      disabled={(date) => date < new Date()}
                      locale={ptBR}
                      className="rounded-md"
                    />
                  </div>
                  {editDate && (
                    <p className="text-sm text-center mt-3 text-primary font-semibold bg-primary/10 py-2 rounded-md">
                      Data selecionada: {format(editDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-startTime" className="text-base font-semibold">Horário Início</Label>
                    <Select
                      value={reservationData.startTime}
                      onValueChange={(value) => setReservationData(prev => ({ ...prev, startTime: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Início" />
                      </SelectTrigger>
                      <SelectContent>
                        {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'].map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-endTime" className="text-base font-semibold">Horário Fim</Label>
                    <Select
                      value={reservationData.endTime}
                      onValueChange={(value) => setReservationData(prev => ({ ...prev, endTime: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Fim" />
                      </SelectTrigger>
                      <SelectContent>
                        {['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'].map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-people" className="text-base font-semibold">Número de Pessoas</Label>
                  <Select
                    value={reservationData.people}
                    onValueChange={(value) => setReservationData(prev => ({ ...prev, people: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Quantas pessoas?" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                        <SelectItem key={num} value={num.toString()}>{num} pessoas</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setEditDialogOpen(false);
                      setEditDate(undefined);
                      setReservationData({ date: '', startTime: '', endTime: '', people: '', notes: '' });
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 shadow-glow"
                    disabled={loading || !editDate || !reservationData.startTime || !reservationData.endTime}
                  >
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservations;
