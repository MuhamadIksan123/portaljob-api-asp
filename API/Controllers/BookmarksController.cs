using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// [Authorize(Roles = "employee")]
[Authorize]

public class BookmarksController(
    StoreContext context,
    UserManager<User> userManager) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<BookmarkDto>>> GetBookmarks()
    {
        var userId = userManager.GetUserId(User);

        return await context.Bookmarks
            .Where(x => x.UserId == userId)
            .Include(x => x.Job)
                .ThenInclude(x => x.Company)
            .Include(x => x.Job)
                .ThenInclude(x => x.Category)
            .OrderByDescending(x => x.Id)
            .Select(x => new BookmarkDto
            {
                Id = x.Id,
                JobId = x.JobId,
                JobName = x.Job.Name,
                JobSlug = x.Job.Slug,
                CompanyName = x.Job.Company.Name,
                CategoryName = x.Job.Category.Name,
                ThumbnailUrl = x.Job.ThumbnailUrl,
                Location = x.Job.Location,
                Type = x.Job.Type,
                SkillLevel = x.Job.SkillLevel,
                Salary = x.Job.Salary,
                IsOpen = x.Job.IsOpen,
                CreatedAt = x.Job.CreatedAt
            })
            .ToListAsync();
    }

    [HttpPost("{jobId:int}")]
    public async Task<ActionResult> AddBookmark(int jobId)
    {
        var userId = userManager.GetUserId(User);

        if (userId is null)
            return Unauthorized();

        var jobExists = await context.CompanyJobs
            .AnyAsync(x => x.Id == jobId);

        if (!jobExists)
            return NotFound();

        var exists = await context.Bookmarks
            .AnyAsync(x => x.JobId == jobId && x.UserId == userId);

        if (exists)
            return BadRequest("Job already bookmarked.");

        context.Bookmarks.Add(new Bookmark
        {
            UserId = userId,
            JobId = jobId
        });

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem adding bookmark.");

        return NoContent();
    }

    [HttpDelete("{jobId:int}")]
    public async Task<ActionResult> DeleteBookmark(int jobId)
    {
        var userId = userManager.GetUserId(User);

        var bookmark = await context.Bookmarks
            .FirstOrDefaultAsync(x =>
                x.JobId == jobId &&
                x.UserId == userId);

        if (bookmark is null)
            return NotFound();

        context.Bookmarks.Remove(bookmark);

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem deleting bookmark.");

        return NoContent();
    }
}