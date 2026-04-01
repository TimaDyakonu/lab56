export interface TodoTask {
    id: number;
    title: string;
    description: string;
    isCompleted: boolean;
    createdAt: string;
}

export interface SendEmailRequest {
    to: string;
    subject: string;
    body: string;
}

export interface EmailMessage {
    from: string;
    subject: string;
    date: string;
    body: string;
}