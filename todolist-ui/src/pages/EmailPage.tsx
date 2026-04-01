import { useState } from "react";
import { EmailMessage } from "../types";
import { sendEmail, getImapEmails, getPop3Emails } from "../api";
import SendEmailForm from "../components/SendEmailForm";
import EmailList from "../components/EmailList";

function EmailPage() {
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [tab, setTab] = useState<"imap" | "pop3">("imap");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSend = async (to: string, subject: string, body: string) => {
    setError("");
    setSuccess("");
    try {
      const res = await sendEmail({ to, subject, body });
      setSuccess(res.message);
    } catch {
      setError("Failed to send email");
    }
  };

  const handleFetch = async (protocol: "imap" | "pop3") => {
    setTab(protocol);
    setLoading(true);
    setError("");
    try {
      const data =
        protocol === "imap" ? await getImapEmails() : await getPop3Emails();
      setEmails(data);
    } catch {
      setError(`Failed to fetch emails via ${protocol.toUpperCase()}`);
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Email</h1>

      <div className="section">
        <h2>Send Email</h2>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
        <SendEmailForm onSubmit={handleSend} />
      </div>

      <div className="section">
        <h2>Inbox</h2>
        <div className="tabs">
          <button
            className={tab === "imap" ? "active" : ""}
            onClick={() => handleFetch("imap")}
          >
            IMAP
          </button>
          <button
            className={tab === "pop3" ? "active" : ""}
            onClick={() => handleFetch("pop3")}
          >
            POP3
          </button>
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <EmailList emails={emails} />
        )}
      </div>
    </div>
  );
}

export default EmailPage;