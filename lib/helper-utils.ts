import { ReactNode } from 'react';
import parser from 'html-react-parser';

export const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: {
  condition: boolean;
  wrapper: any;
  children: ReactNode;
}) => (condition ? wrapper(children) : children);

export const formatPhone = (phone: string) => {
  return phone.replace(/[ ()+]/g, '');
};

export const getFullHead = (fullHead: string) => {
  // Indexing is controlled solely by the global `noindex, nofollow` tag in
  // _document.tsx. Strip any robots tag Yoast injected into the SEO head so we
  // never emit a second, conflicting directive on top of it.
  fullHead = fullHead.replace(/<meta[^>]*name=["']robots["'][^>]*>/gi, '');

  // replace NEXT_PUBLIC_MEDIA_URL with NEXT_PUBLIC_IMGIX_URL
  if (process.env.NEXT_PUBLIC_MEDIA_URL && process.env.NEXT_PUBLIC_IMGIX_URL) {
    fullHead = fullHead.replace(
      new RegExp(process.env.NEXT_PUBLIC_MEDIA_URL, 'g'),
      process.env.NEXT_PUBLIC_IMGIX_URL
    );
  }

  // replace NEXT_PUBLIC_BACKEND_URL with NEXT_PUBLIC_FRONTEND_URL
  if (process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_FRONTEND_URL) {
    fullHead = fullHead.replace(
      new RegExp(process.env.NEXT_PUBLIC_BACKEND_URL, 'g'),
      process.env.NEXT_PUBLIC_FRONTEND_URL
    );
  }

  // replace all /" with "
  fullHead = fullHead.replace(/\/"/g, '"');

  return parser(fullHead);
}