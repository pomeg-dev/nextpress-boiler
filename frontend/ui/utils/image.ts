import { ImageProps } from "@/lib/types";

export function parseImageAtts(
  image: any, 
  className?: string, 
  imageSize?: string,
  sizes?: string,
  loading?: "eager" | "lazy" | undefined,
  dims?: { width?: number; height?: number },
  quality?: number,
) {
  if (!image) return {
    src: "/images/placeholder.jpg",
    alt: "Placeholder",
    width: 640,
    height: 480,
  };

  const imageSrc = (imageSize && image?.sizes?.[imageSize]) ?? image.url;
  const imageW: number = dims?.width
    ? dims.width
    : (imageSize && image?.sizes?.[`${imageSize}-width`]) 
      ? image.sizes[`${imageSize}-width`] 
      : image.width;
  const imageH: number = dims?.height
    ? dims.height
    : (imageSize && image?.sizes?.[`${imageSize}-height`])
      ? image.sizes[`${imageSize}-height`]
      : image.height;

  let imageAtts: ImageProps = { src: "", alt: ""};
  if (image) {
    imageAtts.src = imageSrc;
    imageAtts.alt = image?.alt || "Poster";
    imageAtts.width = imageW;
    imageAtts.height = imageH;
    imageAtts.className = className;
    imageAtts.blurDataURL = "/images/placeholder.jpg"
    imageAtts.placeholder = imageW > 400 ? "blur" : undefined;
    imageAtts.loading=loading || "lazy"
    
    // Quality optimization
    if (quality) {
      imageAtts.quality = quality;
    } else {
      imageAtts.quality = imageW > 800 ? 60 : 75;
    }
    
    imageAtts.sizes = sizes ? sizes : "(max-width: 640px) 50vw, (min-width: 1080px) 1080px, 100vw";
  }

  return imageAtts;
}