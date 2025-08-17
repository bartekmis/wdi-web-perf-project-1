import type { NextApiRequest, NextApiResponse } from 'next';
import { getPreviewPageByID } from '@/queries/pages';

export default async function preview(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { secret, id } = req.query;

  // Check the secret and next parameters
  // This secret should only be known by this API route
  if (
    !process.env.WORDPRESS_PREVIEW_SECRET ||
    secret !== process.env.WORDPRESS_PREVIEW_SECRET ||
    !id
  ) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  // Fetch WordPress to check if the provided `id` exists
  const page = await getPreviewPageByID(id);

  // If the post doesn't exist prevent preview mode from being enabled
  if (!page) {
    return res.status(401).json({ message: 'Page not found' });
  }

  // Redirect to the path from the fetched post
  // We don't redirect to `req.query.slug` as that might lead to open redirect vulnerabilities
  res.writeHead(307, { Location: `/preview/${id}` });
  res.end();
}
