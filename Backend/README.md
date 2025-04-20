# /users/register Endpoint Documentation

This document describes the `/users/register` endpoint used to create a new user in the application.

---

## Description

The `/users/register` endpoint is a **POST** endpoint used to register a new user. It accepts user details in JSON format, validates the input, hashes the password, creates the user in the database, and returns an authentication token along with the user details.

---

## Request

### URL

- Replace `<PORT>` with the port your server is running on (default is `3000` if not specified).

### Headers

- `Content-Type: application/json`

### Body

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

## Response

The response will be in JSON format with the following structure:

```json
{
  "token": "yourAuthTokenHere",
  "user": {
    "fullname":
        "firstname",
        "lastname"
    "email"
    "password"
  }
  "token" (String): JWT Token
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
