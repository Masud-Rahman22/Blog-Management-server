import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'

export const getUserInfoFromToken = (token: string) => {
  const extractedToken = token && token.split(' ')[1]
  const decoded = jwt.verify(
    extractedToken,
    config.jwt_access_secret as string,
  ) as JwtPayload

  return decoded // {email, role}=decoded
}