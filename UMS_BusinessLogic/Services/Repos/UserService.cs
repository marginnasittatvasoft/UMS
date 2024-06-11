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
using UMS_DataAccess.Dto;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services.Repos
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUserRepositories _userRepositories;
        private readonly ILogger<UserService> _logger;

        public UserService(ApplicationDbContext context, IMapper mapper, IUserRepositories userRepositories, ILogger<UserService> logger)
        {
            _context = context;
            _mapper = mapper;
            _userRepositories = userRepositories;
            _logger = logger;
        }

        #region GetUsersData

        /// <summary>
        /// Retrieves a user by their ID.
        /// </summary>
        /// <param name="id">The ID of the user to retrieve.</param>
        /// <returns>A Task representing the asynchronous operation, with a User object as the result.</returns>
        public async Task<User> GetUserById(int id)
        {
            try
            {
                return await _userRepositories.GetUserById(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Retrieves a list of users.
        /// </summary>
        /// <param name="id">An identifier for the query (could be used for filtering).</param>
        /// <returns>A Task representing the asynchronous operation, with a list of User objects as the result.</returns>
        public async Task<List<User>> GetUsers(int id)
        {
            try
            {
                return await _userRepositories.GetAllUsers(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Retrieves user roles based on their username.
        /// </summary>
        /// <param name="username">The username of the user.</param>
        /// <returns>A Task representing the asynchronous operation, with a User object as the result.</returns>
        public async Task<User> GetUserRoles(string username)
        {
            try
            {
                return await _userRepositories.GetUserByUsername(username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Checks if a user exists based on their username, email, and ID.
        /// </summary>
        /// <param name="username">The username to check.</param>
        /// <param name="email">The email to check.</param>
        /// <param name="id">The ID to check.</param>
        /// <returns>A Task representing the asynchronous operation, with a boolean indicating if the user exists.</returns>
        public async Task<bool> UserExists(string username, string email, int id)
        {
            try
            {
                return await _userRepositories.UserExists(username, email, id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        #endregion

        #region ActionOnUsersData

        /// <summary>
        /// Adds a new user to the system.
        /// </summary>
        /// <param name="user">The user object to add.</param>
        /// <returns>A Task representing the asynchronous operation, with a User object as the result.</returns>
        public async Task<User> AddUser(User user)
        {
            try
            {
                return await _userRepositories.AddUser(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Updates an existing user.
        /// </summary>
        /// <param name="id">The ID of the user to update.</param>
        /// <param name="user">The updated user object.</param>
        /// <returns>A Task representing the asynchronous operation, with a User object as the result.</returns>
        public async Task<User> UpdateUser(int id, User user)
        {
            try
            {
                var existingUser = await _userRepositories.GetUserById(id);
                if (existingUser == null)
                    return null;

                _mapper.Map(user, existingUser);

                return await _userRepositories.UpdateUser(existingUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw ex;
            }
        }

        /// <summary>
        /// Deletes a user or multiple users based on their IDs.
        /// </summary>
        /// <param name="id">An array of user IDs to delete.</param>
        /// <returns>A Task representing the asynchronous operation, with a boolean indicating the success of the operation.</returns>
        public async Task<bool> DeleteUser(int[] id)
        {
            try
            {
                return await _userRepositories.DeleteUser(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        #endregion

        #region AuthenticateUser

        /// <summary>
        /// Authenticates a user based on their username and password.
        /// </summary>
        /// <param name="username">The username of the user.</param>
        /// <param name="password">The password of the user.</param>
        /// <returns>A Task representing the asynchronous operation, with a boolean indicating if the authentication was successful.</returns>
        public async Task<bool> Authenticate(string username, string password)
        {
            try
            {
                return _userRepositories.AuthenticateUser(username, password);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        #endregion
    }
}
