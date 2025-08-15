import { Suspense } from 'react'
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

type RecommendedProductsProps = {
  products: Promise<any>
}

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  return (
    <div className={styles.recommendedProducts}>
      <Stamp size={900} className={styles.stamp} />
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
