import { startPolling } from  './client.js';
import './style.css';

startPolling('http://localhost:7070/messages/unread', 5000);