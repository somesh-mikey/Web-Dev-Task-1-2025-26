# API Documentation

This document describes the `/users/register`, `/users/login`, `/users/profile`, `/users/logout`, `/captains/register`, and `/rides/get-fare` endpoints used in the application.

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
    // List of validation error messages
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

---

## /captains/register Endpoint

### Description

The `/captains/register` endpoint is a **POST** endpoint used to register a new captain. It accepts captain details in JSON format, validates the input, hashes the password, creates the captain in the database, and returns an authentication token along with the captain details.

> This endpoint is implemented in [`routes/captain.routes.js`](c:\Users\Somesh Das\Documents\Frontend Batch\Projects\Uber Video\Backend\routes\captain.routes.js) and signed using methods from [`models/captain.model.js`](c:\Users\Somesh Das\Documents\Frontend Batch\Projects\Uber Video\Backend\models\captain.model.js) after processing by [`services/captain.service.js`](c:\Users\Somesh Das\Documents\Frontend Batch\Projects\Uber Video\Backend\services\captain.service.js).

### Request

#### URL

```
POST http://localhost:<PORT>/captains/register
```

#### Headers

- `Content-Type: application/json`

#### Body

The request body should include the following fields:

- `fullname`: An object containing:
  - `firstname` (string, at least 3 characters)
  - `lastname` (string)
- `email`: A valid email address.
- `password`: A string with a minimum of 6 characters.
- `vehicle`: An object containing:
  - `color` (string, at least 3 characters)
  - `plate` (string, at least 3 characters)
  - `capacity` (number)
  - `vehicleType` (string, at least 3 characters)

Example body:

```json
{
  "fullname": {
    "firstname": "Alice",
    "lastname": "Smith"
  },
  "email": "alice.smith@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "XYZ123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

---

### Response

The response will be in JSON format with the following structure:

```json
{
  "token": "yourAuthTokenHere",
  "captain": {
    "fullname": {
      "firstname": "Alice",
      "lastname": "Smith"
    },
    "email": "alice.smith@example.com"
    // other captain details
  }
}
```

In case of validation errors, the response will include an `errors` array:

```json
{
  "errors": [
    // List of validation error messages
  ]
}
```

In case of invalid email or password, the response will include the following structure:

```json
{
  "message": "Invalid email or password"
}
```

In case the captain already exists, the response will include the following structure:

```json
{
  "message": "Captain already exists"
}
```

---

## /rides/get-fare Endpoint

### Description

The `/rides/get-fare` endpoint is a **GET** endpoint that calculates and returns the estimated fare for a ride based on the pickup location, destination, and vehicle type. This endpoint requires authentication using a JWT token.

---

### Request

#### URL

```
GET http://localhost:<PORT>/rides/get-fare?pickup=<pickup>&destination=<destination>&vehicleType=<vehicleType>
```

#### Headers

- `Authorization: Bearer <your-jwt-token>`
  or
- Cookie with `token=<your-jwt-token>`

#### Query Parameters

- `pickup`: The pickup location (string, required)
- `destination`: The destination location (string, required)
- `vehicleType`: The type of vehicle (`car`, `motorcycle`, or `three-wheeler`, required)

---

### Response

#### Success Response (200 OK)

```json
{
  "fare": 193
}
```

#### Error Responses

- **422 Unprocessable Entity**: Validation errors in the query parameters.
- **500 Internal Server Error**: If there is a server error calculating the fare.

```json
{
  "errors": [
    // List of validation error messages
  ]
}
```

```json
{
  "message": "Internal server error",
  "error": "Error message details"
}
```
