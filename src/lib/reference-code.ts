import { randomInt } from "crypto";

// MDN-XXXXX — A-Z0-9 without ambiguous chars (I, L, O, 0, 1).
// Same alphabet as prisma/seed.ts so all codes look alike.
const REFERENCE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateReferenceCode(): string {
  let code = "MDN-";
  for (let i = 0; i < 5; i++) {
    code += REFERENCE_ALPHABET[randomInt(REFERENCE_ALPHABET.length)];
  }
  return code;
}
