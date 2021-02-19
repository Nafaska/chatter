# `Chatter`
Web application for instant messaging. Deployed to Heroku: https://chatter-messaging-app.herokuapp.com

## Technologies and libraries used: 

 - Server - [Node](https://nodejs.org/), [Express](https://expressjs.com)
 - WebSocket - [socket.io](https://socket.io)
 - Authentication - [JSON Web Token](https://jwt.io), [Google Auth](https://developers.google.com/identity/sign-in/web/sign-in)
 - Database - [MongoDB](https://www.mongodb.com), connected via [mongoose](https://mongoosejs.com)
 - Client Framework - [React](https://reactjs.org), [Redux Toolkit](https://redux-toolkit.js.org)
 - Styles - [Tailwind CSS](https://tailwindcss.com) 
 - Testing - [Jest](https://jestjs.io), [React Testing Library](https://testing-library.com)
 - Toast messages - [React-Toastify](https://www.npmjs.com/package/react-toastify)
 - Emoji - [React Emoji Picker](https://www.npmjs.com/package/emoji-picker-react)

## Limitations: 
- Messages are currently stored on the client side with the limit of 15 messages per channel. The client store is cleaned up each time the page is refreshed. 
- Messages are not stored on the server or database.

## Planned Improvements:
- Get user images from Google Account.
- Update channel details.
- Close channel panel once selected.
- Show online users.

## GIFs:

## Screenshots:

### Desktop (macOS, Chrome):

<p float="left">
  <img src="./docs/ReadmeImages/Desktop/LoginPage.png" width="470" title="Login Page"/>
  <img src="./docs/ReadmeImages/Desktop/RegistrationPage.png" width="470" title="Registration Page"/> 
</p>
<p float="left">
  <img src="./docs/ReadmeImages/Desktop/BurgerMenu.png" width="470" title="Channels List">
  <img src="./docs/ReadmeImages/Desktop/ChatPage.png" width="470" title="Chat Page">
</p>
<p float="left">
  <img src="./docs/ReadmeImages/Desktop/ChannelsPage.png" width="470" title="Channels Page">
  <img src="./docs/ReadmeImages/Desktop/AdminPanel.png" width="470" title="Admin Panel">
</p>
<p float="left">
  <img src="./docs/ReadmeImages/Desktop/ToastError.png" width="470" title="Toast Error">
  <img src="./docs/ReadmeImages/Desktop/ModalWindow.png" width="470" title="Modal Window">
</p>

### Mobile (iOS, Chrome):
<p float="left">
  <img src="./docs/ReadmeImages/Mobile/LoginPage.jpg" width="310" title="Login Page"/>
  <img src="./docs/ReadmeImages/Mobile/RegistrationPage.jpg" width="310" title="Registration Page"/> 
  <img src="./docs/ReadmeImages/Mobile/ChannelsPage.jpg" width="310" title="Channels Page"/> 
</p>
<p float="left">
  <img src="./docs/ReadmeImages/Mobile/ChatPage.jpg" width="310" title="Chat Page">
  <img src="./docs/ReadmeImages/Mobile/ChannelList.jpg" width="310" title="Channels List">
  <img src="./docs/ReadmeImages/Mobile/AdminPanel.jpg" width="310" title="Admin Panel">
</p>
<p float="left">
  <img src="./docs/ReadmeImages/Mobile/ErrorToast.jpg" width="310" title="Toast Error">
  <img src="./docs/ReadmeImages/Mobile/ModalWindow.jpg" width="310" title="Modal Window">
</p>
<p float="left">
  <img src="./docs/ReadmeImages/Mobile/HorizontalLandscape.jpg" title="Horizontal Landscape">
</p>

<img src="./docs/test.gif" title="Horizontal Landscape">

