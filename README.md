# RehabAI Companion

This app now uses Firebase Authentication and Firestore for its backend data store.

## Environment Variables

Create a local `.env` file with these Firebase values:

```bash
VITE_FIREBASE_API_KEY=""
VITE_FIREBASE_AUTH_DOMAIN=""
VITE_FIREBASE_PROJECT_ID=""
VITE_FIREBASE_STORAGE_BUCKET=""
VITE_FIREBASE_MESSAGING_SENDER_ID=""
VITE_FIREBASE_APP_ID=""
```

## Firestore Collections

The frontend expects these collections:

`profiles`
- Document id: Firebase auth user id
- Fields: `user_id`, `full_name`, `role`, `hospital`, `department`, `phone`, `avatar_url`, `created_at`, `updated_at`

`patients`
- Document id: auto-generated
- Fields: `user_id`, `name`, `age`, `gender`, `diagnosis`, `affected_limb`, `notes`, `created_at`, `updated_at`

`sessions`
- Document id: auto-generated
- Fields: `user_id`, `patient_id`, `date`, `duration_seconds`, `dominant_emotion`, `avg_grip_force`, `status`, `emotion_log`, `robot_log`, `vitals`, `created_at`, `updated_at`

## Local Development

```bash
npm install
npm run dev
```

