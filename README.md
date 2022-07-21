# Blog - server

## Config .env

```
TELEGRAM_API=https://api.telegram.org/bot
BOT_KEY=
CHAT_ID=
BLOG_METHODS_DISABLED=[]
AUTHORS_METHODS_DISABLED=[]
```

---

## Data structure

**Author**:

```json
{
  "<authors name>": {
    "name": "",
    "hash": "",
    "avatar": ""
  }
}
```

**Post**:

```json
{
  "<authors name>": {
    "post date": {
      "title": "",
      "description": "",
      "author": "",
      "date": "",
      "content": ""
    }
  }
}
```

---

## API

### Authors

**GET**:

`/authors/all`: all authors data
`/authors/:author`: author data

**POST**:

`/authors`: create a new author

**DELETE**:

`/authors/:author`: delete an author

### Posts

**GET**:

`/posts/all`: all posts by author
`/posts/:author`: all authors posts
`/posts/:author/:date`: authors post for a specific date

**POST**:

`/posts`: create a new authors post

**DELETE**:

`/posts/:author/:date`: delete an author

---

## TODO

- [ ] TLS
- [ ] wipe all authors data on delete
- [ ] custom db file paths in parameters
- [ ] disable methods and endpoints depending on `.env` config
- [ ] allow only an unique nicknames
- [ ] "update password" route
- [x] avatar validation
- [ ] improve validation for all client values
- [ ] add salt in hash generation
- [ ] fix `argon2` work
- [ ] improve post content (for now it's only a string)
- [ ] option to select range of posts
- [ ] option to select range of posts by some parameters (sections, dates, etc.)
- [ ] option to select authors by some parameters
- [ ] server data filtration
