import { server } from '../src'

describe('Server', () => {
  const person1 = {
    author: 'John',
    password: 'Abcde#12345?',
    avatar: 'http://example.com/img.png',
  }
  const person2 = {
    author: 'Bob',
    password: '#12345?Abcde',
    avatar: 'http://example.com/different.png',
  }
  const PORT = 9001

  beforeAll(async () => {
    server.listen(PORT)
  })

  afterAll(async () => {
    server.close()
  })

  it('should add new authors', async () => {
    try {
      //
    } catch (error) {
      throw error
    }
  })
})
