import type { Metadata } from "next";

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
};

const shareImage = "/media/common/og-share.png";

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
          width: 1200,
          height: 630,
          alt: "Rent Worx property management",
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
