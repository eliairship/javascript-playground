# JS Playground 
## API Specification

### Endpoint
https://javascript-playground-5ccu.onrender.com

#### Auth
`POST /auth/signin`
Returns a `Set-Cookie` header with the session.

Request
```json
{
  "email": "some@email",
  "password": "password"
}
```

Response 200
```json
"success"
```
---
`POST /auth/signup`
Returns a `Set-Cookie` header with the session.

Request Body
```json
{
  "email": "some@email",
  "password": "password"
}
```

Response 200
```json
"success"
```
---
#### Protected

`GET /protected`
Return a user

Request Header
```
Cookie=auth_session=<SESSION_ID>; HttpOnly; Max-Age=2592000; Path=/; SameSite=Lax
```

Response 200
```json
  {
  "message": "Secret Value!",
  "session": {
    "id": "some-session-id",
    "userId": "some-user-id",
    "fresh": false,
    "expiresAt": "2024-04-20T21:58:21.000Z"
  },
  "user": {
    "id": "some-user-id"
  }
}
```

---
