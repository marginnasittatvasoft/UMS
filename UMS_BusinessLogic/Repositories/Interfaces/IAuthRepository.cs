using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UMS_BusinessLogic.Repositories.Interfaces
{
    public interface IAuthRepository
    {
        bool AuthenticateUser(string username, string password);
    }
}
