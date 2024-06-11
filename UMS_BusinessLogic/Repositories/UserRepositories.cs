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
                throw;
            }
        }

        public async Task<List<User>> GetAllUsers(int id)
        {
            try
            {
                if(_context.Users.Any(i=> i.Id==id && !i.IsDeleted && i.RoleId==1))
                {
                    return await _context.Users.Where(i => !i.IsDeleted).ToListAsync();
                    
                }
                return await _context.Users.Where(i => !i.IsDeleted && i.Id == id).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("Getting error with users" + ex.ToString());
                throw;
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
                _logger.LogError("Getting error with Add User" + ex.ToString());
                throw;
            }
        }

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
                _logger.LogError("Getting error with Update User" + ex.ToString());
                throw;
            }
        }

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
                _logger.LogError("Getting error with Authenticate" + ex.ToString());
                throw;
            }

        }


        public async Task<User> GetUserByUsername(string username)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == username && !u.IsDeleted);
                if (user == null)
                {
                    _logger.LogError("User with username not found", user);
                }
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError("Getting error with username" + ex.ToString());
                throw;
            }
        }
    }
}
