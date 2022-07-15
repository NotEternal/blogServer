import axios from 'axios'
import fs from 'fs'
import hasha from 'hasha'
import argon2 from 'argon2'
import {
  TELEGRAM_API,
  BOT_KEY,
  CHAT_ID,
  LOGS_FILE,
  ALGORITHM,
  USERNAME_REGEXP,
  PASSWORD_REGEXP,
} from '../constants'

export async function writeData(file: string, content: string, flag = 'a+') {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(file, content, { flag }, (error: any) => {
        return error ? reject(error) : resolve(true)
      })
    } catch (error) {
      console.warn('CANNOT SAVE')
      console.error(error)
      reject(error)
    }
  })
}

export async function readData(file: string) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(file)) return resolve(false)

      const rawData = fs.readFileSync(file)

      try {
        // @ts-ignore
        const data = JSON.parse(rawData)

        resolve(data)
      } catch (error) {
        resolve(false)
      }
    } catch (error) {
      console.warn('CANNOT READ')
      console.error(error)
      reject(error)
    }
  })
}

export async function timeout(ms: number) {
  return new Promise((res) => {
    setTimeout(() => res(true), ms)
  })
}

export async function sendFeedback(message: string) {
  if (!TELEGRAM_API || !BOT_KEY || !CHAT_ID) {
    return
  }

  try {
    const request = `${TELEGRAM_API}${BOT_KEY}/sendMessage?chat_id=${CHAT_ID}&text=${message}`
    const { status, data } = await axios.post(request)

    if (status !== 200) {
      await writeData(
        LOGS_FILE,
        JSON.stringify({
          type: 'ERROR',
          function: 'sendFeedback',
          reason: data?.description,
          error_code: data?.error_code,
          date: new Date(),
        }) + '\n'
      )
    }
  } catch (error: any) {
    console.error('Sending error', error.message)
    await writeData(
      LOGS_FILE,
      JSON.stringify({
        type: 'ERROR',
        function: 'sendFeedback',
        reason: error?.message,
        error_code: error?.code,
        date: new Date(),
      }) + '\n'
    )
  }
}

const DEFAULT_ALGORITHM = ALGORITHM.sha512

export async function passwordHash({
  password,
  algorithm = DEFAULT_ALGORITHM,
}: {
  password: string
  algorithm?: ALGORITHM
}): Promise<string> {
  if (!password) return ''

  try {
    switch (algorithm) {
      case ALGORITHM.argon2:
        return await argon2.hash(password, {
          type: argon2.argon2id,
          memoryCost: 2048,
          timeCost: 2,
          hashLength: 50,
        })
      case ALGORITHM.sha512:
        return await hasha(password, {
          encoding: 'hex',
          algorithm: 'sha512',
        })
      default:
        return ''
    }
  } catch (error: any) {
    console.error('Password verification', error.message)
    return ''
  }
}

export async function verifyPassword({
  password,
  hash: dbHash,
  algorithm = DEFAULT_ALGORITHM,
}: {
  password: string
  hash: string
  algorithm?: ALGORITHM
}): Promise<boolean> {
  try {
    switch (algorithm) {
      case ALGORITHM.argon2:
        return await argon2.verify(dbHash, password)
      case ALGORITHM.sha512:
        const hash = await passwordHash({ password })

        return hash === dbHash
      default:
        return false
    }
  } catch (error: any) {
    console.error('Password verification', error.message)
    return false
  }
}

export function authorDataValidation(author: string, password: string) {
  return Boolean(
    author.match(USERNAME_REGEXP) && password.match(PASSWORD_REGEXP)
  )
}
