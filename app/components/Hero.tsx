import { Image } from '@shopify/hydrogen'
import styles from './Hero.module.scss'
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types'
import LinkButton from './LinkButton'

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

const Hero = ({ heading, paragraph, image, cta1, cta2 }: Props) => {
  const hasCta = cta1?.url || cta2?.url
  return (
    <section className={styles.Hero}>
      <div className={styles.imageWrapper}>
        {image && (
          <Image
            className={styles.image}
            alt={'test'}
            data={image}
            loading="lazy"
            width={2000}
          />
        )}
        <div className={styles.imageOverlay}></div>
        <div className={styles.text}>
          <h1 className={styles.heading}>{heading}</h1>
          <p className={styles.paragraph}>{paragraph}</p>
          {hasCta && (
            <div className={styles.buttonWrapper}>
              {cta1 && <LinkButton href={cta1.url}>{cta1.text}</LinkButton>}
              {cta2 && (
                <LinkButton href={cta2.url} variant="secondary">
                  {cta2.text}
                </LinkButton>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
