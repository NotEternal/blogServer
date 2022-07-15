import { passwordHash, verifyPassword } from '../src/utils'

describe('Password and hash', () => {
  const dummyPass = '12345'
  const dummyHash =
    '3627909a29c31381a071ec27f7c9ca97726182aed29a7ddd2e54353322cfb30abb9e3a6df2ac2c20fe23436311d678564d0c8d305930575f60e2d3d048184d79'

  it('should calculate hash correctly', async () => {
    const emptyHash = await passwordHash({ password: '' })

    expect(emptyHash).toEqual('')

    const hash = await passwordHash({ password: dummyPass })
    console.log('🚀 ~ file: password.test.ts ~ line 14 ~ it ~ hash', hash)

    expect(hash).toEqual(dummyHash)
  })

  it('should validate password', async () => {
    const result = await verifyPassword({
      password: dummyPass,
      hash: dummyHash,
    })

    expect(result).toBe(true)
  })
})
