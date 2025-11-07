import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, CreditCard, Smartphone, Building, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { total, paymentMethod } = location.state || {};

  useEffect(() => {
    // Redirect to home if no payment data
    if (!total) {
      navigate('/');
    }
  }, [total, navigate]);

  const getPaymentMethodIcon = () => {
    switch (paymentMethod) {
      case 'pix':
        return <Smartphone className="h-8 w-8 text-green-500" />;
      case 'boleto':
        return <Building className="h-8 w-8 text-blue-500" />;
      default:
        return <CreditCard className="h-8 w-8 text-purple-500" />;
    }
  };

  const getPaymentMethodText = () => {
    switch (paymentMethod) {
      case 'pix':
        return 'PIX';
      case 'boleto':
        return 'Boleto Bancário';
      default:
        return 'Cartão de Crédito';
    }
  };

  if (!total) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="p-12 text-center space-y-8">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>

            {/* Success Message */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400">
                Pagamento Aprovado!
              </h1>
              <p className="text-lg text-muted-foreground">
                Seu pedido foi confirmado com sucesso
              </p>
            </div>

            {/* Order Details */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center justify-center gap-3">
                {getPaymentMethodIcon()}
                <span className="text-lg font-semibold">{getPaymentMethodText()}</span>
              </div>
              
              <div className="text-2xl font-bold text-primary">
                R$ {total.toFixed(2)}
              </div>

              <div className="text-sm text-muted-foreground">
                Pedido #{Math.floor(Math.random() * 100000).toString().padStart(5, '0')}
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Próximos Passos</h3>
              <div className="text-left space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Preparação do pedido</p>
                    <p className="text-sm text-muted-foreground">
                      Nosso time está preparando seus itens
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Notificação</p>
                    <p className="text-sm text-muted-foreground">
                      Você receberá um email com os detalhes
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Retirada/Entrega</p>
                    <p className="text-sm text-muted-foreground">
                      Estimativa: 15-30 minutos
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/products')}
              >
                Continuar Comprando
              </Button>
              <Button 
                className="flex-1 shadow-glow"
                onClick={() => navigate('/')}
              >
                Ir para Início
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Support */}
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Dúvidas? Entre em contato conosco pelo WhatsApp
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;