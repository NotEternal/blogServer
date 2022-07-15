import express from 'express'
import { authorsDB } from '../db'
import { processGetting } from './common'
import { passwordHash, authorDataValidation, verifyPassword } from '../utils'
import { STATUS } from '../constants'

const router = express.Router()

router.get('/all', (req, res) => {
  processGetting(res, req, authorsDB.get('/'))
})

router.get('/:author', (req, res) => {
  const { author = '' } = req.params

  processGetting(res, req, authorsDB.get(author))
})

router.post(
  '/',
  async (
    req: { body: { author: string; password: string; avatar: string } },
    res,
    next
  ) => {
    const { author = '', password = '', avatar = '' } = req.body

    if (authorDataValidation(author, password)) {
      const authorsHash = authorsDB.hash(author, false)

      if (
        authorsHash &&
        !(await verifyPassword({
          password,
          hash: authorsHash,
        }))
      ) {
        res.status(STATUS.unauthenticated).json({
          msg: 'Back off',
        })
        return
      }

      const newHash = await passwordHash({ password })
      const success = authorsDB.add({ author, passHash: newHash, avatar })

      if (success) {
        res.status(STATUS.success).json({
          msg: 'Success',
        })
      } else {
        res.status(STATUS.serverError).json({
          msg: 'It is my problem',
        })
      }
    } else {
      res.status(STATUS.clientError).json({
        msg: 'Invalid',
      })
    }
  }
)

router.delete('/:author', async (req, res) => {
  const { author = '' } = req.params
  const { password = '' } = req.body
  const authorsHash = authorsDB.hash(author, false)

  if (!authorsHash) {
    res.status(STATUS.unauthenticated).json({
      msg: 'Back off',
    })
    return
  }

  const validAuthor = await verifyPassword({
    password,
    hash: authorsHash,
  })

  if (validAuthor) {
    const success = authorsDB.delete(author)

    if (success) {
      res.status(STATUS.success).json({
        msg: 'Success',
      })
    } else {
      res.status(STATUS.notFound).json({
        msg: 'You are searching for nothing',
      })
    }
  } else {
    res.status(STATUS.unauthenticated).json({
      msg: 'Back off',
    })
  }
})

export default router
