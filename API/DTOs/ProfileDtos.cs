using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class UpdateProfileDto
{
    [Required, MaxLength(255)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    public string? Occupation { get; set; }
    public int Experience { get; set; }
    public IFormFile? Avatar { get; set; }
}

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}

public class DeleteProfileDto
{
    [Required]
    public string Password { get; set; } = string.Empty;
}