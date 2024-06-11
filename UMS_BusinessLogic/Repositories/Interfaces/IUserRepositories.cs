using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories.Interfaces
{
    public interface IUserRepositories
    {
        #region GetUsersData
        Task<User> GetUserById(int id);

        Task<List<User>> GetAllUsers(int id);

        Task<bool> UserExists(string username, string email, int id);

        Task<User> GetUserByUsername(string username);
        #endregion

        #region ActionOnUsersData
        Task<User> AddUser(User user);

        Task<User> UpdateUser(User user);

        Task<bool> DeleteUser(int[] id);
        #endregion

        #region AuthenticateUser
        bool AuthenticateUser(string username, string password);
        #endregion
    }
}
