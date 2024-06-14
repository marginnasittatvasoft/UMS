using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_BusinessLogic.Services.Interfaces;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services.Repos
{
    public class AuthService:IAuthService
    {
        private readonly IAuthRepository _authRepository;
        private readonly ILogger<AuthService> _logger;

        public AuthService(ApplicationDbContext context, IMapper mapper, IAuthRepository authRepository, ILogger<AuthService> logger)
        {
            _authRepository = authRepository;
            _logger = logger;
        }


        /// <summary>
        /// Authenticates a user based on username and password.
        /// </summary>
        /// <param name="username">Username of the user to authenticate.</param>
        /// <param name="password">Password of the user to authenticate.</param>
        /// <returns>True if the user is authenticated; false otherwise.</returns>
        public async Task<bool> Authenticate(string username, string password)
        {
            try
            {
                return _authRepository.AuthenticateUser(username, password);
            }
            catch
            {
                throw new Exception();
            }
        }

    }
}
