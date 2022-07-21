import dotenv from 'dotenv'

dotenv.config()

const {
  TELEGRAM_API: TG_API,
  BOT_KEY: BOT,
  CHAT_ID: CHAT,
  ORIGIN_SOURCE,
} = process.env

export const ORIGIN = ORIGIN_SOURCE || 'http://localhost:3000'
export const TELEGRAM_API = TG_API || ''
export const BOT_KEY = BOT || ''
export const CHAT_ID = CHAT || ''
export const LOGS_FILE = '../data/logs.txt'

export const STATUS = {
  unauthenticated: 401,
  success: 200,
  clientError: 400,
  serverError: 500,
  notFound: 404,
}

export enum ALGORITHM {
  argon2,
  sha512,
}

export const AVATAR_REGEXP =
  /^http(s)?\:\/\/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+\/[a-zA-Z0-9]+\.(png|jpeg|svg)$/
export const USERNAME_REGEXP = /^[a-zA-Z0-9\-_]{2,120}$/
export const PASSWORD_REGEXP =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\-+!@?#_$%^&*]).{8,}$/

export const DB_ERROR = {
  dataPathIsNotValid: "Can't find dataPath",
}
