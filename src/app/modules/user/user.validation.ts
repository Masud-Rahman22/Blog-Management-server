import { z } from 'zod'

const createUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be a string',
      })
      .min(1, 'Name is required'),
    email: z.string({
      invalid_type_error: 'Email must be a string',
    }),
    password: z
      .string({
        invalid_type_error: 'Password must be a string',
      })
      .min(6, 'Password must be at least 6 characters')
      .max(20, 'Password cannot exceed 20 characters'),
    role: z
      .enum(['admin', 'user'], {
        invalid_type_error: 'Role must be either "admin" or "user"',
      })
      .default('user'),
  }),
})


  
  export const UserValidations = {
    createUserValidationSchema
  }