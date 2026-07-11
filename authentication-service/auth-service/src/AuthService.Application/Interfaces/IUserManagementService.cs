<<<<<<< HEAD
using AuthService.Application.DTOs;

namespace AuthService.Application.Interfaces;

public interface IUserManagementService
{
    Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName);
    Task<IReadOnlyList<string>> GetUserRolesAsync(string userId);
    Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName);
    Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto> CreateUserByAdminAsync(AdminCreateUserDto dto);
    Task<UserResponseDto> UpdateUserByAdminAsync(string id, AdminUpdateUserDto dto);
    Task<bool> DeleteUserAsync(string userId);
    Task<bool> ChangePasswordAsync(string userId, string oldPassword, string newPassword);
}
=======
using AuthService.Application.DTOs;

namespace AuthService.Application.Interfaces;

public interface IUserManagementService
{
    Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName);
    Task<IReadOnlyList<string>> GetUserRolesAsync(string userId);
    Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName);
    Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync();
    Task<UserResponseDto> CreateUserByAdminAsync(AdminCreateUserDto dto);
    Task<UserResponseDto> UpdateUserByAdminAsync(string id, AdminUpdateUserDto dto);
    Task<bool> DeleteUserAsync(string userId);
    Task<bool> ChangePasswordAsync(string userId, string oldPassword, string newPassword);
}
>>>>>>> 86dfc5480411a3aa8ee51d5b4f125727a6f8945a
