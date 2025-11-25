import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

const sessionId = 'test-session-' + Date.now();

socket.on('connect', () => {
  console.log('✅ Connected to server');
  
  // Join session
  socket.emit('join-session', sessionId);
  console.log(`📍 Joined session: ${sessionId}`);
  
  // Send message
  setTimeout(() => {
    console.log('\n📤 Sending message...');
    socket.emit('send-message', {
      sessionId,
      message: 'What are the latest developments in AI?'
    });
  }, 1000);
});

socket.on('message-received', (data) => {
  console.log('\n✅ Message received by server');
});

socket.on('response-chunk', (data) => {
  process.stdout.write(data.chunk);
});

socket.on('response-complete', (data) => {
  console.log('\n\n✅ Response complete');
  console.log('Timestamp:', data.timestamp);
  
  // Get history
  setTimeout(() => {
    console.log('\n📜 Fetching history...');
    socket.emit('get-history', { sessionId });
  }, 1000);
});

socket.on('history', (data) => {
  console.log('\n📖 History:');
  console.log(JSON.stringify(data.history, null, 2));
  
  // Clear session
  setTimeout(() => {
    console.log('\n🗑️  Clearing session...');
    socket.emit('clear-session', { sessionId });
  }, 1000);
});

socket.on('session-cleared', (data) => {
  console.log('\n✅ Session cleared:', data.sessionId);
  socket.disconnect();
});

socket.on('error', (error) => {
  console.error('❌ Error:', error);
});

socket.on('disconnect', () => {
  console.log('\n👋 Disconnected from server');
  process.exit(0);
});
