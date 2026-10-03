using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CompanyDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string LogoUrl { get; set; }
    public required string Slug { get; set; }
    public required string About { get; set; }
    public required string EmployerId { get; set; }
}

public class CreateCompanyDto
{
    [Required, MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public IFormFile? Logo { get; set; }

    [Required]
    public string About { get; set; } = string.Empty;
}

public class UpdateCompanyDto
{
    [Required, MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    public IFormFile? Logo { get; set; }

    [Required]
    public string About { get; set; } = string.Empty;
}