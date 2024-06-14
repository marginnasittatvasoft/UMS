using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_BusinessLogic.Repositories.Repos;
using UMS_BusinessLogic.Services.Interfaces;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Services.Repos
{
    public class RoleService: IRoleService
    {
        private readonly IAspNetRoleRepository _aspNetRoleRepository;

        public RoleService(IAspNetRoleRepository aspNetRoleRepository)
        {
            _aspNetRoleRepository = aspNetRoleRepository;
        }

        #region AspNetRolesData

        /// <summary>
        /// Retrieves an AspNetRole by its ID from the repository.
        /// </summary>
        /// <param name="id">The ID of the role to retrieve.</param>
        /// <returns>A task that represents the asynchronous operation. 
        /// The task result contains the AspNetRole object corresponding to the provided ID.</returns>
        public async Task<AspNetRole> GetRoleNameById(int id)
        {
            try
            {
                return await _aspNetRoleRepository.GetRoleById(id);
            }
            catch
            {
                throw new Exception();
            }
        }


        /// <summary>
        /// Retrieves all roles from the repository.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation. 
        /// The task result contains a list of AspNetRole objects representing all roles.</returns>
        public async Task<List<AspNetRole>> GetAllRoles()
        {
            try
            {
                return await _aspNetRoleRepository.GetAllRoles();
            }
            catch
            {
                throw new Exception();
            }
        }

        #endregion
    }
}
