using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories.Repos
{
    public class AspNetRoleRepository : IAspNetRoleRepository
    {
        private readonly ApplicationDbContext _userDbContext;
        private readonly IBaseRepository<AspNetRole> _baseRepository;
        private readonly ILogger<UserRepository> _logger;

        public AspNetRoleRepository(ApplicationDbContext userDbContext, ILogger<UserRepository> logger, IBaseRepository<AspNetRole> baseRepository)
        {
            _userDbContext = userDbContext;
            _baseRepository = baseRepository;
            _logger = logger;
        }

        #region AspNetRolesData

        /// <summary>
        /// Retrieves role by id.
        /// </summary>
        /// <param name="id">The ID of the Role.</param>
        /// <returns>A task representing the asynchronous operation with get role by id.</returns>
        public async Task<AspNetRole> GetRoleById(int id)
        {
            try
            {
                return await _baseRepository.GetById(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while retrieving all roles: ", ex);
            }
        }


        /// <summary>
        /// Retrieves all roles.
        /// </summary>
        /// <returns>A task representing the asynchronous operation with a list of all roles.</returns>
        public async Task<List<AspNetRole>> GetAllRoles()
        {
            try
            {
                return await _baseRepository.GetAll();
            }
            catch (Exception ex)
            {
                throw new Exception("Error occurred while retrieving all roles: ", ex);
            }
        }

        #endregion
    }
}
