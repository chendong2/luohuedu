using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.Services.Protocols;
using BusinessObject.WSBo;
using LuoHuEduWebService.Common;
using Services.Course.CourseControl;

namespace LuoHuEduWebService.CourseInfo
{
    /// <summary>
    /// CourseInfoWebService 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。
    // [System.Web.Script.Services.ScriptService]
    public class CourseInfoWebService : System.Web.Services.WebService
    {
       public LuoHuSoapHeader htSoapHeader;
        /// <summary>
        /// 获取课程信息
        /// </summary>
        /// <param name="courseName"></param>
        /// <param name="courseCode"></param>
        /// <param name="beginDate"></param>
        /// <param name="endDate"></param>
        /// <returns></returns>
       [ScriptMethod]
       [WebMethod]
       [SoapHeader("htSoapHeader", Direction = SoapHeaderDirection.InOut | SoapHeaderDirection.Fault)]
        public string GetCourses(string courseName, string courseCode,DateTime beginDate,DateTime endDate)
        {
            if (!htSoapHeader.ValideUser(htSoapHeader.UserName, htSoapHeader.PassWord)) return null;
            CourseService course=new CourseService();
            var list = course.GetCourses(courseName, courseCode, beginDate, endDate);
            if (list.Count > 0)
            {
                return new JavaScriptSerializer().Serialize(list);
            }
            else
            {
                return "";

            }
            
        }

        /// <summary>
        /// 根据课程ID获取报名信息
        /// </summary>
        /// <param name="courseId"></param>
        /// <returns></returns>
        [ScriptMethod]
        [WebMethod]
        [SoapHeader("htSoapHeader", Direction = SoapHeaderDirection.InOut | SoapHeaderDirection.Fault)]
        public string GetCourseStudentByCourseId(string courseId)
        {
            if (!htSoapHeader.ValideUser(htSoapHeader.UserName, htSoapHeader.PassWord)) return null;
            CourseStudentFace courseStudentFace=new CourseStudentFace();
            var list = courseStudentFace.GetCourseStudentByCourseId(courseId);
            return new JavaScriptSerializer().Serialize(list);
        }
        
    }
}
