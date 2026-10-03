namespace API.Entities;

public class JobResponsibility
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int CompanyJobId { get; set; }
    public CompanyJob CompanyJob { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}

public class JobQualification
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int CompanyJobId { get; set; }
    public CompanyJob CompanyJob { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}