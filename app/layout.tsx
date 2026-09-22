import type { Metadata } from 'next';
import { Geist, Geist_Mono, Jost } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const jost = Jost({
  variable: '--font-jost',
  subsets: ['latin'],
  weight: ['500'],
});

export const metadata: Metadata = {
  title: 'PartLLM: A Unified Multimodal Foundation for 3D Part Segmentation',
  description:
    'PartLLM is a unified multimodal foundation for text-guided, interactive, and semantic full-shape 3D part segmentation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jost.variable}`}
      >
        {children}
        <Script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
