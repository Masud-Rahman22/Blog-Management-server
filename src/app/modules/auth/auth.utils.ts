import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { email: string; role: string; id: string },
  secret: string,
  expiresIn: string | number
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: String(expiresIn)}); // Ensure it's a string
};
