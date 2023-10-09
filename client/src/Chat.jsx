import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
const Chat = ({socket, username, room}) => {
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        // Set the selected image when the file input changes
        const imageFile = e.target.files[0];
        setSelectedImage(imageFile);
      };
    const sendMessage = async () => {
        if(currentMessage !== ""){
            const messageData = {
                room : room,
                author : username,
                message : currentMessage,
                time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setCurrentMessage("");
            
        }

        // if (selectedImage) {
        //     // Convert the selected image to a base64 string
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //       const imageBase64 = e.target.result;
        //       const imageMessageData = {
        //         room: room,
        //         author: username,
        //         image: imageBase64,
        //         time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
        //       };
        //       socket.emit('send_image', imageMessageData);
        //     };
        //     reader.readAsDataURL(selectedImage);
    
        //     // Clear the selected image after sending
        //     setSelectedImage(null);
        //   }
    }

    useEffect(() => {
        socket.on('receive_message', (data) => {
            // console.log(data)
            setMessageList((list) => [...list, data]); 
        })
    }, [socket]);
  return (
    <div className='chat-window'>
        <div className='chat-header'>
            <p>Live Chat</p>
        </div>
        <div className='chat-body'>
            <ScrollToBottom className='message-container'>

            {messageList.map((messageContent) => {
                return <div className='message' id = {username === messageContent.author ? "you" : "other"}>
                    <div>
                        <div className='message-content'> 
                        <p>{messageContent.message}</p>
                        </div>
                        <div className='message-meta'>
                            <p id = "time">{messageContent.time}</p> 
                            <p id = "author">{messageContent.author}</p> 
                            </div>
                    </div>
                </div>
            })}
            </ScrollToBottom>
        </div>
        <div className='chat-footer'>
            <input type='text'value={currentMessage} placeholder='Hey...' onChange={(e) =>{setCurrentMessage(e.target.value)} } onKeyDown={(event) =>{
                event.key === "Enter" && sendMessage();
            }} />
            <button onClick={sendMessage}>&#9658;</button>
            {/* <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setSelectedImage(e.target.files[0]);
          }}
        /> */}
        </div>
    </div>
  )
}

export default Chat;