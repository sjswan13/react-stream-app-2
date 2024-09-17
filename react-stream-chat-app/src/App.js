import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat, 
  Channel, 
  Window,
  ChannelHeader,
  MessageList, 
  MessageInput,
  Thread, 
  LoadingIndicator,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';


const apiKey = process.env.REACT_APP_STREAM_API_KEY;

const user = {
  id: 'jane', 
  name: 'Jane',
  image: 'https://getstream.io/random_svg/?name=Jane',
};

export default function App() {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!apiKey) {
      console.error('API key is not set. Make sure your environment variable is configured properly.');
      return;
    }

    const chatClient = StreamChat.getInstance(apiKey);

    const connectUser = async () => {
      try {
        
        const devToken = chatClient.devToken(user.id);

        
        await chatClient.connectUser(user, devToken);

        const channel = chatClient.channel('messaging', 'react-talk', {
          image: 'https://www.drupal.org/files/project-images/react.png',
          name: 'Talk about React',
          members: [user.id],
        });

        await channel.watch();

        setChannel(channel);
        setClient(chatClient);
      } catch (error) {
        console.error('Error connecting user:', error);
      }
    };

    connectUser();

    
    return () => {
      if (chatClient) {
        chatClient.disconnectUser();
      }
    };
  }, []); 

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <Chat client={client} theme='messaging light'>
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}
