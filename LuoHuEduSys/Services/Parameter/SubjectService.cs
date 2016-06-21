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

    public class SubjectService
    {
        #region 科目增删改查基本操作

        /// <summary>
        /// 新增科目
        /// </summary>
        /// <param name="subjectBo"> 科目BO</param>
        /// <returns>bool</returns>
        public bool AddSubject(SubjectBo subjectBo)
        {
            if (subjectBo == null)
                throw new ArgumentNullException("subjectBo");
            if (subjectBo.Id != null && subjectBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {


                    String id = Guid.NewGuid().ToString();
                    subjectBo.Id = id;
                    var sqlStr = @"INSERT INTO tb_subject(Id,SubjectName) VALUES(@Id,@SubjectName);";
                    int row = connection.Execute(sqlStr, subjectBo);
                    if (row > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }

            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SubjectService.AddSubject({0})异常", subjectBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除科目信息
        /// </summary>
        /// <param name="ids">多个科目id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteSubjectsByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        SubjectBo sBo = new SubjectBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_subject where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
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
        /// <param name="subjectBo">科目BO</param>
        /// <returns></returns>
        public bool UpdateSubject(SubjectBo subjectBo)
        {
            if (subjectBo == null)
                throw new ArgumentNullException("subjectBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_subject set SubjectName=@SubjectName where Id=@Id";
                    int row = connection.Execute(sqlStr, subjectBo);
                    if (row > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SubjectService.UpdateSubject({0})异常", subjectBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过科目id获取科目信息
        /// </summary>
        /// <param name="id">科目id</param>
        /// <returns>科目BO实体</returns>
        public SubjectBo GetSubjectById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var SubjectBo = new SubjectBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_subject where Id=@Id";
                    SubjectBo = connection.Query<SubjectBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SubjectService.GetSubjectById({0})异常", id), ex);
            }
            return SubjectBo;
        }

        //获取数据列表
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
                    strSql += "and subjectname like @SubjectName";
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
                                                SubjectName = string.Format("%{0}%", subjectBo.SubjectName)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<SubjectBo>(strSql,
                                                new
                                                {
                                                    SubjectName = string.Format("%{0}%", subjectBo.SubjectName),
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

        //获取全部的学校数据
        public string[] GetAllSubject()
        {
            List<SubjectBo> list;
            string strSql = string.Format(@"SELECT * from tb_subject where 1=1 ");
            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<SubjectBo>(strSql,
                                                new { }).ToList();
            }
            string[] data = new string[list.Count];
            for (int i = 0; i < list.Count; i++)
            {
                data[i] = list[i].SubjectName + "******" + list[i].Id;
            }
            return data;
        }
    }
}
