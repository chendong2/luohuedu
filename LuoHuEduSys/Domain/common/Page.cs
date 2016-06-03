using System.Collections.Generic;

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

       **    主要用于封装分页属性。
   *********************************************************************************/
    public class Page<T>: Page
    {
        //internal Page()
        //{
        //    ListT = new List<T>();
        //}

        public Page(){}

        public int PageIndex { get; set; }//当前页码
        public int PageSize { get; set; }//每页数据量
        public int TotalCount { get;set; }//总记录数
        public int PageCount { get; set; }//总页数
        public List<T> ListT { get; set; } //当前分页的数据
        public List<object> Footer { get; set; } //用于web页面列表的合计

        /// <summary>
        /// 初始化page信息：页码 每页数据量 总记录数 数据
        /// </summary>
        /// <param name="pageIndex">页码</param>
        /// <param name="pageSize">当前页的数据量</param>
        /// <param name="totalCount">总记录数</param>
        /// <param name="listT"></param>
        public Page(int pageIndex, int pageSize, int totalCount, List<T> listT)
        {
            this.PageIndex = pageIndex;
            this.PageSize = pageSize;
            this.TotalCount = totalCount;
            this.PageCount = totalCount % pageSize == 0 ? totalCount / pageSize : totalCount / pageSize + 1;
            this.ListT = listT;
        }

        public Page<T> Empty
        {
            get{return new Page<T>();}
        }
    }
   
    public class  Page
    {
        public static void CheckPageIndexAndSize(ref int index, ref int size)
        {
            if (index < 1)
            {
                index = 1;
            }
            if (size < 1)
            {
                size = 10;
            }
        }

        public static void DapperCheckPageIndexAndSize(ref int index, ref int size)
        {
            if (index < 0)
            {
                index = 0;
            }
            if (size < 0)
            {
                size = 10;
            }
        }
        public static void CheckPageIndexAndSize(ref int index, int size, int count)
        {
            if (count >= index * size)
            {
                return;
            }
            index = count / size;
            if (count % size > 0)
            {
                index++;
            }

            if (index == 0)
            {
                index = 1;
            }
        }
    }
}
