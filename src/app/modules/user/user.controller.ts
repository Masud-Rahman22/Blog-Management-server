import httpStatus from 'http-status'
import catchAsync from "../../utils/catchAsync"
import sendResponse from "../../utils/sendResponse"
import { TUser } from "./user.interface"
import { userServices } from "./user.service"


const createUser = catchAsync(async (req, res) => {
    const userInfo = req.body
  
    const userData: TUser = {
      ...userInfo
    }
  
    const result = await userServices.createUserIntoDb(userData)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User registered successfully',
      data: result,
    })
  })



  export const userControllers = {
    createUser
  }