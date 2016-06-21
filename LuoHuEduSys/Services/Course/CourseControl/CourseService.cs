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
    public class CourseService
    {
        /// <summary>
        /// 分页获取课程数据方法
        /// </summary>
        /// <param name="page">页码</param>
        /// <param name="rows">行数</param>
        /// <param name="sort">排序</param>
        /// <param name="order">排序字段</param>
        /// <param name="courseBo">课程实体</param>
        /// <returns></returns>
        public Page<CourseBo> GetCourseList(int page, int rows, string sort, string order, CourseBo courseBo)
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

            string strSql = string.Format(@"SELECT * from tb_course  where 1=1 ");
            if (courseBo != null)
            {
                //课程名称查询
                if (courseBo.CourseName != null)
                {
                    strSql += "and CourseName like @CourseName ";
                }
                //课程代码查询
                if (courseBo.CourseCode != null)
                {
                    strSql += " and CourseCode=@CourseCode ";
                }
            }

            switch (sort)
            {
                case "TheYear":
                    strSql += " order by TheYear " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<CourseBo>(strSql,
                                            new
                                            {
                                                EducationtName = string.Format("%{0}%", courseBo.CourseName)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<CourseBo>(strSql,
                                                new
                                                {
                                                    CourseName = string.Format("%{0}%", courseBo.CourseName),
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

        public bool UpdateCourse(CourseBo courseBo)
        {
            return false;
        }
    }
}
