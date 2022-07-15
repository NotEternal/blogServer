import DB from './DB'

export interface Post {
  title: string
  description: string
  author: string
  date: string
  //@todo not just a string
  content: string
}

class BlogDB extends DB {
  constructor() {
    super('../data/posts.json')
  }

  get(path: string): any | false {
    try {
      return this.db.getData(path)
    } catch (error) {
      this.onError('BlogDB.get()', new Date().toUTCString(), error)
      return false
    }
  }

  add({ path, post }: { path: string; post: Post }): boolean {
    try {
      if (this.validatePost(post)) {
        this.db.push(path, post)
        this.db.save()
        return true
      } else {
        return false
      }
    } catch (error) {
      this.onError('BlogDB.add()', new Date().toUTCString(), error)
      return false
    }
  }

  delete({ path }: { path: string }): boolean {
    try {
      this.db.delete(path)
      this.db.save()
      return true
    } catch (error) {
      this.onError('BlogDB.delete()', new Date().toUTCString(), error)
      return false
    }
  }

  validatePost(post: Post): boolean {
    if (
      !post?.author ||
      !post?.date ||
      !post?.title ||
      !post?.description ||
      !post?.content
    ) {
      return false
    }

    return true
  }
}

export default new BlogDB()
