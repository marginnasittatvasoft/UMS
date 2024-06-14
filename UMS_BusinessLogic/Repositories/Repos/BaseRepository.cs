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

        public BaseRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = _dbContext.Set<T>();
        }

        /// <summary>
        /// Retrieves an entity of type T by its unique identifier asynchronously.
        /// Throws an exception if the entity is not found.
        /// </summary>
        /// <param name="id">The identifier of the entity to retrieve.</param>
        /// <returns>The entity of type T if found; otherwise, null.</returns>
        public async Task<T> GetById(int id)
        {
            T? data = await _dbSet.FindAsync(id);

            if (data == null)
            {
                throw new Exception("Error in Retrive the data by id");
            }
            return data;
        }

        /// <summary>
        /// Retrieves all entities of type T asynchronously.
        /// Throws an exception if no entities are found.
        /// </summary>
        /// <returns>A collection of all entities of type T.</returns>
        public async Task<List<T>> GetAll()
        {
            try
            {
                List<T> data = await _dbSet.ToListAsync();
                return data;
            }
            catch (Exception ex)
            {
                throw new Exception("Error in Retrieve all the data", ex);
            }
        }

        /// <summary>
        /// Retrieves entities of type T that match the specified predicate asynchronously.
        /// Throws an exception if no entities are found.
        /// </summary>
        /// <param name="predicate">The condition to filter entities.</param>
        /// <returns>A collection of entities of type T that satisfy the predicate.</returns>
        public async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> predicate)
        {
            try
            {
                List<T> data = await _dbSet.Where(predicate).ToListAsync();
                return data;
            }
            catch (Exception ex)
            {
                throw new Exception("Data not Found", ex);
            }
        }

        /// <summary>
        /// Adds a new entity of type T asynchronously.
        /// Catches and logs database update exceptions and other unexpected exceptions.
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
            catch (DbUpdateException dbEx)
            {
                throw new Exception("An error occurred while updating the database", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("An unexpected error occurred", ex);
            }
        }


        /// <summary>
        /// Updates an existing entity of type T asynchronously.
        /// Catches and rethrows database update exceptions and other unexpected exceptions.
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
            catch (DbUpdateException dbEx)
            {
                throw new Exception("Database update error in Add method", dbEx);
            }
            catch (Exception ex)
            {
                throw new Exception("Error in Update method: ", ex);
            }
        }


        /// <summary>
        /// Soft deletes or removes an entity of type T asynchronously by its identifier.
        /// If the entity has an IsDeleted property, it sets this property to true; otherwise, it removes the entity from the database.
        /// Throws an exception if the entity is not found.
        /// </summary>
        /// <param name="id">The identifier of the entity to delete.</param>
        /// <returns>True if the entity was successfully deleted or marked as deleted; otherwise, false.</returns>
        public async Task<bool> Delete(int id)
        {
            try
            {
                T? entity = await _dbSet.FindAsync(id);
                if (entity == null)
                {
                    return false;
                    throw new Exception("No data Found with given id");
                }

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
                throw new Exception("Error in Delete method: ", ex);
            }
        }


    }
}
