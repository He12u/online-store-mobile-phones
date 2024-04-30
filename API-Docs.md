## List of Available Endpoints :

- 'POST /registration'
- 'POST /login'

routes below need authentication :

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

## 3. POST /profile

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

## 4. POST /profile/update

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

## 5. POST /profile/image

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
