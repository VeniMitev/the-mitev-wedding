import { defineQuery } from 'next-sanity';

export const HOME_PAGE_QUERY = defineQuery(`
  *[_id == "homePage"][0]{
    title,
    heroStatement,
    mainImage{
      asset,
      alt,
      hotspot,
      crop
    },
    galleryImages[]{
      _key,
      caption,
      image{
        asset,
        alt,
        hotspot,
        crop
      }
    },
    eventDate,
    venueName,
    venueLocation,
    details,
    seo{
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
      ogImage{
        asset,
        alt,
        hotspot,
        crop
      }
    }
  }
`);
