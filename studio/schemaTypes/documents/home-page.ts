import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Page title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroStatement',
      title: 'Hero statement',
      type: 'string',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'galleryImages',
      title: 'Supporting gallery images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {hotspot: true},
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alt text',
                  type: 'string',
                  validation: (rule) => rule.required(),
                }),
              ],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              validation: (rule) => rule.max(100),
            }),
          ],
          preview: {
            select: {
              title: 'caption',
              media: 'image',
            },
            prepare(selection) {
              return {
                title: selection.title || 'Gallery image',
                media: selection.media,
              }
            },
          },
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: 'eventDate',
      title: 'Event date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venueName',
      title: 'Venue name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'venueLocation',
      title: 'Venue location',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'details',
      title: 'Details',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: {
        collapsible: true,
        collapsed: false,
      },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'string',
          validation: (rule) => rule.required().max(60),
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required().max(160),
        }),
        defineField({
          name: 'ogTitle',
          title: 'Open Graph title',
          type: 'string',
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: 'ogDescription',
          title: 'Open Graph description',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.max(200),
        }),
        defineField({
          name: 'ogImage',
          title: 'Open Graph image',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'venueName',
    },
  },
})
