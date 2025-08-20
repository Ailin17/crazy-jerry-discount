import { Suspense, useRef, useEffect } from 'react'
import { Await, Link } from 'react-router'
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
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

type RecommendedProductsProps = {
  products: Promise<any>
}

export default function RecommendedProducts({
  products,
}: RecommendedProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stampRef = useRef<HTMLDivElement>(null)
  const leftTextRef = useRef<HTMLSpanElement>(null)
  const rightTextRef = useRef<HTMLSpanElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const slidesRef = useRef<HTMLDivElement[]>([])
  const viewAllRef = useRef<HTMLAnchorElement>(null)

  useGSAP(() => {
    // Only run if all refs exist and there are slides
    if (
      !containerRef.current ||
      !leftTextRef.current ||
      !rightTextRef.current ||
      slidesRef.current.length === 0
    )
      return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top center',
        end: '+=2000',
        scrub: true,
      },
    })

    // Split heading apart
    tl.to(
      leftTextRef.current,
      { xPercent: -100, ease: 'power2.out', opacity: 0 },
      '<.5'
    )
    tl.to(
      rightTextRef.current,
      { xPercent: 100, ease: 'power2.out', opacity: 0 },
      '<'
    )

    // Flip in slides
    slidesRef.current.forEach((slide, i) => {
      tl.fromTo(
        slide,
        { opacity: 0, rotateY: 90 },
        { opacity: 1, rotateY: 0, ease: 'power3.out' },
        '<.1'
      )
    })

    tl.from(
      viewAllRef.current,
      { yPercent: -40, ease: 'power2.out', opacity: 0 },
      '<.5'
    )

    return () => tl.kill() // cleanup
  }, [slidesRef.current.length]) // run again if number of slides changes

  return (
    <div className={styles.recommendedProducts} ref={containerRef}>
      {/* <div ref={stampRef} className={styles.stamp}>
        <Stamp size={900} />
      </div> */}

      <div className={styles.stickyContainer}>
        <div className={styles.wrapper}>
          <h3 className={styles.splitTitle}>
            <span ref={leftTextRef}>TRENDING</span>
            <span ref={rightTextRef} className={styles.rightText}>
              COLLECTION
            </span>
          </h3>
          <div className={styles.swiperWrapper}>
            <div className="swiper-button-prev">
              <ChevronLeft size={24} />
            </div>
            <div className="swiper-button-next">
              <ChevronRight size={24} />
            </div>

            <div ref={carouselRef}>
              <Suspense fallback={<div>Loading...</div>}>
                <Await resolve={products}>
                  {(response) => (
                    <Swiper
                      className={styles.carousel}
                      modules={[Navigation, Pagination]}
                      spaceBetween={12}
                      slidesPerView={1.2}
                      loop={true}
                      effect="coverflow"
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
                      {response?.products.nodes.map(
                        (product: any, i: number) => (
                          <SwiperSlide key={product.id}>
                            <div
                              ref={(el) => el && (slidesRef.current[i] = el)}
                            >
                              <ProductItem product={product} />
                            </div>
                          </SwiperSlide>
                        )
                      )}
                    </Swiper>
                  )}
                </Await>
              </Suspense>
            </div>

            <a href="#" className={styles.viewAll} ref={viewAllRef}>
              View All
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
