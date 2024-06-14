using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services.Interfaces
{
    public interface IRoleService
    {
        #region AspNetRolesData

        Task<AspNetRole> GetRoleNameById(int id);
        Task<List<AspNetRole>> GetAllRoles();

        #endregion
    }
}
