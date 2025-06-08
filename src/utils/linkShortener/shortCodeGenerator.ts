export function generateShortCode(length: number = 6): string {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateUniqueShortCode(existingCodes: string[], length: number = 6): string {
  let shortCode: string;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    shortCode = generateShortCode(length);
    attempts++;

    if (attempts > maxAttempts) {
      // Si no puede generar uno único en 100 intentos, aumenta la longitud
      length++;
      attempts = 0;
    }
  } while (existingCodes.includes(shortCode));

  return shortCode;
}
