import React from 'react'
import styles from './BannerVideo.module.scss'
import { Video } from '@shopify/hydrogen'
import { MediaContentType } from '@shopify/hydrogen/storefront-api-types'
export type VideoMetafield = {
  key: string
  type: string
  reference:
    | {
        mediaContentType: string
        sources: { url: string; format: string; mimeType: string }[]
      }
    | undefined
  value: string
}
type BannerVideoProps = {
  videoMetafield: VideoMetafield
  posterUrl?: string
  heading?: string
  text?: string
}

const BannerVideo = ({
  videoMetafield,
  posterUrl,
  heading,
  text,
}: BannerVideoProps) => {
  if (!videoMetafield?.reference?.sources?.length) return null
  console.log(videoMetafield)
  const mp4Source = videoMetafield.reference.sources.find(
    (s) => s.format === 'mp4'
  )

  console.log(videoMetafield, mp4Source)

  return (
    <section className={styles.bannerVideo}>
      <Video
        className={styles.video}
        data={{
          sources: [
            {
              url: 'https://cdn.shopify.com/videos/c/o/v/fa15053ec2cd4523bb1104e3eacff823.mp4',
              mimeType: videoMetafield.reference.sources[0].mimeType,
            },
          ],
          mediaContentType: videoMetafield.reference
            .mediaContentType as MediaContentType,
        }}
        poster={posterUrl}
        autoPlay
        muted
        loop
        playsInline
        controls={false}
      />
      {(heading || text) && (
        <div className={styles.overlayText}>
          {heading && <h2>{heading}</h2>}
          {text && <p>{text}</p>}
        </div>
      )}
    </section>
  )
}

export default BannerVideo
