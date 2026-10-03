using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ApplyJobDto
{
    [Required]
    public IFormFile? Resume { get; set; }

    [Required]
    public string Message { get; set; } = string.Empty;
}

public class ApplicationDto
{
    public int Id { get; set; }
    public int CompanyJobId { get; set; }
    public required string JobName { get; set; }
    public required string JobSlug { get; set; }
    public required string CompanyName { get; set; }
    public required string CandidateId { get; set; }
    public required string CandidateName { get; set; }
    public required string ResumeUrl { get; set; }
    public required string Message { get; set; }
    public bool IsHired { get; set; }
    public DateTime CreatedAt { get; set; }
}