import { EmailMessage } from "../types";

interface Props {
  emails: EmailMessage[];
}

function EmailList({ emails }: Props) {
  if (emails.length === 0) {
    return <p className="empty">No emails loaded. Click IMAP or POP3 to fetch.</p>;
  }

  return (
    <div>
      {emails.map((email, i) => (
        <div key={i} className="email-card">
          <div className="email-from">{email.from}</div>
          <div className="email-subject">{email.subject}</div>
          <div className="email-date">{email.date}</div>
          {email.body && <div className="email-body">{email.body}</div>}
        </div>
      ))}
    </div>
  );
}

export default EmailList;