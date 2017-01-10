using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.Course;
using BusinessObject.WSBo;
using Dapper;
using Domain.common;
using Huatong.DAO;

namespace Services.Course.CourseControl
{
    /// <summary>
    /// 该类只提供查询方法给外部接口调用！
    /// </summary>
    public class CourseStudentFace
    {
        /// <summary>
        /// 根据课程ID获取报名数据
        /// </summary>
        /// <param name="courseId">课程ID</param>
        /// <returns></returns>
        public List<CourseStudentWSBo> GetCourseStudentByCourseId(string courseId)
        {
            string strSql = string.Format(@"SELECT s.IDNo,s.Name,s.`Id` AS StudentId,c.`CourseId`,co.`CourseName` FROM `tb_coursestudent` c
                                            INNER JOIN `tb_student` s ON c.`StudentId`=s.`Id`
                                            INNER JOIN `tb_course` co ON co.`Id`=c.`CourseId`
                                            WHERE c.`CourseId`=@CourseId");
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    var list = context.Query<CourseStudentWSBo>(strSql,
                                                 new
                                                 {
                                                     CourseId = courseId
                                                 }).ToList();
                    return list;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentFace.GetCourseStudentByCourseId({0})异常", courseId), ex);
                return null;
            }
        }



        /// <summary>
        /// 根据课程ID获取报名数据
        /// </summary>
        /// <param name="courseId">课程ID</param>
        /// <returns></returns>
        public List<CourseStudentDto> GetCourseStudentByCourseIdNew(string courseId)
        {
            string strSql = string.Format(@"SELECT * FROM `tb_coursestudent` WHERE `CourseId`=@CourseId");
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    var list = context.Query<CourseStudentDto>(strSql,
                                                 new
                                                 {
                                                     CourseId = courseId
                                                 }).ToList();
                    return list;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentFace.GetCourseStudentByCourseIdNew({0})异常", courseId), ex);
                return null;
            }
        }

        /// <summary>
        /// 根据课程ID获取报名学员信息
        /// M by laq 修改为通过身份证号关联
        /// </summary>
        /// <param name="page"></param>
        /// <param name="rows"></param>
        /// <param name="order"></param>
        /// <param name="sort"></param>
        /// <param name="courseId"></param>
        /// <returns></returns>
        public Page<CourseStudentWSBo> GetCourseStudentByCourseIdNew(int page, int rows, string order, string sort, string courseId)
        {
            string strSql = string.Format(@"SELECT c.`Id`,s.IDNo,s.`Name`,s.`Sex`,sc.`SchoolName`,s.`Id` AS StudentId,c.`CourseId` 
                                            FROM `tb_coursestudent` c   
                                            INNER JOIN tb_student s ON c.`IDNo`=s.`IDNo`
                                            INNER JOIN tb_school sc ON sc.`Id`=s.`SchoolId`
                                            WHERE  c.`CourseId`=@CourseId ");


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
            var pageList = new Page<CourseStudentWSBo>();

            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    //因为没有分页，所以不需要查询两次
                    /*count = context.Query<CourseStudentWSBo>(strSql,
                        new
                        {
                            CourseId = courseId
                        }).Count();*/

                    //strSql += " limit @pageindex,@pagesize";
                    var list = context.Query<CourseStudentWSBo>(strSql,
                                                 new
                                                 {
                                                     CourseId = courseId,
                                                 }).ToList();
                    pageList.ListT = list;
                    pageList.PageIndex = page;
                    pageList.PageSize = rows;
                    pageList.TotalCount = list.Count;//查出来的数据就是最大的数量
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentFace.GetCourseStudentByCourseId({0})异常", courseId), ex);
                return null;
            }
            return pageList;
        }
        
    }
}
