import Hero from '@/components/Hero';
import Benefits from '@/components/Benefits';
import ProductGrid from '@/components/ProductGrid';
import Trust from '@/components/Trust';
import Marquee from '@/components/Marquee';

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Benefits />
      <ProductGrid />
      <Trust />
    </>
  );
}
