using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Sistemaserviciostaller.Data;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Sistemaserviciostaller.Services;

[Route("api/[controller]")]
[ApiController]
[EnableCors("AllowAll")]
public class AuthController : ControllerBase
{
    private readonly TallervehicularContext _context;
    private readonly ILogger<AuthController> _logger;
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _env;

    public AuthController(
        TallervehicularContext context,
        ILogger<AuthController> logger,
        IConfiguration config,
        IWebHostEnvironment env)
    {
        _context = context;
        _logger = logger;
        _config = config;
        _env = env;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
        {
            return BadRequest(new { success = false, message = "Email y contraseña son requeridos" });
        }

        try
        {
            var jwtKey = _config["Jwt:Key"];
            var expireHours = _config.GetValue<int>("Jwt:ExpireHours", 2);

            if (string.IsNullOrWhiteSpace(jwtKey))
            {
                _logger.LogError("Configuración JWT: Key no está configurada");
                return StatusCode(500, new { success = false, message = "Error de configuración del servidor" });
            }

            var user = await _context.Usuario
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
            {
                _logger.LogInformation($"Intento de inicio de sesión fallido para: {dto.Email}");
                return Unauthorized(new { success = false, message = "Credenciales incorrectas" });
            }

            if (string.IsNullOrWhiteSpace(user.PasswordHash) || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                _logger.LogInformation($"Contraseña incorrecta para: {user.Email}");
                return Unauthorized(new { success = false, message = "Credenciales incorrectas" });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var keyBytes = Encoding.ASCII.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(expireHours),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(keyBytes),
                    SecurityAlgorithms.HmacSha256Signature),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            _logger.LogInformation($"Inicio de sesión exitoso para: {user.Email}");

            return Ok(new
            {
                success = true,
                token = tokenString,
                expiresIn = expireHours * 3600,
                user = new { user.Id, user.Nombre, user.Email }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error en el método Login para: {dto.Email}");
            return StatusCode(500, new
            {
                success = false,
                message = "Error interno del servidor",
                error = _env.IsDevelopment() ? ex.Message : null
            });
        }
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterDto dto)
    {
        try
        {
            _logger.LogInformation("Intento de registro para: {Email}", dto.Email);

            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                _logger.LogWarning("Errores de validación: {@Errors}", errors);
                return BadRequest(new
                {
                    success = false,
                    message = "Errores de validación",
                    errors
                });
            }

            if (_context.Usuario.Any(u => u.Email == dto.Email))
            {
                _logger.LogWarning("Email ya registrado: {Email}", dto.Email);
                return BadRequest(new
                {
                    success = false,
                    message = "El email ya está registrado."
                });
            }

            var user = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password)
            };

            _context.Usuario.Add(user);
            _context.SaveChanges();

            _logger.LogInformation("Usuario registrado exitosamente: {Email}", dto.Email);

            return Ok(new
            {
                success = true,
                message = "Usuario creado con éxito.",
                user = new { user.Nombre, user.Email }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al registrar usuario");
            return StatusCode(500, new
            {
                success = false,
                message = "Error interno del servidor.",
                error = ex.Message
            });
        }
    }

    // AuthController.cs
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
        if (!string.IsNullOrEmpty(token))
        {
            TokenBlacklist.Add(token);
        }
        return Ok(new { message = "Sesión cerrada" });
    }



    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class RegisterDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(50, ErrorMessage = "El nombre no puede exceder los 50 caracteres")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "El email es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de email inválido")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "La contraseña es obligatoria")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "La contraseña debe tener al menos 6 caracteres")]
        public string Password { get; set; } = string.Empty;
    }
}