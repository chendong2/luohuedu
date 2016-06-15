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
    /// Summary description for StudentTrain
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class StudentTrain : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddStudentTrain(StudentTrainBo studentTrainBo)
        {

            var studentTrainService = new StudentTrainService();
            return studentTrainService.AddStudentTrain(studentTrainBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateStudentTrain(StudentTrainBo studentTrainBo)
        {

            var studentTrainService = new StudentTrainService();
            return studentTrainService.UpdateStudentTrain(studentTrainBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteStudentTrainsByIds(String ids)
        {
            var studentTrainService = new StudentTrainService();
            return studentTrainService.DeleteStudentTrainsByIds(ids);
        }

        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetStudentTrainList(int page, int rows, string sort, string order, StudentTrainBo studentTrainBo)
        {

            var studentTrain = new StudentTrainService();
            var list = studentTrain.GetStudentTrains(page, rows, sort, order, studentTrainBo);
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
        public StudentTrainBo GetStudentTrainById(String id)
        {

            var studentTrainService = new StudentTrainService();
            var studentTrainBo = studentTrainService.GetStudentTrainById(id);
            return studentTrainBo;
        }

    }
}
