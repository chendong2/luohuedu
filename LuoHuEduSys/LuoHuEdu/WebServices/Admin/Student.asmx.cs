using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.AdminBo;
using BusinessObject.Parameter;
using Services.Admin.StudentControl;
using Services.Parameter;

namespace LuoHuEdu.WebServices.Admin
{
    /// <summary>
    /// Summary description for Student
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class Student : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddStudent(StudentBo schoolBo)
        {

            var schoolService = new StudentService();
            return schoolService.AddStudent(schoolBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateStudent(StudentBo schoolBo)
        {

            var schoolService = new StudentService();
            return schoolService.UpdateStudent(schoolBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteStudentsByIds(String ids)
        {
            var schoolService = new StudentService();
            return schoolService.DeleteStudentsByIds(ids);
        }

        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetStudentList(int page, int rows, string sort, string order, StudentBo schoolBo)
        {

            var school = new StudentService();
            var list = school.GetStudents(page, rows, sort, order, schoolBo);
            if (list != null)
            {
                return new
                {
                    total = list.TotalCount,
                    rows = list.ListT
                };
            }
            else
            {
                return new { total = 0, rows = 0 };
            }
        }

        //根据Id获取数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public StudentBo GetAllStudentById(String id)
        {

            var schoolService = new StudentService();
            var schoolBo = schoolService.GetAllStudentById(id);
            return schoolBo;
        }

    }
}
