using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UMS_BusinessLogic.Services.Interfaces
{
    public interface IJwtService
    {
        public string GetJwtToken(string username, string role);
        public bool VerifyToken(string token, out JwtSecurityToken jwttoken);
    }
}
