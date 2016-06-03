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
            string sql = @"SELECT Name,IDNO,YearNo,TermNo,CourseType,CourseName,StudyType,Period,DATE_FORMAT(StartDate, '%Y-%m-%d') AS StartDate,DATE_FORMAT(EndDate, '%Y-%m-%d') AS EndDate,TrainDept FROM tb_coursestudenttemp where 1=1 ";

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
            //加where条件
            sql += wheres;
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
