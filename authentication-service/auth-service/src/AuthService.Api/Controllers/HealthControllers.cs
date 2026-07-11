using System;
using Microsoft.AspNetCore.Mvc;

namespace AuthService.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class HealthControllers: ControllerBase
{
    [HttpGet]
    public IActionResult GetHealth()
    {
        var response = new
        {
            status = "Healthy",
            timespan = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffz"),
            service = "Kinal Sport AuthService"
        };
        return Ok(response);
    }
}