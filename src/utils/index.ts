import { ZodSchema, SafeParseReturnType } from 'zod';
import { Response } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";

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




interface SignOption {
  expiresIn?: string | number;
}
const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: "3d",
};


export const generateAccessToken = (
  payload: JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTION
) => {
  const secret = process.env.SECRET_KEY;
  // Use this command to generate SECRET_KEY: openssl rand -base64 32
  const token = jwt.sign(payload, secret!, options);
  return token;
}


export function generateOrderNumber(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let orderNumber = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    orderNumber += characters[randomIndex];
  }
  return orderNumber;
}