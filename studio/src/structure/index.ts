import {HomeIcon} from '@sanity/icons/Home'
import type {StructureResolver} from 'sanity/structure'

const SINGLETON_TYPES = new Set(['homePage'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => !SINGLETON_TYPES.has(listItem.getId() || '')),
    ])
