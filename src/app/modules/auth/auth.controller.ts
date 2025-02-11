import httpStatus from 'http-status'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'
import { getUserInfoFromToken } from '../../utils/getUserInfoFromToken'

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)
  const { accessToken, user } = result

  res.cookie('refreshToken', accessToken, {
    httpOnly: true,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    accessToken: accessToken,
    data: user,
  })
})

  const getRefreshToken = catchAsync(async (req, res) => {
    const token = req.headers.authorization
    const { id } = getUserInfoFromToken(token as string)
    const result = await AuthServices.refreshToken(id)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Refresh token generated successfully',
      data: result,
    })
  })
  
  export const AuthControllers = {
    loginUser,
    getRefreshToken,
  }