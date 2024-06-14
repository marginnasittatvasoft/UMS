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
using UMS_BusinessLogic.Services.Interfaces;

namespace UMS_BusinessLogic.Services.Repos
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

        /// <summary>
        /// Generates a JWT token for a given username and role.
        /// </summary>
        /// <param name="username">The username for which the token is generated.</param>
        /// <param name="role">The role of the user for which the token is generated.</param>
        /// <returns>A JWT token as a string.</returns>
        public string GetJwtToken(string username, string role)
        {
            try
            {
                JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
                SymmetricSecurityKey securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:key"]));
                SigningCredentials credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new[]
                    {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role),
            }),
                    Expires = DateTime.UtcNow.AddMinutes(30),
                    SigningCredentials = credentials
                };

                SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw ex;
            }
        }


        /// <summary>
        /// Verifies the provided JWT token.
        /// </summary>
        /// <param name="token">The JWT token to verify.</param>
        /// <param name="jwttoken">The validated JWT token if verification is successful.</param>
        /// <returns>A boolean indicating whether the token is valid.</returns>
        public bool VerifyToken(string token, out JwtSecurityToken jwttoken)
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.UTF8.GetBytes(_configuration["Jwt:key"]);

            try
            {
                SecurityToken validatedToken;
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero,
                }, out validatedToken);

                jwttoken = (JwtSecurityToken)validatedToken;

                return jwttoken != null;
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
