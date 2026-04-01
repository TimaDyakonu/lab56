using Microsoft.AspNetCore.Mvc;
using MailKit;
using MailKit.Net.Smtp;
using MailKit.Net.Imap;
using MailKit.Net.Pop3;
using MailKit.Search;
using MailKit.Security;
using MimeKit;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController : ControllerBase
{
    private readonly IConfiguration _config;

    public EmailController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendSmtp([FromBody] SendEmailRequest request)
    {
        try
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_config["Email:Address"]));
            message.To.Add(MailboxAddress.Parse(request.To));
            message.Subject = request.Subject;
            message.Body = new TextPart("plain") { Text = request.Body };

            using var client = new SmtpClient();
            await client.ConnectAsync(
                _config["Email:SmtpHost"],
                int.Parse(_config["Email:SmtpPort"]),
                SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_config["Email:Address"], _config["Email:Password"]);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return Ok(new { message = "Email sent via SMTP" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("imap")]
    public async Task<ActionResult<List<EmailMessage>>> GetViaImap()
    {
        try
        {
            var result = new List<EmailMessage>();

            using var client = new ImapClient();
            await client.ConnectAsync(
                _config["Email:ImapHost"],
                int.Parse(_config["Email:ImapPort"]),
                SecureSocketOptions.SslOnConnect);
            await client.AuthenticateAsync(_config["Email:Address"], _config["Email:Password"]);

            var inbox = client.Inbox;
            await inbox.OpenAsync(FolderAccess.ReadOnly);

            var uids = await inbox.SearchAsync(SearchQuery.All);
            var latest = uids.Reverse().Take(10).ToList();

            var items = await inbox.FetchAsync(latest, MessageSummaryItems.Envelope | MessageSummaryItems.UniqueId);

            foreach (var item in items.OrderByDescending(x => x.Date))
            {
                var bodyText = "";
                try
                {
                    var msg = await inbox.GetMessageAsync(item.UniqueId);
                    bodyText = msg.TextBody ?? "";
                }
                catch
                {
                }

                result.Add(new EmailMessage
                {
                    From = item.Envelope.From.ToString(),
                    Subject = item.Envelope.Subject ?? "",
                    Date = item.Date.ToString("yyyy-MM-dd HH:mm"),
                    Body = bodyText.Length > 500 ? bodyText[..500] + "..." : bodyText
                });
            }

            await client.DisconnectAsync(true);
            return result;
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpGet("pop3")]
    public async Task<ActionResult<List<EmailMessage>>> GetViaPop3()
    {
        try
        {
            var result = new List<EmailMessage>();

            using var client = new Pop3Client();
            await client.ConnectAsync(
                _config["Email:Pop3Host"],
                int.Parse(_config["Email:Pop3Port"]),
                SecureSocketOptions.SslOnConnect);
            await client.AuthenticateAsync(_config["Email:Address"], _config["Email:Password"]);

            int start = Math.Max(client.Count - 10, 0);
            for (int i = client.Count - 1; i >= start; i--)
            {
                var msg = await client.GetMessageAsync(i);
                var body = msg.TextBody ?? "";
                result.Add(new EmailMessage
                {
                    From = msg.From.ToString(),
                    Subject = msg.Subject ?? "",
                    Date = msg.Date.ToString("yyyy-MM-dd HH:mm"),
                    Body = body.Length > 500 ? body[..500] + "..." : body
                });
            }

            await client.DisconnectAsync(true);
            return result;
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }    
    }
}