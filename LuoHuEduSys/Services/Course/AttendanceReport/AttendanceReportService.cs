using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.Course;
using Dapper;
using Domain.common;
using Huatong.DAO;

namespace Services.Course.AttendanceReport
{
    public class AttendanceReportService
    {
        public Page<AttendanceReportBo> GetAttendanceReportList(int page, int rows, string order, string sort, AttendanceReportBo attendanceReportBo)
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
            var pageList = new Page<AttendanceReportBo>();

            string sql = @"SELECT * FROM  tb_coursestudenttemp WHERE 1=1 ";

            //sql 查询条件拼接

            if (attendanceReportBo != null)
            {
                if (!string.IsNullOrEmpty(attendanceReportBo.CourseName))
                {
                    sql += "and CourseName Like @CourseName ";
                }
                if (!string.IsNullOrEmpty(attendanceReportBo.Name))
                {
                    sql += "and Name=@Name ";
                }
            }
            string orderby = " ORDER BY CourseName,StartDate " + order;
            //加where条件
            sql += orderby;
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    count = context.Query<AttendanceReportBo>(sql,
                                             new
                                             {
                                                 EducationtName = string.Format("%{0}%", attendanceReportBo.CourseName),
                                                 Name = attendanceReportBo.Name
                                             }).Count();

                    sql += " limit @pageindex,@pagesize";

                    var list = context.Query<AttendanceReportBo>(sql,
                                               new
                                               {
                                                   CourseName = string.Format("%{0}%", attendanceReportBo.CourseName),
                                                   Name = attendanceReportBo.Name,
                                                   pageindex = pageIndex,
                                                   pagesize = pageSize
                                               }).ToList();

                    pageList.ListT = list;
                    pageList.PageIndex = page;
                    pageList.PageSize = rows;
                    pageList.TotalCount = count;
                    return pageList;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentTempService.GetCourseStudent(courseStudentTempBo)"), ex);
                return pageList;
            }

        }
    }
}
