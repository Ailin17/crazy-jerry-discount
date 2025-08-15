// import { Image } from '@shopify/hydrogen'
// import styles from './Hero.module.scss'
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types'
// import LinkButton from './LinkButton'
// import { useGSAP } from '@gsap/react'
// import { useRef } from 'react'
// import gsap from 'gsap'

export type LinkType = { text: string; url: string }
type Props = {
  heading: string
  paragraph: string
  image: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >
  cta1?: LinkType
  cta2?: LinkType
}

// const Hero = ({ heading, paragraph, image, cta1, cta2 }: Props) => {
//   const hasCta = cta1?.url || cta2?.url

//   const container = useRef<HTMLElement>(null)

//   useGSAP(
//     () => {
//       gsap.from('[data-hero-text]', {
//         duration: 1,
//         opacity: 0,
//         stagger: 0.2,
//         x: 50,
//       })

//       gsap.from('[data-hero-button]', {
//         duration: 3,
//         opacity: 0,
//       })
//     },
//     { scope: container }
//   )

//   return (
//     <section className={styles.Hero} ref={container}>
//       <div className={styles.imageWrapper}>
//         {image && (
//           <Image
//             className={styles.image}
//             alt={'test'}
//             data={image}
//             loading="lazy"
//             width={2000}
//           />
//         )}
//         <div className={styles.imageOverlay}></div>
//         <div className={styles.text}>
//           <h1 className={styles.heading} data-hero-text>
//             {heading}
//           </h1>
//           <p className={styles.paragraph} data-hero-text>
//             {paragraph}
//           </p>
//           {hasCta && (
//             <div className={styles.buttonWrapper} data-hero-button>
//               {cta1 && <LinkButton href={cta1.url}>{cta1.text}</LinkButton>}
//               {cta2 && (
//                 <LinkButton href={cta2.url} variant="secondary">
//                   {cta2.text}
//                 </LinkButton>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   )
// }

import React, { useRef } from 'react'
import gsap from 'gsap'
import styles from './Hero.module.scss'
import { useGSAP } from '@gsap/react'

// type HeroProps = {
//   leftImage: string
//   rightImage: string
//   heading: string
//   subheading: string
// }

function Hero({ image, heading, paragraph }: Props) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!container.current) return

    const items = container.current.querySelectorAll('[data-hero-animate]')

    items.forEach((el, i) => {
      const overlay = el.querySelector(`.${styles.revealOverlay}`)
      const direction = el.getAttribute('data-hero-direction') || 'left'

      // Map the direction string to GSAP transform properties
      const directionMap: Record<string, any> = {
        left: { xPercent: 0, to: { xPercent: 100 } },
        right: { xPercent: 0, to: { xPercent: -100 } },
        top: { yPercent: 0, to: { yPercent: 100 } },
        bottom: { yPercent: 0, to: { yPercent: -100 } },
      }

      const anim = directionMap[direction]

      if (overlay && anim) {
        gsap.set(overlay, anim) // set starting position
        const tl = gsap.timeline({ delay: i * 0.3 })
        tl.to(overlay, {
          ...anim.to,
          duration: 1.2,
          ease: 'power4.inOut',
        }).from(
          el,
          {
            scale: 2,
            opacity: 0,
            duration: 2,
            ease: 'power4.out',
            stagger: 2,
          },
          '-=1.1'
        )
      }
    })
  }, [])

  return (
    <section className={styles.hero} ref={container}>
      <div
        className={styles.leftImage}
        style={{ backgroundImage: `url(${image?.url})` }}
        data-hero-animate
        data-hero-direction="left"
      >
        <span className={styles.revealOverlay}></span>
      </div>

      <div
        className={styles.rightTopImage}
        style={{ backgroundImage: `url(${image?.url})` }}
        data-hero-animate
        data-hero-direction="right"
      >
        <span className={styles.revealOverlay}></span>
      </div>

      <div
        className={styles.rightBottomText}
        // data-hero-animate
        // data-hero-direction="bottom"
      >
        <h1>{heading}</h1>
        <p>{paragraph}</p>
      </div>
    </section>
  )
}
export default Hero
