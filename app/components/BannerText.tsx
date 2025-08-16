import { LinkType } from './Hero'
import styles from './BannerText.module.scss'
import LinkButton from './LinkButton'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import gsap from 'gsap'
type Props = {
  text?: string
  cta1?: LinkType
  cta2?: LinkType
}

const BannerText = ({
  text = 'A colorful and versatile design to personalize your wardrobe',
  cta1 = {
    url: '#',
    text: 'Get Started',
  },
  cta2 = {
    url: '#',
    text: 'Learn more',
  },
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const hasCta = cta1?.url || cta2?.url

  useGSAP(() => {
    if (!containerRef.current) return

    const buttons = containerRef.current.querySelectorAll('[data-hero-button]')
    const lines = containerRef.current.querySelectorAll(`.line`)
    gsap.set(lines, { y: 50, opacity: 0 })
    gsap.to(lines, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'back.out(1.7)',
      stagger: 0.2,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
      },
    })

    buttons.forEach((el, i) => {
      gsap.set(el, { opacity: 0 })
      gsap.to(el, {
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 110%',
        },
      })
    })
  }, [])

  return (
    <section className={styles.BannerText} ref={containerRef}>
      <h2 className={styles.heading}>
        <span className="line">A colorful and versatile</span>
        <span className="line">design to personalize</span>
        <span className="line">your perfect wardrobe</span>
      </h2>
      {hasCta && (
        <div className={styles.buttonWrapper} data-hero-button>
          {cta1 && <LinkButton href={cta1.url}>{cta1.text}</LinkButton>}
          {cta2 && (
            <LinkButton href={cta2.url} variant="secondary">
              {cta2.text}
            </LinkButton>
          )}
        </div>
      )}
    </section>
  )
}

export default BannerText
