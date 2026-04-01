using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Hubs;

var builder = WebApplication.CreateBuilder(args); // factory

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build(); // builder

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

app.MapControllers();
app.MapHub<TasksHub>("/taskshub");
app.Run();