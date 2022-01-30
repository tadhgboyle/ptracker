# PTracker

## Organization
- Express server in the `backend` folder
  - Runs on port `9000`

- React app in the `frontend` folder
  - Runs on port `3000`

## Developing

- You need MySQL installed and running on your machine
  - By default it assumes uer `root` and no password. You can change this by editing the `/backend/prisma/schema.prisma` file on line 10
  - You should then seed the database with `npx primsa migrate reset` (from the `backend` folder)

- Backend runs on port `9000`
  - Start with `npm run start` in a terminal window

- Frontend runs on port `3000`
  - Start with `npm run start` in a separate terminal window (they must be running at the same time)

- Navigate to `http://localhost:3000`
