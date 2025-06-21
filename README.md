# 🕵️ AnonymousGroupChat

**AnonymousGroupChat** is a React Native application that enables users to join an **anonymous public group chat** using [CometChat's React Native UI Kit](https://www.cometchat.com/tutorials). It automatically creates users on the fly, adds them to a predefined public group using CometChat REST API, and allows real-time group messaging.

---

## 🚀 Features

* Anonymous user creation using REST API
* Auto-join public group (`anonymous-chat-123`) created on CometChat Dashboard
* Real-time group chat using CometChat UI Kit
* Built with **React Native**, **JavaScript**, and **CometChat SDK + UI Kit**

---

## 🔐 User Creation & Group Join (REST API Snippets)

Upon launching the app, a user enters a name. Then the CometChat SDK is initialized with App ID, region, and auth key.
<br/>
⚠️ Fine for prototyping but you should use an auth token in production.

The following logic runs:

### 📌 1. Create user via CometChat REST API

```ts
const create_user_url = `https://${COMETCHAT_APPID}.api-in.cometchat.io/v3/users`;

const create_user_options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    apikey: COMETCHAT_AUTH_KEY,
  },
  body: JSON.stringify({
    metadata: {
      '@private': {
        email: 'user@email.com', //Placeholder data, required by CometChat
        contactNumber: '0123456789',
      },
    },
    uid: name,
    name: name,
  }),
};

await fetch(create_user_url, create_user_options);
```

> If the user already exists, CometChat will return HTTP 409 (Conflict), which is handled gracefully.
> *Note: Creation of users and addition to group should ideally be done on the backend. This is a frontend prototype.*

---

### 👥 2. Add user to public group

```ts
const add_to_group_url = `https://${COMETCHAT_APPID}.api-in.cometchat.io/v3/groups/anonymous-chat-123/members`;

const add_to_group_options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    apikey: COMETCHAT_RESTAPI_KEY,
  },
  body: JSON.stringify({
    participants: [name],
  }),
};

await fetch(add_to_group_url, add_to_group_options);
```

---

## 💬 Chat Interface

### 📨 Send messages

```ts
const textMessage = new CometChat.TextMessage(
  'anonymous-chat-123',
  msg,
  CometChatUiKitConstants.ReceiverTypeConstants.group
);

await CometChatUIKit.sendTextMessage(textMessage);
```

### 📈 Display messages

```tsx
import { CometChatMessageList } from '@cometchat/chat-uikit-react-native';

<CometChatMessageList
  group={{
    guid: 'anonymous-chat-123',
    name: 'Anonymous Group',
    type: 'public',
  }}
/>
```

A Text Input is used to send the message and CometChat handles all the real-time logic and UI for displaying the messages with the `CometChatMessageList` component.

---

## 📷 Screenshots

<img src="https://github.com/user-attachments/assets/e587827d-482b-4d45-b538-0c8c5f35fb4c" width="300">
<img src="https://github.com/user-attachments/assets/e3fdb621-0a25-45ba-94ea-1efdc23f4ce6" width="300">
<img src="https://github.com/user-attachments/assets/9a4ebd67-4b8b-43b1-b0e7-2c2e3df66519" width="300">


---

