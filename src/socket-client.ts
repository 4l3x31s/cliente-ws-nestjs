import { Manager, Socket } from 'socket.io-client';


let socket: Socket;

export const connectToServer = (token: string) => {

    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mund',
            authentication: token
        }
    });
    socket?.removeAllListeners();
    socket = manager.socket('/');



    //console.log({ socket })
    addListeners(socket);
}
//clients-ul
const addListeners = (socket: Socket) => {


    //messages-ul

    const clientsUl = document.querySelector('#clients-ul')!;
    const serverStatusLabek = document.querySelector('#server-status')!;

    const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
    const messageInput = document.querySelector<HTMLInputElement>('#message-input')!;


    const messagesUl = document.querySelector('#messages-ul')!;

    socket.on('connect', () => {
        serverStatusLabek.innerHTML = 'connected!';
    });

    socket.on('disconnect', () => {
        serverStatusLabek.innerHTML = 'disconnected!';
    });

    socket.on('clients-udated', (clients: string[]) => {
        let clientsHtml = '';
        clients.forEach(clientId => {
            clientsHtml += `
            <li>${clientId}</li>
            `;
        })
        clientsUl.innerHTML = clientsHtml;
    });

    messageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (messageInput.value.trim().length <= 0) return;
        socket.emit('message-from-client',
            { id: 'YO!!', message: messageInput.value }
        );
        messageInput.value = '';
    });

    socket.on('messages-from-server', (payload: { fullName: string, message: string }) => {
        const newMessage = `
        <li>
            <strong>${payload.fullName}</strong>
            <span>${payload.message}</span>
        </li>
        `;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl.append(li);
    });
}