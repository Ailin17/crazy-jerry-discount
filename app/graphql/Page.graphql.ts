export const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
      metafields(identifiers: [
        { namespace: "custom", key: "hero_heading" },
        { namespace: "custom", key: "hero_paragraph" },
        { namespace: "custom", key: "hero_image" },
        { namespace: "custom", key: "cta_link" },
        { namespace: "custom", key: "cta_link_2" }
      ]) {
        key
        type
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
        value
      }
    }
  }
` as const;
