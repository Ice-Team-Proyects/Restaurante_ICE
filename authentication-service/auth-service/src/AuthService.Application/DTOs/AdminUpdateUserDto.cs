using System.ComponentModel.DataAnnotations;

namespace AuthService.Application.DTOs;

public class AdminUpdateUserDto
{
    [Required]
    [MaxLength(25)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [MaxLength(25)]
    public string Surname { get; set; } = string.Empty;

    [Required]
    [MaxLength(25)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [MinLength(8)]
    [MaxLength(50)]
    public string? Password { get; set; } // Opcional si quiere cambiarla

    [Required]
    [StringLength(8, MinimumLength = 8)]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = string.Empty; // ADMIN_ROLE or USER_ROLE
}
