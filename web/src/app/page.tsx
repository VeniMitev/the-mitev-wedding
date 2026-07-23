import type { Metadata } from 'next';
import Image from 'next/image';
import { PortableTextBlock } from 'next-sanity';
import { client } from '@/sanity/lib/client';
import { HOME_PAGE_QUERY } from '@/sanity/lib/queries';
import { urlForImage } from '@/sanity/lib/image';
import RichText from '@/components/RichText';

type HomePageDocument = {
    title: string;
    heroStatement: string;
    mainImage?: {
        asset?: {
            _ref: string;
            _type: 'reference';
        };
        alt?: string;
    };
    galleryImages?: Array<{
        _key: string;
        caption?: string;
        image?: {
            asset?: {
                _ref: string;
                _type: 'reference';
            };
            alt?: string;
        };
    }>;
    eventDate: string;
    venueName: string;
    venueLocation: string;
    details?: PortableTextBlock[];
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: {
            asset?: {
                _ref: string;
                _type: 'reference';
            };
            alt?: string;
        };
    };
};

type SanityImage = {
    asset?: {
        _ref: string;
        _type: 'reference';
    };
    alt?: string;
};

type HeroImage = {
    key: string;
    image: SanityImage;
    caption?: string;
};

const queryOptions = { next: { revalidate: 60 } };

function formatEventDate(eventDate: string) {
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
    }).format(new Date(eventDate));
}

function getDateSegments(eventDate: string) {
    const parts = new Intl.DateTimeFormat('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: '2-digit',
    }).formatToParts(new Date(eventDate));

    return [
        parts.find((part) => part.type === 'month')?.value || '',
        parts.find((part) => part.type === 'day')?.value || '',
        parts.find((part) => part.type === 'year')?.value || '',
    ];
}

function getHeroImages(homePage: HomePageDocument) {
    const images: Array<HeroImage | null> = [
        homePage.mainImage?.asset
            ? {
                  key: 'main-image',
                  image: homePage.mainImage,
                  caption: homePage.mainImage.alt,
              }
            : null,
        ...(homePage.galleryImages || []).map((item) =>
            item.image?.asset
                ? {
                      key: item._key,
                      image: item.image,
                      caption: item.caption || item.image.alt,
                  }
                : null,
        ),
    ];

    return images.filter((item): item is HeroImage => Boolean(item)).slice(0, 3);
}

export async function generateMetadata(): Promise<Metadata> {
    const homePage = await client.fetch<HomePageDocument | null>(
        HOME_PAGE_QUERY,
        {},
        queryOptions,
    );

    const metaTitle =
        homePage?.seo?.metaTitle || homePage?.title || 'The Mitev Wedding';
    const metaDescription =
        homePage?.seo?.metaDescription ||
        'Wedding details powered by Sanity and Next.js.';
    const ogTitle = homePage?.seo?.ogTitle || metaTitle;
    const ogDescription = homePage?.seo?.ogDescription || metaDescription;
    const ogImage = homePage?.seo?.ogImage;
    const ogImageUrl = ogImage
        ? urlForImage(ogImage).width(1200).height(630).url()
        : undefined;

    return {
        title: metaTitle,
        description: metaDescription,
        openGraph: {
            type: 'website',
            title: ogTitle,
            description: ogDescription,
            images: ogImageUrl
                ? [
                      {
                          url: ogImageUrl,
                          alt: homePage?.seo?.ogImage?.alt || ogTitle,
                          width: 1200,
                          height: 630,
                      },
                  ]
                : undefined,
        },
        twitter: {
            card: ogImageUrl ? 'summary_large_image' : 'summary',
            title: ogTitle,
            description: ogDescription,
            images: ogImageUrl ? [ogImageUrl] : undefined,
        },
    };
}

export default async function Home() {
    const homePage = await client.fetch<HomePageDocument | null>(
        HOME_PAGE_QUERY,
        {},
        queryOptions,
    );

    if (!homePage) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-stone-100 px-6 py-16 text-stone-900'>
                <main className='w-full max-w-3xl rounded-3xl bg-white p-10 shadow-sm'>
                    <p className='text-sm font-semibold uppercase tracking-[0.3em] text-rose-500'>
                        Sanity connected
                    </p>
                    <h1 className='mt-4 text-4xl font-semibold tracking-tight'>
                        Create your homepage content in Studio
                    </h1>
                    <p className='mt-4 max-w-2xl text-base leading-7 text-stone-600'>
                        The Next.js app is now wired to project oym9hr2z on the
                        production dataset. Open the standalone Studio, edit the
                        Homepage singleton, and this page will start rendering
                        your wedding details.
                    </p>
                    <div className='mt-8 rounded-2xl border border-stone-200 bg-stone-50 p-6 text-sm text-stone-700'>
                        <p>Next steps:</p>
                        <ol className='mt-3 list-decimal space-y-2 pl-5'>
                            <li>
                                Run the Studio in the <code>studio</code>{' '}
                                folder.
                            </li>
                            <li>
                                Open the Homepage document and fill in the event
                                fields.
                            </li>
                            <li>
                                Run the web app in the <code>web</code> folder
                                to preview the content.
                            </li>
                        </ol>
                    </div>
                </main>
            </div>
        );
    }

    const heroImages = getHeroImages(homePage);
    const dateSegments = getDateSegments(homePage.eventDate);

    return (
        <div className='min-h-screen bg-[#fbf8f4] px-4 py-6 text-stone-800 sm:px-6 lg:px-8'>
            <main className='mx-auto flex w-full max-w-6xl flex-col items-center gap-8 sm:gap-10'>
                <section className='grid w-full gap-4 md:grid-cols-3 md:gap-6'>
                    {heroImages.map((item, index) => (
                        <figure
                            key={item.key}
                            className='relative aspect-[4/5] overflow-hidden bg-stone-200 shadow-sm'
                        >
                            <Image
                                src={urlForImage(item.image)
                                    .width(1200)
                                    .height(1500)
                                    .fit('crop')
                                    .url()}
                                alt={
                                    item.caption ||
                                    homePage.heroStatement ||
                                    'Wedding photo'
                                }
                                fill
                                priority={index === 0}
                                sizes='(min-width: 768px) 33vw, 100vw'
                                className='object-cover'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent' />
                            <div className='absolute inset-x-0 bottom-0 px-4 pb-3 text-white sm:px-5 sm:pb-4'>
                                <span className='block text-6xl font-semibold leading-none tracking-[-0.08em] sm:text-7xl lg:text-[7.5rem]'>
                                    {dateSegments[index] || ''}
                                </span>
                            </div>
                        </figure>
                    ))}
                </section>

                <section className='flex w-full flex-col items-center gap-4 text-center'>
                    <p className='text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-stone-500 sm:text-xs'>
                        {homePage.title}
                    </p>
                    <h1
                        className='font-script text-5xl leading-none text-stone-700 sm:text-6xl lg:text-7xl'
                    >
                        {homePage.heroStatement}
                    </h1>
                    <div className='space-y-2'>
                        <p className='text-xs font-semibold uppercase tracking-[0.45em] text-stone-500 sm:text-sm'>
                            {formatEventDate(homePage.eventDate)}
                        </p>
                        <p className='text-sm text-stone-600 sm:text-base'>
                            {homePage.venueName}
                            {homePage.venueLocation
                                ? ` · ${homePage.venueLocation}`
                                : ''}
                        </p>
                    </div>
                </section>

                {homePage.details && homePage.details.length > 0 ? (
                    <section className='w-full max-w-3xl text-center'>
                        <div className='prose prose-stone mx-auto max-w-none text-stone-600'>
                            <RichText data={homePage.details} />
                        </div>
                    </section>
                ) : null}
            </main>
        </div>
    );
}
