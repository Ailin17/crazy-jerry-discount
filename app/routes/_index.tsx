import { type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData } from 'react-router'
import { Image } from '@shopify/hydrogen'
import { PAGE_QUERY } from '~/graphql/Page.graphql'
import Hero, { LinkType } from '~/components/Hero'
import RecommendedProducts from '~/components/RecommendedProducts'
import BannerText from '~/components/BannerText'
import BannerVideo, { VideoMetafield } from '~/components/BannerVideo'

export async function loader({ context }: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(context)
  const criticalData = await loadCriticalData(context)

  return { ...deferredData, ...criticalData }
}

/** Critical data for above-the-fold rendering */
async function loadCriticalData(context: LoaderFunctionArgs['context']) {
  const [{ collections }, { page }] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    context.storefront.query(PAGE_QUERY, {
      variables: { handle: 'home' }, // Fetch the 'home' page
    }),
  ])

  return {
    featuredCollection: collections.nodes[0],
    page,
  }
}

/** Deferred data for below-the-fold rendering */
function loadDeferredData(context: LoaderFunctionArgs['context']) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((err) => {
      console.error(err)
      return null
    })

  return { recommendedProducts }
}

export default function Homepage() {
  const { page, featuredCollection, recommendedProducts } =
    useLoaderData<typeof loader>()
  console.log({ page })
  const heading = page.metafields.find(
    (f: any) => f.key === 'hero_heading'
  )?.value
  const paragraph = page.metafields.find(
    (f: any) => f.key === 'hero_paragraph'
  )?.value
  const imageMeta = page.metafields.find((f: any) => f.key === 'hero_image')
  const imageMeta2 = page.metafields.find((f: any) => f.key === 'hero_image_2')
  const ctaLink = JSON.parse(
    page.metafields.find((f: any) => f.key === 'cta_link').value
  )
  const ctaLink2 = JSON.parse(
    page.metafields.find((f: any) => f.key === 'cta_link_2').value
  )
  const videoMetafield = page.metafields.find(
    (f: any) => f.key === 'video_banner'
  )

  console.log(videoMetafield)
  return (
    <div className="home">
      {page && (
        <Hero
          heading={heading}
          paragraph={paragraph}
          image={imageMeta.reference.image}
          image2={imageMeta2.reference.image}
          cta1={ctaLink as LinkType}
          cta2={ctaLink2 as LinkType}
        />
      )}

      {/* {featuredCollection && (
        <FeaturedCollection collection={featuredCollection} />
      )} */}

      {recommendedProducts && (
        <RecommendedProducts products={recommendedProducts} />
      )}

      <BannerText />
      <BannerVideo
        videoMetafield={videoMetafield as VideoMetafield}
        heading={'A whole new world'}
      />
    </div>
  )
}

/** Featured Collection Component */
function FeaturedCollection({ collection }: { collection: any }) {
  if (!collection) return null
  const image = collection.image
  return (
    <a
      className="featured-collection"
      href={`/collections/${collection.handle}`}
    >
      {image && <Image data={image} sizes="100vw" />}
      <h1>{collection.title}</h1>
    </a>
  )
}

/** GraphQL Queries */
const FEATURED_COLLECTION_QUERY = `#graphql
query FeaturedCollection($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
  collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
    nodes {
      id
      title
      handle
      image {
        id
        url
        altText
        width
        height
      }
    }
  }
}
` as const

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
query RecommendedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
  products(first: 4, sortKey: UPDATED_AT, reverse: true) {
    nodes {
      id
      title
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      featuredImage {
        id
        url
        altText
        width
        height
      }
    }
  }
}
` as const
