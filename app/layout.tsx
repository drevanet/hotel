import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
export const metadata: Metadata = { title: 'Velora Hotel | A More Thoughtful Stay', description: 'Discover beautifully designed rooms, thoughtful hospitality and exceptional stays at Velora Hotel.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><SiteHeader />{children}<SiteFooter /></body></html>; }
