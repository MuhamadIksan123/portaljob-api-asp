namespace API.Entities;

public class JobCandidate
{
    public int Id { get; set; }
    public required string ResumeUrl { get; set; }
    public required string ResumePublicId { get; set; }
    public required string Message { get; set; }
    public bool IsHired { get; set; }
    public required string CandidateId { get; set; }
    public User Candidate { get; set; } = null!;
    public int CompanyJobId { get; set; }
    public CompanyJob Job { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}