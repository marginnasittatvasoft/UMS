using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_BusinessLogic.Services;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories.Repos
{
    public class UserRepositories : IUserRepositories
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserRepositories> _logger;

        public UserRepositories(ApplicationDbContext context, ILogger<UserRepositories> logger)
        {
            _context = context;
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
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id && !u.IsDeleted);
                if (user == null)
                {
                    _logger.LogError("User with ID {Id} not found", id);
                }
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while retrieving user by ID: " + ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Retrieves a list of users.
        /// </summary>
        /// <param name="id">An identifier for the query (could be used for filtering).</param>
        /// <returns>A Task representing the asynchronous operation, with a list of User objects as the result.</returns>
        public async Task<List<User>> GetAllUsers(int id)
        {
            try
            {
                if (_context.Users.Any(i => i.Id == id && !i.IsDeleted && i.RoleId == 1))
                {
                    return await _context.Users.Where(i => !i.IsDeleted).ToListAsync();
                }
                return await _context.Users.Where(i => !i.IsDeleted && i.Id == id).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while retrieving all users: " + ex.ToString());
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
                var userExists = await _context.Users
                    .FirstOrDefaultAsync(u => (u.UserName == username || u.Email == email) && u.Id != id);

                return userExists != null;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while checking user existence: " + ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Retrieves a user by their username.
        /// </summary>
        /// <param name="username">The username of the user to retrieve.</param>
        /// <returns>A Task representing the asynchronous operation, with a User object as the result.</returns>
        public async Task<User> GetUserByUsername(string username)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username && !u.IsDeleted);
                if (user == null)
                {
                    _logger.LogError("User with username not found", username);
                }
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while retrieving user by username: " + ex.ToString());
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
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while adding user: " + ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Updates an existing user.
        /// </summary>
        /// <param name="user">The updated user object.</param>
        /// <returns>A Task representing the asynchronous operation, with a User object as the result.</returns>
        public async Task<User> UpdateUser(User user)
        {
            try
            {
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while updating user: " + ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Deletes a user or multiple users based on their IDs.
        /// </summary>
        /// <param name="ids">An array of user IDs to delete.</param>
        /// <returns>A Task representing the asynchronous operation, with a boolean indicating the success of the operation.</returns>
        public async Task<bool> DeleteUser(int[] ids)
        {
            try
            {
                foreach (var id in ids)
                {
                    var existingUser = await _context.Users.FindAsync(id);
                    if (existingUser == null)
                        return false;

                    existingUser.IsDeleted = true;
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting users with IDs: {Ids}", ids);
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
        /// <returns>A boolean indicating if the authentication was successful.</returns>
        public bool AuthenticateUser(string username, string password)
        {
            try
            {
                if (username != null)
                {
                    User? user = _context.Users.FirstOrDefault(i => i.UserName == username && !i.IsDeleted);
                    if (user != null)
                    {
                        return _context.Users.Any(i => i.UserName == username && i.Password == password);
                    }
                    return false;
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error occurred while authenticating user: " + ex.ToString());
                throw;
            }
        }

        #endregion
    }
}
