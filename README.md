# PTracker

## :whale: Docker
- `docker-compose up --build`

## Developing

- You need MySQL installed and running on your machine
    - https://dev.mysql.com/downloads/installer/ (download the second option/the file thats bigger)
- create a .env file into the main "ptracker" directory
    - ![Screenshot 2022-01-31 231534](https://user-images.githubusercontent.com/77702776/151927088-a84384fb-cc0f-49e6-9d5c-21ac3fd64078.png)
    - and add your password after "root"
    - ![Screenshot 2022-01-29 211150](https://user-images.githubusercontent.com/77702776/151687551-8560152e-aedc-4d8e-a3dc-5c9becf17037.png)
        - By default it assumes that the user `root` has no password.
- You should then seed the database with `npx prisma migrate reset` (from the `backend` folder)
    - If you see an error about google client id, follow this tutorial to create a google client
      id: https://www.balbooa.com/gridbox-documentation/how-to-get-google-client-id-and-client-secret
        - add these urls once you are at the last page for signing up for a google client id
        - ![Screenshot 2022-01-31 210326](https://user-images.githubusercontent.com/77702776/151915311-1d54ac6b-aa47-46c0-90aa-f1a3962dafdc.png)
        - then add your client id, client secret to the .env file you created earlier (you can get the format of what u
          need to put from the .env.sample file (also put the COOKIE_KEY line inside the .env file))
- If you get this error,
    - ![Screenshot 2022-01-29 205601 (2)](https://user-images.githubusercontent.com/77702776/151693097-b9dc098e-88be-4c22-89b7-ece91616aad3.png)
    - Run the command "npm i -g nodemon"

- App runs on port `3000`
    - Start with `npm run dev` in a separate terminal window

- Navigate to `http://localhost:3000`

## Testing
- run "npm i mocha"
- You can test the app with `npm run test`
