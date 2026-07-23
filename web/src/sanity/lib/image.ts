import { createImageUrlBuilder } from "@sanity/image-url";
import { client } from "./client";

const builder = createImageUrlBuilder(client);

type SanityImageLike = {
  asset?: {
    _ref?: string;
    url?: string;
  };
};

export function urlForImage(source: SanityImageLike) {
  return builder.image(source);
}
