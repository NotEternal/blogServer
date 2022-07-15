import { join } from 'path'
import { JsonDB } from 'node-json-db'
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import { sendFeedback, writeData } from '../utils'
import { DB_ERROR } from '../constants'

export default class DB {
  protected db: any

  constructor(relatedDbPath: string) {
    this.db = new JsonDB(
      new Config(
        join(__dirname, relatedDbPath),
        false, // don't auto save after changes
        false, // compress JSON file
        '/' // hierarchy separator
      )
    )
  }

  async onError(place: string, date: string, error: any) {
    if (error?.message.match(DB_ERROR.dataPathIsNotValid)) return

    await writeData(
      join(__dirname, '../data/logs.txt'),
      JSON.stringify({ place, date, error: error?.message })
    )
    await sendFeedback(
      JSON.stringify({
        place,
        msg: error?.message,
      })
    )
  }
}
