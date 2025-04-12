import './App.css';
import { useState, useEffect } from 'react';
import {io} from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [isRoomJoined, setRoomJoined] = useState(false);
  const [messageReceived, setMessageReceived] = useState("");
  const handleMessage = (e) => {
    setMessage(e.target.value);
  };
  const handleSetRoom = (e) => {
    setRoom(e.target.value);
  };
  const handleJoinRoom = () => {
    if(room) {
      socket.emit("join_room",room);
      setRoomJoined(true);
    }
  };
  const handleSendMessage = () => {
    socket.emit("send_message",{ message, room });
  };
  useEffect(()=> {
    socket.on("receive_message", (data) => {
      console.log('received msg:', data);
      setMessageReceived(data.message);
    });
  },[socket]);
  return (
    <div className="App">
      {!isRoomJoined && 
      <><input type="text" name="room" value={room} onChange={handleSetRoom} placeholder="Enter room number to join"/>
      <button type="button" name="join" onClick={handleJoinRoom}>JOIN</button></>
      }
      {isRoomJoined && <>Room number: {room} [Joined]</>}
      
      <br/><br/>
      <input type="text" name="message" value={message} onChange={handleMessage} placeholder='Enter message'/>
      <button type='button' onClick={handleSendMessage}>Send Message</button>
      <br/><br/>
      Message: 
      {messageReceived}
    </div>
  );
}

export default App;
