using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories;
using UMS_DataAccess.Dto;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly IUserRepositories _userRepositories;
        private readonly ILogger<UserService> _logger;

        public UserService(ApplicationDbContext context, IMapper mapper, IUserRepositories userRepositories,ILogger<UserService> logger)
        {
            _context = context;
            _mapper = mapper;
            _userRepositories = userRepositories;
            _logger=logger;
        }

        public async Task<User> GetUserById(int id)
        {
            try
            {
                return await _userRepositories.GetUserById(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw ex;
            }
        }

        public async Task<List<User>> GetUsers()
        {
            try
            {
                return await _userRepositories.GetAllUsers();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw ex;
            }
        }

        public async Task<User> AddUser(User user)
        {
            try
            {
                return await _userRepositories.AddUser(user); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw ex;
            }
        }


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

        public async Task<bool> DeleteUser(int id)
        {
            try
            {
                return await _userRepositories.DeleteUser(id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw ex;
            }
        }


        public async Task<bool> Authenticate(string username, string password)
        {
            try
            {
                return _userRepositories.AuthenticateUser(username, password);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.ToString());
                throw ex;
            }
        }



    }
}
