using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services.Interfaces
{
    public interface IUserService
    {
        #region User Existence
        Task<bool> UserExists(string username, string email, int id);

        #endregion

        #region GetUsersData
        Task<User> GetUserById(int id);
        Task<List<User>> GetUsers(int id);
        Task<User> GetUserByUsername(string username);
        
        #endregion

        #region CRUD Operations
        Task<User> AddUser(User user);
        Task<User> UpdateUser(int id, User user);
        Task<bool> DeleteUser(int[] id);
        #endregion

       
    }
}