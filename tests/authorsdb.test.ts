import { authorsDB } from '../src/db'
import { passwordHash, authorDataValidation } from '../src/utils'

describe('Authors database', () => {
  const name = 'Bob45'
  const pass = 'Abcde?123'
  let passHash = ''
  const invalidName = 'Bob\\'
  const invalidPass = 'Abcd123456'

  beforeAll(async () => {
    jest.useFakeTimers()
    passHash = await passwordHash({ password: pass })
  })

  it('should validate authors data', () => {
    expect(authorDataValidation({ author: name, password: pass })).toBeTruthy()
    expect(
      authorDataValidation({ author: invalidName, password: invalidPass })
    ).toBeFalsy()
  })

  it('should not get author', () => {
    const author = authorsDB.get(name)

    expect(author).toBe(false)
  })

  it('should add and get a new author', () => {
    const value = {
      author: name,
      avatar: 'http://example.com/img.png',
      passHash,
    }

    authorsDB.add(value)

    const { name: dbName, avatar, hash } = authorsDB.get(name, false)

    expect(dbName).toStrictEqual(name)
    expect(avatar).toStrictEqual(value.avatar)
    expect(hash).toStrictEqual(passHash)
  })

  it('should get authors', async () => {
    const password = 'Pussword1234_*'
    const value = {
      author: 'Alice',
      passHash: await passwordHash({ password }),
    }

    authorsDB.add(value)

    const authors = authorsDB.get('/', false)

    expect(authors[name].name).toBe(name)
    expect(authors[name].avatar).toBe('http://example.com/img.png')
    expect(authors[name].hash).toBe(passHash)

    expect(authors[value.author].name).toBe(value.author)
    expect(authors[value.author].name).toBe(value.author)
  })

  it('should delete author', () => {
    authorsDB.delete(name)

    const author = authorsDB.get(name)

    expect(author).toBeFalsy()
  })
})
