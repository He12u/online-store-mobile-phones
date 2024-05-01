## List of Available Endpoints :

- 'POST /user/registration'
- 'POST /user/login'
- 'GET /public/products'
- 'GET /public/products/:id'

routes below need authentication :

- 'GET /user/profile'
- 'PUT /user/profile/update'
- 'PATCH /user/profile/image'
- 'POST /product/create'
- 'GET /product/lists'
- 'GET /product/:id'
- 'PUT /product/:id/update'

routes below need authorization :

&nbsp;

## 1. POST /user/registration

- Request body :

```json
{
  "email": "welcome1@example.com",
  "full_name": "welcome one",
  "password": "123456789"
}
```

_Response (201 - Created)_

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

## 2. POST /user/login

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

## 3. GET /user/profile

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

## 4. PUT /user/profile/update

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
  "message": "The token is invalid or ePATCHred"
}
```

## 5. PATCH /user/profile/image

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

## 8. GET /product/list

- Headers :

```json
{
  "Authorization": "Bearer <access_token>"
}
```

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

## 9. GET /product/:id

- Headers :

```json
{
  "Authorization": "Bearer <access_token>"
}
```

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

## 10. POST /product/create

- Headers :

```json
{
  "Authorization": "Bearer <access_token>"
}
```

- Request body :

```js
let { name, description, excerpt, price } = req.body;
let { id } = req.user;
```

```
file
string($binary)
```

_Response (201 - Created)_

```json
{
  "message": "Login Successfully",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndlbGNvbWUxQGV4YW1wbGUuY29tIiwicm9sZSI6ImNsaWVudCIsImV4cGlyYXRpb24iOjE3MTQ1MDQ5MzcsImlhdCI6MTcxNDQ2MTczN30.7YxcGa_tNS87Ft3XZdpff_lyLmZEOYaJzUEESWhBBLY"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Price must be a positive number"
}
```

## 11. PUT /product/:id/update

- Headers :

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Params_

```js
let { id } = req.params;
```

- Request body :

```js
let { name, description, excerpt, price } = req.body;
let { id } = req.user;
```

```
file
string($binary)
```

_Response (200 - Request Successfully)_

```json
{
  "message": "Product successfully updated",
  "data": {
    "name": "New mobile phones type",
    "description": "the one and only mobile phones type",
    "excerpt": "the one and only",
    "price": 900,
    "thumbnail": "https://res.cloudinary.com/diebcsgvf/image/upload/v1714566968/tht/urutan%20query.jpeg-4c978fe9-e95d-4285-9f89-b64ba898418e.jpg"
  }
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Price must be a positive number"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "The product was not found"
}
```

## 12. DELETE /product/:id/delete

- Headers :

```json
{
  "Authorization": "Bearer <access_token>"
}
```

_Params_

```js
let { id } = req.params;
```

_Response (200 - Request Successfully)_

```json
{
  "message": "The product has been successfully deleted"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "The product was not found"
}
```
