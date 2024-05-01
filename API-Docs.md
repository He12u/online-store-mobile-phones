## List of Available Endpoints :

- 'POST /registration'
- 'POST /login'
- 'GET /public/products'
- 'GET /public/products/:id'

routes below need authentication :

- 'GET /profile'
- 'PUT /profile/update'
- 'PUT /profile/image'

routes below need authorization :

&nbsp;

## 1. POST /registration

- Request body :

```json
{
  "email": "welcome1@example.com",
  "full_name": "welcome one",
  "password": "123456789"
}
```

_Response (200 - Request Successfully)_

```json
{
  "message": "Registration Successfully"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "The email is not in the correct format"
}
```

```json
{
  "message": "The email is already registered"
}
```

```json
{
  "message": "The minimum password length is 8 characters"
}
```

## 2. POST /login

- Request body :

```json
{
  "email": "welcome1@example.com",
  "password": "123456789"
}
```

_Response (200 - Request Successfully)_

```json
{
  "message": "Login Successfully",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndlbGNvbWUxQGV4YW1wbGUuY29tIiwicm9sZSI6ImNsaWVudCIsImV4cGlyYXRpb24iOjE3MTQ1MDQ5MzcsImlhdCI6MTcxNDQ2MTczN30.7YxcGa_tNS87Ft3XZdpff_lyLmZEOYaJzUEESWhBBLY"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "The email is not in the correct format"
}
```

```json
{
  "message": "The email and password cannot be empty"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "The email or password is incorrect"
}
```

## 3. GET /profile

- Headers :

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Response (200 - Request Successfully)_

```json
{
  "message": "Successfully",
  "data": {
    "email": "welcome1@example.com",
    "full_name": "welcome one",
    "profile_image": null
  }
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "The token is invalid or expired"
}
```

## 4. PUT /profile/update

- Headers :

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- Request body :

```json
{
  "email": "welcome1@example.com",
  "password": "123456789"
}
```

_Response (200 - Request Successfully)_

```json
{
  "message": "Profile successfully updated",
  "data": {
    "email": "welcome1@example.com",
    "full_name": "welcome satu",
    "profile_image": null
  }
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "The token is invalid or expired"
}
```

## 5. PUT /profile/image

- Headers :

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- Request body :

```
file
string($binary)
```

_Response (200 - Request Successfully)_

```json
{
  "message": "Profile image successfully changed",
  "data": {
    "email": "welcome1@example.com",
    "full_name": "welcome satu",
    "profile_image": "https://res.cloudinary.com/diebcsgvf/image/upload/v1714473314/tht/urutan%20query.jpeg-2557eee3-ad6d-42a8-9416-fc436fc2e9c8.jpg"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "The image cannot be empty or is in the wrong file format"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "The token is invalid or expired"
}
```

## 6. GET /public/products

- Request query :

_Query_

```js
{ sort, search, page } = req.query
```

_Response (200 - Request Successfully)_

```json
{
  "total": 1,
  "size": 10,
  "totalPage": 1,
  "currentPage": 1,
  "data": [
    {
      "id": 15,
      "name": "Samsung Galaxy A12",
      "description": "Entry-level phone with a modern design",
      "excerpt": "Modern design in an affordable entry-level device",
      "price": 180,
      "thumbnail": "a12_thumbnail.jpg",
      "authorId": 1,
      "createdAt": "2024-04-30T06:42:15.685Z",
      "updatedAt": "2024-04-30T06:42:15.685Z"
    }
  ]
}
```

## 7. GET /public/products/:id

_Params_

```js
let { id } = req.params;
```

_Response (200 - Request Successfully)_

```json
{
  "id": 1,
  "name": "Samsung Galaxy S21",
  "description": "Flagship smartphone with powerful features",
  "excerpt": "Powerful flagship device with top-notch features",
  "price": 800,
  "thumbnail": "s21_thumbnail.jpg",
  "authorId": 1,
  "createdAt": "2024-04-30T06:42:15.685Z",
  "updatedAt": "2024-04-30T06:42:15.685Z"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "The product was not found"
}
```
