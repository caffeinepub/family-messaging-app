import { Sprout, Leaf, TrendingUp } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-b border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sprout className="h-4 w-4" />
              <span>Trusted by Farmers Nationwide</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              Quality Fertilizers for <span className="text-primary">Abundant Harvests</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Premium agricultural products designed to nourish your soil and maximize crop yields. 
              Trusted by farmers for generations.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">100% Organic</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">High Yield</p>
              </div>
              <div className="text-center">
                <Sprout className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Soil Health</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/assets/generated/hero-banner.dim_1200x400.png" 
              alt="Bhai Bhai Fertilizer Products" 
              className="w-full h-auto rounded-2xl shadow-agricultural"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
