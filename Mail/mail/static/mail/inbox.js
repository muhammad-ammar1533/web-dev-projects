document.addEventListener('DOMContentLoaded', function() {
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  load_mailbox('inbox');
});

function compose_email(recipients = '', subject = '', body = '') {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}

function load_mailbox(mailbox) {
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        const emailDiv = document.createElement('div');
        emailDiv.className = email.read ? 'email-read' : 'email-unread';
        emailDiv.innerHTML = `<strong>${email.sender}</strong> ${email.subject} - ${email.timestamp}`;
        emailDiv.addEventListener('click', () => load_email(email.id));
        document.querySelector('#emails-view').append(emailDiv);
      });
    });
}

function load_email(email_id) {
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#emails-view').innerHTML = '';
  fetch(`/emails/${email_id}`)
    .then(response => response.json())
    .then(email => {
      document.querySelector('#emails-view').innerHTML = `
        <h4>${email.subject}</h4>
        <p><strong>From:</strong> ${email.sender}</p>
        <p><strong>To:</strong> ${email.recipients.join(', ')}</p>
        <p><strong>Timestamp:</strong> ${email.timestamp}</p>
        <hr>
        <p>${email.body}</p>
        <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
      `;
      document.querySelector('#reply').addEventListener('click', () => {
        const subject = email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`;
        const body = `

On ${email.timestamp}, ${email.sender} wrote:
${email.body}`;
        compose_email(email.sender, subject, body);
      });
      if (email.recipients.includes(document.querySelector('#user-email').textContent) && mailbox !== 'sent') {
        const archiveBtn = document.createElement('button');
        archiveBtn.className = 'btn btn-sm btn-outline-secondary';
        archiveBtn.innerHTML = email.archived ? 'Unarchive' : 'Archive';
        archiveBtn.addEventListener('click', () => {
          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({ archived: !email.archived })
          }).then(() => load_mailbox('inbox'));
        });
        document.querySelector('#emails-view').append(archiveBtn);
      }
      fetch(`/emails/${email_id}`, {
        method: 'PUT',
        body: JSON.stringify({ read: true })
      });
    });
}
