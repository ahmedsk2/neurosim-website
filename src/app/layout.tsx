import type { Metadata } from 'next';
import Script from 'next/script';
import 'katex/dist/katex.min.css';
import '@/styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgress } from '@/components/layout/ScrollProgress';
import { BackToTop } from '@/components/layout/BackToTop';
import { ServiceWorkerRegister } from '@/components/layout/ServiceWorkerRegister';
import { ReviewOverlay } from '@/components/review-overlay/ReviewOverlay';
import { THEME_BOOTSTRAP_SCRIPT } from '@/lib/theme';

export const metadata: Metadata = {
  // Production origin (the locked launch domain; see docs/DECISIONS.md). metadataBase resolves the
  // relative OG / Twitter image URLs below to absolute URLs on this host.
  metadataBase: new URL('https://web.towardpcc.com'),
  title: {
    default: 'MNM-Edu, Pediatric Multimodal Neuromonitoring',
    template: '%s | MNM-Edu',
  },
  description:
    'An interactive, evidence-anchored educational resource for pediatric multimodal neuromonitoring (MNM).',
  // Declare the site icon (the existing public/icons/icon.svg) so browsers use it instead of
  // probing /favicon.ico (which 404s when no icon is declared).
  icons: { icon: [{ url: '/icons/icon.svg', type: 'image/svg+xml' }] },
  openGraph: {
    type: 'website',
    title: 'MNM-Edu, Pediatric Multimodal Neuromonitoring',
    description:
      'Interactive, evidence-anchored education for PICU fellows, intensivists, and trainees.',
    url: '/',
    siteName: 'MNM-Edu',
    images: ['/og/default.svg'],
  },
  twitter: { card: 'summary_large_image', images: ['/og/default.svg'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-theme="dark" suppressHydrationWarning>
      <head>
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {THEME_BOOTSTRAP_SCRIPT}
        </Script>
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#081224" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#F8FAFC" media="(prefers-color-scheme: light)" />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <ScrollProgress />
        <Header />
        <main id="main" className="mx-auto max-w-page px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <ServiceWorkerRegister />
        <ReviewOverlay />
      </body>
    </html>
  );
}
