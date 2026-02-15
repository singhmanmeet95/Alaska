# Metro Lines API Documentation

Base URL: `http://localhost:3000`

## Authentication (`/api/auth`)

### Register

- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Body (JSON):**
  ```json
  {
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "about": "Commuter",
    "bio": "Daily traveler on the functionality line."
  }
  ```

### Login

- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Body (JSON):**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Returns JWT token. **Save this token** for authenticated requests.

### Get Profile

- **Method:** `GET`
- **URL:** `/api/auth/profile`
- **Headers:**
  - `Authorization`: `Bearer <YOUR_TOKEN>`

### Update Profile

- **Method:** `PUT`
- **URL:** `/api/auth/profile`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "name": "Johnathan Doe",
    "about": "Frequent Flyer",
    "bio": "Updated bio",
    "image": "http://example.com/new-profile.jpg",
    "images": [
      "http://example.com/gallery1.jpg",
      "http://example.com/gallery2.jpg"
    ]
  }
  ```

### Add Profile Image

- **Method:** `POST`
- **URL:** `/api/auth/profile/images`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "imageUrl": "http://example.com/gallery3.jpg"
  }
  ```

### Delete Profile Image

- **Method:** `DELETE`
- **URL:** `/api/auth/profile/images`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "imageUrl": "http://example.com/gallery3.jpg"
  }
  ```

### Change Password

- **Method:** `POST`
- **URL:** `/api/auth/change-password`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "currentPassword": "password123",
    "newPassword": "newpassword456"
  }
  ```

---

## Users (`/api/users`)

### Get All Users

- **Method:** `GET`
- **URL:** `/api/users`

### Get User by ID

- **Method:** `GET`
- **URL:** `/api/users/:id`

### Get User by Username

- **Method:** `GET`
- **URL:** `/api/users/username/:username`

---

## Trips (`/api/trips`)

### Create Trip

- **Method:** `POST`
- **URL:** `/api/trips`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "userId": "USER_ID_HERE",
    "startTime": "2023-10-27T08:30:00.000Z",
    "stationList": ["Station A", "Station B", "Station C"],
    "length": 3,
    "startStation": "Station A",
    "endStation": "Station C"
  }
  ```

### Get All Trips

- **Method:** `GET`
- **URL:** `/api/trips`

### Get Trip by ID

- **Method:** `GET`
- **URL:** `/api/trips/:id`

### Get Trips by Station

- **Method:** `GET`
- **URL:** `/api/trips/station/:stationName`

### Update Trip

- **Method:** `PUT`
- **URL:** `/api/trips/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "stationList": ["Station A", "Station B", "Station D"]
  }
  ```

### Delete Trip

- **Method:** `DELETE`
- **URL:** `/api/trips/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`

---

## Reviews (`/api/reviews`)

### Create Review

- **Method:** `POST`
- **URL:** `/api/reviews`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "revieweeId": "TARGET_USER_ID",
    "rating": 5,
    "comment": "Great travel companion!"
  }
  ```

### Get All Reviews

- **Method:** `GET`
- **URL:** `/api/reviews`

### Get Reviews Received by User

- **Method:** `GET`
- **URL:** `/api/reviews/received/:userId`

### Get Reviews Written by User

- **Method:** `GET`
- **URL:** `/api/reviews/written/:userId`

### Update Review

- **Method:** `PUT`
- **URL:** `/api/reviews/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "rating": 4,
    "comment": "Good, but was late."
  }
  ```

### Delete Review

- **Method:** `DELETE`
- **URL:** `/api/reviews/:id`
- **Headers:** `Authorization: Bearer <TOKEN>`

---

## Trip Matching / Utils (`/api/utils`)

### Match Trips (Custom Input)

This endpoint matches a provided path against all existing trips in the database to find overlaps. It returns the "Top K" candidates along with user details.

- **Method:** `POST`
- **URL:** `/api/utils/path/match_trips`
- **Body (JSON):**

  ```json
  {
    "stationList": ["Hauz Khas", "Green Park", "AIIMS"],
    "startTime": "2023-10-27T08:30:00.000Z",
    "k": 5
  }
  ```

  - `stationList`: Array of strings representing the station path.
  - `startTime`: (Optional) ISO timestamp to filter matches by time.
  - `k`: (Optional) Integery specifying how many top matches to return. Default is 10.

- **Response:**
  Returns a list of matching trips, including the `user` object for each match, sorted by the length of the overlapping path.

### Get Sorted Matches for Existing Trip

- **Method:** `GET`
- **URL:** `/api/utils/path/sorted_trips?id=EXISTING_TRIP_ID`

---

## Chats (HTTP) (`/api/chats`)

### Send Message (HTTP)

- **Method:** `POST`
- **URL:** `/api/chats`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "senderId": "YOUR_USER_ID",
    "receiverId": "TARGET_USER_ID",
    "message": "Hello there!"
  }
  ```

### Get Chats Between Users

- **Method:** `GET`
- **URL:** `/api/chats/between/:user1Id/:user2Id`
- **Headers:** `Authorization: Bearer <TOKEN>`

---

## Real-time Chat (Socket.IO)

**Connection URL:** `http://localhost:3000`

### Events

1.  **Join Room (`emit 'join_user'`)**
    - **Description:** Client MUST emit this event immediately after connection to receive private messages.
    - **Payload:** `userId` (string) - The ID of the currently logged-in user.
    - **Example:** `socket.emit("join_user", "user-uuid-123");`

2.  **Send Message (`emit 'send_message'`)**
    - **Description:** Send a message to another user.
    - **Payload:**
      ```json
      {
        "senderId": "sender-uuid-123",
        "receiverId": "receiver-uuid-456",
        "message": "Hello via Socket!"
      }
      ```

3.  **Receive Message (`on 'receive_message'`)**
    - **Description:** Listen for incoming messages in real-time.
    - **Payload (Response):** The full message object (including sender details).

4.  **Message Sent Confirmation (`on 'message_sent'`)**
    - **Description:** Verification that your message was saved and sent.
