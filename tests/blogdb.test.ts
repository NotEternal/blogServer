import { blogDB } from '../src/db'

describe('Blog database', () => {
  const author = 'Bob45'
  const date = Date.now().toString()
  const post = {
    title: 'First post',
    description: 'post description',
    author: author,
    date,
    content: 'post content',
  }

  it('should validate a post', () => {
    expect(blogDB.validatePost(post)).toBeTruthy()
  })

  it('should not get a post', () => {
    expect(blogDB.get(`/${author}/${date}`)).toBeFalsy()
  })

  it('should add and get a new post', () => {
    blogDB.add({ path: `/${author}/${date}`, post })

    expect(JSON.stringify(blogDB.get(`/${author}/${date}`))).toStrictEqual(
      JSON.stringify(post)
    )
  })

  it('should delete a post', () => {
    expect(blogDB.delete({ path: `/${author}/${date}` })).toBeTruthy()
    expect(blogDB.get(`/${author}/${date}`)).toBeFalsy()
  })
})
