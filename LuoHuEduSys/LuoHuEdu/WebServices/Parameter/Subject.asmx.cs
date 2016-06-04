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
    /// Summary description for Subject
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class Subject : System.Web.Services.WebService
    {


        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public string GetSubjectList(int page, int rows, string sort, string order, SubjectBo SubjectBo)
        {

            var Subject = new SubjectService();
            var list = Subject.GetSubjects(page, rows, sort, order, SubjectBo);
            return new JavaScriptSerializer().Serialize(list);
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public SubjectBo GetSubjectById(int id)
        {

            var Subject = new SubjectService();
            var SubjectBo = Subject.GetSubjectById(id);
            return SubjectBo;
        }

    }
}
