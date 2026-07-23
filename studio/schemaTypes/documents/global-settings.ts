import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'underConstruction',
      title: 'Under construction mode',
      type: 'boolean',
      initialValue: false,
      description: 'Enable this to show a temporary under-construction page on the website.',
    }),
    defineField({
      name: 'underConstructionTitle',
      title: 'Under construction title',
      type: 'string',
      hidden: ({parent}) => !parent?.underConstruction,
      validation: (rule) =>
        rule.custom((value, context) => {
          if ((context.parent as {underConstruction?: boolean})?.underConstruction && !value) {
            return 'Required when under construction mode is enabled.'
          }
          return true
        }),
    }),
    defineField({
      name: 'underConstructionMessage',
      title: 'Under construction message',
      type: 'text',
      rows: 4,
      hidden: ({parent}) => !parent?.underConstruction,
      validation: (rule) =>
        rule.custom((value, context) => {
          if ((context.parent as {underConstruction?: boolean})?.underConstruction && !value) {
            return 'Required when under construction mode is enabled.'
          }
          return true
        }),
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO',
      type: 'seo',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'siteTitle',
      underConstruction: 'underConstruction',
    },
    prepare(selection) {
      const subtitle = selection.underConstruction
        ? 'Under construction mode enabled'
        : 'Under construction mode disabled'
      return {
        title: selection.title || 'Global settings',
        subtitle,
      }
    },
  },
})
