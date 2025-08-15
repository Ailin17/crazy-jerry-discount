import { Suspense, useRef, useEffect } from 'react'
import { Await } from 'react-router'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { ProductItem } from './ProductItem'
import styles from './RecommendedProducts.module.scss'
import { Navigation, Pagination } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Stamp from '~/elements/Stamp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type RecommendedProductsProps = {
  products: Promise<any>
}

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stampRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !stampRef.current) return

    gsap.to(stampRef.current, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current, // scope to container
        start: 'top top', // when container top hits viewport top
        end: '+=100', // fade out over 300px scroll
        scrub: true, // smooth scrubbing
      },
    })
  }, [])

  return (
    <div className={styles.recommendedProducts} ref={containerRef}>
      <div ref={stampRef} className={styles.stamp}>
        <Stamp size={900} />
      </div>

      <h2 className={styles.heading}>Featured Collection</h2>

      <div className="swiper-button-prev">
        <ChevronLeft size={24} />
      </div>
      <div className="swiper-button-next">
        <ChevronRight size={24} />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <Swiper
              className={styles.carousel}
              modules={[Navigation, Pagination]}
              spaceBetween={12}
              slidesPerView={1.2}
              loop={true}
              navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
            >
              {response?.products.nodes.map((product: any) => (
                <SwiperSlide key={product.id}>
                  <ProductItem product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </Await>
      </Suspense>
    </div>
  )
}
