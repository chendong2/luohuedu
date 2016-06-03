using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace Domain.common
{
    /********************************************************************************

        ** 作者： 来爱清

        ** 创始时间：2013-03-22

        ** 修改人：

        ** 修改时间：

        ** 修改人：

        ** 修改时间：

        ** 描述：

        **    主要用于封装LINQ的分页方法。
    *********************************************************************************/
    public static class LinqExtensions
    {
        #region "通用分页查询方法封装"
        public static List<TResult> GetPagedListQuery<TEntity, TOrderBy, TResult>(this IQueryable<TEntity> query,
           Expression<Func<TEntity, bool>> where,
           Expression<Func<TEntity, TOrderBy>> orderBy,
           Expression<Func<TEntity, int, TResult>> selector,
           bool isAsc)
        {
            if (selector == null)
            {
                throw new AggregateException("selector");
            }

            var queryable = query;
            if (where != null)
            {
                queryable = queryable.Where(where);
            }

            if (orderBy != null)
            {
                queryable = isAsc ? queryable.OrderBy(orderBy) : queryable.OrderByDescending(orderBy);
            }

            return queryable.Select(selector).ToList();
        }
        public static List<object> GetPagedListQuery<TEntity, TOrderBy>(this IQueryable<TEntity> query,
            Expression<Func<TEntity, bool>> where,
            Expression<Func<TEntity, TOrderBy>> orderBy,
            Func<IQueryable<TEntity>, List<object>> selector,
            bool isAsc)
        {
            if (selector == null)
            {
                throw new AggregateException("selector");
            }
            var queryable = query;
            if (where != null)
            {
                queryable = queryable.Where(where);
            }

            if (orderBy != null)
            {
                queryable = isAsc ? queryable.OrderBy(orderBy) : queryable.OrderByDescending(orderBy);
            }
            return selector(queryable);
        }
        public static Page<object> GetPagedListQuery<TEntity, TOrderBy>(this IQueryable<TEntity> query, int index,
             int pageSize,
            Expression<Func<TEntity, bool>> where,
            Expression<Func<TEntity, TOrderBy>> orderBy,
            Func<IQueryable<TEntity>, List<object>> selector,
            bool isAsc)
        {
            return GetPagedListQuery(query, index, pageSize, new List<Expression<Func<TEntity, bool>>> { where },
                orderBy, selector, isAsc);
        }

        public static Page<object> GetPagedListQuery<TEntity, TOrderBy>(this IQueryable<TEntity> query, int index,
           int pageSize,
           List<Expression<Func<TEntity, bool>>> wheres,
           Expression<Func<TEntity, TOrderBy>> orderBy,
           Func<IQueryable<TEntity>, List<object>> selector,
           bool isAsc)
        {
            return GetPagedListQuery<TEntity, TOrderBy, object>(query, index, pageSize, wheres, orderBy, selector, isAsc);
        }
        #endregion


        #region "通用分页查询方法封装 2"

        public static Page<TResult> GetPagedListQuery<TEntity, TOrderBy, TResult>(
            this IQueryable<TEntity> query,
            int index,
            int pageSize,
            List<Expression<Func<TEntity, bool>>> wheres,
            Expression<Func<TEntity, TOrderBy>> orderBy,
            Func<IQueryable<TEntity>, List<TResult>> selector,
            bool isAsc)
        {
            if (selector == null)
            {
                throw new AggregateException("selector");
            }

            Page.CheckPageIndexAndSize(ref index, ref pageSize);

            var queryable = query;
            if (wheres != null)
            {
                wheres.ForEach(p => queryable = queryable.Where(p));
            }
            int count = queryable.Count();

            Page.CheckPageIndexAndSize(ref index, pageSize, count);
            if (count > 0)
            {
                if (orderBy != null)
                {
                    queryable = isAsc ? queryable.OrderBy(orderBy) : queryable.OrderByDescending(orderBy);
                }
                return new Page<TResult>(index, pageSize, count, selector(queryable));
            }
            return new Page<TResult>(index, pageSize, count, new List<TResult>());
        }

        public static Page<TResult> GetPagedListQuery<TEntity, TOrderBy, TResult>(this IQueryable<TEntity> query, int index,
            int pageSize, Expression<Func<TEntity, bool>> where,
            Expression<Func<TEntity, TOrderBy>> orderBy,
            Func<IQueryable<TEntity>, List<TResult>> selector,
            bool isAsc)
        {
            return GetPagedListQuery(query, index, pageSize, new List<Expression<Func<TEntity, bool>>> { where },
                   orderBy, selector, isAsc);
        }
        #endregion

        #region "通用分页查询方法封装 3"
        public static Page<TResult> GetPagedListQuery<TEntity, IEntity, TOrderBy, TResult>(
            this IQueryable<TEntity> query,
            int index,
            int pageSize,
            List<Expression<Func<TEntity, IEntity, bool>>> wheres,
            Expression<Func<TEntity, TOrderBy>> orderBy,
            Func<IQueryable<TEntity>, List<TResult>> selector,
            bool isAsc)
        {
            if (selector == null)
            {
                throw new AggregateException("selector");
            }

            Page.CheckPageIndexAndSize(ref index, ref pageSize);

            var queryable = query;
            //if (wheres != null)
            //{
            //    wheres.ForEach(p => queryable = queryable.Where(p));
            //}
            int count = queryable.Count();

            Page.CheckPageIndexAndSize(ref index, pageSize, count);
            if (count > 0)
            {
                if (orderBy != null)
                {
                    queryable = isAsc ? queryable.OrderBy(orderBy) : queryable.OrderByDescending(orderBy);
                }
                return new Page<TResult>(index, pageSize, count, selector(queryable));
            }
            return new Page<TResult>(index, pageSize, count, new List<TResult>());
        }
        #endregion

        #region "通用分页查询方法封装 4"

        public static Page<TResult> GetPagedListQuery<TEntity, TOrderBy, TResult>(
            this IQueryable<TEntity> query,
            int index,
            int pageSize,
            List<Expression<Func<TEntity, bool>>> wheres,
            List<Expression<Func<TEntity, TOrderBy>>> orderBy,
            Func<IQueryable<TEntity>, List<TResult>> selector,
            bool isAsc)
        {
            if (selector == null)
            {
                throw new AggregateException("selector");
            }

            Page.CheckPageIndexAndSize(ref index, ref pageSize);

            var queryable = query;
            if (wheres != null)
            {
                wheres.ForEach(p => queryable = queryable.Where(p));
            }
            int count = queryable.Count();

            Page.CheckPageIndexAndSize(ref index, pageSize, count);
            if (count > 0)
            {
                if (orderBy != null)
                {
                    queryable = isAsc
                                    ? orderBy.Aggregate(queryable, (current, order) => current.OrderBy(order))
                                    : orderBy.Aggregate(queryable, (current, o) => current.OrderByDescending(o));
                }
                return new Page<TResult>(index, pageSize, count, selector(queryable));
            }
            return new Page<TResult>(index, pageSize, count, new List<TResult>());
        }
        #endregion


    }
}
