using System.Text.RegularExpressions;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class JobsController(
    StoreContext context,
    UserManager<User> userManager,
    ImageService imageService
    ) : BaseApiController
{
    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<PagedResult<JobSummaryDto>>> GetJobs(
        [FromQuery] JobQueryDto query)
    {
        query.PageNumber = Math.Max(1, query.PageNumber);
        query.PageSize = Math.Clamp(query.PageSize, 1, 20);

        var jobs = context.CompanyJobs
            .Include(x => x.Company)
            .Include(x => x.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Keyword))
            jobs = jobs.Where(x => x.Name.Contains(query.Keyword));

        if (!string.IsNullOrWhiteSpace(query.CategorySlug))
            jobs = jobs.Where(x => x.Category.Slug == query.CategorySlug);

        var count = await jobs.CountAsync();

        var items = await jobs
            .OrderByDescending(x => x.Id)
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(x => new JobSummaryDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                Type = x.Type,
                Location = x.Location,
                SkillLevel = x.SkillLevel,
                Salary = x.Salary,
                ThumbnailUrl = x.ThumbnailUrl,
                CompanyName = x.Company.Name,
                CategoryName = x.Category.Name
            })
            .ToListAsync();

        return Ok(new PagedResult<JobSummaryDto>
        {
            Items = items,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize,
            Count = count
        });
    }

    [AllowAnonymous]
    [HttpGet("{slug}")]
    public async Task<ActionResult<JobDto>> GetJob(string slug)
    {
        var job = await context.CompanyJobs
            .Include(x => x.Company)
            .Include(x => x.Category)
            .Include(x => x.Responsibilities)
            .Include(x => x.Qualifications)
            .FirstOrDefaultAsync(x => x.Slug == slug);

        if (job is null)
            return NotFound();

        var related = await context.CompanyJobs
            .Include(x => x.Company)
            .Where(x =>
                x.Id != job.Id &&
                x.CategoryId == job.CategoryId)
            .OrderBy(x => Guid.NewGuid())
            .Take(4)
            .Select(x => new JobSummaryDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                Type = x.Type,
                Location = x.Location,
                SkillLevel = x.SkillLevel,
                Salary = x.Salary,
                ThumbnailUrl = x.ThumbnailUrl,
                CompanyName = x.Company.Name,
                CategoryName = x.Category.Name
            })
            .ToListAsync();

        var result = new JobDto
        {
            Id = job.Id,
            Name = job.Name,
            Slug = job.Slug,
            Type = job.Type,
            Location = job.Location,
            SkillLevel = job.SkillLevel,
            Salary = job.Salary,
            ThumbnailUrl = job.ThumbnailUrl,
            About = job.About,
            IsOpen = job.IsOpen,

            CompanyId = job.CompanyId,
            CompanyName = job.Company.Name,

            CategoryId = job.CategoryId,
            CategoryName = job.Category.Name,

            Responsibilities = job.Responsibilities
            .Select(x => x.Name)
            .ToList(),

            Qualifications = job.Qualifications
            .Select(x => x.Name)
            .ToList(),

            RelatedJobs = related
        };

        return Ok(result);
    }

    [Authorize(Roles = "employer,super_admin")]
    [HttpGet("mine")]
    public async Task<ActionResult<List<JobSummaryDto>>> GetMyJobs()
    {
        var userId = userManager.GetUserId(User);

        var jobs = context.CompanyJobs
            .Include(x => x.Company)
            .Where(x =>
                User.IsInRole("super_admin") ||
                x.Company.EmployerId == userId);

        var result = await jobs
            .OrderByDescending(x => x.Id)
            .Select(x => new JobSummaryDto
            {
                Id = x.Id,
                Name = x.Name,
                Slug = x.Slug,
                Type = x.Type,
                Location = x.Location,
                SkillLevel = x.SkillLevel,
                Salary = x.Salary,
                ThumbnailUrl = x.ThumbnailUrl,
                CompanyName = x.Company.Name,
                CategoryName = x.Category.Name
            })
            .ToListAsync();

        return Ok(result);
    }

    [Authorize(Roles = "employer,super_admin")]
    [HttpPost]
    public async Task<ActionResult<JobDto>> CreateJob(
    [FromForm] CreateJobDto dto)
    {
        var company = await context.Companies.FindAsync(dto.CompanyId);

        if (company is null)
            return BadRequest("Company not found.");

        if (!User.IsInRole("super_admin") &&
            company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        var category = await context.Categories.FindAsync(dto.CategoryId);

        if (category is null)
            return BadRequest("Category not found.");

        if (dto.Thumbnail is null)
            return BadRequest("Thumbnail is required.");

        if (dto.Responsibilities.Count == 0 ||
            dto.Qualifications.Count == 0)
        {
            return BadRequest(
                "Responsibilities and qualifications are required.");
        }

        var upload = await imageService.AddImageAsync(
            dto.Thumbnail,
            "jobportal/jobs");

        if (upload.Error is not null)
            return BadRequest(upload.Error.Message);

        var job = new CompanyJob
        {
            Name = dto.Name,
            Slug = ToSlug(dto.Name),
            Type = dto.Type,
            Location = dto.Location,
            SkillLevel = dto.SkillLevel,
            Salary = dto.Salary,
            ThumbnailUrl = upload.SecureUrl.AbsoluteUri,
            ThumbnailPublicId = upload.PublicId,
            About = dto.About,
            IsOpen = true,
            CompanyId = dto.CompanyId,
            CategoryId = dto.CategoryId
        };

        foreach (var item in dto.Responsibilities
                     .Where(x => !string.IsNullOrWhiteSpace(x)))
        {
            job.Responsibilities.Add(new JobResponsibility
            {
                Name = item.Trim()
            });
        }

        foreach (var item in dto.Qualifications
                     .Where(x => !string.IsNullOrWhiteSpace(x)))
        {
            job.Qualifications.Add(new JobQualification
            {
                Name = item.Trim()
            });
        }

        context.CompanyJobs.Add(job);

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem creating job.");

        var result = new JobDto
        {
            Id = job.Id,
            Name = job.Name,
            Slug = job.Slug,
            Type = job.Type,
            Location = job.Location,
            SkillLevel = job.SkillLevel,
            Salary = job.Salary,
            ThumbnailUrl = job.ThumbnailUrl,
            About = job.About,
            IsOpen = job.IsOpen,

            CompanyId = job.CompanyId,
            CompanyName = company.Name,

            CategoryId = job.CategoryId,
            CategoryName = category.Name,

            Responsibilities = job.Responsibilities
                .Select(x => x.Name)
                .ToList(),

            Qualifications = job.Qualifications
                .Select(x => x.Name)
                .ToList()
        };

        return CreatedAtAction(
            nameof(GetJob),
            new { slug = job.Slug },
            result);
    }

    [Authorize(Roles = "employer,super_admin")]
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateJob(
        int id,
        [FromForm] UpdateJobDto dto)
    {
        var job = await context.CompanyJobs
            .Include(x => x.Company)
            .Include(x => x.Responsibilities)
            .Include(x => x.Qualifications)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (job is null)
            return NotFound();

        if (!User.IsInRole("super_admin") &&
            job.Company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        var oldPublicId = job.ThumbnailPublicId;

        job.Name = dto.Name;
        job.Slug = ToSlug(dto.Name);
        job.Type = dto.Type;
        job.Location = dto.Location;
        job.SkillLevel = dto.SkillLevel;
        job.Salary = dto.Salary;
        job.About = dto.About;
        job.CompanyId = dto.CompanyId;
        job.CategoryId = dto.CategoryId;
        job.IsOpen = dto.IsOpen;
        job.UpdatedAt = DateTime.UtcNow;

        if (dto.Thumbnail is not null)
        {
            var upload = await imageService.AddImageAsync(
                dto.Thumbnail,
                "jobportal/jobs");

            if (upload.Error is not null)
                return BadRequest(upload.Error.Message);

            job.ThumbnailUrl = upload.SecureUrl.AbsoluteUri;
            job.ThumbnailPublicId = upload.PublicId;
        }

        context.JobResponsibilities.RemoveRange(
            job.Responsibilities);

        context.JobQualifications.RemoveRange(
            job.Qualifications);

        foreach (var item in dto.Responsibilities
                     .Where(x => !string.IsNullOrWhiteSpace(x)))
        {
            job.Responsibilities.Add(new JobResponsibility
            {
                Name = item.Trim()
            });
        }

        foreach (var item in dto.Qualifications
                     .Where(x => !string.IsNullOrWhiteSpace(x)))
        {
            job.Qualifications.Add(new JobQualification
            {
                Name = item.Trim()
            });
        }

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem updating job.");

        if (dto.Thumbnail is not null &&
            !string.IsNullOrEmpty(oldPublicId))
        {
            await imageService.DeleteImageAsync(oldPublicId);
        }

        return NoContent();
    }

    [Authorize(Roles = "employer,super_admin")]
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteJob(int id)
    {
        var job = await context.CompanyJobs
            .Include(x => x.Company)
            .Include(x => x.Responsibilities)
            .Include(x => x.Qualifications)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (job is null)
            return NotFound();

        if (!User.IsInRole("super_admin") &&
            job.Company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        job.DeletedAt = DateTime.UtcNow;
        job.UpdatedAt = DateTime.UtcNow;

        foreach (var item in job.Responsibilities)
            item.DeletedAt = DateTime.UtcNow;

        foreach (var item in job.Qualifications)
            item.DeletedAt = DateTime.UtcNow;

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem deleting job.");

        if (!string.IsNullOrEmpty(job.ThumbnailPublicId))
            await imageService.DeleteImageAsync(
                job.ThumbnailPublicId);

        return NoContent();
    }

    private static string ToSlug(string value)
    {
        var slug = Regex.Replace(
            value.ToLowerInvariant().Trim(),
            "[^a-z0-9]+",
            "-");

        return slug.Trim('-');
    }
}