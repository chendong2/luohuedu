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
            sql += wheres +group;
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
    }
}
