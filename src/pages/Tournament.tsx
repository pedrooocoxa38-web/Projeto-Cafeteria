import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trophy, Gamepad2, Users, Calendar, Zap, Phone, CheckCircle, Plus, Minus, CalendarDays } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const Tournament = () => {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [tournamentData, setTournamentData] = useState({
    name: '',
    game: '',
    platform: '',
    players: '',
    format: '',
    eventType: '',
    dateTime: '',
    contact: '',
    extras: {
      narration: false,
      buffet: false,
      prize: false,
      banner: false,
    }
  });

  const games = [
    "League of Legends (LoL)",
    "Valorant",
    "Counter-Strike 2 (CS2)",
    "FIFA",
    "Tekken 8",
    "Super Smash Bros",
    "Mortal Kombat",
    "Outro"
  ];

  const platforms = [
    "PC", 
    "PlayStation 5", 
    "Xbox Series X/S", 
    "Nintendo Switch",
    "Jogo de tabuleiro"
  ];
  
  const formats = [
    "Eliminacao Direta",
    "Melhor de 3",
    "Grupos + Final"
  ];

  const eventTypes = [
    "Amistoso",
    "Campeonato local",
    "Final de temporada",
    "Aniversario gamer"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tournamentData.name || !tournamentData.game || !tournamentData.platform || 
        !tournamentData.players || !tournamentData.format || !tournamentData.eventType ||
        !tournamentData.dateTime || !tournamentData.contact) {
      toast({
        title: "Dados incompletos",
        description: "Preencha todos os campos obrigatorios",
        variant: "destructive",
      });
      return;
    }

    setPreviewOpen(true);
  };

  const generateWhatsAppMessage = () => {
    const extras = [];
    if (tournamentData.extras.narration) extras.push("Narração local profissional");
    if (tournamentData.extras.buffet) extras.push("Buffet gamer");
    if (tournamentData.extras.prize) extras.push("Premiação personalizada");
    if (tournamentData.extras.banner) extras.push("Banner personalizado");

    const message = `🏆 *NOVO TORNEIO - GEEKHAVEN CAFE*

📋 *Nome:* ${tournamentData.name}
🎮 *Jogo:* ${tournamentData.game}
🖥️ *Plataforma:* ${tournamentData.platform}
👥 *Jogadores:* ${tournamentData.players}
⚔️ *Formato:* ${tournamentData.format}
🎪 *Tipo de Evento:* ${tournamentData.eventType}
📅 *Data/Horario:* ${new Date(tournamentData.dateTime).toLocaleString('pt-BR')}
${extras.length > 0 ? `\n✨ *Extras:* ${extras.join(', ')}` : ''}

📞 *Contato:* ${tournamentData.contact}

Quero organizar esse campeonato no GeekHaven Cafe!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "5511999999999"; // Substitua pelo numero real do cafe
    return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Banner Superior */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 border-2 border-primary/50 rounded-lg p-6 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 animate-pulse" />
            <div className="relative z-10">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary animate-bounce" />
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Crie seu proprio torneio e desafie outros squads no Cafe Gamer!
              </h2>
              <p className="text-lg text-muted-foreground">
                Organize campeonatos epicos com seus amigos
              </p>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Card de Introdução */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8 space-y-6 hover-lift h-full border-primary/20">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Gamepad2 className="h-8 w-8 text-primary" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-center">
                    Monte o seu proprio campeonato com o seu squad!
                  </h2>
                  
                  <p className="text-lg text-center text-muted-foreground">
                    Escolha o jogo, formato e horario — a gente organiza tudo pra voce.
                  </p>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold">Setup Profissional</h3>
                      <p className="text-sm text-muted-foreground">
                        PCs e consoles de ultima geracao, monitores 144Hz e perifericos premium
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold">Espaco Dedicado</h3>
                      <p className="text-sm text-muted-foreground">
                        Ambiente exclusivo para seu torneio com telas para plateia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold">Extras Personalizados</h3>
                      <p className="text-sm text-muted-foreground">
                        Narracao ao vivo, buffet gamer e premiacoes customizadas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold">Suporte Total</h3>
                      <p className="text-sm text-muted-foreground">
                        Nossa equipe cuida de toda a organizacao e infraestrutura
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Formulário */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="p-8 space-y-6 border-secondary/20">
                <div className="text-center space-y-2">
                  <Trophy className="h-10 w-10 text-secondary mx-auto" />
                  <h3 className="text-2xl font-bold">Monte Seu Campeonato</h3>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados e receba um orcamento personalizado
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={itemVariants}>
                    <Label htmlFor="name" className="text-base font-semibold">
                      Nome do Torneio *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ex: Copa dos Campeoes 2025"
                      value={tournamentData.name}
                      onChange={(e) => setTournamentData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-2"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="game" className="text-base font-semibold">
                        Jogo *
                      </Label>
                      <Select
                        value={tournamentData.game}
                        onValueChange={(value) => setTournamentData(prev => ({ ...prev, game: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Escolha o jogo" />
                        </SelectTrigger>
                        <SelectContent>
                          {games.map((game) => (
                            <SelectItem key={game} value={game}>{game}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="platform" className="text-base font-semibold">
                        Plataforma *
                      </Label>
                      <Select
                        value={tournamentData.platform}
                        onValueChange={(value) => setTournamentData(prev => ({ ...prev, platform: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          {platforms.map((platform) => (
                            <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="players" className="text-base font-semibold">
                        Numero de Jogadores *
                      </Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10"
                          onClick={() => {
                            const current = parseInt(tournamentData.players) || 0;
                            if (current > 2) {
                              setTournamentData(prev => ({ ...prev, players: (current - 1).toString() }));
                            }
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          id="players"
                          type="number"
                          min="2"
                          placeholder="Ex: 16"
                          value={tournamentData.players}
                          onChange={(e) => setTournamentData(prev => ({ ...prev, players: e.target.value }))}
                          className="text-center font-semibold"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10 rounded-full border-primary/20 hover:border-primary hover:bg-primary/10"
                          onClick={() => {
                            const current = parseInt(tournamentData.players) || 0;
                            setTournamentData(prev => ({ ...prev, players: (current + 1).toString() }));
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="format" className="text-base font-semibold">
                        Formato *
                      </Label>
                      <Select
                        value={tournamentData.format}
                        onValueChange={(value) => setTournamentData(prev => ({ ...prev, format: value }))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Formato" />
                        </SelectTrigger>
                        <SelectContent>
                          {formats.map((format) => (
                            <SelectItem key={format} value={format}>{format}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="eventType" className="text-base font-semibold">
                      Tipo de Evento *
                    </Label>
                    <Select
                      value={tournamentData.eventType}
                      onValueChange={(value) => setTournamentData(prev => ({ ...prev, eventType: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Escolha o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="dateTime" className="text-base font-semibold">
                      Data e Horario *
                    </Label>
                    <div className="relative mt-2">
                      <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                      <Input
                        id="dateTime"
                        type="datetime-local"
                        value={tournamentData.dateTime}
                        onChange={(e) => setTournamentData(prev => ({ ...prev, dateTime: e.target.value }))}
                        className="pl-11"
                        min={new Date().toISOString().slice(0, 16)}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label className="text-base font-semibold mb-3 block">
                      Extras (Opcionais)
                    </Label>
                    <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-primary/10">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="narration"
                          checked={tournamentData.extras.narration}
                          onCheckedChange={(checked) => 
                            setTournamentData(prev => ({ 
                              ...prev, 
                              extras: { ...prev.extras, narration: checked as boolean }
                            }))
                          }
                        />
                        <label htmlFor="narration" className="text-sm cursor-pointer">
                          Narração local profissional
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="buffet"
                          checked={tournamentData.extras.buffet}
                          onCheckedChange={(checked) => 
                            setTournamentData(prev => ({ 
                              ...prev, 
                              extras: { ...prev.extras, buffet: checked as boolean }
                            }))
                          }
                        />
                        <label htmlFor="buffet" className="text-sm cursor-pointer">
                          Buffet gamer (pizzas, snacks e bebidas)
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="prize"
                          checked={tournamentData.extras.prize}
                          onCheckedChange={(checked) => 
                            setTournamentData(prev => ({ 
                              ...prev, 
                              extras: { ...prev.extras, prize: checked as boolean }
                            }))
                          }
                        />
                        <label htmlFor="prize" className="text-sm cursor-pointer">
                          Premiação personalizada
                        </label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="banner"
                          checked={tournamentData.extras.banner}
                          onCheckedChange={(checked) => 
                            setTournamentData(prev => ({ 
                              ...prev, 
                              extras: { ...prev.extras, banner: checked as boolean }
                            }))
                          }
                        />
                        <label htmlFor="banner" className="text-sm cursor-pointer">
                          Quer banner personalizado?
                        </label>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <Label htmlFor="contact" className="text-base font-semibold">
                      Contato (WhatsApp ou Email) *
                    </Label>
                    <Input
                      id="contact"
                      placeholder="Ex: (11) 99999-9999 ou email@exemplo.com"
                      value={tournamentData.contact}
                      onChange={(e) => setTournamentData(prev => ({ ...prev, contact: e.target.value }))}
                      className="mt-2"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full shadow-glow text-lg py-6"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Montar Campeonato
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Trophy className="h-6 w-6 text-primary" />
              Preview do Torneio
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
              <h3 className="text-2xl font-bold mb-4">{tournamentData.name}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Jogo</p>
                      <p className="font-semibold">{tournamentData.game}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Jogadores</p>
                      <p className="font-semibold">{tournamentData.players} participantes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Data/Horario</p>
                      <p className="font-semibold">
                        {new Date(tournamentData.dateTime).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Plataforma</p>
                    <p className="font-semibold">{tournamentData.platform}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Formato</p>
                    <p className="font-semibold">{tournamentData.format}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Tipo de Evento</p>
                    <p className="font-semibold">{tournamentData.eventType}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Contato</p>
                    <p className="font-semibold text-sm">{tournamentData.contact}</p>
                  </div>
                </div>
              </div>

              {(tournamentData.extras.narration || tournamentData.extras.buffet || tournamentData.extras.prize || tournamentData.extras.banner) && (
                <div className="mt-4 pt-4 border-t border-primary/20">
                  <p className="text-xs text-muted-foreground mb-2">Extras Selecionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {tournamentData.extras.narration && (
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        Narração local profissional
                      </span>
                    )}
                    {tournamentData.extras.buffet && (
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        Buffet gamer
                      </span>
                    )}
                    {tournamentData.extras.prize && (
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        Premiação personalizada
                      </span>
                    )}
                    {tournamentData.extras.banner && (
                      <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        Banner personalizado
                      </span>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPreviewOpen(false)}
              >
                Editar Informacoes
              </Button>
              <Button
                className="flex-1 shadow-glow bg-green-600 hover:bg-green-700"
                onClick={() => window.open(generateWhatsAppMessage(), '_blank')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Enviar via WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Tournament;
