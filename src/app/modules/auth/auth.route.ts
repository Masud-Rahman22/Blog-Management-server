import express from 'express'
import { AuthControllers } from './auth.controller'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'
import { userControllers } from '../user/user.controller'
import { UserValidations } from '../user/user.validation'

const router = express.Router()

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthControllers.loginUser,
)
router.post(
  '/register',
  validateRequest(UserValidations.createUserValidationSchema),
  userControllers.createUser,
)

export const AuthRoutes = router