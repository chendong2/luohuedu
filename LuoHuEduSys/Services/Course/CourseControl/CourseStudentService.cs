using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.Course;
using Dapper;
using Domain.common;
using Huatong.DAO;

namespace Services.Course.CourseControl
{
    public class CourseStudentService
    {
        #region "市获取考勤数据接口方法"
        /// <summary>
        /// 该方法供市中心获取临时考勤数据使用！
        /// </summary>
        /// <param name="idNo"></param>
        /// <param name="yearNo"></param>
        /// <param name="isAll"></param>
        /// <returns></returns>
        public List<CourseStudentBo> GetCourseStudent(string idNo, string yearNo, string isAll)
        {
            string sql = @"SELECT Name,IDNO,YearNo,TermNo,CASE CourseType
                            WHEN '集中培训' THEN '专业科目'
                            WHEN '专项培训' THEN '专业科目'
                            WHEN '校本培训' THEN '个人选修'
                            ELSE CourseType
                            END AS CourseType,CourseName,StudyType,Period,DATE_FORMAT(StartDate, '%Y-%m-%d') AS StartDate,DATE_FORMAT(EndDate, '%Y-%m-%d') AS                                EndDate,TrainDept FROM tb_coursestudenttemp where 1=1 ";

            //sql 查询条件拼接
            var wheres = new StringBuilder();
            var paras = new DynamicParameters();
            if (!string.IsNullOrEmpty(idNo))
            {
                wheres.Append(" and IDNO = @IdNo");
                paras.Add("IdNo", idNo);
            }
            if (isAll != "All")
            {
                if (!string.IsNullOrEmpty(yearNo))
                {
                    wheres.Append(" and YearNo=@YearNo ");
                    paras.Add("YearNo", yearNo);
                }
            }
            string group = " GROUP BY IDNO,CourseName ";
            //加where条件
            sql += wheres + group;
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    var list = context.Query<CourseStudentBo>(sql, paras).ToList();

                    return list;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.Login({0},{1},{2})", idNo, yearNo, isAll), ex);
                return null;
            }


        }

        #endregion


        #region "CRUD方法封装"

        /// <summary>
        /// 修改学生报名
        /// </summary>
        /// <param name="courseStudentBo"></param>
        /// <returns></returns>
        public bool UpdateCourseStudent(CourseStudentDto studentBo)
        {
            if (studentBo == null)
                throw new ArgumentNullException("studentBo");
            try
            {
                string sqlStr = @"UPDATE `tb_coursestudent`
                                    SET 
                                      `CourseNumber` = @CourseNumber,
                                      `StudentId` = @StudentId,
                                      `Sign` = @Sign,
                                      `feedback` = @feedback,
                                      `TaskName` = @TaskName,
                                      `TaskUrl` = @TaskUrl,
                                      `SignDate` = @SignDate,
                                      `SignOutDate` = @SignOutDate
                                       WHERE `Id` = @Id;";
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, studentBo);
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
                LogHelper.WriteLog(string.Format("CourseStudentService.UpdateCourseStudent(studentBo)", studentBo), ex);
                return false;
            }

        }

        /// <summary>
        /// 新增课程报名数据
        /// </summary>
        /// <param name="studentBo"></param>
        /// <returns></returns>
        public bool AddCourseStudent(CourseStudentDto studentBo)
        {
            if (studentBo == null)
                throw new ArgumentNullException("studentBo");
            if (studentBo.Id != null && studentBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");

            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    studentBo.Id = Guid.NewGuid().ToString();
                    var strSql = @"INSERT INTO `tb_coursestudent`
                                    (`Id`,
                                     `CourseNumber`,
                                     `StudentId`,
                                     `Sign`,
                                     `feedback`,
                                     `TaskName`,
                                     `TaskUrl`,
                                     `SignDate`,
                                     `SignOutDate`)
                                    VALUES (@Id,
                                            @CourseNumber,
                                            @StudentId,
                                            @Sign,
                                            @feedback,
                                            @TaskName,
                                            @TaskUrl,
                                            @SignDate,
                                            @SignOutDate);";
                    int row = connection.Execute(strSql, studentBo);
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
                LogHelper.WriteLog(string.Format("CourseStudentService.AddCourseStudent({0})异常", studentBo), ex);
            }
            return false;
        }

       /// <summary>
       /// 根据学员ID和课程ID修改签到及签退时间
       /// </summary>
       /// <param name="signDate"></param>
       /// <param name="signOutDate"></param>
       /// <param name="studentId"></param>
       /// <param name="courseId"></param>
       /// <returns></returns>
        public bool Registration(DateTime signDate, DateTime signOutDate, string studentId, string courseId)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    string sql = @"UPDATE `tb_coursestudent` SET `SignDate`=@SignDate,`SignOutDate`=@SignOutDate WHERE `StudentId`=@StudentId AND                                            `CourseId`=@CourseId";
                    int row = connection.Execute(sql, new
                    {
                        SignDate = signDate,
                        SignOutDate = signOutDate,
                        StudentId = studentId,
                        CourseId = courseId
                    
                    });
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

                LogHelper.WriteLog(string.Format("CourseStudentService.Registration({0},{1},{2},{3})", signDate, signOutDate, studentId, courseId), ex);
                return false;
            }
        }
        #endregion

        /// <summary>
        /// 批量修改报名数据方法
        /// </summary>
        /// <param name="courseStudentDtos"></param>
        /// <returns></returns>
        public bool BatchRegistration(List<CourseStudentDto> courseStudentDtos )
        {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    string sql = @"UPDATE `tb_coursestudent` SET `SignDate`=@SignDate,`SignOutDate`=@SignOutDate WHERE `StudentId`=@StudentId AND                                            `CourseId`=@CourseId";
                    var trans = connection.BeginTransaction();
                    try
                    {
                        foreach (var courseStudentDto in courseStudentDtos)
                        {
                            connection.Execute(sql, new
                            {
                                SignDate = courseStudentDto.SignDate,
                                SignOutDate = courseStudentDto.SignOutDate,
                                StudentId = courseStudentDto.StudentId,
                                CourseId = courseStudentDto.CourseId
                            }, trans);
                        }
                        trans.Commit();
                        return true;

                    }
                    catch (Exception ex)
                    {
                        LogHelper.WriteLog(string.Format("CourseStudentService.Registration({0})", courseStudentDtos), ex);
                        trans.Rollback();
                        return false;
                    }
                   
                }
        }

    }
}
