
import { useState } from 'react'
import io from 'socket.io-client'
import Chat from './Chat'
const socket = io.connect('http://localhost:3001')
function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const[showChat, setShowChat] = useState(false);
  const joinRoom = () => {
    if(username !== "" && room !== ""){
      socket.emit("join_room", room);
      setShowChat(true);
    }

  }

  const handleImageChange = (e) => {
    // Set the selected image when the file input changes
    const imageFile = e.target.files[0];
    setSelectedImage(imageFile);
  };

  return (
    <div className='App'>
      {!showChat ? (

      
      <div className='joinChatContainer'>

      <h1>Join a chat</h1>
      <input type="text" placeholder="John..." onChange={(e) => setUsername(e.target.value)} />
      <input type="text" placeholder="Room ID..." onChange={(e) => setRoom(e.target.value)} />
      
      <button onClick={joinRoom}>Join a Room</button>
      </div>
      ) : (
      <Chat socket = {socket} username= {username} room = {room}/>
      )}
    </div>
  )
}

export default App
