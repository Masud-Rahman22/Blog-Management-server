import { Types } from 'mongoose'
// import { Booking } from '../booking/booking.model'
import { TUser } from './user.interface'
import { User } from './user.model'



const createUserIntoDb = async (userData: TUser) => {
    const result = await User.create(userData)
    return result
  }


 
  export const userServices = {
    createUserIntoDb
  }