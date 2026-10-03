using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class JobSummaryDto
{
    public int Id { get; set; }

    public required string Name { get; set; }

    public required string Slug { get; set; }

    public required string CompanyName { get; set; }

    public required string CategoryName { get; set; }

    public required string ThumbnailUrl { get; set; }

    public required string Location { get; set; }

    public required string Type { get; set; }

    public required string SkillLevel { get; set; }

    public long Salary { get; set; }

    public bool IsOpen { get; set; }
}

public class JobDto : JobSummaryDto
{
    public int CompanyId { get; set; }

    public int CategoryId { get; set; }

    public required string About { get; set; }

    public List<string> Responsibilities { get; set; } = [];

    public List<string> Qualifications { get; set; } = [];

    public List<JobSummaryDto> RelatedJobs { get; set; } = [];
}

public class JobQueryDto
{
    public string? Keyword { get; set; }

    public string? CategorySlug { get; set; }

    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 6;
}

public class CreateJobDto
{
    [Required]
    public int CompanyId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string SkillLevel { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string Location { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string Type { get; set; } = string.Empty;

    [Required]
    public long Salary { get; set; }

    [Required]
    public IFormFile? Thumbnail { get; set; }

    [Required]
    public string About { get; set; } = string.Empty;

    [Required]
    public List<string> Responsibilities { get; set; } = [];

    [Required]
    public List<string> Qualifications { get; set; } = [];
}

public class UpdateJobDto
{
    [Required]
    public int CompanyId { get; set; }

    [Required]
    public int CategoryId { get; set; }

    [Required, MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string SkillLevel { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string Location { get; set; } = string.Empty;

    [Required, MaxLength(255)]
    public string Type { get; set; } = string.Empty;

    [Required]
    public long Salary { get; set; }

    public IFormFile? Thumbnail { get; set; }

    [Required]
    public string About { get; set; } = string.Empty;

    [Required]
    public List<string> Responsibilities { get; set; } = [];

    [Required]
    public List<string> Qualifications { get; set; } = [];

    public bool IsOpen { get; set; } = true;
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = [];

    public int PageNumber { get; set; }

    public int PageSize { get; set; }

    public int Count { get; set; }
}