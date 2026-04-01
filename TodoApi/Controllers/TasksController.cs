using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Hubs;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IHubContext<TasksHub> _hubContext;

    public TasksController(AppDbContext context, IHubContext<TasksHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    [HttpGet]
    public async Task<ActionResult<List<TodoTask>>> GetAll()
    {
        return await _context.Tasks.OrderByDescending(t => t.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TodoTask>> GetById(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();
        return task;
    }

    [HttpPost]
    public async Task<ActionResult<TodoTask>> Create(TodoTask task)
    {
        task.CreatedAt = DateTime.UtcNow;
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        
        await _hubContext.Clients.All.SendAsync("TaskChanged");
        
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TodoTask task)
    {
        var existing = await _context.Tasks.FindAsync(id);
        if (existing == null) return NotFound();

        existing.Title = task.Title;
        existing.Description = task.Description;
        existing.IsCompleted = task.IsCompleted;

        await _context.SaveChangesAsync();
        
        await _hubContext.Clients.All.SendAsync("TaskChanged");
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        
        await _hubContext.Clients.All.SendAsync("TaskChanged");
        
        return NoContent();
    }
}