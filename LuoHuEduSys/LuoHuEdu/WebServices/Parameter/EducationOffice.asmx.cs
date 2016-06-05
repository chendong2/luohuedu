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
    /// Summary description for EducationOffice
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class EducationOffice : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddEducationOffice(EducationOfficeBo educationOfficeBo)
        {

            var educationOfficeService = new EducationOfficeService();
            return educationOfficeService.AddEducationOffice(educationOfficeBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateEducationOffice(EducationOfficeBo educationOfficeBo)
        {

            var educationOfficeService = new EducationOfficeService();
            return educationOfficeService.UpdateEducationOffice(educationOfficeBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteEducationOfficesByIds(String ids)
        {
            var educationOfficeService = new EducationOfficeService();
            return educationOfficeService.DeleteEducationOfficesByIds(ids);
        }

        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetEducationOfficeList(int page, int rows, string sort, string order, EducationOfficeBo educationOfficeBo)
        {

            var educationOffice = new EducationOfficeService();
            var list = educationOffice.GetEducationOffices(page, rows, sort, order, educationOfficeBo);
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
        public EducationOfficeBo GetEducationOfficeById(String id)
        {

            var educationOfficeService = new EducationOfficeService();
            var educationOfficeBo = educationOfficeService.GetEducationOfficeById(id);
            return educationOfficeBo;
        }

    }
}
