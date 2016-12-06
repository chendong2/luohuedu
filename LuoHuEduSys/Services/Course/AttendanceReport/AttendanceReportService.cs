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
        /// <summary>
        /// 
        /// </summary>
        /// <param name="page"></param>
        /// <param name="rows"></param>
        /// <param name="order"></param>
        /// <param name="sort"></param>
        /// <param name="attendanceReportBo"></param>
        /// <returns></returns>
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

            string sql = @"SELECT c.`Id`,co.`CourseName`,co.`TimeStart`,co.`TimeEnd`,s.`Name` ,co.`TheYear`,c.`Period`,c.`SignDate`,c.`SignOutDate`,c.Sign,IsCalculate,c.IDNo 
                            FROM  `tb_course` co 
                            INNER JOIN `tb_coursestudent` c ON co.`Id`=c.`CourseId`
                            INNER JOIN `tb_student` s ON s.`IDNo`=c.`IDNo` WHERE 1=1 ";

            //sql 查询条件拼接

            if (attendanceReportBo != null)
            {
                if (!string.IsNullOrEmpty(attendanceReportBo.CourseName))
                {
                    sql += "and co.CourseName= @CourseName ";
                }
                if (!string.IsNullOrEmpty(attendanceReportBo.Name))
                {
                    sql += "and s.Name = @Name ";
                }
            }

            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    count = context.Query<AttendanceReportBo>(sql,
                                             new
                                             {
                                                 CourseName = attendanceReportBo.CourseName,
                                                 Name = attendanceReportBo.Name
                                             }).Count();

                    sql += " limit @pageindex,@pagesize";

                    var list = context.Query<AttendanceReportBo>(sql,
                                               new
                                               {
                                                   CourseName = attendanceReportBo.CourseName,
                                                   Name =  attendanceReportBo.Name,
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
                LogHelper.WriteLog(string.Format("AttendanceReportService.AttendanceReportBo(courseStudentTempBo)"), ex);
                return pageList;
            }

        }
    }
}
