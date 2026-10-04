namespace API.Entities;

public class Bookmark
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public User User { get; set; } = null!;

    public int JobId { get; set; }
    public CompanyJob Job { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}