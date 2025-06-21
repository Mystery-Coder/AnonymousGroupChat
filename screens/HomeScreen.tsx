import {useState} from 'react';
import {View, Text, TextInput, Pressable, Alert} from 'react-native';

export default function HomeScreen({navigation}: any) {
  const [name, setName] = useState('');

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 8,
          padding: 10,
          fontSize: 16,
          width: 200,
        }}
        placeholder="Enter Name"
        placeholderTextColor={'black'}
        value={name}
        onChangeText={setName}
      />

      <View style={{height: 20}} />

      <Pressable
        onPress={() => {
          if (name.trim() !== '') {
            navigation.navigate('Chat', {name});
            setName('');
          } else {
            Alert.alert('Name Required', 'Please enter your name to continue.');
          }
        }}
        style={{
          backgroundColor: '#007AFF',
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 5,
        }}>
        <Text style={{color: 'white', fontSize: 18}}>Start Chatting!</Text>
      </Pressable>
    </View>
  );
}
