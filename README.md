# Backend API

Node.js Express backend with a standard layered folder structure and Cloudinary uploads.

## Folder structure

```text
backend-api/
├── src/
│   ├── config/          # env, database, Cloudinary
│   ├── constants/       # Shared status codes and messages
│   ├── controllers/     # Request handlers (thin layer)
│   ├── middlewares/     # Auth, validation, upload, errors, 404
│   ├── models/          # Data access
│   ├── routes/v1/       # Versioned API routes
│   ├── services/        # Business logic
│   ├── utils/           # ApiError, ApiResponse helpers
│   ├── validators/      # Request validation rules
│   ├── app.js           # Express app factory
│   └── server.js        # Process entry point
├── tests/
├── .env.example
├── package.json
└── README.md
```

Request flow: **Route → Validator → Controller → Service → Model**

## Setup

```bash
cd backend-api
npm install
cp .env.example .env
npm run dev
```

## MongoDB Atlas + Compass (get the URL)

Compass does not host the database. Create a free cluster on Atlas, then paste the URL into Compass and this project.

1. In Compass, click **CREATE FREE CLUSTER** (or open [cloud.mongodb.com](https://cloud.mongodb.com)).
2. Sign up / log in → **Build a Database** → choose **M0 Free** → create cluster.
3. Create a database user: **Database Access** → **Add New Database User** → username + password (save the password).
4. Allow network: **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) for local testing.
5. Get the URL: cluster **Connect** → **Drivers** (or **Compass**) → copy the string:

```text
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/backend-api?retryWrites=true&w=majority
```

Replace `USERNAME` and `PASSWORD` with your Atlas user. Keep `/backend-api` as the database name (created automatically on first write).

6. In Compass: **+ Add new connection** → paste the same URL → **Connect**.
7. After connect: **Create Database** → Database name `backend-api`, Collection name `users` (optional; Mongoose also creates this).

8. Paste the URL into project `.env`:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/backend-api?retryWrites=true&w=majority
```

## Cloudinary requirements (fill in `.env`)

Get these from [Cloudinary Console](https://console.cloudinary.com):

| Field | Env key | Example | Required |
|-------|---------|---------|----------|
| Cloud name | `CLOUDINARY_CLOUD_NAME` | `dxxxxxabc` | Yes |
| API key | `CLOUDINARY_API_KEY` | `123456789012345` | Yes |
| API secret | `CLOUDINARY_API_SECRET` | `AbCdEfGhIjKlMnOp` | Yes |
| Upload folder | `CLOUDINARY_FOLDER` | `backend-api` | No (default: `backend-api`) |

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=backend-api
```

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm start`    | Start the API            |
| `npm run dev`  | Start with auto-reload   |
| `npm test`     | Run tests                |

## Endpoints

| Method | Path                    | Description                          |
|--------|-------------------------|--------------------------------------|
| GET    | `/api/v1/users`         | Get current user (Bearer token)      |
| POST   | `/api/v1/uploads`       | Upload image                         |
| DELETE | `/api/v1/uploads`       | Delete image                         |

### Upload image

Form field name must be `file`. Optional body field: `folder`.

```bash
curl -X POST http://localhost:3000/api/v1/uploads \
  -F "file=@/path/to/image.jpg" \
  -F "folder=backend-api/profiles"
```

### Delete image

```bash
curl -X DELETE http://localhost:3000/api/v1/uploads \
  -H "Content-Type: application/json" \
  -d '{"publicId":"backend-api/abc123"}'
```

### Get current user

```bash
curl http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Users are stored in MongoDB. Set `MONGODB_URI` in `.env` before starting the server.
# homehub_backend
