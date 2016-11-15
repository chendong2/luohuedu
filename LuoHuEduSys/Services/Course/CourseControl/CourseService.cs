using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using BusinessObject.Course;
using Dapper;
using Domain.common;
using Huatong.DAO;
using Services.Admin.StudentControl;

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

            string strSql = string.Format(@"SELECT c.*,s.SubjectName,t.TrainType,sh.`SchoolName`, CONCAT(st.Name,c.`WaiPingName`) AS NAME,COUNT(ct.id) AS YiBao FROM tb_course AS c 
                                            LEFT JOIN tb_subject AS s ON c.Subject=s.Id
                                            LEFT JOIN tb_traintype AS t ON c.TrainType=t.Id 
                                            LEFT JOIN `tb_school` sh ON sh.`Id`=  c.`OrganizationalName`
                                            LEFT JOIN tb_student st ON st.`Id`=c.`TeacherId` 
                                            LEFT JOIN `tb_coursestudent` ct ON ct.`CourseId`=c.`Id`                                        
                                            WHERE 1=1
                                             ");
            if (courseBo != null)
            {
                //课程名称查询
                if (!string.IsNullOrEmpty(courseBo.CourseName))
                {
                    strSql += "and c.CourseName Like @CourseName ";
                }
                //课程代码查询
                if (!string.IsNullOrEmpty(courseBo.CourseCode))
                {
                    strSql += " and c.CourseCode=@CourseCode ";
                }
                //课程代码查询
                if (!string.IsNullOrEmpty(courseBo.TeacherId))
                {
                    strSql += " and c.TeacherId=@TeacherId ";
                }
                //课程代码查询
                if (!string.IsNullOrEmpty(courseBo.TheYear))
                {
                    strSql += " and c.TheYear=@TheYear ";
                }
                //课程代码查询
                if (!string.IsNullOrEmpty(courseBo.OrganizationalName) && courseBo.OrganizationalName != "0")
                {
                    strSql += " and c.OrganizationalName=@OrganizationalName ";
                }
                //课程代码查询
                if (!string.IsNullOrEmpty(courseBo.TrainType) && courseBo.TrainType != "0")
                {
                    strSql += " and c.TrainType=@TrainType ";
                }
                //课程代码查询
                if ( courseBo.Locked !=0)
                {
                    strSql += " and c.Locked=@Locked ";
                }
            }
            string adminSchoolId = string.Empty;

            if (Domain.common.UserInfo.havePermissions("学校管理员") && !Domain.common.UserInfo.havePermissions("系统管理员"))
            {

                string userId = Domain.common.UserInfo.GetUserId().ToString();
                var studentService=new StudentService();

                var adminBo = studentService.GetAllStudentById1(userId);
                adminSchoolId = adminBo.SchoolId;

                strSql += " and c.OrganizationalName=@adminSchoolId and c.TrainType='c038430c-1b54-4c91-9e60-993642e79163' ";


            }

           
            const string group = " GROUP BY c.`Id` ORDER BY c.`TimeStart` DESC ";
            strSql += group;
            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<CourseBo>(strSql,
                                            new
                                            {
                                                CourseName = string.Format("%{0}%", courseBo.CourseName),
                                                adminSchoolId = adminSchoolId,
                                                TheYear = courseBo.TheYear,
                                                TeacherId=courseBo.TeacherId,
                                                OrganizationalName=courseBo.OrganizationalName,
                                                TrainType = courseBo.TrainType,
                                                Locked=courseBo.Locked

                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<CourseBo>(strSql,
                                                new
                                                {
                                                    CourseName = string.Format("%{0}%", courseBo.CourseName),
                                                    adminSchoolId = adminSchoolId,
                                                     TheYear = courseBo.TheYear,
                                                    TeacherId=courseBo.TeacherId,
                                                     OrganizationalName=courseBo.OrganizationalName,
                                                     TrainType = courseBo.TrainType,
                                                      Locked=courseBo.Locked,
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

        /// <summary>
        /// 课程修改方法
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        public bool UpdateCourse(CourseBo courseBo)
        {
            if (courseBo == null)
                throw new ArgumentNullException("courseBo");
            try
            {
                var sqlStr = @"UPDATE `tb_course`
                                SET `TeacherId` = @TeacherId,
                                `CourseName` = @CourseName,
                                `TheYear` = @TheYear,
                                `TrainType` = @TrainType,
                                `Subject` = @Subject,
                                `Phone` = Phone,
                                `Period` = @Period,
                                `Cost` = @Cost,
                                `ChargeObj` = @ChargeObj,
                                `SetCheck` = @SetCheck,
                                `IsMust` = @IsMust,
                                `Address` = @Address,
                                `MaxNumber` = @MaxNumber,
                                `SetApply` = @SetApply,
                                `OrganizationalName` = @OrganizationalName,
                                `DesignIdea` = @DesignIdea,
                                `TrainingAim` = @TrainingAim,
                                `Distinctive` = @Distinctive,
                                `EffectAnalysis` = @EffectAnalysis,
                                `TimeStart` = @TimeStart,
                                `TimeEnd` = @TimeEnd,
                                `CourseCode` = @CourseCode,
                                `Requirement` = @Requirement,
                                `TeachingObject` = @TeachingObject,
                                `ObjectEstablish` = @ObjectEstablish,
                                `ObjectSubject` = @ObjectSubject,
                                `ModifiyBy` = @ModifiyBy,
                                `ModifiyOn` = @ModifiyOn,
                                `MainComment` = @MainComment,
                                `TeacherName` = @TeacherName,
                                WaiPingName=@WaiPingName,
                                ReMark=@ReMark,
                                `KaoQingDateOne`=@KaoQingDateOne,
                                `KaoQingMorningOne`=@KaoQingMorningOne,
                                `KaoQingAfternoonOne`=@KaoQingAfternoonOne,
                                `KaoQingNightOne`=@KaoQingNightOne,
                                `MorningPeriodOne`=@MorningPeriodOne,
                                `AfternoonPeriodOne`=@AfternoonPeriodOne,
                                `NightPeriodOne`=@NightPeriodOne,
                                `KaoQingDateTwo`=@KaoQingDateTwo,
                                `KaoQingMorningTwo`=@KaoQingMorningTwo,
                                `KaoQingAfternoonTwo`=@KaoQingAfternoonTwo,
                                `KaoQingNightTwo`=@KaoQingNightTwo,
                                `MorningPeriodTwo`=@MorningPeriodTwo,
                                `AfternoonPeriodTwo`=@AfternoonPeriodTwo,
                                `NightPeriodTwo`=@NightPeriodTwo
                                 WHERE `Id` = @Id;"; 
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, courseBo);
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
                LogHelper.WriteLog(string.Format("EducationOfficeService.UpdateCourse({0})异常", courseBo), ex);
                return false;
            }

        }

        public CourseBo GetCourseById(string id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var courseBo = new CourseBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_course where Id=@Id";
                    courseBo = connection.Query<CourseBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseService.GetCourseById({0})异常", id), ex);
            }
            return courseBo;
        }
        /// <summary>
        /// 新增课程
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        public bool AddCourse(CourseBo courseBo)
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
  `AttendanceUrl`,`Locked`,`Assessmentlevel`,`CreatedBy`,`CreatedOn`,`ModifiyBy`,`ModifiyOn`,`WaiPingName`,`ReMark`,PlcSchool,PriSchool,`KaoQingDateOne`,
  `KaoQingMorningOne`,`KaoQingAfternoonOne`,`KaoQingNightOne`,`MorningPeriodOne`,`AfternoonPeriodOne`,`NightPeriodOne`,`KaoQingDateTwo`,
  `KaoQingMorningTwo`,`KaoQingAfternoonTwo`,`KaoQingNightTwo`,`MorningPeriodTwo`,`AfternoonPeriodTwo`,`NightPeriodTwo`)
   VALUES (@Id,@TeacherId,@CourseName,@TheYear,@TrainType,@Subject,@Phone, @Period,@Cost,@ChargeObj, @SetCheck,
 @IsMust,@Address,@MaxNumber,@SetApply,@OrganizationalName,@DesignIdea,@TrainingAim,
 @Distinctive,@EffectAnalysis,@CourseDate,
 @TimeStart,
 @TimeEnd,
 @CourseCode,
 @Requirement,
 @TeachingObject,
 @ObjectEstablish,
 @ObjectSubject,
 @CourseState,
 @AduitTime,
 @FirstAduit,
 @EndAduit,
 @CenterAduit,
 @AttendanceName,
 @AttendanceUrl,
 @Locked,
 @Assessmentlevel,
 @CreatedBy,
 @CreatedOn,
 @ModifiyBy,
 @ModifiyOn,@WaiPingName,@ReMark,@PlcSchool,@PriSchool,
 @KaoQingDateOne,@KaoQingMorningOne,@KaoQingAfternoonOne, @KaoQingNightOne,@MorningPeriodOne,@AfternoonPeriodOne,@NightPeriodOne,
 @KaoQingDateTwo,@KaoQingMorningTwo,@KaoQingAfternoonTwo,@KaoQingNightTwo,@MorningPeriodTwo,@AfternoonPeriodTwo,@NightPeriodTwo);";
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

        #region "课程审核、设定、锁定、查看报名数据方法封装"

        /// <summary>
        /// 报名设置方法，
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        public bool ApplySet(CourseBo courseBo)
        {
            if (courseBo == null)
                throw new ArgumentNullException("courseBo");
            try
            {
                var sqlStr = @"UPDATE `tb_course` SET Requirement=@Requirement,TeachingObject=@TeachingObject,ObjectEstablish=@ObjectEstablish,ObjectEstablish=@ObjectEstablish,
ObjectSubject=@ObjectSubject,PlcSchool=@PlcSchool,PriSchool=@PriSchool WHERE Id=@Id
";
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, courseBo);
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
                LogHelper.WriteLog(string.Format("EducationOfficeService.ApplySet({0})异常", courseBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 课程锁定方法
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        public bool SetLockCourse(CourseBo courseBo)
        {
            if (courseBo == null)
                throw new ArgumentNullException("courseBo");
            try
            {
                var sqlStr = @"UPDATE `tb_course` SET Locked=@Locked,Assessmentlevel=@Assessmentlevel 
                                WHERE Id=@Id
                                ";
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, courseBo);
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
                LogHelper.WriteLog(string.Format("EducationOfficeService.AduitSet({0})异常", courseBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 课程审批方法
        /// </summary>
        /// <param name="courseBo"></param>
        /// <returns></returns>
        public bool AduitSet(CourseBo courseBo)
        {
            if (courseBo == null)
                throw new ArgumentNullException("courseBo");
            try
            {
                var sqlStr = @"UPDATE `tb_course` SET CourseState=@CourseState,AduitTime=@AduitTime,FirstAduit=@FirstAduit,
                                EndAduit=@EndAduit,CenterAduit=@CenterAduit
                                WHERE Id=@Id
                                ";
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, courseBo);
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
                LogHelper.WriteLog(string.Format("EducationOfficeService.AduitSet({0})异常", courseBo), ex);
                return false;
            }
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
            string strSql = string.Format(@"SELECT * from tb_course  WHERE  TrainType !='c038430c-1b54-4c91-9e60-993642e79163' ");

            endDate = endDate.AddDays(1);
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

                strSql += " and TimeStart BETWEEN @beginDate and @endDate ";
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

        #region "我的课程"
        public Page<CourseBo> GetMyCourseList(int page, int rows, string order, string sort, CourseBo courseBo,string studentId)
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

            string strSql = string.Format(@"SELECT c.*,s.SubjectName,t.TrainType,sh.`SchoolName`,cs.`Period` AS HuoDePeriod FROM tb_course AS c 
                                            INNER JOIN tb_subject AS s ON c.Subject=s.Id
                                            INNER JOIN tb_traintype AS t ON c.TrainType=t.Id 
					                        INNER JOIN `tb_school` sh ON sh.`Id`=  c.`OrganizationalName`
					                        INNER JOIN tb_coursestudent cs ON c.`Id`=cs.`CourseId`                                 
                                            WHERE cs.`StudentId`=@StudentId
                                             ");

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
                                                StudentId = studentId
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<CourseBo>(strSql,
                                                new
                                                {
                                                    StudentId = studentId,
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
        #endregion 

        #region "我是授课教师"
        public Page<CourseBo> GetRoleCourseList(int page, int rows, string order, string sort, CourseBo courseBo)
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

            string strSql = string.Format(@"SELECT c.*,s.SubjectName,t.TrainType,sh.`SchoolName` FROM tb_course AS c 
                                            INNER JOIN tb_subject AS s ON c.Subject=s.Id
                                            INNER JOIN tb_traintype AS t ON c.TrainType=t.Id 
					                        INNER JOIN `tb_school` sh ON sh.`Id`=  c.`OrganizationalName`                                
                                            WHERE 1=1
                                             ");
            if (courseBo != null)
            {
                //课程名称查询
                if (!string.IsNullOrEmpty(courseBo.CourseName))
                {
                    strSql += "and c.CourseName Like @CourseName ";
                }
                //授课教师ID
                if (!string.IsNullOrEmpty(courseBo.TeacherId))
                {
                    strSql += " and c.TeacherId=@TeacherId ";
                }
                if (!string.IsNullOrEmpty(courseBo.TheYear))
                {
                    strSql += "and c.TheYear=@TheYear ";
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
                                                EducationtName = string.Format("%{0}%", courseBo.CourseName),
                                                TeacherId = courseBo.TeacherId,
                                                TheYear=courseBo.TheYear
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<CourseBo>(strSql,
                                                new
                                                {
                                                    EducationtName = string.Format("%{0}%", courseBo.CourseName),
                                                    TeacherId = courseBo.TeacherId,
                                                    TheYear=courseBo.TheYear,
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
        #endregion
    }
}
