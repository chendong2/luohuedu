using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using BusinessObject.AdminBo;

namespace Domain.common
{
	/// <summary>
	/// 整个系统用于封装访问Session
	/// </summary>
	public class UserInfo
	{
		/// <summary>
		/// 获取session中的 UserId
		/// </summary>
		/// <returns></returns>
		public static object GetUserId()
		{
			if (HttpContext.Current.Session["UserId"] == null)
			{
				return "";
			}
			return HttpContext.Current.Session["UserId"];
		}

		/// <summary>
		/// 设置用户id放到session中
		/// </summary>
		/// <param name="id"></param>
		public static void SetUserId(int id)
		{
			HttpContext.Current.Session["UserId"] = id;
		}

		/// <summary>
		/// 获取session中的 UserName
		/// </summary>
		/// <returns></returns>
		public static string GetUserName()
		{
			if (HttpContext.Current.Session["UserName"] == null)
			{
				return "";
			}
			return HttpContext.Current.Session["UserName"].ToString();
		}

		/// <summary>
		/// 获取session中的 VipId
		/// </summary>
		/// <returns></returns>
		public static string GetVipId()
		{
			if (HttpContext.Current.Session["VipId"] == null)
			{
				return "";
			}
			return HttpContext.Current.Session["VipId"].ToString();
		}

		/// <summary>
		/// 获取session中的 会员登陆名
		/// </summary>
		/// <returns></returns>
		public static string GetLoginName()
		{
			if (HttpContext.Current.Session["LoginName"] == null)
			{
				return "";
			}
			return HttpContext.Current.Session["LoginName"].ToString();
		}

        /// <summary>
        /// 获取session中的,当前登录用户的真实姓名
        /// </summary>
        /// <returns></returns>
        public static string GetUserRealName()
        {
            if (HttpContext.Current.Session["UserRealName"] == null)
            {
                return string.Empty;
            }
            return HttpContext.Current.Session["UserRealName"].ToString();
        }

        //判读用户是否有权限
        public bool havePermissions(string name)
        {
            if (HttpContext.Current.Session["perList"] == null)
            {
                return false;
            }
            else
            {
                var perList=HttpContext.Current.Session["perList"].ToString();
                return perList.Contains(name);
            }
        }

	}
}
