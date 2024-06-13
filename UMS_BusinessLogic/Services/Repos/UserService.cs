using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_BusinessLogic.Repositories.Repos;
using UMS_BusinessLogic.Services.Interfaces;
using UMS_DataAccess.Dto;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services.Repos
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IAspNetRoleRepository _aspNetRoleRepository;
        private readonly ILogger<UserService> _logger;

        public UserService(IMapper mapper, IUserRepository userRepository, ILogger<UserService> logger, IAspNetRoleRepository aspNetRoleRepository)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _logger = logger;
            _aspNetRoleRepository = aspNetRoleRepository;
        }

        #region User Existence

        /// <summary>
        /// Checks if a user with the given username or email exists, excluding the user with the specified id.
        /// </summary>
        /// <param name="username">Username to check.</param>
        /// <param name="email">Email to check.</param>
        /// <param name="id">Id of the user to exclude from the check.</param>
        /// <returns>True if a user with the given username or email exists (excluding the specified id), false otherwise.</returns>
        public async Task<bool> UserExists(string username, string email, int id)
        {
            try
            {
                return await _userRepository.UserExists(username, email, id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        #endregion

        #region GetUsersData

        /// <summary>
        /// Retrieves a user by their identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the user to retrieve.</param>
        /// <returns>The user object if found; otherwise, null.</returns>
        public async Task<User> GetUserById(int id)
        {
            try
            {
                return await _userRepository.GetUserById(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Retrieves a list of users based on whether the requester is an admin or not.
        /// </summary>
        /// <param name="id">The identifier of the user requesting the data.</param>
        /// <returns>A list of users based on the user's admin status.</returns>
        public async Task<List<User>> GetUsers(int id)
        {
            try
            {
                return await _userRepository.GetMutipleUsers(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Retrieves a user and their roles by username asynchronously.
        /// </summary>
        /// <param name="username">The username of the user to retrieve.</param>
        /// <returns>The user object including their roles if found; otherwise, null.</returns>
        public async Task<User> GetUserByUsername(string username)
        {
            try
            {
                return await _userRepository.GetUserByUsername(username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        #endregion

        #region CRUD Operations

        /// <summary>
        /// Adds a new user asynchronously.
        /// </summary>
        /// <param name="user">The user object to add.</param>
        /// <returns>The added user object.</returns>
        public async Task<User> AddUser(User user)
        {
            try
            {
                return await _userRepository.AddUser(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Updates an existing user asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the user to update.</param>
        /// <param name="user">The updated user object.</param>
        /// <returns>The updated user object.</returns>
        public async Task<User> UpdateUser(int id, User user)
        {
            try
            {
                var existingUser = await _userRepository.GetUserById(id);
                if (existingUser == null)
                    return null;
                _mapper.Map(user, existingUser);

                return await _userRepository.UpdateUser(existingUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Deletes one or more users asynchronously.
        /// </summary>
        /// <param name="ids">An array of user identifiers to delete.</param>
        /// <returns>True if all users were successfully deleted; false otherwise.</returns>
        public async Task<bool> DeleteUser(int[] ids)
        {
            try
            {
                return await _userRepository.DeleteUser(ids);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        #endregion

        #region AspNetRolesData
        public async Task<AspNetRole> GetRoleNameById(int id)
        {
            try
            {
                return await _aspNetRoleRepository.GetRoleById(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        public async Task<List<AspNetRole>> GetAllRoles() {
            try
            {
                return await _aspNetRoleRepository.GetAllRoles();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw;
            }
        }

        #endregion

    }
}
