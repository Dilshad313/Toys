// ✅ Make sure this file has a default export
import CategoryBar from '@/components/home/CategoryBar'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import CategoryCards from '@/components/home/CategoryCards'
import Categories from '@/components/home/Categories'
import BestSellers from '@/components/home/BestSellers'
import WatchAndBuy from '@/components/home/WatchAndBuy'
import OfferBanner from '@/components/home/OfferBanner'
import HappyChildhoods from '@/components/home/HappyChildhoods'
import Testimonials from '@/components/home/Testimonials'
// import Newsletter from '@/components/home/Newsletter'

// ✅ Default export (not named export)
export default function HomePage() {
  return (
    <>
      <CategoryBar />
      <Hero />
      <Features />
      <CategoryCards />
      <Categories />
      <BestSellers />
      <WatchAndBuy />
      <OfferBanner />
      <HappyChildhoods />
      <Testimonials />
      {/* <Newsletter /> */}
    </>
  )
}