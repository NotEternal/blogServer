import express from 'express'
import { authorsDB, blogDB, Post } from '../db'
import { verifyPassword } from '../utils'
import { STATUS } from '../constants'
import { processGetting } from './common'

const router = express.Router()

router.get('/all', (req, res) => {
  processGetting(res, req, blogDB.get('/'))
})

router.get('/:author', (req, res) => {
  const { author = '' } = req.params

  processGetting(res, req, blogDB.get(`/${author}`))
})

router.get('/:author/:date', (req, res) => {
  const { author = '', date = '' } = req.params

  processGetting(res, req, blogDB.get(`/${author}/${date}`))
})

router.post(
  '/',
  async (
    req: {
      body: { author: string; password: string; date: string; post: Post }
    },
    res
  ) => {
    const { author = '', date = '', password = '', post } = req.body
    const authorsHash = authorsDB.get(author)

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
      const success = blogDB.add({ path: `/${author}/${date}`, post })

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
      res.status(STATUS.unauthenticated).json({
        msg: 'Back off',
      })
    }
  }
)

router.delete('/:author/:date', async (req, res) => {
  const { author = '', date = '' } = req.params
  const { password = '' } = req.body
  const authorsHash = authorsDB.get(author)

  if (!authorsHash) {
    res.status(STATUS.unauthenticated).json({
      msg: 'Back off',
      body: req.body,
    })
    return
  }

  const validAuthor = await verifyPassword({
    password,
    hash: authorsHash,
  })

  if (validAuthor) {
    const success = blogDB.delete({ path: `/${author}/${date}` })

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
