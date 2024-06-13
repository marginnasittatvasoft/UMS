using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UMS_BusinessLogic.Services.Interfaces
{
    public interface IAuthService
    {
        Task<bool> Authenticate(string username, string password);
    }
}
