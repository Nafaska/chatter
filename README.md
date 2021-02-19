# `Chatter`
Web application for instant messaging. Deployed to Heroku: https://chatter-messaging-app.herokuapp.com/login 

## Technologies and libraries used: 

 - Server - Node, Express
 - WebSocket - [socket.io](https://socket.io)
 - Authentication - [JSON Web Token](https://jwt.io), [Google Auth](https://developers.google.com/identity/sign-in/web/sign-in)
 - Database - MongoDB, connected via [mongoose](https://mongoosejs.com)
 - Client - React, [Redux Toolkit](https://redux-toolkit.js.org)
 - Styles - [Tailwind CSS](https://tailwindcss.com) 
 - Testing - [Jest](https://jestjs.io), [React Testing Library](https://testing-library.com)
 - Toast messages - [React-Toastify](https://www.npmjs.com/package/react-toastify)
 - Emoji - [React Emoji Picker](https://www.npmjs.com/package/emoji-picker-react)

## Limitations: 
- Messages are currently stored on the client side with the limit of 15 messages per channel. The client store is cleaned up each time the page is refreshed. 
- Messages are not stored on the server or Database.

## Planned Improvements:
- Get user images from Google Account.
- Update channel details.
- Close channel panel once selected.
- Show online users.

## Screenshots:
### Mobile (iOS, Chrome):

## To Do
- Check if database URL is not availbale
