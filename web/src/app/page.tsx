import { Bubbles } from '@/components/Bubbles';
import { Dashboard } from '@/components/Dashboard';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Winners } from '@/components/Winners';
import type { Metadata } from 'next'
// import MintSection from "@/components/home/MintSection";
// import HowToPlaySection from "@/components/home/HowToPlaySection";

export const metadata: Metadata = {
  title: 'POOL.PARTY',
  description: 'Join the party.',
}

export default function Home() {
  return (
    <main className='items-center'>

<Bubbles />

      <Hero />
      <HowItWorks />
      <Dashboard />
      <Winners />


    </main>
  );
}
