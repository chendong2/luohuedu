using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace HuaTongCallCenter.Export.Common
{
    /// <summary>
    /// 公用的工具类
    /// </summary>
    public class CommonHelper
    {
        /// <summary>
        /// 转换mysql中like语句中的匹配字符%、_
        /// add by jjx on 2013-10-10
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string FilterChar(string s)
        {
            if (string.IsNullOrEmpty(s))
            {
                return s;
            }
            if (s.IndexOf('%') != -1)
            {
                s = s.Replace("%", @"\%");
            }
            if (s.IndexOf('_') != -1)
            {
                s = s.Replace("_", @"\_");
            }
            return s;
        }

        ///// <summary>
        ///// Webservice导出Excel的通用方法,只用于NPOI导出方法
        ///// add by jjx on 2013-10-10
        ///// </summary>
        ///// <typeparam name="T">泛型BO</typeparam>
        ///// <param name="data">web前段的搜索字符串</param>
        ///// <param name="context">HttpContext上下文</param>
        ///// <param name="exportList">后台NPOI导出委托</param>
        //public static void ExportExcel<T> (string data,HttpContext context, Action<HttpContext, String, String, T> exportList)
        //{
        //    // 反序列化为条件对象，详情查看SearchDataObj对象结构
        //    var p = new JavaScriptSerializer().Deserialize<SearchDataObj<T>>(FilterChar(data));
        //    if(p==null)
        //    {
        //        return;
        //    }
        //    exportList(context, p.Sort, p.Order, p.Bo);
        //}

        //public static void ExportExcel<T>(string data, HttpContext context, Action<HttpContext, T> exportList)
        //{
        //    // 反序列化为条件对象，详情查看SearchDataObj对象结构
        //    var p = new JavaScriptSerializer().Deserialize<SearchDataObj<T>>(FilterChar(data));
        //    exportList(context, p.Bo);
        //}
    }
}