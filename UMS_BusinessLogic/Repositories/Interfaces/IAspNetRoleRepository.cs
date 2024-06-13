using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories.Interfaces
{
    public interface IAspNetRoleRepository
    {
        Task<AspNetRole> GetRoleById(int id);
        Task<List<AspNetRole>> GetAllRoles();
    }
}
