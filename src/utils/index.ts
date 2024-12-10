import { ZodSchema, SafeParseReturnType } from 'zod';
import { Response } from 'express';

/**
 * Validates the provided data against the given Zod schema.
 * 
 * @template T - The type that the data is expected to conform to.
 * @param {ZodSchema} schema - The Zod schema to validate the data against.
 * @param {any} data - The data to be validated.
 * @returns {SafeParseReturnType<T, T>} The result of the validation, containing either the parsed data or validation errors.
 */

export const validateSchema = <T>(schema: ZodSchema, data: any): SafeParseReturnType<T, T> => {
  return schema.safeParse(data);
};

export const handleValidationResponse = (validationResult: SafeParseReturnType<any, any>, res: Response): boolean => {
  if (!validationResult.success) {
    const formattedErrorMessage = validationResult.error.errors.map(
      (error) => `${error.path} is ${error.message}`
    );
    res.status(400).json({ error: formattedErrorMessage, data: null });
    return false;
  }
  return true;
};
