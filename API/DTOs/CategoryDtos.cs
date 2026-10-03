using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CategoryDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string IconUrl { get; set; }
    public required string Slug { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCategoryDto
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public IFormFile? Icon { get; set; }
}

public class UpdateCategoryDto
{
    [Required]
    [MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    public IFormFile? Icon { get; set; }
}