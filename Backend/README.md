# API Documentation

This document describes the `/users/register`, `/users/login`, `/users/profile`, and `/users/logout` endpoints used in the application.

---

## /users/register Endpoint

### Description

The `/users/register` endpoint is a **POST** endpoint used to register a new user. It accepts user details in JSON format, validates the input, hashes the password, creates the user in the database, and returns an authentication token along with the user details.

---

### Request

#### URL

- Replace `<PORT>` with the port your server is running on (default is `3000` if not specified).

#### Headers

- `Content-Type: application/json`

#### Body

The request body should be in JSON format with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "password123"
}
```

---

### Response

The response will be in JSON format with the following structure:

```json
{
  "token": "yourAuthTokenHere",
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

In case of validation errors, the response will include an `errors` array:

```json
{
  "errors": [
    // Array of validation error messages
  ]
}
```

In case of invalid email or password, the response will include the following structure:

```json
{
  "message": "Invalid email or password"
}
```

---

## /users/profile Endpoint

### Description

The `/users/profile` endpoint is a **GET** endpoint that returns the authenticated user's profile information. This endpoint requires authentication using a JWT token.

### Request

#### URL

```
GET http://localhost:<PORT>/users/profile
```

#### Headers

- `Authorization: Bearer <your-jwt-token>`
  or
- Cookie with `token=<your-jwt-token>`

### Response

#### Success Response (200 OK)

```json
{
  "user": {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "_id": "user-id-here"
  }
}
```

#### Error Response (401 Unauthorized)

```json
{
  "message": "Unauthorized"
}
```

---

## /users/logout Endpoint

### Description

The `/users/logout` endpoint is a **GET** endpoint that invalidates the current JWT token and logs out the user. This endpoint requires authentication using a JWT token.

### Request

#### URL

```
GET http://localhost:<PORT>/users/logout
```

#### Headers

- `Authorization: Bearer <your-jwt-token>`
  or
- Cookie with `token=<your-jwt-token>`

### Response

#### Success Response (200 OK)

```json
{
  "message": "Logged out successfully"
}
```

#### Error Responses

##### 401 Unauthorized

```json
{
  "message": "Unauthorized"
}
```

##### 400 Bad Request

```json
{
  "message": "Token is required"
}
```

##### 500 Internal Server Error

```json
{
  "message": "Failed to log out",
  "error": "Error message details"
}
```
