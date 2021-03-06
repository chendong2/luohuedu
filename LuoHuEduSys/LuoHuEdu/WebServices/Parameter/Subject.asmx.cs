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

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddSubject(SubjectBo subjectBo)
        {

            var subjectService = new SubjectService();
            return subjectService.AddSubject(subjectBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateSubject(SubjectBo subjectBo)
        {

            var subjectService = new SubjectService();
            return subjectService.UpdateSubject(subjectBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteSubjectsByIds(String ids)
        {
            var subjectService = new SubjectService();
            return subjectService.DeleteSubjectsByIds(ids);
        }

        //获取数据列表
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

        //根据Id获取数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public SubjectBo GetSubjectById(String id)
        {

            var subjectService = new SubjectService();
            var subjectBo = subjectService.GetSubjectById(id);
            return subjectBo;
        }

        //获取全部的免修数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public string[] GetAllSubject()
        {
            var subjectService = new SubjectService();
            var subjectList = subjectService.GetAllSubject();
            return subjectList;
        }

        //获取全部的免修数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public List<SubjectBo> GetAllSubjectNew()
        {
            var subjectService = new SubjectService();
            var subjectList = subjectService.GetAllSubjectNew();
            return subjectList;
        }
    }
}
