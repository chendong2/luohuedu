using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.Parameter;
using Services.Parameter;

namespace LuoHuEdu.WebServices.Parameter
{
    /// <summary>
    /// Summary description for School
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class School : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddSchool(SchoolBo schoolBo)
        {

            var schoolService = new SchoolService();
            return schoolService.AddSchool(schoolBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateSchool(SchoolBo schoolBo)
        {

            var schoolService = new SchoolService();
            return schoolService.UpdateSchool(schoolBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteSchoolsByIds(String ids)
        {
            var schoolService = new SchoolService();
            return schoolService.DeleteSchoolsByIds(ids);
        }

        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetSchoolList(int page, int rows, string sort, string order, SchoolBo schoolBo)
        {

            var school = new SchoolService();
            var list = school.GetSchools(page, rows, sort, order, schoolBo);
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
        public SchoolBo GetSchoolById(String id)
        {

            var schoolService = new SchoolService();
            var schoolBo = schoolService.GetSchoolById(id);
            return schoolBo;
        }

        //获取全部的免修数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public string[] GetAllSchool()
        {
            var schoolService = new SchoolService();
            var schoolList = schoolService.GetAllSchool();
            return schoolList;
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public List<SchoolBo> GetAllSchoolNew()
        {
            var schoolService = new SchoolService();
            return schoolService.GetAllSchoolNew();
        }

    }
}
