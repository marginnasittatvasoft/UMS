using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services
{
    public interface IUserService
    {
        Task<User> GetUserById(int id);
        Task<List<User>> GetUsers();
        Task<User> AddUser(User user);
        Task<User> UpdateUser(int id, User user);
        Task<bool> DeleteUser(int id);

        Task<bool> Authenticate(string username, string password);
    }
}