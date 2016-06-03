using System.Collections.Generic;
using System.Data;
using System.Linq;
using DapperExtensions;
using DapperExtensions.Sql;
using Domain.common;

namespace LuoHuEdu.Dao
{
    public static class DapperExtensions
    {
        /// <summary>
        /// 获取分页数据
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="connection"></param>
        /// <param name="predicate"></param>
        /// <param name="sort"></param>
        /// <param name="pageIndex">页码从0开始</param>
        /// <param name="pageSize"></param>
        /// <param name="transaction"></param>
        /// <param name="commandTimeout"></param>
        /// <param name="buffered"></param>
        /// <returns></returns>
        public static Page<T> GetPagedList<T>(this IDatabase database, object predicate, IList<ISort> sort, int pageIndex, int pageSize, IDbTransaction transaction = null, int? commandTimeout = null, bool buffered = false) where T : class
        {
            Page.DapperCheckPageIndexAndSize(ref pageIndex, ref pageSize);

            //记录总条数

            var recordTotalCount = database.Count<T>(predicate);

            //在连接资源释放之前的IEnumerable类型集合必须转为List类型，否则连接资源释放之后IEnumerable类型集合数据已丢失
            var list = database.GetPage<T>(predicate, sort, pageIndex, pageSize, transaction, commandTimeout, buffered).ToList();
            var userPageList = new Page<T>(pageIndex, pageSize, recordTotalCount, list);

            return userPageList;
        }
    }
}
