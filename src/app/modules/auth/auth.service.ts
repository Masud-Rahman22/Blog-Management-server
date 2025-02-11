import httpStatus from 'http-status'
import { TLoginUser } from './auth.interface'
import { createToken } from './auth.utils'
import { User } from '../user/user.model'
import { TUser } from '../user/user.interface'
import { AppError } from '../../error/appError'
import config from '../../config'


export const generateToken = (user: TUser) => {
  const jwtPayload = {
    email: user.email,
    role: user.role,
    id: user._id,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )
  return accessToken
}

const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exist
    const user = await User.isUserExistsByEmail(payload.email)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
    }
    //checking if the password is correct
    if (!(await User.isPasswordMatched(payload?.password, user?.password)))
      throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')
    //create token and sent to the  client
    const jwtPayload = {
      email: user.email,
      role: user.role,
      id: user._id,
    }
  
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    )
  
    return {
      accessToken: accessToken,
      user,
    }
  }
  
  const refreshToken = async (id: string) => {
    const user = await User.findById(id)
    if (!user) {
      throw new Error('User not available')
    }
    return generateToken(user)
  }
  

  
  export const AuthServices = {
    loginUser,
    refreshToken,
  }