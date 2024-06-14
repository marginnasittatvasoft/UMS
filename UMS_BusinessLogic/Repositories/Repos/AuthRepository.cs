using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories.Repos
{
    public class AuthRepository:IAuthRepository
    {

        private readonly ApplicationDbContext _userDbContext;
        private readonly ILogger<AuthRepository> _logger;

        public AuthRepository(ApplicationDbContext userDbContext, ILogger<AuthRepository> logger)
        {
            _userDbContext = userDbContext;
            _logger = logger;
        }

        /// <summary>
        /// Authenticates a user based on username and password.
        /// </summary>
        /// <param name="username">Username of the user to authenticate.</param>
        /// <param name="password">Password of the user to authenticate.</param>
        /// <returns>True if the user is authenticated; false otherwise.</returns>
        public bool AuthenticateUser(string username, string password)
        {
            try
            {
                if (username != null)
                {
                    User? user = _userDbContext.Users.FirstOrDefault(i => i.UserName == username && !i.IsDeleted);
                    if (user != null)
                    {
                        return _userDbContext.Users.Any(i => i.UserName == username && i.Password == password);
                    }
                    return false;
                }
                return false;
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while authenticating user: ", ex);
            }
        }

    }
}
