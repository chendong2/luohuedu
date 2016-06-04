using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.Parameter;
using Services.Parameter;

namespace LuoHuEduWebService.Parameter
{
    /// <summary>
    /// Subject 的摘要说明
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // 若要允许使用 ASP.NET AJAX 从脚本中调用此 Web 服务，请取消对下行的注释。
    // [System.Web.Script.Services.ScriptService]
    public class Subject : System.Web.Services.WebService
    {

        [ScriptMethod]
        [WebMethod]
        public string GetSubjectList(int page, int rows, string sort, string order, SubjectBo SubjectBo)
        {

            var Subject = new SubjectService();
            var list = Subject.GetSubjects(page, rows, sort, order, SubjectBo);
            return new JavaScriptSerializer().Serialize(list);
        }

        [ScriptMethod]
        [WebMethod]
        public SubjectBo GetSubjectById(int? id)
        {

            var Subject = new SubjectService();
            var SubjectBo = Subject.GetSubjectById(id);
            return SubjectBo;
        }
    }
}
