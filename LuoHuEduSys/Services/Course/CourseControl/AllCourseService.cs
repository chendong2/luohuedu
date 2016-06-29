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
(SELECT ct.StudentId,SUM(Period) AS Period,TrainType,TheYear  FROM  tb_coursestudent ct INNER JOIN tb_course co  ON co.id=ct.CourseId and sign=2 
GROUP BY ct.StudentId,TrainType,TheYear)b ON st.id=b.studentid where TheYear =@TheYear and TrainType=@TrainType and StudentId=@StudentId ";
                courseBo = connection.Query<CourseBo>(sqlStr, new { TheYear = theYear, TrainType = trainType, studentid = userId }).FirstOrDefault();
            }


            return  courseBo;
        }

        public CourseBo GetCount(string theYear)
        {
            string userId = Domain.common.UserInfo.GetUserId().ToString();
            var courseBo = new CourseBo { };
            using (var connection = DataBaseConnection.GetMySqlConnection())
            {
                var sqlStr =
                    @"SELECT COUNT(Period) AS  Period FROM  tb_coursestudent ct INNER JOIN tb_course co  ON co.id=ct.CourseId   
                      where TheYear =@TheYear  and StudentId=@StudentId ";
                courseBo = connection.Query<CourseBo>(sqlStr, new { TheYear = theYear, studentid = userId }).FirstOrDefault();
            }


            return courseBo;
        }

        public List<CourseBo>  GetMyCourseList(string theYear,string trainType)
        {
            var list = new List<CourseBo>();
            string userId = Domain.common.UserInfo.GetUserId().ToString();
            string strSql = string.Format(@"SELECT  CourseNAME,IsMust,TeachingObject,SubjectName,st1.name AS teachername,OrganizationalName,
co.Address,co.Period,DATE_FORMAT(CourseDate,'%Y-%m-%d') AS CourseDateStr,SIGN FROM tb_student st INNER JOIN 
tb_coursestudent ct ON st.id=ct.studentid
INNER JOIN tb_course co  ON co.id=ct.CourseId  INNER JOIN tb_subject sub 
ON co.Subject=sub.id INNER JOIN tb_student st1 ON st1.id=co.teacherid 
WHERE TheYear =@TheYear AND TrainType=@TrainType AND st.Id=@Id
");
            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                list = context.Query<CourseBo>(strSql,
                                                   new
                                                       {
                                                           TheYear = theYear,
                                                           TrainType = trainType,
                                                           Id = userId
                                                       }).ToList();
            }

            return list;

        }

    }
}
