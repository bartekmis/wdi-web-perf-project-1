import { submitGravityForm } from '@/queries/gravity-forms';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { formId, fieldValues } = req.body;

    if (!formId || !fieldValues) {
      return res
        .status(401)
        .json({ message: 'Invalid data provided.', entry: null, errors: null });
    }

    try {
      const result = await submitGravityForm(formId, fieldValues);

      if (!result.entry && !!result.errors?.length) {
        return res
          .status(400)
          .json({
            message: 'Some errors occured during form submission.',
            entry: null,
            errors: result.errors,
          });
      }

      res
        .status(200)
        .json({
          message: 'Form has been successfully submitted.',
          entry: result.entry,
          errors: null,
        });
    } catch (error: any) {
      res.status(500).json({
        message: "Couldn't submit the form. Please try again later.",
        entry: null,
        errors: null,
      });
    }
  }
}
