import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import pino from 'pino-http'

import routers from './routers'

const app = express()

app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(pino())

app.use('/api', routers.root)
app.use('/api/users', routers.users)
app.use('/api/tokens', routers.tokens)
app.use('/api/verifications', routers.verifications)

export default app
