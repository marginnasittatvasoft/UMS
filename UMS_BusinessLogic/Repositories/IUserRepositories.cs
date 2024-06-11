using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories
{
    public interface IUserRepositories
    {
        Task<User> GetUserById(int id);

        Task<List<User>> GetAllUsers(int id);

        Task<bool> UserExists(string username, string email, int id);

        Task<User> AddUser(User user);

        Task<User> UpdateUser(User user);

        Task<bool> DeleteUser(int[] id);

        bool AuthenticateUser(string username, string password);


        Task<User> GetUserByUsername(string username);
        
    }
}
