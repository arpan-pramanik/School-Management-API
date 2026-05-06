# School Management API

A set of Node.js APIs using the Express.js framework and MySQL to manage school data.
It allows users to add new schools and retrieve a list of schools sorted by proximity to a user-specified location.

## Features
- **Add School:** Validates and inserts a new school with geographic coordinates.
- **List Schools:** Fetches schools and sorts them by geographic distance (Haversine formula evaluated in SQL) from the provided coordinates.

## Technologies
- Node.js & Express.js
- MySQL & `mysql2` package
- Joi (Input Validation)
- Cors & Dotenv

---

## How to Use

The API is live and publicly accessible. You can start making requests immediately.

**Base URL:**
```
https://educase-two-omega.vercel.app
```

### Add a New School

**Endpoint:** `POST /api/addSchool`

Send a JSON body with the school's details.

**Request:**
```bash
curl -X POST https://educase-two-omega.vercel.app/api/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Springfield Elementary",
    "address": "123 Main Street, Springfield",
    "latitude": 39.7817,
    "longitude": -89.6501
  }'
```

**Success Response (201):**
```json
{
  "message": "School added successfully",
  "schoolId": 1,
  "data": {
    "name": "Springfield Elementary",
    "address": "123 Main Street, Springfield",
    "latitude": 39.7817,
    "longitude": -89.6501
  }
}
```

**Validation Error Response (400):**
```json
{
  "error": "\"name\" is required"
}
```

| Field       | Type   | Required | Rules                           |
|-------------|--------|----------|---------------------------------|
| `name`      | string | Yes      | Must be a non-empty string      |
| `address`   | string | Yes      | Must be a non-empty string      |
| `latitude`  | number | Yes      | Must be between -90 and 90      |
| `longitude` | number | Yes      | Must be between -180 and 180    |

### List Schools Sorted by Proximity

**Endpoint:** `GET /api/listSchools`

Pass the user's coordinates as query parameters. The API returns all schools sorted by distance (nearest first), calculated using the Haversine formula.

**Request:**
```bash
curl "https://educase-two-omega.vercel.app/api/listSchools?latitude=19.0760&longitude=72.8777"
```

**Success Response (200):**
```json
{
  "message": "Schools fetched successfully",
  "count": 4,
  "data": [
    {
      "id": 3,
      "name": "Kendriya Vidyalaya",
      "address": "IIT Campus, Powai, Mumbai",
      "latitude": 19.1334,
      "longitude": 72.9133,
      "distance": 7.39
    },
    {
      "id": 2,
      "name": "St. Xaviers School",
      "address": "Fort, Mumbai, Maharashtra",
      "latitude": 18.9388,
      "longitude": 72.8354,
      "distance": 15.89
    },
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Sector 24, Mathura Road, New Delhi",
      "latitude": 28.5355,
      "longitude": 77.391,
      "distance": 1147.36
    }
  ]
}
```

| Parameter   | Type   | Required | Rules                           |
|-------------|--------|----------|---------------------------------|
| `latitude`  | number | Yes      | Must be between -90 and 90      |
| `longitude` | number | Yes      | Must be between -180 and 180    |

The `distance` field in the response is in **kilometers**.

### Postman Collection

A ready-to-use Postman collection is included in the repository at `docs/postman_collection.json`.

1. Open Postman.
2. Click **Import** and select the `postman_collection.json` file.
3. The collection is pre-configured with the live API base URL. You can start testing immediately.

---

## Host It Yourself

Follow the steps below to run your own instance of this API.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later)
- A MySQL database (local or remote)

### 1. Clone the Repository
```bash
git clone https://github.com/arpan-pramanik/School-Management-API.git
cd School-Management-API
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root (you can copy the example file):
```bash
cp .env.example .env
```

Edit the `.env` file with your MySQL database credentials:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=school_db
DB_SSL=false
DB_CA_CERT=
```

If your database requires SSL (e.g., a cloud-hosted MySQL like Aiven), set `DB_SSL=true` and provide the CA certificate either as an inline string in `DB_CA_CERT` or by placing a `ca.pem` file inside a `certs/` directory at the project root.

### 4. Initialize the Database
This script connects to your MySQL server and creates the `schools` table automatically:
```bash
node scripts/initDB.js
```

You should see:
```
Connected to database 'school_db'.
Table 'schools' created or already exists.
Database initialization completed successfully.
```

### 5. Start the Server
**Development mode** (auto-restarts on file changes):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: `3000`).

### 6. Deploy to Vercel (Optional)

This project includes a `vercel.json` configuration file for seamless deployment to Vercel as a serverless function.

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Link and deploy:
   ```bash
   vercel --prod
   ```

3. Add your environment variables on the Vercel dashboard under **Project Settings > Environment Variables**:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `DB_SSL` (set to `true` for cloud databases)
   - `DB_CA_CERT` (paste the full CA certificate content if SSL is required)

4. Redeploy after adding the environment variables for them to take effect.

> **Note:** Vercel is a serverless platform and does not host databases. You will need a remote MySQL provider. Free tier options include [Aiven](https://aiven.io/mysql), [TiDB Serverless](https://en.pingcap.com/tidb-serverless/), and [Railway](https://railway.app/).

---

## Project Structure

```
.
├── config/
│   └── db.js                  # MySQL connection pool with SSL support
├── controllers/
│   └── school.controller.js   # Request handlers and input validation
├── models/
│   └── school.model.js        # Database queries (Haversine formula)
├── routes/
│   └── school.routes.js       # API route definitions
├── scripts/
│   └── initDB.js              # Database initialization script
├── docs/
│   └── postman_collection.json # Postman collection for API testing
├── index.js                   # Express app entry point
├── vercel.json                # Vercel deployment configuration
├── package.json
└── .env.example               # Template for environment variables
```

## License

This project is licensed under the [MIT License](LICENSE).
