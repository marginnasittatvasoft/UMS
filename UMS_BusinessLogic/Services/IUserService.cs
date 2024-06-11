using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services
{
    public interface IUserService
    {
        Task<User> GetUserById(int id);
        Task<List<User>> GetUsers(int id);
        Task<User> AddUser(User user);

        Task<bool> UserExists(string username,string email,int id);
        Task<User> UpdateUser(int id, User user);
        Task<bool> DeleteUser(int[] id);

        Task<bool> Authenticate(string username, string password);

        Task<User> GetUserRoles(string username);
    }
}