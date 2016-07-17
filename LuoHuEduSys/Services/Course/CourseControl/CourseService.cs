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
        #region "通用增删改查方法"
        /// <summary>
        /// 分页获取课程数据方法
        /// </summary>
        /// <param name="page">页码</param>
        /// <param name="rows">行数</param>
        /// <param name="sort">排序</param>
        /// <param name="order">排序字段</param>
        /// <param name="courseBo">课程实体</param>
        /// <returns></returns>
        public Page<CourseBo> GetCourseList(int page, int rows, string order, string sort, CourseBo courseBo)
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
                    strSql += "and CourseName Like @CourseName ";
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

        /// <summary>
        /// 新增课程
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        public bool AddCousrse(CourseBo courseBo)
        {
            if (courseBo == null)
                throw new ArgumentNullException("courseBo");
            if (courseBo.Id != null && courseBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    courseBo.Id = Guid.NewGuid().ToString();
                    var strSql = @"INSERT INTO `tb_course`
                            (`Id`,`TeacherId`, `CourseName`,`TheYear`,`TrainType`,`Subject`,`Phone`,
                             `Period`,`Cost`,`ChargeObj`,`SetCheck`, `IsMust`,`Address`, `MaxNumber`,`SetApply`,
                             `OrganizationalName`,`DesignIdea`,`TrainingAim`,`Distinctive`,`EffectAnalysis`,
                             `CourseDate`,`TimeStart`,`TimeEnd`,`CourseCode`, `Requirement`,`TeachingObject`,`ObjectEstablish`,`ObjectSubject`,
                             `CourseState`,`AduitTime`,`FirstAduit`,`EndAduit`,`CenterAduit`,`AttendanceName`,
                             `AttendanceUrl`,`Locked`,`Assessmentlevel`,`CreatedBy`,`CreatedOn`,`ModifiyBy`,`ModifiyOn`)
                              VALUES ('Id','TeacherId','CourseName','TheYear','TrainType','Subject','Phone', 'Period','Cost','ChargeObj', 'SetCheck',
                            'IsMust','Address','MaxNumber','SetApply','OrganizationalName','DesignIdea','TrainingAim',
                            'Distinctive','EffectAnalysis','CourseDate',
                            'TimeStart',
                            'TimeEnd',
                            'CourseCode',
                            'Requirement',
                            'TeachingObject',
                            'ObjectEstablish',
                            'ObjectSubject',
                            'CourseState',
                            'AduitTime',
                            'FirstAduit',
                            'EndAduit',
                            'CenterAduit',
                            'AttendanceName',
                            'AttendanceUrl',
                            'Locked',
                            'Assessmentlevel',
                            'CreatedBy',
                            'CreatedOn',
                            'ModifiyBy',
                            'ModifiyOn');";
                    int row = connection.Execute(strSql, courseBo);
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
                LogHelper.WriteLog(string.Format("CourseService.AddCousrse({0})异常", courseBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 课程管理批量删除方法
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public bool DeleteCousrseByIds(string ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        CourseBo courseBo = new CourseBo();
                        courseBo.Id = idArray[i];
                        var sqlStr = @"delete from  `tb_course` where id=@Id;";
                        connection.Execute(sqlStr, courseBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("ExemptionService.DeleteCousrseByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }
        #endregion 



        #region "考勤机接口方法"
        /// <summary>
        /// 获取课程数据方法
        /// </summary>
        /// <param name="courseName">课程名称</param>
        /// <param name="courseCode">课程代码</param>
        /// <param name="beginDate">课程开始日期</param>
        /// <param name="endDate">课程结束日期</param>
        /// <returns></returns>
        public List<CourseBo> GetCourses(string courseName, string courseCode,DateTime beginDate,DateTime endDate)
        {
            string strSql = string.Format(@"SELECT * from tb_course  where 1=1 ");

            if (!string.IsNullOrEmpty(courseName))
            {
                strSql += "and CourseName =@CourseName ";
            }
            if (!string.IsNullOrEmpty(courseCode))
            {
                strSql += " and CourseCode=@CourseCode ";
            }
            if (!String.IsNullOrEmpty(beginDate.ToString()) && !String.IsNullOrEmpty(endDate.ToString()))
            {

                strSql += " and CourseDate BETWEEN @beginDate and @endDate ";
            }
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    var list = context.Query<CourseBo>(strSql,
                                                   new
                                                   {
                                                       CourseName = courseName,
                                                       CourseCode = courseCode,
                                                       beginDate = beginDate,
                                                       endDate = endDate
                                                   }).ToList();
                    return list;
                }
            }
            catch (Exception ex)
            {
               
                LogHelper.WriteLog(string.Format("ExemptionService.GetCourses({0})异常", courseName), ex);
                return null;
            }
          
        }
        
        
    
        #endregion

    }
}
