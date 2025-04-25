import type { Metadata } from 'next';
import { Outfit, PT_Serif, Signika, Ultra } from 'next/font/google';
import { Nunito, PT_Sans } from 'next/font/google';
import './globals.css';

import Head from 'next/head';
import { Analytics } from '@vercel/analytics/react';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
// import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from '@/components/Header';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
// import SpaceAnimation from '@/components/SpaceAnimation';
// import SupplyBar from '@/components/SupplyBar';
// import { useResources } from '@/components/ResourceContext';


const signika = Signika({
  subsets: ['latin'], weight: "400", variable: '--font-signika',
});

const outfit = Outfit({
  subsets: ['latin'], weight: "500", variable: '--font-outfit',

})

const nunito = Nunito({
  subsets: ['latin'], weight: "400", variable: '--font-nunito',
});

const ptsans = PT_Sans({
  subsets: ['latin'], weight: "400", variable: '--font-ptsans',
});

const ultra = Ultra({
  subsets: ['latin'], weight: "400", variable: '--font-ultra',
});

const ptser = PT_Serif({
  subsets: ['latin'], weight: "400", variable: '--font-ptserif',
});



export const metadata: Metadata = {
  title: 'Starforge',
  description: 'Weave the stars.  Forge Empires.  Uncover the truth.',
  openGraph: {
    title: 'Starforge',
    description: 'Weave the stars.  Forge Empires.  Uncover the truth.',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang='en'>
      <body className={`min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-900 dark:to-blue-900"`}>
        {/* <Providers> */}
          {/* <SpaceAnimation /> */}
          {/* <Navbar /> */}
          <Header />

          {children}
          {/* <ToastContainer position='bottom-right' /> */}

          {/* <Footer /> */}
          <Analytics />
        {/* </Providers> */}
      </body>
    </html>
  );
}
