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

[Authorize(Roles = "employer,super_admin")]
public class CompaniesController(
    StoreContext context,
    UserManager<User> userManager,
    ImageService imageService) : BaseApiController
{
    [HttpGet]
    public async Task<ActionResult<List<CompanyDto>>> GetCompanies()
    {
        var userId = userManager.GetUserId(User);
        var query = context.Companies.AsQueryable();

        if (!User.IsInRole("super_admin"))
            query = query.Where(x => x.EmployerId == userId);

        return await query
            .OrderByDescending(x => x.Id)
            .Select(x => new CompanyDto
            {
                Id = x.Id,
                Name = x.Name,
                LogoUrl = x.LogoUrl,
                Slug = x.Slug,
                About = x.About,
                EmployerId = x.EmployerId
            })
            .ToListAsync();
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CompanyDto>> GetCompany(int id)
    {
        var company = await context.Companies.FindAsync(id);

        if (company is null) return NotFound();

        if (!User.IsInRole("super_admin") &&
            company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        return Ok(new CompanyDto
        {
            Id = company.Id,
            Name = company.Name,
            LogoUrl = company.LogoUrl,
            Slug = company.Slug,
            About = company.About,
            EmployerId = company.EmployerId
        });
    }

    [Authorize(Roles = "employer")]
    [HttpPost]
    public async Task<ActionResult<CompanyDto>> CreateCompany([FromForm] CreateCompanyDto dto)
    {
        var employerId = userManager.GetUserId(User);

        if (employerId is null) return Unauthorized();

        if (await context.Companies.AnyAsync(x => x.EmployerId == employerId))
            return BadRequest("Employer already has a company.");

        if (await context.Companies.AnyAsync(x => x.Name == dto.Name))
            return BadRequest("Company name already exists.");

        if (dto.Logo is null)
            return BadRequest("Logo is required.");

        var upload = await imageService.AddImageAsync(dto.Logo, "jobportal/companies");

        if (upload.Error is not null)
            return BadRequest(upload.Error.Message);

        var company = new Company
        {
            Name = dto.Name,
            LogoUrl = upload.SecureUrl.AbsoluteUri,
            LogoPublicId = upload.PublicId,
            Slug = ToSlug(dto.Name),
            About = dto.About,
            EmployerId = employerId
        };

        context.Companies.Add(company);

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem creating company.");

        return CreatedAtAction(
            nameof(GetCompany),
            new { id = company.Id },
            new CompanyDto
            {
                Id = company.Id,
                Name = company.Name,
                LogoUrl = company.LogoUrl,
                Slug = company.Slug,
                About = company.About,
                EmployerId = company.EmployerId
            });
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateCompany(int id, [FromForm] UpdateCompanyDto dto)
    {
        var company = await context.Companies.FindAsync(id);

        if (company is null) return NotFound();

        if (!User.IsInRole("super_admin") &&
            company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        if (await context.Companies.AnyAsync(x =>
            x.Id != id && x.Name == dto.Name))
            return BadRequest("Company name already exists.");

        var oldPublicId = company.LogoPublicId;

        company.Name = dto.Name;
        company.About = dto.About;
        company.Slug = ToSlug(dto.Name);
        company.UpdatedAt = DateTime.UtcNow;

        if (dto.Logo is not null)
        {
            var upload = await imageService.AddImageAsync(
                dto.Logo, "jobportal/companies");

            if (upload.Error is not null)
                return BadRequest(upload.Error.Message);

            company.LogoUrl = upload.SecureUrl.AbsoluteUri;
            company.LogoPublicId = upload.PublicId;
        }

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem updating company.");

        if (dto.Logo is not null && !string.IsNullOrEmpty(oldPublicId))
            await imageService.DeleteImageAsync(oldPublicId);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> DeleteCompany(int id)
    {
        var company = await context.Companies.FindAsync(id);

        if (company is null) return NotFound();

        if (!User.IsInRole("super_admin") &&
            company.EmployerId != userManager.GetUserId(User))
            return Forbid();

        company.DeletedAt = DateTime.UtcNow;
        company.UpdatedAt = DateTime.UtcNow;

        if (await context.SaveChangesAsync() <= 0)
            return BadRequest("Problem deleting company.");

        if (!string.IsNullOrEmpty(company.LogoPublicId))
            await imageService.DeleteImageAsync(company.LogoPublicId);

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