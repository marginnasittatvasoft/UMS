using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_BusinessLogic.Services;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories.Repos
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _userDbContext;
        private readonly IBaseRepository<User> _baseRepository;
        private readonly ILogger<UserRepository> _logger;

        public UserRepository(ApplicationDbContext userDbContext, ILogger<UserRepository> logger, IBaseRepository<User> baseRepository)
        {
            _userDbContext = userDbContext;
            _baseRepository = baseRepository;
            _baseRepository = baseRepository;
            _logger = logger;
        }

        #region User Existence

        /// <summary>
        /// Checks if a user with the specified username or email exists, excluding a user with a specific ID.
        /// </summary>
        /// <param name="username">The username to check.</param>
        /// <param name="email">The email to check.</param>
        /// <param name="id">The ID to exclude from the check.</param>
        /// <returns>True if the user exists; otherwise, false.</returns>
        public async Task<bool> UserExists(string username, string email, int id)
        {
            try
            {
                User? userExists = await _userDbContext.Users
                    .FirstOrDefaultAsync(u => (u.UserName == username || u.Email == email) && u.Id != id);

                return userExists != null;
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while checking user existence:", ex);
            }
        }

        #endregion


        #region Get User Methods

        /// <summary>
        /// Retrieves a user by their username.
        /// </summary>
        /// <param name="username">The username of the user.</param>
        /// <returns>The user with the specified username.</returns>
        public async Task<User> GetUserByUsername(string username)
        {
            try
            {
                User? user = await _userDbContext.Users.FirstOrDefaultAsync(u => u.UserName == username && !u.IsDeleted);
                if (user == null)
                {
                    throw new Exception($"User with username {username} not found");
                }
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while retrieving user by username: ",ex);
            }
        }

        /// <summary>
        /// Retrieves a user by their ID.
        /// </summary>
        /// <param name="id">The ID of the user.</param>
        /// <returns>The user with the specified ID.</returns>
        public async Task<User> GetUserById(int id)
        {
            return await _baseRepository.GetById(id);
        }


        /// <summary>
        /// Retrieves multiple users based on the specified ID.
        /// </summary>
        /// <param name="id">The ID used to filter users.</param>
        /// <returns>A list of users matching the criteria.</returns>
        public async Task<List<User>> GetMutipleUsers(int id)
        {
            try
            {
                if (_userDbContext.Users.Any(u => u.Id == id && u.RoleId == 1 && !u.IsDeleted))
                {
                    return (await _baseRepository.Find(i => !i.IsDeleted)).ToList();
                }
                return (await _baseRepository.Find(i => !i.IsDeleted && i.Id == id)).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error in Getting Mutiple Users: ",ex);
            }
        }

        #endregion


        #region CRUD Operations

        /// <summary>
        /// Adds a new user.
        /// </summary>
        /// <param name="entity">The user entity to add.</param>
        /// <returns>The added user entity.</returns>
        public async Task<User> AddUser(User entity)
        {
            return await _baseRepository.Add(entity);
        }

        /// <summary>
        /// Updates an existing user.
        /// </summary>
        /// <param name="entity">The user entity to update.</param>
        /// <returns>The updated user entity.</returns>
        public async Task<User> UpdateUser(User entity)
        {
            return await _baseRepository.Update(entity);
        }

        /// <summary>
        /// Deletes users with the specified IDs.
        /// </summary>
        /// <param name="ids">The IDs of the users to delete.</param>
        /// <returns>True if the users were deleted; otherwise, false.</returns>
        public async Task<bool> DeleteUser(int[] ids)
        {
            try
            {
                bool result = true;
                foreach (var id in ids)
                {
                    result &= await _baseRepository.Delete(id);
                }
                return result;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in Getting while delete Users:",ex);
            }
        }

        #endregion


       
    }
}
