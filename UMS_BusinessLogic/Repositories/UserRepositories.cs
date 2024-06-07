using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Services;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories
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
                _logger.LogError("Getting error with id" + ex.ToString());
                throw ex;
            }
        }

        public async Task<List<User>> GetAllUsers()
        {
            try
            {
                return await _context.Users.Where(i => !i.IsDeleted).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("Getting error with users"+ ex.ToString());
                throw ex;
            }
        }

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
                _logger.LogError("Getting error with Add User"+ ex.ToString());
                throw ex;
            }
        }

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
                _logger.LogError("Getting error with Update User"+ ex.ToString());
                throw ex;
            }
        }

        public async Task<bool> DeleteUser(int id)
        {
            try
            {
                var existingUser = await _context.Users.FindAsync(id);
                if (existingUser == null)
                    return false;

                existingUser.IsDeleted = true;
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Getting error with Delete User"+ ex.ToString());
                throw ex;
            }
        }


        public bool AuthenticateUser(string username, string password)
        {
            try
            {
                if(username != null)
                {
                    User? user = _context.Users.FirstOrDefault(i => i.UserName == username);
                    if(user != null)
                    {
                        return _context.Users.Any(i => i.UserName == username && i.Password == password);
                    }
                    return false;

                }
                return false;
            }
            catch(Exception ex)
            {
                _logger.LogError("Getting error with Authenticate" + ex.ToString());
                throw ex;
            }

        }
    }
}
