using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class ChangePasswordDto
{
    [Required]
    public string OldPassword { get; set; } = string.Empty;

    [Required]
    [MinLength(8)]
    [MaxLength(50)]
    public string NewPassword { get; set; } = string.Empty;
}
