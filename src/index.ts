import http from 'http'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { createTerminus } from '@godaddy/terminus'
import authors from './routes/authors'
import posts from './routes/posts'
import { ORIGIN } from './constants'

const PORT = process.env.PORT || 5000
const app = express()

app.disable('x-powered-by')
app.use(
  helmet({
    referrerPolicy: { policy: 'no-referrer' },
  })
)
app.use(express.json())
app.use(
  cors({
    origin: ORIGIN,
    // @todo filter it depending on .evn config
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
)
app.use(express.urlencoded({ extended: true }))
app.use('/posts', posts)
app.use('/authors', authors)

app.use((req, res, next) => {
  res.status(400).send('')
})
app.use((err: Error, req: any, res: any, next: any) => {
  console.error(err.stack)
  res.status(500).send(err?.message || '')
})

export const server = http.createServer(app)

async function onSignal() {
  // @todo start cleanup of resources
}

async function onHealthCheck() {
  return Promise.resolve()
}

const MS = 1_000
const TWENTY_SECONDS = MS * 20

createTerminus(server, {
  timeout: TWENTY_SECONDS,
  signal: 'SIGINT',
  healthChecks: { '/healthcheck': onHealthCheck },
  onSignal,
})

server.listen(PORT, () => console.log('Listening on ' + PORT))
