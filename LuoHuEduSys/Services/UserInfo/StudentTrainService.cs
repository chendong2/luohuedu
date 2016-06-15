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

    public class StudentTrainService
    {
        #region 免修信息增删改查基本操作

        /// <summary>
        /// 新增免修信息
        /// </summary>
        /// <param name="studentTrainBo"> 免修信息BO</param>
        /// <returns>bool</returns>
        public bool AddStudentTrain(StudentTrainBo studentTrainBo)
        {
            if (studentTrainBo == null)
                throw new ArgumentNullException("studentTrainBo");
            if (studentTrainBo.Id != null && studentTrainBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {


                    String id = Guid.NewGuid().ToString();
                    studentTrainBo.Id = id;
                    studentTrainBo.CreateOn = DateTime.Now;
                    studentTrainBo.StudentId = Domain.common.UserInfo.GetUserId().ToString();
                    studentTrainBo.SchoolAudit = 0;
                    studentTrainBo.DistinctSchoolAudit = 0;
                    var sqlStr = @"INSERT INTO tb_studenttrain(Id,StudentID,ProgramId,TrainName,TheYear,Comment,SchoolAudit,DistinctSchoolAudit,CreateOn) VALUES(@Id,@StudentID,@ProgramId,@TrainName,@TheYear,@Comment,@SchoolAudit,@DistinctSchoolAudit,@CreateOn);";
                    int row = connection.Execute(sqlStr, studentTrainBo);
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
                LogHelper.WriteLog(string.Format("StudentTrainService.AddStudentTrain({0})异常", studentTrainBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除免修信息信息
        /// </summary>
        /// <param name="ids">多个免修信息id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteStudentTrainsByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        StudentTrainBo sBo = new StudentTrainBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_studenttrain where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentTrainService.DeleteStudentTrainsByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改免修信息信息
        /// </summary>
        /// <param name="studentTrainBo">免修信息BO</param>
        /// <returns></returns>
        public bool UpdateStudentTrain(StudentTrainBo studentTrainBo)
        {
            if (studentTrainBo == null)
                throw new ArgumentNullException("studentTrainBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_studenttrain set ProgramId=@ProgramId,TrainName=@TrainName,TheYear=@TheYear,Comment=@Comment,SchoolAudit=@SchoolAudit,DistinctSchoolAudit=@DistinctSchoolAudit where Id=@Id";
                    int row = connection.Execute(sqlStr, studentTrainBo);
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
                LogHelper.WriteLog(string.Format("StudentTrainService.UpdateStudentTrain({0})异常", studentTrainBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过免修信息id获取免修信息信息
        /// </summary>
        /// <param name="id">免修信息id</param>
        /// <returns>免修信息BO实体</returns>
        public StudentTrainBo GetStudentTrainById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var StudentTrainBo = new StudentTrainBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_studenttrain where Id=@Id";
                    StudentTrainBo = connection.Query<StudentTrainBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentTrainService.GetStudentTrainById({0})异常", id), ex);
            }
            return StudentTrainBo;
        }

        //获取数据列表
        public Page<StudentTrainBo> GetStudentTrains(int page, int rows, string sort, string order, StudentTrainBo studentTrainBo)
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
            var pageList = new Page<StudentTrainBo>();

            string strSql = string.Format(@"SELECT se.*,ex.ProgrameName,ex.SubProgrameName,ex.SunProgrameName,ex.StuTime,st.UserName FROM tb_studentTrain se INNER JOIN tb_maintrainset ex ON se.ProgramId=ex.Id INNER JOIN  tb_student st ON se.StudentId=st.Id WHERE 1=1 ");
            if (studentTrainBo != null)
            {
                if (studentTrainBo.UserName != null)
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
                count = context.Query<StudentTrainBo>(strSql,
                                            new
                                            {
                                                UserName = string.Format("%{0}%", studentTrainBo.UserName),
                                                StudentID = Domain.common.UserInfo.GetUserId().ToString()
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<StudentTrainBo>(strSql,
                                                new
                                                {
                                                    UserName = string.Format("%{0}%", studentTrainBo.UserName),
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
