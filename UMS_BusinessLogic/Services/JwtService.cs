using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace UMS_BusinessLogic.Services
{
    public class JwtService : IJwtService
    {
        public IConfiguration _configuration { get; set; }
        private readonly ILogger<JwtService> _logger;

        public JwtService(IConfiguration configuration, ILogger<JwtService> logger)
        {
            _configuration = configuration;
            _logger = logger;

        }

        public string GetJwtToken(string username, string role)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                    new Claim(ClaimTypes.Name, username),
                     new Claim(ClaimTypes.Role, role),
                }),
                    Expires = DateTime.UtcNow.AddMinutes(30),
                    SigningCredentials = credentials
                };

                var token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw ex;
            }

        }

        public bool VerifyToken(string token, out JwtSecurityToken jwttoken)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:key"]);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                }, out SecurityToken validatedToken);
                jwttoken = (JwtSecurityToken)validatedToken;

                if (jwttoken != null)
                {
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                jwttoken = null;
                return false;
            }
        }
    }
}
