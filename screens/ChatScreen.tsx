import {View, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import {COMETCHAT_AUTH_KEY, COMETCHAT_APPID, COMETCHAT_RESTAPI_KEY} from '@env'; //Env vars declared in config
import React, {useEffect, useState} from 'react';
import {
  CometChatUIKit,
  CometChatUiKitConstants,
  CometChatMessages,
  CometChatGroups,
  CometChatMessageList,
} from '@cometchat/chat-uikit-react-native';
import {CometChat} from '@cometchat/chat-sdk-react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ChatScreen({route}: any) {
  const {name} = route.params;
  // console.log(COMETCHAT_APPID + ' ' + COMETCHAT_AUTH_KEY);
  const [chatGroup, setChatGroup] = useState<CometChat.Group>(); // Will be loaded with a logged in Group Object
  // fetch(url, options)
  //   .then(res => res.json())
  //   .then(json => console.log(json))
  //   .catch(err => console.error(err));

  useEffect(() => {
    const initCometChat = async () => {
      try {
        // 1. Init CometChat
        await CometChatUIKit.init({
          appId: COMETCHAT_APPID,
          authKey: COMETCHAT_AUTH_KEY,
          region: 'IN',
          subscriptionType: CometChat.AppSettings.SUBSCRIPTION_TYPE_ALL_USERS,
        });
        console.log('CometChatUiKit successfully initialized');

        // 2. Create user via REST API
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
                email: 'user@email.com', // Dummy data
                contactNumber: '0123456789',
              },
            },
            uid: name,
            name: name,
          }),
        };

        const res = await fetch(create_user_url, create_user_options);

        if (!res.ok) {
          const errorBody = await res.json();
          // 409 = user already exists (conflict)
          if (res.status === 409) {
            console.warn(`User '${name}' already exists.`);
          } else {
            throw new Error(
              `User creation failed: ${res.status} ${errorBody?.message || ''}`,
            );
          }
        } else {
          const createdUser = await res.json();
          console.log(`User '${createdUser.data.name}' created successfully.`);
        }

        // 3. Add the user to the public Group made on CometChat Dashboard using the REST API
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

        try {
          const group_res = await fetch(add_to_group_url, add_to_group_options);

          if (!group_res.ok) {
            const errorBody = await group_res.json();
            throw new Error(
              `Failed to add users to group: ${group_res.status} ${
                errorBody?.message || ''
              }`,
            );
          }

          const groupData = await group_res.json();
          console.log(`Added to group successfully:`, groupData);
        } catch (error) {
          console.error('Group membership failed:', error);
        }

        // 4. Log in the user
        const loggedInUser = await CometChatUIKit.login({uid: name});
        console.log(`Logged in as ${loggedInUser.getName()}`);
        const groupData = await CometChat.getGroup('anonymous-chat-123');
        setChatGroup(groupData);
      } catch (error) {
        console.error('CometChat init/login failed:', error);
      }
    };

    initCometChat();
  }, []);

  const [msg, setMsg] = useState('');

  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 12,
          width: 350,
        }}>
        <Text style={{fontSize: 20}}>You are seen as '{name}'</Text>
      </View>

      {/* View for the message box */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 4,
          borderColor: '#ccc',
          borderRadius: 8,
          paddingHorizontal: 10,
          width: 250,
          margin: 4,
        }}>
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            paddingVertical: 10,
            color: 'black',
          }}
          placeholder="Enter Message"
          placeholderTextColor="black"
          value={msg}
          onChangeText={setMsg}
        />
        <TouchableOpacity
          onPress={async () => {
            if (msg.trim() !== '') {
              try {
                const receiverID = 'anonymous-chat-123';
                const receiverType =
                  CometChatUiKitConstants.ReceiverTypeConstants.group;

                const textMessage = new CometChat.TextMessage(
                  receiverID,
                  msg,
                  receiverType,
                );

                const message = await CometChatUIKit.sendTextMessage(
                  textMessage,
                );
                console.log('Message sent successfully:', message);
                setMsg('');
              } catch (error) {
                console.error('Message send failed:', error);
              }
            } else {
              Alert.alert('Empty', 'Message cannot be empty');
            }
          }}>
          <Text style={{fontSize: 25}}>➡️</Text>
        </TouchableOpacity>
      </View>
      {/* <CometChatGroups /> */}
      {chatGroup && <CometChatMessageList group={chatGroup} />}
    </View>
  );
}
