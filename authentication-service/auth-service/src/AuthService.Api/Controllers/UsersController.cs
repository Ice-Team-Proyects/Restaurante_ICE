using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
[Authorize]
public class UsersController(IUserManagementService userManagementService, IAuthService authService) : ControllerBase
{
    private string? GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
    }

    private bool IsAdmin()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value ?? User.FindFirst("role")?.Value;
        return string.Equals(role, "ADMIN_ROLE", StringComparison.OrdinalIgnoreCase);
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserResponseDto>> GetProfile()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { message = "Invalid token claims" });

        var user = await authService.GetUserByIdAsync(userId);
        if (user == null) return NotFound(new { message = "User not found" });

        return Ok(user);
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<UserResponseDto>>> GetAllUsers()
    {
        if (!IsAdmin()) return StatusCode(403, new { message = "Access denied. Admin role required." });

        var users = await userManagementService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpPost]
    public async Task<ActionResult<UserResponseDto>> CreateUser([FromBody] AdminCreateUserDto dto)
    {
        if (!IsAdmin()) return StatusCode(403, new { message = "Access denied. Admin role required." });

        try
        {
            var user = await userManagementService.CreateUserByAdminAsync(dto);
            return StatusCode(201, user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<UserResponseDto>> UpdateUser(string id, [FromBody] AdminUpdateUserDto dto)
    {
        if (!IsAdmin()) return StatusCode(403, new { message = "Access denied. Admin role required." });

        try
        {
            var user = await userManagementService.UpdateUserByAdminAsync(id, dto);
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        if (!IsAdmin()) return StatusCode(403, new { message = "Access denied. Admin role required." });

        try
        {
            var result = await userManagementService.DeleteUserAsync(id);
            return Ok(new { success = result, message = "User deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { message = "Invalid token claims" });

        try
        {
            var result = await userManagementService.ChangePasswordAsync(userId, dto.OldPassword, dto.NewPassword);
            return Ok(new { success = result, message = "Password updated successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("delete-account")]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = GetCurrentUserId();
        if (string.IsNullOrEmpty(userId)) return Unauthorized(new { message = "Invalid token claims" });

        try
        {
            var result = await userManagementService.DeleteUserAsync(userId);
            return Ok(new { success = result, message = "Account deleted successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
