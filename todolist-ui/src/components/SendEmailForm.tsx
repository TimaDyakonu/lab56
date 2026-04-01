import { useState } from "react";

interface Props {
  onSubmit: (to: string, subject: string, body: string) => Promise<void>;
}

function SendEmailForm({ onSubmit }: Props) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(to.trim(), subject.trim(), body.trim());
      setTo("");
      setSubject("");
      setBody("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card">
      <div className="form-group">
        <label>To</label>
        <input
          type="email"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="recipient@example.com"
        />
      </div>
      <div className="form-group">
        <label>Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
        />
      </div>
      <div className="form-group">
        <label>Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Email body"
        />
      </div>
      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

export default SendEmailForm;