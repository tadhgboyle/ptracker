# PTracker

## Organization
- Express server in the `backend` folder
  - Runs on port `9000`

- React app in the `frontend` folder
  - Runs on port `3000`

## Developing

- You need MySQL installed and running on your machine
  -  https://dev.mysql.com/downloads/installer/ (download the second option/the file thats bigger)
  -  create a .env file in the "./prisma" folder
    -   ![Screenshot 2022-01-29 211712](https://user-images.githubusercontent.com/77702776/151687680-267e03e0-e118-498e-91a5-fa4bb64c5506.png)
    -  and add your password after "root"
  -  ![Screenshot 2022-01-29 211150](https://user-images.githubusercontent.com/77702776/151687551-8560152e-aedc-4d8e-a3dc-5c9becf17037.png)
      -  By default it assumes that the user `root` has no password.
  - You should then seed the database with `npx primsa migrate reset` (from the `backend` folder)
  - If you see an error about google client id, follow this tutorial to create a google client id: https://www.balbooa.com/gridbox-documentation/how-to-get-google-client-id-and-client-secret
    -  add these urls once you are at the last page for signing up for a google client id
    -  ![Screenshot 2022-01-29 213601](https://user-images.githubusercontent.com/77702776/151688058-0192fa9c-9c0e-48da-a177-d9cec520a9cf.png)
    - then add your client id, client secret to the .env file you created earlier (you can get the format of the line from the .env.sample file (also put the COOKIE_KEY inside the .env file))
  - If you get this error,
  - ![Screenshot 2022-01-29 205601 (2)](https://user-images.githubusercontent.com/77702776/151693097-b9dc098e-88be-4c22-89b7-ece91616aad3.png)
    - Run the command "npm i -g nodemon"  

- Backend runs on port `9000`
  - Start with `npm run start` in a terminal window

- Frontend runs on port `3000`
  - Start with `npm run start` in a separate terminal window (they must be running at the same time)

- Navigate to `http://localhost:3000`
