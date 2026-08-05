import type { Metadata } from 'next'
import { Inter, Baloo_2, Fredoka, Comic_Neue } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import CategoryBar from '@/components/home/CategoryBar'
import Footer from '@/components/layout/Footer'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ['latin'] })

// Playful Fonts
const baloo = Baloo_2({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-baloo',
})

const fredoka = Fredoka({ 
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-fredoka',
})

const comic = Comic_Neue({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-comic',
})

export const metadata: Metadata = {
  title: 'Athvi Toys - Premium Toys for Happy Learning',
  description: 'Shop premium educational toys for kids. Safe, non-toxic & BIS certified toys.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${baloo.variable} ${fredoka.variable} ${comic.variable}`}>
        <CartProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}