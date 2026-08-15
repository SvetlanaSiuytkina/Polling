import { interval, mergeMap, catchError, map } from 'rxjs';
import { ajax } from 'rxjs/ajax';

function formatTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);
  const time = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const dateStr = date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return `${time} ${dateStr}`;
}

function shortenSubject(subject) {
  if (subject.length <= 15) {
    return subject;
  }

  return subject.substring(0, 15) + '...';
}

function renderMessage(message, tbody) {
  const tr = document.createElement('tr');
  const fromCell = document.createElement('td');
  fromCell.textContent = message.from;

  const subjectCell = document.createElement('td');
  subjectCell.textContent = shortenSubject(message.subject);

  const receivedCell = document.createElement('td');
  receivedCell.textContent = formatTimestamp(message.received);

  tr.appendChild(fromCell);
  tr.appendChild(subjectCell);
  tr.appendChild(receivedCell);

  tbody.insertBefore(tr, tbody.firstChild);
}

export function startPolling(url, intervalMs) {
  const tbody = document.getElementById('messages-tbody');

  interval(intervalMs)
    .pipe(
      mergeMap(() => ajax.getJSON(url)),
      map(response => response.messages),

      catchError(error => {
        console.error('Ошибка при запросе:', error);
        return [];
      })
    ).subscribe(messages => {
      messages.forEach(msg => renderMessage(msg, tbody));
    });
}