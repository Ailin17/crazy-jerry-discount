import { Link } from 'react-router'
import {
  Image as ImageComp,
  Money,
  Video as VideoComp,
} from '@shopify/hydrogen'
import type {
  ProductItemFragment,
  CollectionItemFragment,
} from 'storefrontapi.generated'
import { useVariantUrl } from '~/lib/variants'
import styles from './ProductItem.module.scss'
import {
  Maybe,
  Video,
  VideoSource,
  Image,
} from '@shopify/hydrogen/storefront-api-types'
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types'

type VideoMedia = {
  __typename: 'Video'
} & Pick<Video, 'id' | 'mediaContentType'> & {
    previewImage?: Maybe<Pick<Image, 'url' | 'height' | 'width'>>
    sources: Array<Pick<VideoSource, 'url' | 'format'>>
  }

type ImageMedia = { __typename: 'MediaImage' } & Pick<
  StorefrontAPI.MediaImage,
  'id' | 'mediaContentType'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'height' | 'width' | 'altText'>
    >
  }

export function ProductItem({
  product,
  loading,
}: {
  product: CollectionItemFragment | ProductItemFragment
  loading?: 'eager' | 'lazy'
}) {
  const variantUrl = useVariantUrl(product.handle)
  const image = product.featuredImage
  const secondMedia = product.media?.edges?.[1]?.node
  const hasVideo = secondMedia?.mediaContentType === 'VIDEO'

  if (hasVideo) {
    console.log({ secondMedia })
  }
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className={styles.imgWrapper}>
        {image && (
          <ImageComp
            alt={image.altText || product.title}
            data={image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className={secondMedia ? styles.top : styles.solo}
          />
        )}
        {secondMedia && secondMedia.image && (
          <ImageComp
            alt={(secondMedia as ImageMedia).image?.altText || product.title}
            aspectRatio="2/3"
            data={(secondMedia as ImageMedia)?.image}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
            className={styles.bottom}
          />
        )}
        {secondMedia && hasVideo && (
          <VideoComp
            className={`${styles.bottom} ${styles.video}`}
            data={{
              ...(secondMedia as VideoMedia),
              sources: (secondMedia as VideoMedia).sources.map((s) => ({
                url: s.url,
                mimeType: `video/${s.format === 'm3u8' ? 'mpegurl' : s.format}`,
              })),
            }}
            muted={true}
            autoPlay={true}
            controls={false}
            loop={true}
            playsInline={true}
            poster={secondMedia.previewImage}
            preload="auto"
          />
        )}
      </div>
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  )
}
