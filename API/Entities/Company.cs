namespace API.Entities;

public class Company
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string LogoUrl { get; set; }
    public required string LogoPublicId { get; set; }
    public required string Slug { get; set; }
    public required string About { get; set; }
    public required string EmployerId { get; set; }
    public User Employer { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}