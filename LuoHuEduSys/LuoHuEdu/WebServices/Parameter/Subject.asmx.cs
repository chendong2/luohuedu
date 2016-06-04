﻿using System;
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
        public object GetSubjectList(int page, int rows, string sort, string order, SubjectBo subjectBo)
        {

            var Subject = new SubjectService();
            var list = Subject.GetSubjects(page, rows, sort, order, subjectBo);
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

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public SubjectBo GetSubjectById(String id)
        {

            var subjectService = new SubjectService();
            var subjectBo = subjectService.GetSubjectById(id);
            return subjectBo;
        }

    }
}
