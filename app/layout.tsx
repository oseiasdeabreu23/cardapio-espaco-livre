import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Cardápio Digital · Churrascaria Espaço Livre',
  description:
    'Churrasco, pizza e petiscos da casa. Veja o cardápio completo da Churrascaria Espaço Livre direto da mesa.',
  applicationName: 'Espaço Livre',
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#C8141C',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className="bg-brand-bg text-brand-ink antialiased">
        <div className="mx-auto w-full max-w-[480px] bg-brand-bg shadow-card min-h-dvh">
          {children}
        </div>
      </body>
    </html>
  );
}
