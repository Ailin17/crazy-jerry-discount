'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import styles from './TopBar.module.scss'

const promotions = [
  { id: 1, message: 'Free shipping on orders over $50' },
  { id: 2, message: 'Summer sale: up to 40% off' },
  { id: 3, message: 'Sign up for our newsletter & get 10% off' },
  { id: 4, message: 'New arrivals dropping every Friday' },
]

export default function TopBar() {
  return (
    <div className={styles.topBar}>
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        className={styles.swiper}
      >
        {promotions.map((promo) => (
          <SwiperSlide key={promo.id} className={styles.slide}>
            <p>{promo.message}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
