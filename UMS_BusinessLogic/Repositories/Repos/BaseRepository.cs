using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using UMS_BusinessLogic.Repositories.Interfaces;
using UMS_DataAccess.Models;

namespace UMS_BusinessLogic.Repositories.Repos
{
    public class BaseRepository<T> : IBaseRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _dbContext;
        protected readonly DbSet<T> _dbSet;
        protected readonly ILogger<BaseRepository<T>> _logger;

        public BaseRepository(ApplicationDbContext dbContext, ILogger<BaseRepository<T>> logger)
        {
            _dbContext = dbContext;
            _dbSet = _dbContext.Set<T>();
            _logger = logger;
        }

        /// <summary>
        /// Retrieves an entity of type T by its unique identifier asynchronously.
        /// </summary>
        /// <param name="id">The identifier of the entity to retrieve.</param>
        /// <returns>The entity of type T if found; otherwise, null.</returns>
        public async Task<T> GetById(int id)
        {
            try
            {
                return await _dbSet.FindAsync(id);
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in Retrive the data by id: ", ex.ToString());
                throw ex;
            }
        }

        /// <summary>
        /// Retrieves all entities of type T asynchronously.
        /// </summary>
        /// <returns>A collection of all entities of type T.</returns>
        public async Task<List<T>> GetAll()
        {
            try
            {
                return await _dbSet.ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in Retrieve all the data: ", ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Retrieves entities of type T that match the specified predicate asynchronously.
        /// </summary>
        /// <param name="predicate">The condition to filter entities.</param>
        /// <returns>A collection of entities of type T that satisfy the predicate.</returns>
        public async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate)
        {
            try
            {
                return await _dbSet.Where(predicate).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in find the data: ", ex.ToString());
                throw ex;
            }
        }

        /// <summary>
        /// Adds a new entity of type T asynchronously.
        /// </summary>
        /// <param name="entity">The entity of type T to add.</param>
        /// <returns>The added entity of type T.</returns>
        public async Task<T> Add(T entity)
        {
            try
            {
                _dbSet.Add(entity);
                await _dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in Add the data: ", ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Updates an existing entity of type T asynchronously.
        /// </summary>
        /// <param name="entity">The entity of type T to update.</param>
        /// <returns>The updated entity of type T.</returns>
        public async Task<T> Update(T entity)
        {
            try
            {
                _dbContext.Entry(entity).State = EntityState.Modified;
                await _dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in Update the data: ", ex.ToString());
                throw;
            }
        }

        /// <summary>
        /// Soft deletes or removes an entity of type T asynchronously by its identifier.
        /// </summary>
        /// <param name="id">The identifier of the entity to delete.</param>
        /// <returns>True if the entity was successfully deleted or marked as deleted; otherwise, false.</returns>
        public async Task<bool> Delete(int id)
        {
            try
            {
                T? entity = await _dbSet.FindAsync(id);
                if (entity == null)
                    return false;

                PropertyInfo? isDeletedProp = typeof(T).GetProperty("IsDeleted");
                if (isDeletedProp != null)
                {
                    isDeletedProp.SetValue(entity, true);
                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    _dbSet.Remove(entity);
                    await _dbContext.SaveChangesAsync();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Error in Delete: ", ex.ToString());
                throw;
            }
        }


    }
}
