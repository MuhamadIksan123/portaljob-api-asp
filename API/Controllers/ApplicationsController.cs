using API.Data;
using API.DTOs;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[Authorize]
[Route("api/applications")]
public class ApplicationsController(
    StoreContext context,
    UserManager<User> userManager,
    ImageService imageService) : BaseApiController
{
    [Authorize(Roles = "employee,super_admin")]
    [HttpPost("jobs/{slug}/apply")]
    public async Task<ActionResult<ApplicationDto>> Apply(
        string slug, [FromForm] ApplyJobDto dto)
    {
        var userId = userManager.GetUserId(User);
        if (userId is null) return Unauthorized();

        var job = await context.CompanyJobs
            .FirstOrDefaultAsync(x => x.Slug == slug && x.IsOpen);

        if (job is null)
            return NotFound("Open job not found.");

        if (dto.Resume is null ||
            !string.Equals(Path.GetExtension(dto.Resume.FileName),
                ".pdf", StringComparison.OrdinalIgnoreCase))
            return BadRequest("Resume must be a PDF.");

        if (await context.JobCandidates.AnyAsync(
                x => x.CompanyJobId == job.Id && x.CandidateId == userId))
            return BadRequest("You have already applied to this job.");

        var upload = await imageService.AddRawAsync(
            dto.Resume, "jobportal/resumes");

        if (upload.Error is not null)
            return BadRequest(upload.Error.Message);

        var application = new JobCandidate
        {
            ResumeUrl = upload.SecureUrl.AbsoluteUri,
            ResumePublicId = upload.PublicId,
            Message = dto.Message,
            IsHired = false,
            CandidateId = userId,
            CompanyJobId = job.Id
        };

        context.JobCandidates.Add(application);

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem creating application.");

        application = await context.JobCandidates
            .Include(x => x.Job).ThenInclude(x => x.Company)
            .Include(x => x.Candidate)
            .FirstAsync(x => x.Id == application.Id);

        return CreatedAtAction(
            nameof(GetMyApplication),
            new { id = application.Id },
            new ApplicationDto
            {
                Id = application.Id,
                CompanyJobId = application.CompanyJobId,
                JobName = application.Job.Name,
                JobSlug = application.Job.Slug,
                CompanyName = application.Job.Company.Name,
                CandidateId = application.CandidateId,
                CandidateName = application.Candidate.Name,
                ResumeUrl = application.ResumeUrl,
                Message = application.Message,
                IsHired = application.IsHired,
                CreatedAt = application.CreatedAt
            });
    }

    [Authorize(Roles = "employee,super_admin")]
    [HttpGet("mine")]
    public async Task<ActionResult<List<ApplicationDto>>> GetMyApplications()
    {
        var userId = userManager.GetUserId(User);

        return await context.JobCandidates
            .Where(x => x.CandidateId == userId)
            .Include(x => x.Job).ThenInclude(x => x.Company)
            .Include(x => x.Candidate)
            .OrderByDescending(x => x.Id)
            .Select(x => new ApplicationDto
            {
                Id = x.Id,
                CompanyJobId = x.CompanyJobId,
                JobName = x.Job.Name,
                JobSlug = x.Job.Slug,
                CompanyName = x.Job.Company.Name,
                CandidateId = x.CandidateId,
                CandidateName = x.Candidate.Name,
                ResumeUrl = x.ResumeUrl,
                Message = x.Message,
                IsHired = x.IsHired,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    [Authorize(Roles = "employee,super_admin")]
    [HttpGet("mine/{id:int}")]
    public async Task<ActionResult<ApplicationDto>> GetMyApplication(int id)
    {
        var userId = userManager.GetUserId(User);

        var application = await context.JobCandidates
            .Include(x => x.Job).ThenInclude(x => x.Company)
            .Include(x => x.Candidate)
            .FirstOrDefaultAsync(x =>
                x.Id == id && x.CandidateId == userId);

        if (application is null)
            return NotFound();

        return new ApplicationDto
        {
            Id = application.Id,
            CompanyJobId = application.CompanyJobId,
            JobName = application.Job.Name,
            JobSlug = application.Job.Slug,
            CompanyName = application.Job.Company.Name,
            CandidateId = application.CandidateId,
            CandidateName = application.Candidate.Name,
            ResumeUrl = application.ResumeUrl,
            Message = application.Message,
            IsHired = application.IsHired,
            CreatedAt = application.CreatedAt
        };
    }

    [Authorize(Roles = "employer,super_admin")]
    [HttpGet("jobs/{jobId:int}")]
    public async Task<ActionResult<List<ApplicationDto>>> GetJobApplications(int jobId)
    {
        var job = await context.CompanyJobs
            .Include(x => x.Company)
            .FirstOrDefaultAsync(x => x.Id == jobId);

        if (job is null)
            return NotFound();

        if (!User.IsInRole("super_admin") &&
            job.Company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        return await context.JobCandidates
            .Where(x => x.CompanyJobId == jobId)
            .Include(x => x.Job).ThenInclude(x => x.Company)
            .Include(x => x.Candidate)
            .OrderByDescending(x => x.Id)
            .Select(x => new ApplicationDto
            {
                Id = x.Id,
                CompanyJobId = x.CompanyJobId,
                JobName = x.Job.Name,
                JobSlug = x.Job.Slug,
                CompanyName = x.Job.Company.Name,
                CandidateId = x.CandidateId,
                CandidateName = x.Candidate.Name,
                ResumeUrl = x.ResumeUrl,
                Message = x.Message,
                IsHired = x.IsHired,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    [Authorize(Roles = "employer,super_admin")]
    [HttpPut("{id:int}/hire")]
    public async Task<ActionResult> Hire(int id)
    {
        var application = await context.JobCandidates
            .Include(x => x.Job).ThenInclude(x => x.Company)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (application is null)
            return NotFound();

        if (!User.IsInRole("super_admin") &&
            application.Job.Company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        application.IsHired = true;
        application.Job.IsOpen = false;
        application.UpdatedAt = DateTime.UtcNow;

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem hiring candidate.");

        return NoContent();
    }

    [Authorize(Roles = "employer,super_admin")]
    [HttpGet("{id:int}/resume")]
    public async Task<ActionResult> GetResume(int id)
    {
        var application = await context.JobCandidates
            .Include(x => x.Job).ThenInclude(x => x.Company)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (application is null)
            return NotFound();

        if (!User.IsInRole("super_admin") &&
            application.Job.Company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        return Redirect(application.ResumeUrl);
    }
}