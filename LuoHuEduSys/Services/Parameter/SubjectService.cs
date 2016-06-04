using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Text;
using BusinessObject.Parameter;
using Dapper;
using Domain.common;
using Huatong.DAO;
using System.Linq;
using Dapper;
using DapperExtensions;
using System.Data.Common;
namespace Services.Parameter
{
    /********************************************************************************
      ** 科目ISubjectService的实现类SubjectService。
    *******************************************************************************/

    public class SubjectService 
    {
        #region 科目增删改查基本操作

        /// <summary>
        /// 新增科目
        /// </summary>
        /// <param name="SubjectBo"> 科目BO</param>
        /// <returns>bool</returns>
        public bool AddSubject(SubjectBo SubjectBo)
        {
            if (SubjectBo == null)
                throw new ArgumentNullException("SubjectBo");
            if (SubjectBo.Id != null)
                throw new Exception("不能给Id赋值");
            try
            {
                SubjectBo.SubjectName = SubjectBo.SubjectName;
             
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SubjectService.AddSubject({0})异常", SubjectBo), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 通过科目id删除科目信息
        /// </summary>
        /// <param name="id">科目id</param>
        /// <returns>bool</returns>
        public bool DeleteSubject(int? id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            try
            {
               
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SubjectService.DeleteSubject({0})异常", id), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 批量删除科目信息
        /// </summary>
        /// <param name="ids">多个科目id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteSubjectsByIds(int[] ids)
        {
            try
            {
               
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SubjectService.DeleteSubjectsByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改科目信息
        /// </summary>
        /// <param name="SubjectBo">科目BO</param>
        /// <returns></returns>
        public bool UpdateSubject(SubjectBo SubjectBo)
        {
            if (SubjectBo == null)
                throw new ArgumentNullException("SubjectBo");
            try
            {
                
              
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SubjectService.UpdateSubject({0})异常", SubjectBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过科目id获取科目信息
        /// </summary>
        /// <param name="id">科目id</param>
        /// <returns>科目BO实体</returns>
        public SubjectBo GetSubjectById(int? id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var SubjectBo = new SubjectBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_subject where Id=@Id";
                    SubjectBo = connection.Query<SubjectBo>(sqlStr, new { Id = id.GetValueOrDefault() }).FirstOrDefault();
                    
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SubjectService.GetSubjectById({0})异常", id), ex);
            }
            return SubjectBo;
        }

        public Page<SubjectBo> GetSubjects(int page, int rows, string sort, string order, SubjectBo subjectBo)
        {
            int count = 0;
            int pageIndex = 0;
            int pageSize = 0;
            if (page < 0)
            {
                pageIndex = 0;
            }
            else
            {
                pageIndex = (page - 1) * rows;
            }
            pageSize = page * rows;
            var pageList = new Page<SubjectBo>();

            string strSql = string.Format(@"SELECT * from tb_subject where 1=1 ");
            if (subjectBo != null)
            {
                if (subjectBo.SubjectName != null)
                {
                    strSql += "and t.SubjectName like @SubjectName";
                }
            }

            switch (sort)
            {
                case "SubjectName":
                    strSql += " order by SubjectName " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<SubjectBo>(strSql,
                                            new
                                            {
                                                SubjectName = subjectBo.SubjectName
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<SubjectBo>(strSql,
                                                new
                                                {
                                                    SubjectName = subjectBo.SubjectName,
                                                    pageindex = pageIndex,
                                                    pagesize = pageSize
                                                }).ToList();

                pageList.ListT = list;
                pageList.PageIndex = page;
                pageList.PageSize = rows;
                pageList.TotalCount = count;
            }

            return pageList;
        }

        #endregion
    }
}
