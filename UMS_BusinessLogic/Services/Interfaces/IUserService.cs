using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services.Interfaces
{
    public interface IUserService
    {

        #region GetUsersData
        Task<User> GetUserById(int id);
        Task<List<User>> GetUsers(int id);
        Task<User> GetUserRoles(string username);
        Task<bool> UserExists(string username, string email, int id);
        #endregion

        #region ActionOnUsersData
        Task<User> AddUser(User user);
        Task<User> UpdateUser(int id, User user);
        Task<bool> DeleteUser(int[] id);
        #endregion

        #region AuthenticateUser
        Task<bool> Authenticate(string username, string password);
        #endregion
    }
}