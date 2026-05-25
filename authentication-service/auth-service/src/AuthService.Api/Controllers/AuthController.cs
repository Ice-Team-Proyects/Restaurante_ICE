using System;
using AuthService.Application.DTOs;
using AuthService.Application.DTOs.Email;
using AuthService.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.RateLimiting;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(IAuthService authService, IConfiguration configuration) : ControllerBase
{
    [HttpPost("login")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
    {
        var result = await authService.LoginAsync(loginDto);
        return Ok(result);
    }

    [HttpPost("register")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<RegisterResponseDto>> Register([FromForm] RegisterDto registerDto)
    {
        var result = await authService.RegisterAsync(registerDto);
        return StatusCode(201, result);
    }

    [HttpPost("verify-email")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<ActionResult<EmailResponseDto>> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
    {
        var result = await authService.VerifyEmailAsync(verifyEmailDto);
        return Ok(result);
    }

    [HttpGet("verify-email")]
    [EnableRateLimiting("AuthPolicy")]
    public async Task<IActionResult> VerifyEmailFromQuery([FromQuery] string token)
    {
        var dto = new VerifyEmailDto { Token = token };
        var result = await authService.VerifyEmailAsync(dto);

        var frontend = configuration["AppSettings:FrontendUrl"] ?? "/";
        if (result != null && result.Success)
        {
            // After successful verification, redirect user to frontend login page so they can sign in
            return Redirect($"{frontend}/login?verified=true");
        }
        else
        {
            // On failure, redirect to login with a failed flag (frontend can show an error)
            return Redirect($"{frontend}/login?verified=false");
        }
    }
}
