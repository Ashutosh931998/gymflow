# MongoDB Atlas Schema - Gym Flow

This document defines the MongoDB collections and schemas required to migrate the **Gym Flow** application from LocalStorage to a cloud-hosted MongoDB Atlas database.

## 1. Database Structure
We recommend a single database (e.g., `gym_flow_db`) with the following collections.

### Collection: `gyms`
Stores global gym settings and metadata.
```json
{
  "_id": "ObjectId",
  "name": "String (Unique)",
  "ownerEmail": "String",
  "createdAt": "Date",
  "permissions": {
    "trainer": { "pages": ["Array"], "actions": ["Array"] },
    "receptionist": { "pages": ["Array"], "actions": ["Array"] }
  }
}
```

### Collection: `members`
```json
{
  "_id": "ObjectId",
  "gymId": "ObjectId (Ref: gyms)",
  "name": "String",
  "email": "String",
  "phone": "String",
  "planId": "String",
  "status": "String (active | inactive | pending)",
  "joinDate": "Date",
  "customId": "String (Optional)"
}
```

### Collection: `staff`
```json
{
  "_id": "ObjectId",
  "gymId": "ObjectId (Ref: gyms)",
  "name": "String",
  "email": "String (Unique)",
  "role": "String (admin | trainer | receptionist)",
  "passwordHash": "String"
}
```

### Collection: `plans`
```json
{
  "_id": "ObjectId",
  "gymId": "ObjectId (Ref: gyms)",
  "name": "String",
  "price": "Number",
  "duration": "String",
  "features": ["String"]
}
```

### Collection: `payments`
```json
{
  "_id": "ObjectId",
  "gymId": "ObjectId (Ref: gyms)",
  "memberId": "ObjectId (Ref: members)",
  "memberName": "String",
  "amount": "Number",
  "date": "Date",
  "method": "String (Cash | Card | UPI)",
  "status": "String (Completed | Pending)"
}
```

### Collection: `attendance`
```json
{
  "_id": "ObjectId",
  "gymId": "ObjectId (Ref: gyms)",
  "memberId": "ObjectId (Ref: members)",
  "memberName": "String",
  "date": "String (YYYY-MM-DD)",
  "checkInTime": "Date",
  "checkOutTime": "Date (Optional)"
}
```

## 2. Flow of Integration (Upload)

To connect your React app to MongoDB Atlas, follow this flow:

### Step 1: Set Up MongoDB Atlas
1. Create a free cluster at [mongodb.com](https://www.mongodb.com/cloud/atlas).
2. Create a Database User (Username/Password).
3. Whitelist your IP address (or `0.0.0.0/0` for development).
4. Copy your **Connection String** (SRV).

### Step 2: Create a Backend (Express.js)
Since MongoDB cannot be called directly from the browser for security reasons, you need a small server:
1. Initialize a Node.js project: `npm init -y`.
2. Install dependencies: `npm install express mongoose dotenv cors`.
3. Create a `server.js` and connect using Mongoose:
   ```javascript
   mongoose.connect(process.env.MONGODB_URI);
   ```

### Step 3: Create API Endpoints
Build REST API routes for each collection:
- `GET /api/members` -> Fetch all members.
- `POST /api/members` -> Add a new member.
- `PUT /api/members/:id` -> Update member details.

### Step 4: Update Frontend (React)
Replace the current `localStorage` logic in `src/App.tsx` with `fetch` or `axios` calls to your new backend:
```javascript
// Example: Fetching members from MongoDB via your API
const fetchMembers = async () => {
  const res = await fetch('https://your-api.com/api/members');
  const data = await res.json();
  setMembers(data);
};
```

### Step 5: Data Migration (Initial Upload)
To move your existing LocalStorage data to MongoDB:
1. Export your LocalStorage data as a JSON file.
2. Use **MongoDB Compass** (Desktop App) or the **Atlas "Import Data"** tool.
3. Upload the JSON file into the corresponding collections.
