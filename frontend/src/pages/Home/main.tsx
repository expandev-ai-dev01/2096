import { Button } from '@/core/components/button';
import { useNavigation } from '@/core/hooks/useNavigation';
import { Package } from 'lucide-react';

function HomePage() {
  const { navigate } = useNavigation();

  return (
    <div className="flex min-h-[calc(100vh-200px)] flex-col items-center justify-center space-y-8 py-12 text-center">
      <div className="space-y-4">
        <div className="bg-primary/10 size-20 mx-auto flex items-center justify-center rounded-full">
          <Package className="text-primary size-10" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Lozorio Móveis</h1>
        <p className="text-muted-foreground mx-auto max-w-[600px] text-lg">
          Explore nosso catálogo completo de móveis de alta qualidade para transformar seus
          ambientes.
        </p>
      </div>
      <Button
        size="lg"
        onClick={() => navigate('/catalogo')}
        className="shadow-lg transition-all hover:shadow-xl"
      >
        Ver Catálogo
      </Button>
    </div>
  );
}

export { HomePage };
