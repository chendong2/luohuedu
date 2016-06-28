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
    public class AllCourseService
    {

        public CourseBo GetMyColloctCourse(string theYear, string trainType)
        {
            string userId = Domain.common.UserInfo.GetUserId().ToString();
            var courseBo = new CourseBo { };
            using (var connection = DataBaseConnection.GetMySqlConnection())
            {
                var sqlStr =
                    @"SELECT  NAME,Sex,Profession,b.Period,TheYear,TrainType FROM tb_student st INNER JOIN 
(SELECT ct.StudentId,SUM(Period) AS Period,TrainType,TheYear  FROM  tb_coursestudent ct INNER JOIN tb_course co  ON co.id=ct.CourseId 
GROUP BY ct.StudentId,TrainType,TheYear)b ON st.id=b.studentid WHERE TheYear=@TheYear AND TrainType=@TrainType";
                courseBo = connection.Query<CourseBo>(sqlStr, new { TheYear = theYear, TrainType = trainType }).FirstOrDefault();
            }


            return  courseBo;
        }

    }
}
