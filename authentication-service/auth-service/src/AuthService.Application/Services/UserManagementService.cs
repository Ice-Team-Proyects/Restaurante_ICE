using AuthService.Application.DTOs;
using AuthService.Application.Interfaces;
using AuthService.Domain.Constants;
using AuthService.Domain.Entities;
using AuthService.Domain.Interfaces;

using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace AuthService.Application.Services;

public class UserManagementService(IUserRepository users, IRoleRepository roles, IPasswordHashService passwordHashService) : IUserManagementService
{
    public async Task<UserResponseDto> UpdateUserRoleAsync(string userId, string roleName)
    {
        // Normalize
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;

        // Validate inputs
        if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentException("Invalid userId", nameof(userId));
        if (!RoleConstants.AllowedRoles.Contains(roleName))
            throw new InvalidOperationException($"Role not allowed. Use {RoleConstants.ADMIN_ROLE} or {RoleConstants.USER_ROLE}");

        // Load user with roles
        var user = await users.GetByIdAsync(userId);

        // If demoting an admin, prevent removing last admin
        var isUserAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isUserAdmin && roleName != RoleConstants.ADMIN_ROLE)
        {
            var adminCount = await roles.CountUsersInRoleAsync(RoleConstants.ADMIN_ROLE);

            if (adminCount <= 1)
            {
                throw new InvalidOperationException("Cannot remove the last administrator");
            }
        }

        // Find role entity
        var role = await roles.GetByNameAsync(roleName)
                       ?? throw new InvalidOperationException($"Role {roleName} not found");

        // Update role using repository method
        await users.UpdateUserRoleAsync(userId, role.Id);

        // Reload user with updated roles
        user = await users.GetByIdAsync(userId);

        // Map to response
        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Username = user.Username,
            Email = user.Email,
            Phone = user.UserProfile?.Phone ?? string.Empty,
            Role = role.Name,
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    public async Task<IReadOnlyList<string>> GetUserRolesAsync(string userId)
    {
        var roleNames = await roles.GetUserRoleNamesAsync(userId);
        return roleNames;
    }

    public async Task<IReadOnlyList<UserResponseDto>> GetUsersByRoleAsync(string roleName)
    {
        roleName = roleName?.Trim().ToUpperInvariant() ?? string.Empty;
        var usersInRole = await roles.GetUsersByRoleAsync(roleName);
        return usersInRole.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Name = u.Name,
            Surname = u.Surname,
            Username = u.Username,
            Email = u.Email,
            Phone = u.UserProfile?.Phone ?? string.Empty,
            Role = roleName,
            Status = u.Status,
            IsEmailVerified = u.UserEmail?.EmailVerified ?? false,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
    }

    public async Task<IReadOnlyList<UserResponseDto>> GetAllUsersAsync()
    {
        var allUsers = await users.GetAllAsync();
        return allUsers.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Name = u.Name,
            Surname = u.Surname,
            Username = u.Username,
            Email = u.Email,
            Phone = u.UserProfile?.Phone ?? string.Empty,
            Role = u.UserRoles.FirstOrDefault()?.Role?.Name ?? RoleConstants.USER_ROLE,
            Status = u.Status,
            IsEmailVerified = u.UserEmail?.EmailVerified ?? false,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
    }

    public async Task<UserResponseDto> CreateUserByAdminAsync(AdminCreateUserDto dto)
    {
        if (await users.ExistsByEmailAsync(dto.Email))
            throw new InvalidOperationException("Email already exists");

        if (await users.ExistsByUsernameAsync(dto.Username))
            throw new InvalidOperationException("Username already exists");

        var roleName = dto.Role.Trim().ToUpperInvariant();
        if (!RoleConstants.AllowedRoles.Contains(roleName))
            throw new InvalidOperationException($"Role {roleName} not allowed");

        var roleEntity = await roles.GetByNameAsync(roleName)
            ?? throw new InvalidOperationException($"Role {roleName} not found");

        var userId = UuidGenerator.GenerateUserId();
        var userProfileId = UuidGenerator.GenerateUserId();
        var userEmailId = UuidGenerator.GenerateUserId();
        var userRoleId = UuidGenerator.GenerateUserId();
        var userPasswordReset = UuidGenerator.GenerateUserId();

        var user = new User
        {
            Id = userId,
            Name = dto.Name,
            Surname = dto.Surname,
            Username = dto.Username,
            Email = dto.Email.ToLowerInvariant(),
            Password = passwordHashService.HashPassword(dto.Password),
            Status = true,
            UserProfile = new UserProfile
            {
                Id = userProfileId,
                UserId = userId,
                Phone = dto.Phone
            },
            UserEmail = new UserEmail
            {
                Id = userEmailId,
                UserId = userId,
                EmailVerified = true
            },
            UserRoles =
            [
                new UserRole
                {
                    Id = userRoleId,
                    UserId = userId,
                    RoleId = roleEntity.Id
                }
            ],
            UserPasswordReset = new UserPasswordReset
            {
                Id = userPasswordReset,
                UserId = userId
            }
        };

        var createdUser = await users.CreateAsync(user);
        return new UserResponseDto
        {
            Id = createdUser.Id,
            Name = createdUser.Name,
            Surname = createdUser.Surname,
            Username = createdUser.Username,
            Email = createdUser.Email,
            Phone = createdUser.UserProfile?.Phone ?? string.Empty,
            Role = roleName,
            Status = createdUser.Status,
            IsEmailVerified = createdUser.UserEmail?.EmailVerified ?? false,
            CreatedAt = createdUser.CreatedAt,
            UpdatedAt = createdUser.UpdatedAt
        };
    }

    public async Task<UserResponseDto> UpdateUserByAdminAsync(string id, AdminUpdateUserDto dto)
    {
        var user = await users.GetByIdAsync(id);

        if (!string.Equals(user.Email, dto.Email, StringComparison.OrdinalIgnoreCase) && await users.ExistsByEmailAsync(dto.Email))
            throw new InvalidOperationException("Email already exists");

        if (!string.Equals(user.Username, dto.Username, StringComparison.OrdinalIgnoreCase) && await users.ExistsByUsernameAsync(dto.Username))
            throw new InvalidOperationException("Username already exists");

        var roleName = dto.Role.Trim().ToUpperInvariant();
        if (!RoleConstants.AllowedRoles.Contains(roleName))
            throw new InvalidOperationException($"Role {roleName} not allowed");

        var isUserAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isUserAdmin && roleName != RoleConstants.ADMIN_ROLE)
        {
            var adminCount = await roles.CountUsersInRoleAsync(RoleConstants.ADMIN_ROLE);
            if (adminCount <= 1)
                throw new InvalidOperationException("Cannot remove the last administrator");
        }

        user.Name = dto.Name;
        user.Surname = dto.Surname;
        user.Username = dto.Username;
        user.Email = dto.Email.ToLowerInvariant();

        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            user.Password = passwordHashService.HashPassword(dto.Password);
        }

        if (user.UserProfile == null)
        {
            user.UserProfile = new UserProfile
            {
                Id = UuidGenerator.GenerateUserId(),
                UserId = user.Id,
                Phone = dto.Phone
            };
        }
        else
        {
            user.UserProfile.Phone = dto.Phone;
        }

        var roleEntity = await roles.GetByNameAsync(roleName)
            ?? throw new InvalidOperationException($"Role {roleName} not found");

        await users.UpdateAsync(user);
        await users.UpdateUserRoleAsync(user.Id, roleEntity.Id);

        user = await users.GetByIdAsync(id);

        return new UserResponseDto
        {
            Id = user.Id,
            Name = user.Name,
            Surname = user.Surname,
            Username = user.Username,
            Email = user.Email,
            Phone = user.UserProfile?.Phone ?? string.Empty,
            Role = roleName,
            Status = user.Status,
            IsEmailVerified = user.UserEmail?.EmailVerified ?? false,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    public async Task<bool> DeleteUserAsync(string userId)
    {
        var user = await users.GetByIdAsync(userId);
        
        var isUserAdmin = user.UserRoles.Any(r => r.Role.Name == RoleConstants.ADMIN_ROLE);
        if (isUserAdmin)
        {
            var adminCount = await roles.CountUsersInRoleAsync(RoleConstants.ADMIN_ROLE);
            if (adminCount <= 1)
                throw new InvalidOperationException("Cannot delete the last administrator");
        }

        return await users.DeleteAsync(userId);
    }

    public async Task<bool> ChangePasswordAsync(string userId, string oldPassword, string newPassword)
    {
        var user = await users.GetByIdAsync(userId);

        if (!passwordHashService.VerifyPassword(oldPassword, user.Password))
            throw new InvalidOperationException("Incorrect old password");

        user.Password = passwordHashService.HashPassword(newPassword);
        await users.UpdateAsync(user);
        return true;
    }
}
