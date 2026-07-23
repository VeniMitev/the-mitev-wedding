'use client';

import { PortableTextBlock } from 'next-sanity';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';

type Props = {
    data: PortableTextBlock[];
};

const RichText = ({ data }: Props) => {
    return (
        <PortableText
            value={data}
            components={{
                block: {
                    h2: ({ children }) => (
                        <span className='w-fit'>
                            <h2 className='mb-2 mt-7 text-2xl'>{children}</h2>
                        </span>
                    ),
                    h3: ({ children }) => (
                        <h3 className='mb-1 mt-5'>{children}</h3>
                    ),
                    normal: ({ children }) => (
                        <p className='mb-3 mt-2 max-w-3xl'>{children}</p>
                    ),
                },
                list: {
                    bullet: ({ children }) => (
                        <ul className='my-1 max-w-3xl list-outside list-disc px-5'>
                            {children}
                        </ul>
                    ),
                },
                types: {
                    image: ({ value }) => {
                        if (!value.url) {
                            return null;
                        }

                        return (
                            <Image
                                src={value.url}
                                alt={value.alt}
                                title={value.alt}
                                width={1920}
                                height={720}
                                loading='lazy'
                                className='my-10 max-w-full select-none rounded-lg transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-md'
                            />
                        );
                    },
                },
                marks: {
                    internalLink: ({ value, children }) => {
                        const { slug = {} } = value;
                        const href = `/${slug.current}`;

                        return (
                            <Link
                                href={href}
                                className='text-primary underline transition duration-300 ease-in-out hover:text-blue-500'
                                title={`Navigate to ${slug.current}`}
                                prefetch
                            >
                                {children}
                            </Link>
                        );
                    },
                    link: ({ value, children }) => {
                        const { blank, href } = value;

                        return (
                            <Link
                                href={href}
                                target={blank ? '_blank' : '_self'}
                                rel='noopener noreferrer'
                                className='text-primary underline transition duration-300 ease-in-out hover:text-blue-500'
                                title={`Navigate to ${href}`}
                                prefetch
                            >
                                {children}
                            </Link>
                        );
                    },
                },
            }}
        />
    );
};

export default RichText;
