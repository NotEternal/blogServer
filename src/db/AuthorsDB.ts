import DB from './DB'

type SecureAuthor = {
  name: string
  avatar?: string
}

type Author = SecureAuthor & {
  hash: string
}

class AuthorsDB extends DB {
  private secure: boolean = true

  constructor() {
    super('../data/authors.json')
  }

  filterAuthorData(authorData: Author): SecureAuthor {
    return {
      name: authorData.name,
      avatar: authorData.avatar,
    }
  }

  filterData(data: { [name: string]: Author }) {
    const filtered: { [name: string]: SecureAuthor } = {}

    Object.keys(data).forEach((name) => {
      filtered[name] = this.filterAuthorData(data[name])
    })

    return filtered
  }

  get(author: string, secure = this.secure): any | false {
    try {
      if (author === '/') {
        const data = this.db.getData('/')

        return secure ? this.filterData(data) : data
      } else {
        const data = this.db.getData(`/${author}`)

        return secure ? this.filterAuthorData(data) : data
      }
    } catch (error) {
      this.onError('AuthorsDB.get()', new Date().toUTCString(), error)
      return false
    }
  }

  add({
    author,
    passHash,
    avatar = '',
  }: {
    author: string
    passHash: string
    avatar?: string
  }): boolean {
    try {
      this.db.push(`/${author}`, {
        name: author,
        hash: passHash,
        avatar,
      })
      this.db.save()
      return true
    } catch (error) {
      this.onError('AuthorsDB.add()', new Date().toUTCString(), error)
      return false
    }
  }

  delete(author: string): boolean {
    try {
      if (author === '/') return false

      this.db.delete(`/${author}`)
      this.db.save()
      return true
    } catch (error) {
      this.onError('AuthorsDB.delete()', new Date().toUTCString(), error)
      return false
    }
  }

  hash(author: string, secure = this.secure): string {
    try {
      return secure ? '' : this.db.getData(`/${author}`).hash
    } catch (error) {
      this.onError('AuthorsDB.hash()', new Date().toUTCString(), error)
      return ''
    }
  }
}

export default new AuthorsDB()
