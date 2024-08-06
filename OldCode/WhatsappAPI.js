const { sendWhatsappMessageToGroup } = require('./IndexWhatsApp');

const message = 'Hello, this is a test message to the group!';

sendWhatsappMessageToGroup(message).then(response => {
    console.log('Message sent:', response);
}).catch(err => {
    console.error('Error sending message:', err);
});
