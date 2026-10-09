import type { Metadata } from "next";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

const shareImage = "/media/common/Rentworx__logo_mini.png";

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      siteName: "Rent Worx",
      title,
      description,
      url: path,
      images: [
        {
          url: shareImage,
          width: 640,
          height: 270,
          alt: "Rent Worx",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [shareImage],
    },
  };
}
