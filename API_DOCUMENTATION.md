# ApexServices API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained from `/api/auth/login` or `/api/auth/register` and expire after 7 days.

---

## Authentication Endpoints

### 1. Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "role": "customer",
  "category": "Plumbing",           // Required if role=provider
  "hourly_rate": 45,                // Required if role=provider
  "bio": "Professional plumber"     // Optional for provider
}
```

**Response (201):**
```json
{
  "message": "Registration successful.",
  "token": "abc123def456...",
  "user": {
    "id": 5,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "provider"
  }
}
```

**Errors:**
- `400` - Missing required fields or invalid role
- `400` - Email already registered

---

### 2. Login User

**POST** `/auth/login`

Authenticate user and get session token.

**Request Body:**
```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful.",
  "token": "xyz789uvw012...",
  "user": {
    "id": 2,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "customer"
  }
}
```

**Errors:**
- `400` - Email and password required
- `401` - Invalid email or password

---

### 3. Logout User

**POST** `/auth/logout`

Destroy session token.

**Headers:** Authorization required

**Response (200):**
```json
{
  "message": "Logout successful."
}
```

---

### 4. Get Current User Profile

**GET** `/auth/me`

Retrieve current authenticated user's profile details.

**Headers:** Authorization required

**Response (200):**
```json
{
  "user": {
    "id": 3,
    "name": "John Doe",
    "email": "john@plumbing.com",
    "role": "provider",
    "token": "abc123...",
    "providerDetails": {
      "category": "Plumbing",
      "bio": "Professional plumber with 10 years experience",
      "hourly_rate": 45,
      "rating": 4.8,
      "review_count": 15,
      "availability": {
        "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "hours": {"start": "09:00", "end": "17:00"}
      },
      "status": "approved"
    }
  }
}
```

**Errors:**
- `401` - Authentication token required or invalid

---

## Service Categories Endpoints

### 5. Get All Categories

**GET** `/categories`

List all available service categories.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Cleaning",
    "icon": "cleaning",
    "description": "Professional home, kitchen, and deep office cleaning services."
  },
  {
    "id": 2,
    "name": "Plumbing",
    "icon": "plumbing",
    "description": "Leak detection, pipe repairs, tap fittings, and drainage clearing."
  }
]
```

---

## Service Providers Endpoints

### 6. Get Active Providers

**GET** `/providers`

List active service providers with optional filters.

**Query Parameters:**
- `category` (optional): Filter by service category
- `search` (optional): Search by provider name or bio

**Example:**
```
GET /api/providers?category=Plumbing&search=john
```

**Response (200):**
```json
[
  {
    "id": 3,
    "name": "John Doe",
    "email": "john@plumbing.com",
    "category": "Plumbing",
    "bio": "Professional plumber with 10 years experience",
    "hourly_rate": 45,
    "rating": 4.8,
    "review_count": 12,
    "status": "approved"
  }
]
```

---

### 7. Get Provider Profile & Reviews

**GET** `/providers/:id`

Get detailed profile and reviews for a specific provider.

**Parameters:**
- `id`: Provider user ID

**Response (200):**
```json
{
  "provider": {
    "id": 3,
    "name": "John Doe",
    "email": "john@plumbing.com",
    "category": "Plumbing",
    "bio": "Professional plumber with 10 years experience",
    "hourly_rate": 45,
    "rating": 4.8,
    "review_count": 12,
    "availability": {
      "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "hours": {"start": "09:00", "end": "17:00"}
    },
    "status": "approved"
  },
  "reviews": [
    {
      "id": 1,
      "rating": 5,
      "comment": "Excellent service, very professional",
      "created_at": "2026-06-28T14:30:00Z",
      "customer_name": "Alice Johnson"
    }
  ]
}
```

**Errors:**
- `404` - Provider not found

---

### 8. Update Provider Profile

**PUT** `/providers/profile`

Update provider's profile (bio, hourly rate, availability).

**Headers:** Authorization required (provider role)

**Request Body:**
```json
{
  "bio": "Expert plumber with 15 years of experience",
  "hourly_rate": 50,
  "availability": {
    "days": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "hours": {"start": "08:00", "end": "18:00"}
  }
}
```

**Response (200):**
```json
{
  "message": "Profile updated successfully."
}
```

**Errors:**
- `401` - Authentication required
- `403` - Only providers can perform this action
- `400` - Hourly rate required

---

## Bookings Endpoints

### 9. Create Booking

**POST** `/bookings`

Create a new service booking.

**Headers:** Authorization required (customer role)

**Request Body:**
```json
{
  "provider_id": 3,
  "category": "Plumbing",
  "booking_date": "2026-07-10",
  "booking_time": "14:00",
  "duration_hours": 2,
  "address": "123 Main Street, Apartment 4B",
  "notes": "Fix leaking kitchen sink"
}
```

**Response (201):**
```json
{
  "message": "Booking created successfully.",
  "bookingId": 15,
  "total_price": 90
}
```

**Errors:**
- `401` - Authentication required
- `403` - Only customers can book services
- `400` - Missing required fields or provider unavailable

---

### 10. Get Bookings

**GET** `/bookings`

Retrieve bookings based on user role (customers see their bookings, providers see assigned bookings, admins see all).

**Headers:** Authorization required

**Response (200):**
```json
[
  {
    "id": 15,
    "customer_id": 2,
    "provider_id": 3,
    "category": "Plumbing",
    "booking_date": "2026-07-10",
    "booking_time": "14:00",
    "duration_hours": 2,
    "address": "123 Main Street, Apartment 4B",
    "status": "pending",
    "total_price": 90,
    "notes": "Fix leaking kitchen sink",
    "created_at": "2026-07-03T10:30:00Z",
    "provider_name": "John Doe",
    "provider_email": "john@plumbing.com"
  }
]
```

---

### 11. Update Booking Status

**PUT** `/bookings/:id/status`

Update booking status through its lifecycle.

**Headers:** Authorization required

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Valid Status Transitions:**
- `pending` → `accepted` (provider)
- `accepted` → `in_progress` (provider)
- `in_progress` → `completed` (provider)
- Any status → `cancelled` (customer before service starts, provider)

**Response (200):**
```json
{
  "message": "Booking status updated to accepted."
}
```

**Errors:**
- `404` - Booking not found
- `403` - Unauthorized for this booking
- `400` - Invalid status transition

---

## Reviews Endpoints

### 12. Submit Review

**POST** `/bookings/:id/review`

Submit a review for a completed booking.

**Headers:** Authorization required (customer role)

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service! John was very professional and efficient."
}
```

**Response (201):**
```json
{
  "message": "Review submitted successfully."
}
```

**Errors:**
- `401` - Authentication required
- `403` - Only customers can review
- `400` - Rating must be 1-5, or booking not completed yet
- `400` - Booking already reviewed

---

## Chat Messages Endpoints

### 13. Send Chat Message

**POST** `/messages`

Send a message to a booking participant.

**Headers:** Authorization required

**Request Body:**
```json
{
  "booking_id": 15,
  "message": "When will you arrive? I am home and waiting."
}
```

**Response (201):**
```json
{
  "id": 42,
  "sender_id": 2,
  "receiver_id": 3,
  "booking_id": 15,
  "message": "When will you arrive? I am home and waiting.",
  "created_at": "2026-07-10T13:45:00Z",
  "is_read": 0,
  "sender_name": "Alice Johnson"
}
```

**Errors:**
- `401` - Authentication required
- `404` - Booking not found
- `403` - Not a participant in this booking

---

### 14. Get Chat History

**GET** `/messages/:bookingId`

Retrieve all chat messages for a booking.

**Headers:** Authorization required

**Parameters:**
- `bookingId`: Booking ID

**Response (200):**
```json
[
  {
    "id": 41,
    "sender_id": 3,
    "receiver_id": 2,
    "booking_id": 15,
    "message": "I will be there in 15 minutes",
    "created_at": "2026-07-10T13:30:00Z",
    "is_read": 1,
    "sender_name": "John Doe"
  },
  {
    "id": 42,
    "sender_id": 2,
    "receiver_id": 3,
    "booking_id": 15,
    "message": "Thank you! I will be ready.",
    "created_at": "2026-07-10T13:45:00Z",
    "is_read": 0,
    "sender_name": "Alice Johnson"
  }
]
```

---

## Admin Endpoints

### 15. Get Dashboard Statistics

**GET** `/admin/stats`

Get system-wide statistics for admin dashboard.

**Headers:** Authorization required (admin role)

**Response (200):**
```json
{
  "stats": {
    "totalUsers": 45,
    "totalProviders": 12,
    "totalBookings": 234,
    "totalEarnings": 8640.50
  },
  "bookingsByStatus": [
    {"status": "completed", "count": 200},
    {"status": "in_progress", "count": 15},
    {"status": "pending", "count": 12},
    {"status": "cancelled", "count": 7}
  ],
  "categoryPopularity": [
    {"category": "Cleaning", "count": 85},
    {"category": "Plumbing", "count": 62},
    {"category": "Electrical", "count": 45}
  ]
}
```

**Errors:**
- `401` - Authentication required
- `403` - Admin access only

---

### 16. Get All Users

**GET** `/admin/users`

Get list of all users (non-admin) with details.

**Headers:** Authorization required (admin role)

**Response (200):**
```json
[
  {
    "id": 2,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "customer",
    "created_at": "2026-06-01T10:00:00Z",
    "category": null,
    "hourly_rate": null,
    "provider_status": null
  },
  {
    "id": 3,
    "name": "John Doe",
    "email": "john@plumbing.com",
    "role": "provider",
    "created_at": "2026-06-02T11:00:00Z",
    "category": "Plumbing",
    "hourly_rate": 45,
    "provider_status": "approved"
  }
]
```

---

### 17. Update Provider Status

**PUT** `/admin/users/:id/status`

Approve or suspend a service provider.

**Headers:** Authorization required (admin role)

**Parameters:**
- `id`: User ID of provider

**Request Body:**
```json
{
  "status": "approved"
}
```

**Valid Statuses:**
- `pending_approval` - Awaiting admin approval
- `approved` - Active provider
- `suspended` - Temporarily disabled

**Response (200):**
```json
{
  "message": "Provider status updated successfully."
}
```

---

### 18. Create Service Category

**POST** `/admin/categories`

Add a new service category.

**Headers:** Authorization required (admin role)

**Request Body:**
```json
{
  "name": "Carpentry",
  "icon": "carpentry",
  "description": "Professional woodworking and repairs"
}
```

**Response (201):**
```json
{
  "message": "Category created successfully."
}
```

**Errors:**
- `400` - Name and icon required
- `400` - Category name already exists

---

### 19. Delete Service Category

**DELETE** `/admin/categories/:id`

Remove a service category.

**Headers:** Authorization required (admin role)

**Parameters:**
- `id`: Category ID

**Response (200):**
```json
{
  "message": "Category deleted successfully."
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Description of the error"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (authorization failed)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limits & Performance

- No rate limiting currently implemented
- Database queries typically respond within 100ms
- Image/file uploads not supported (future enhancement)

---

## Testing

Use tools like **Postman** or **cURL** to test endpoints:

**Example cURL Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"alice123"}'
```

---

## API Versioning

Current version: **v1** (base version, no versioning prefix in URLs)

Future versions will use `/api/v2`, `/api/v3`, etc.

---

## Webhooks & Real-time Features

Currently not implemented. Planned for future release.

---

**API Documentation Last Updated:** 2026-07-03
**API Version:** 1.0.0

