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
    /// Summary description for Exemption
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class Exemption : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddExemption(ExemptionBo exemptionBo)
        {

            var exemptionService = new ExemptionService();
            return exemptionService.AddExemption(exemptionBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateExemption(ExemptionBo exemptionBo)
        {

            var exemptionService = new ExemptionService();
            return exemptionService.UpdateExemption(exemptionBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteExemptionsByIds(String ids)
        {
            var exemptionService = new ExemptionService();
            return exemptionService.DeleteExemptionsByIds(ids);
        }

        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetExemptionList(int page, int rows, string sort, string order, ExemptionBo exemptionBo)
        {

            var exemption = new ExemptionService();
            var list = exemption.GetExemptions(page, rows, sort, order, exemptionBo);
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
        public ExemptionBo GetExemptionById(String id)
        {

            var exemptionService = new ExemptionService();
            var exemptionBo = exemptionService.GetExemptionById(id);
            return exemptionBo;
        }

        //获取全部的免修数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public string[] GetAllExemption()
        {
            var exemptionService = new ExemptionService();
            var exemptionList = exemptionService.GetAllExemption();
            return exemptionList;
        }
       

    }
}
