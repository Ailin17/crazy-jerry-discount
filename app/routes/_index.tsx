import { type LoaderFunctionArgs } from '@shopify/remix-oxygen'
import { useLoaderData, Await } from 'react-router'
import { Suspense } from 'react'
import { Image } from '@shopify/hydrogen'
import { ProductItem } from '~/components/ProductItem'
import { PAGE_QUERY } from '~/graphql/Page.graphql'
import Hero, { LinkType } from '~/components/Hero'
import RecommendedProducts from '~/components/RecommendedProducts'

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
  const heading = page.metafields.find(
    (f: any) => f.key === 'hero_heading'
  )?.value
  const paragraph = page.metafields.find(
    (f: any) => f.key === 'hero_paragraph'
  )?.value
  const imageMeta = page.metafields.find((f: any) => f.key === 'hero_image')
  const ctaLink = JSON.parse(
    page.metafields.find((f: any) => f.key === 'cta_link').value
  )
  const ctaLink2 = JSON.parse(
    page.metafields.find((f: any) => f.key === 'cta_link_2').value
  )
  console.log({ ctaLink })
  return (
    <div className="home">
      {page && (
        <Hero
          heading={heading}
          paragraph={paragraph}
          image={imageMeta.reference.image}
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

/** Recommended Products Component */
// function RecommendedProducts({ products }: { products: Promise<any> }) {
//   return (
//     <div className="recommended-products">
//       <h2>Recommended Products</h2>
//       <Suspense fallback={<div>Loading...</div>}>
//         <Await resolve={products}>
//           {(response) => (
//             <div className="recommended-products-grid">
//               {response
//                 ? response.products.nodes.map((product: any) => (
//                     <ProductItem key={product.id} product={product} />
//                   ))
//                 : null}
//             </div>
//           )}
//         </Await>
//       </Suspense>
//     </div>
//   )
// }

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
