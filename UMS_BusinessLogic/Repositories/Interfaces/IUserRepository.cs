using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<bool> UserExists(string username, string email, int id);

        Task<User> GetUserByUsername(string username);

        Task<User> GetUserById(int id);

        Task<List<User>> GetMutipleUsers(int id);

        Task<User> AddUser(User entity);

        Task<User> UpdateUser(User entity);

        Task<bool> DeleteUser(int[] id);

    }
}
