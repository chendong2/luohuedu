using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Text;
using BusinessObject.UserInfo;
using Dapper;
using Domain.common;
using Huatong.DAO;
using System.Linq;
using Dapper;
using DapperExtensions;
using System.Data.Common;
namespace Services.UserInfo
{

    public class StudentExemptionService
    {
        #region 免修信息增删改查基本操作

        /// <summary>
        /// 新增免修信息
        /// </summary>
        /// <param name="studentExemptionBo"> 免修信息BO</param>
        /// <returns>bool</returns>
        public bool AddStudentExemption(StudentExemptionBo studentExemptionBo)
        {
            if (studentExemptionBo == null)
                throw new ArgumentNullException("studentExemptionBo");
            if (studentExemptionBo.Id != null && studentExemptionBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {


                    String id = Guid.NewGuid().ToString();
                    studentExemptionBo.Id = id;
                    studentExemptionBo.CreateOn = DateTime.Now;
                    studentExemptionBo.StudentId = Domain.common.UserInfo.GetUserId().ToString();
                    studentExemptionBo.SchoolAudit = 0;
                    var sqlStr = @"INSERT INTO tb_studentexemption(Id,StudentID,ExemptionId,TheYear,SchoolAudit,CreateOn) VALUES(@Id,@StudentID,@ExemptionId,@TheYear,@SchoolAudit,@CreateOn);";
                    int row = connection.Execute(sqlStr, studentExemptionBo);
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
                LogHelper.WriteLog(string.Format("StudentExemptionService.AddStudentExemption({0})异常", studentExemptionBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除免修信息信息
        /// </summary>
        /// <param name="ids">多个免修信息id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteStudentExemptionsByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        StudentExemptionBo sBo = new StudentExemptionBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_studentexemption where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentExemptionService.DeleteStudentExemptionsByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改免修信息信息
        /// </summary>
        /// <param name="studentExemptionBo">免修信息BO</param>
        /// <returns></returns>
        public bool UpdateStudentExemption(StudentExemptionBo studentExemptionBo)
        {
            if (studentExemptionBo == null)
                throw new ArgumentNullException("studentExemptionBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_studentexemption set ExemptionId=@ExemptionId,TheYear=@TheYear,SchoolAudit=@SchoolAudit where Id=@Id";
                    int row = connection.Execute(sqlStr, studentExemptionBo);
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
                LogHelper.WriteLog(string.Format("StudentExemptionService.UpdateStudentExemption({0})异常", studentExemptionBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过免修信息id获取免修信息信息
        /// </summary>
        /// <param name="id">免修信息id</param>
        /// <returns>免修信息BO实体</returns>
        public StudentExemptionBo GetStudentExemptionById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var StudentExemptionBo = new StudentExemptionBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_studentexemption where Id=@Id";
                    StudentExemptionBo = connection.Query<StudentExemptionBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentExemptionService.GetStudentExemptionById({0})异常", id), ex);
            }
            return StudentExemptionBo;
        }

        //获取数据列表
        public Page<StudentExemptionBo> GetStudentExemptions(int page, int rows, string sort, string order, StudentExemptionBo studentExemptionBo)
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
            var pageList = new Page<StudentExemptionBo>();

            string strSql = string.Format(@"SELECT se.*,ex.ExemptionReason,st.UserName FROM tb_studentExemption se INNER JOIN tb_exemption ex ON  se.ExemptionId=ex.Id INNER JOIN  tb_student st ON se.StudentId=st.Id WHERE 1=1 ");
            if (studentExemptionBo != null)
            {
                if (!string.IsNullOrEmpty(studentExemptionBo.UserName))
                {
                    strSql += "and UserName like @UserName ";
                }
            }

            if (Domain.common.UserInfo.GetUserId() != null)
            {
                strSql += "and StudentID = @StudentID ";
            }

            switch (sort)
            {
                case "UserName":
                    strSql += " order by UserName " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<StudentExemptionBo>(strSql,
                                            new
                                            {
                                                UserName = string.Format("%{0}%", studentExemptionBo.UserName),
                                                StudentID = Domain.common.UserInfo.GetUserId().ToString()
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<StudentExemptionBo>(strSql,
                                                new
                                                {
                                                    UserName = string.Format("%{0}%", studentExemptionBo.UserName),
                                                    StudentID = Domain.common.UserInfo.GetUserId().ToString(),
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
