﻿using System;
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


        public CourseBo GetCoursePeroid(string userId,string theYear, string trainType)
        {
            var courseBo = new CourseBo { };
            using (var connection = DataBaseConnection.GetMySqlConnection())
            {
                var sqlStr =
                    @"SELECT  b.Period FROM tb_student st INNER JOIN 
(SELECT ct.StudentId,SUM(Period) AS Period,tb_traintype.TrainType,TheYear  FROM  tb_coursestudent ct INNER JOIN tb_course co  ON co.id=ct.CourseId AND SIGN=2 
INNER JOIN tb_traintype ON tb_traintype.id=co.TrainType 
GROUP BY ct.StudentId,tb_traintype.TrainType,TheYear )b ON st.id=b.studentid where TheYear =@TheYear and TrainType=@TrainType and StudentId=@StudentId ";
                courseBo = connection.Query<CourseBo>(sqlStr, new { TheYear = theYear, TrainType = trainType, studentid = userId }).FirstOrDefault();
            }


            return courseBo;
        }



        //获取授课教师列表数据
        public Page<CourseBo> GetTeacherMessage(int page, int rows, string sort, string order, CourseBo courseBo)
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
            var pageList = new Page<CourseBo>();

            string strSql = string.Format(@"SELECT sc.SchoolName,st.Name AS teachername,tt.TrainType,CourseName,TimeStart,TimeEnd,co.Period 
                                            FROM tb_course co INNER JOIN tb_student st ON co.TeacherId=st.id 
                                            INNER JOIN tb_school sc ON st.SchoolId=sc.Id INNER JOIN tb_traintype tt ON co.traintype=tt.id  WHERE 1=1  ");
            if (courseBo != null)
            {
                if (courseBo.SchoolName != null)
                {
                    strSql += "and sc.SchoolName like @SchoolName ";
                }

                if (courseBo.TeacherName != null)
                {
                    strSql += "and st.Name like @TeacherName ";
                }
            }



            strSql += " ORDER BY sc.SchoolName,st.Name,TimeStart ";


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<CourseBo>(strSql,
                                            new
                                            {
                                                SchoolName = string.Format("%{0}%", courseBo.SchoolName),
                                                TeacherName = string.Format("%{0}%", courseBo.TeacherName)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<CourseBo>(strSql,
                                                new
                                                {
                                                    SchoolName = string.Format("%{0}%", courseBo.SchoolName),
                                                    TeacherName = string.Format("%{0}%", courseBo.TeacherName),
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

    }
}
