using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace UMS_BusinessLogic.CommonRepository
{
    public interface ICommonRepository<T>
    {
        IQueryable<T> FindAll();
        IQueryable<T> FindById(int id);
        void Create(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}
