import CategoryBar from '@/components/home/CategoryBar'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import Categories from '@/components/home/Categories'
import BestSellers from '@/components/home/BestSellers'
import WatchAndBuy from '@/components/home/WatchAndBuy'
import CategoryCards from '@/components/home/CategoryCards'
import OfferBanner from '@/components/home/OfferBanner'
import HappyChildhoods from '@/components/home/HappyChildhoods'
import Testimonials from '@/components/home/Testimonials'

export default function HomePage() {
  return (
    <>
      <CategoryBar />
      <Hero />
      <Categories />
      <BestSellers />
      <WatchAndBuy />
      <CategoryCards />
      <OfferBanner />
      <HappyChildhoods />
      <Testimonials />
      <Features />
    </>
  )
}