using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.AdminBo;
using BusinessObject.UserInfo;
using Services.Parameter;
using Services.UserInfo;
using Services.Admin.StudentControl;

namespace LuoHuEdu.WebServices.UserInfo
{
    /// <summary>
    /// Summary description for StudentExemption
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class StudentExemption : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddStudentExemption(StudentExemptionBo studentExemptionBo)
        {

            var studentExemptionService = new StudentExemptionService();
            return studentExemptionService.AddStudentExemption(studentExemptionBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateStudentExemption(StudentExemptionBo studentExemptionBo)
        {

            var studentExemptionService = new StudentExemptionService();
            return studentExemptionService.UpdateStudentExemption(studentExemptionBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteStudentExemptionsByIds(String ids)
        {
            var studentExemptionService = new StudentExemptionService();
            return studentExemptionService.DeleteStudentExemptionsByIds(ids);
        }

        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetStudentExemptionList(int page, int rows, string sort, string order, StudentExemptionBo studentExemptionBo)
        {

            var studentExemption = new StudentExemptionService();
            var list = studentExemption.GetStudentExemptions(page, rows, sort, order, studentExemptionBo);
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
        public StudentExemptionBo GetStudentExemptionById(String id)
        {

            var studentExemptionService = new StudentExemptionService();
            var studentExemptionBo = studentExemptionService.GetStudentExemptionById(id);
            return studentExemptionBo;
        }


        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public StudentBo getStudentData()
        {
            string userId = Domain.common.UserInfo.GetUserId().ToString();

            return StudentService.GetStudentById(userId);
        }

    }
}
