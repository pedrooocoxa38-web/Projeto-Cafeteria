import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Shield, 
  ArrowLeft,
  CheckCircle,
  QrCode
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { cartAPI } from "@/lib/api";

const Payment = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit");

  // Get cart data from navigation state
  const { cart, total } = location.state || {};

  // Card form data
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    installments: '1'
  });

  // PIX data
  const [pixData, setPixData] = useState({
    pixKey: 'geek.haven.brew@pix.com.br',
    qrCode: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  });

  if (!cart) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    if (!user) return;

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process the actual checkout
      await cartAPI.checkout();
      
      toast({
        title: "Pagamento aprovado! ✅",
        description: "Seu pedido foi confirmado com sucesso!",
      });
      
      // Redirect to success page or home
      navigate('/payment-success', { state: { total, paymentMethod } });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Erro no pagamento",
        description: "Não foi possível processar o pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold">Finalizar Pagamento</h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-muted-foreground">Pagamento 100% seguro</span>
                </div>

                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="credit" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cartão
                    </TabsTrigger>
                    <TabsTrigger value="pix" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      PIX
                    </TabsTrigger>
                    <TabsTrigger value="boleto" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Boleto
                    </TabsTrigger>
                  </TabsList>

                  {/* Credit Card */}
                  <TabsContent value="credit" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Número do Cartão</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardData.number}
                          onChange={(e) => setCardData({
                            ...cardData,
                            number: formatCardNumber(e.target.value)
                          })}
                          maxLength={19}
                        />
                      </div>

                      <div>
                        <Label htmlFor="cardName">Nome do Titular</Label>
                        <Input
                          id="cardName"
                          placeholder="Nome como está no cartão"
                          value={cardData.name}
                          onChange={(e) => setCardData({
                            ...cardData,
                            name: e.target.value.toUpperCase()
                          })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Validade</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/AA"
                            value={cardData.expiry}
                            onChange={(e) => setCardData({
                              ...cardData,
                              expiry: formatExpiry(e.target.value)
                            })}
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardData.cvv}
                            onChange={(e) => setCardData({
                              ...cardData,
                              cvv: e.target.value.replace(/\D/g, '')
                            })}
                            maxLength={4}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="installments">Parcelas</Label>
                        <Select value={cardData.installments} onValueChange={(value) => 
                          setCardData({ ...cardData, installments: value })
                        }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1x R$ {total?.toFixed(2)} (à vista)</SelectItem>
                            <SelectItem value="2">2x R$ {(total / 2)?.toFixed(2)}</SelectItem>
                            <SelectItem value="3">3x R$ {(total / 3)?.toFixed(2)}</SelectItem>
                            <SelectItem value="6">6x R$ {(total / 6)?.toFixed(2)}</SelectItem>
                            <SelectItem value="12">12x R$ {(total / 12)?.toFixed(2)}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  {/* PIX */}
                  <TabsContent value="pix" className="space-y-6 mt-6">
                    <div className="text-center space-y-4">
                      <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center mx-auto">
                        <QrCode className="h-24 w-24 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Escaneie o QR Code</h3>
                        <p className="text-sm text-muted-foreground">
                          Use o app do seu banco para escanear o código PIX
                        </p>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-xs font-mono">{pixData.pixKey}</p>
                        </div>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                          ⚡ Pagamento instantâneo • Disponível 24h
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Boleto */}
                  <TabsContent value="boleto" className="space-y-6 mt-6">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Building className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-semibold">Boleto Bancário</h3>
                        <p className="text-sm text-muted-foreground">
                          O boleto será gerado após a confirmação do pedido
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          📅 Vencimento em 3 dias úteis<br />
                          💰 Sem taxa adicional
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 space-y-6 sticky top-24">
                <h2 className="text-xl font-bold">Resumo do Pedido</h2>

                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {total?.toFixed(2)}</span>
                </div>

                <Button 
                  className="w-full shadow-glow" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar Pagamento
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Dados protegidos por SSL</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;