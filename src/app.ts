import express, { Application, Request, Response } from 'express'
import cors from 'cors'
import router from './app/routes'
import globalErrorHandler from './app/middlewares/globalErrorhandle'
import notFound from './app/middlewares/notFound'



const app: Application = express()

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: [
      'http://localhost:3000',
    ], // Allow your frontend URL
    credentials: true, // Allow credentials to be included
  }),
)

// application routes
app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Blog Managment Running!')
})

//Not Found
app.use('*', notFound)

app.use(globalErrorHandler)



export default app