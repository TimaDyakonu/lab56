namespace TodoApi.Models;

public class SendEmailRequest
{
    public string To { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Body { get; set; } = "";
}

public class EmailMessage
{
    public string From { get; set; } = "";
    public string Subject { get; set; } = "";
    public string Date { get; set; } = "";
    public string Body { get; set; } = "";
}