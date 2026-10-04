namespace API.DTOs;

public class BookmarkDto
{
    public int Id { get; set; }
    public int JobId { get; set; }
    public string JobName { get; set; } = string.Empty;
    public string JobSlug { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;

    // Properti tambahan yang diambil dari entity Job:
    public string Location { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string SkillLevel { get; set; } = string.Empty;
    public long Salary { get; set; }
    public bool IsOpen { get; set; }
    public DateTime CreatedAt { get; set; }
}