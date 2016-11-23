using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.AdminBo;
using BusinessObject.Course;
using Dapper;
using Domain.common;
using Huatong.DAO;
using Microsoft.SqlServer.Server;

namespace Services.Course.CourseControl
{
    public class CourseStudentService
    {
        #region "市获取考勤数据接口方法"
        /// <summary>
        /// 该方法供市中心获取临时考勤数据使用！
        /// </summary>
        /// <param name="idNo"></param>
        /// <param name="yearNo"></param>
        /// <param name="isAll"></param>
        /// <returns></returns>
        public List<CourseStudentBo> GetCourseStudentNew(string idNo, string yearNo, string isAll)
        {
            //合并新数据和之前导入的数据
            string sql = @"SELECT s.`Name` ,s.`IDNo`,co.`TheYear` AS YearNo,0 AS TermNo,tr.TrainType,co.`CourseName`,'面授' AS 'StudyType',c.`Period`,
                            DATE_FORMAT(co.`TimeStart`, '%Y-%m-%d') AS StartDate,DATE_FORMAT(co.`TimeEnd`, '%Y-%m-%d') 
                            AS EndDate,sc.`SchoolName` AS TrainDept
                            FROM `tb_coursestudent` c
                            INNER JOIN `tb_course` co ON co.`Id`=c.`CourseId`
                            INNER JOIN  tb_school sc ON sc.`Id`=co.`OrganizationalName`
                            INNER JOIN `tb_student` s ON s.`Id`=c.`StudentId`
                            INNER JOIN `tb_traintype` tr ON co.TrainType=tr.`Id`
                            WHERE 1=1 ";

            //sql 查询条件拼接
            var wheres = new StringBuilder();
            var paras = new DynamicParameters();
            if (!string.IsNullOrEmpty(idNo))
            {
                wheres.Append(" and s.IDNO = @IdNo");
                paras.Add("IdNo", idNo);
            }
            if (isAll != "All")
            {
                if (!string.IsNullOrEmpty(yearNo))
                {
                    wheres.Append(" and co.`TheYear`=@YearNo ");
                    paras.Add("YearNo", yearNo);
                }
            }
            //string group = " GROUP BY IDNO,CourseName ";
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

        public List<CourseStudentBo> GetCourseStudentJiu(string idNo, string yearNo, string isAll)
        {
            //合并新数据和之前导入的数据
            string sql = @"
                            SELECT NAME,IDNO,YearNo,TermNo,CASE CourseType
                            WHEN '集中培训' THEN '专业科目'
                            WHEN '专项培训' THEN '专业科目'
                            WHEN '校本培训' THEN '个人选修'
                            ELSE CourseType
                            END AS CourseType,CourseName,StudyType,Period,DATE_FORMAT(StartDate, '%Y-%m-%d') AS StartDate,DATE_FORMAT(EndDate, '%Y-%m-%d') 
                            AS EndDate,TrainDept FROM tb_coursestudenttemp  
                            WHERE 1=1 ";

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
            string group = " GROUP BY IDNO,CourseName ";
            //加where条件
            sql += wheres + group;
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

        public List<CourseStudentBo> GetCourseStudent(string idNo, string yearNo, string isAll)
        {
            //合并新数据和之前导入的数据
            string sql = @"SELECT NAME,IDNO,YearNo,TermNo,CASE CourseType
                            WHEN '集中培训' THEN '专业科目'
                            WHEN '专项培训' THEN '专业科目'
                            WHEN '校本培训' THEN '个人选修'
                            ELSE CourseType
                            END AS CourseType,CourseName,StudyType,Period,DATE_FORMAT(StartDate, '%Y-%m-%d') AS StartDate,DATE_FORMAT(EndDate, '%Y-%m-%d') 
                            AS EndDate,TrainDept FROM tb_coursestudenttempOld where 1=1  ";
            
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
            //string group = " GROUP BY IDNO,CourseName";
            //加where条件
            sql += wheres;
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    var list = context.Query<CourseStudentBo>(sql, paras).ToList();
                    var listnew = GetCourseStudentNew(idNo, yearNo, isAll);
                    var listjiu = GetCourseStudentJiu(idNo, yearNo, isAll);
                    if (listnew.Count > 0)
                    {
                        listnew.ForEach(list.Add);
                    }
                    if (listjiu.Count > 0)
                    {
                        listjiu.ForEach(list.Add);
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.Login({0},{1},{2})", idNo, yearNo, isAll), ex);
                return null;
            }
        }


        #endregion


        #region "CRUD方法封装"

        /// <summary>
        /// 修改学生报名
        /// </summary>
        /// <param name="courseStudentBo"></param>
        /// <returns></returns>
        public bool UpdateCourseStudent(CourseStudentDto studentBo)
        {
            if (studentBo == null)
                throw new ArgumentNullException("studentBo");
            try
            {
                string sqlStr = @"UPDATE `tb_coursestudent`
                                    SET 
                                      `CourseNumber` = @CourseNumber,
                                      `StudentId` = @StudentId,
                                      `Sign` = @Sign,
                                      `feedback` = @feedback,
                                      `TaskName` = @TaskName,
                                      `TaskUrl` = @TaskUrl,
                                      `SignDate` = @SignDate,
                                      `SignOutDate` = @SignOutDate
                                       WHERE `Id` = @Id;";
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, studentBo);
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
                LogHelper.WriteLog(string.Format("CourseStudentService.UpdateCourseStudent(studentBo)", studentBo), ex);
                return false;
            }

        }

        /// <summary>
        /// 新增课程报名数据
        /// </summary>
        /// <param name="studentBo"></param>
        /// <returns></returns>
        public bool AddCourseStudent(CourseStudentDto studentBo)
        {
            if (studentBo == null)
                throw new ArgumentNullException("studentBo");
            if (studentBo.Id != null && studentBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");

            try
            {
               
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    string courseSql = @"SELECT * FROM `tb_student` WHERE Id=@Id ";
                    var student = connection.Query<StudentBo>(courseSql, new { Id =studentBo.StudentId }).FirstOrDefault();
                    if (student != null) studentBo.IDNo = student.IDNo;
                    DeleteCourseStudentbyId(studentBo.CourseId, studentBo.IDNo);//每次进行插入前，先根据课程ID和学员身份证号删除原有的报名数据


                    studentBo.Id = Guid.NewGuid().ToString();
                    var strSql = @"INSERT INTO `tb_coursestudent`
                                    (`Id`,
                                     `CourseNumber`,
                                     `StudentId`,
                                     `Sign`,
                                     `feedback`,
                                     `TaskName`,
                                     `TaskUrl`,
                                     `SignDate`,
                                     `SignOutDate`,
                                     `CourseId`,Period,IDNo,SignMDate,SignADate,SignNDate,PeriodM,PeriodA,PeriodN)
                                    VALUES (@Id,
                                            @CourseNumber,
                                            @StudentId,
                                            @Sign,
                                            @feedback,
                                            @TaskName,
                                            @TaskUrl,
                                            @SignDate,
                                            @SignOutDate,
                                            @CourseId,@Period,@IDNo,@SignMDate,@SignADate,@SignNDate,@PeriodM,@PeriodA,@PeriodN);";
                    int row = connection.Execute(strSql, studentBo);
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
                LogHelper.WriteLog(string.Format("CourseStudentService.AddCourseStudent({0})异常", studentBo), ex);
                return false;
            }
            
        }

       /// <summary>
       /// 根据学员ID和课程ID修改签到及签退时间
       /// </summary>
       /// <param name="signDate"></param>
       /// <param name="signOutDate"></param>
       /// <param name="studentId"></param>
       /// <param name="courseId"></param>
       /// <returns></returns>
        public bool Registration(string signDate, string signOutDate, string studentId, string courseId)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {

                    //string courseSql = @"select * from tb_course where Id=@courseId";

                    //var coursebo = connection.Query<CourseBo>(courseSql, new { Id = courseId }).FirstOrDefault();


                    string sql = @"UPDATE `tb_coursestudent` SET `SignDate`=@SignDate,`SignOutDate`=@SignOutDate,Sign=2,IsCalculate=1
                                    WHERE `StudentId`=@StudentId AND                                            
                                    `CourseId`=@CourseId";
                    int row = connection.Execute(sql, new
                    {
                        SignDate = signDate,
                        SignOutDate = signOutDate,
                        StudentId = studentId,
                        CourseId = courseId
                    
                    });
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

                LogHelper.WriteLog(string.Format("CourseStudentService.Registration({0},{1},{2},{3})", signDate, signOutDate, studentId, courseId), ex);
                return false;
            }
        }


        /// <summary>
        /// 批量增加报名数据方法
        /// </summary>
        /// <param name="studentBo">BO</param>
        /// <param name="ids">学员ID集合</param>
        /// <returns></returns>
        public bool BatchAddCourseStudent(CourseStudentDto studentBo,string ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    string courseSql = @"SELECT * FROM `tb_student` WHERE Id=@Id ";

                   // var studentbo = connection.Query<StudentBo>(courseSql, new { courseId = studentBo.CourseId }).FirstOrDefault();

                    //添加学员的时候不添加学分，学分默认都为0.点结算的时候才给学分。
                    studentBo.Sign = 1;
                    studentBo.IsCalculate = 2;
                    var strSql = @"INSERT INTO `tb_coursestudent`
                                    (`Id`,
                                     `CourseNumber`,
                                     `StudentId`,
                                     `Sign`,
                                     `feedback`,
                                     `TaskName`,
                                     `TaskUrl`,
                                     `SignDate`,
                                     `SignOutDate`,
                                     `CourseId`,Period,IDNo,SignMDate,SignADate,SignNDate)
                                    VALUES (@Id,
                                            @CourseNumber,
                                            @StudentId,
                                            @Sign,
                                            @feedback,
                                            @TaskName,
                                            @TaskUrl,
                                            @SignDate,
                                            @SignOutDate,
                                            @CourseId,@Period,@IDNo,@SignMDate,@SignADate,SignNDate);";
                    string[] idArray = ids.Split(',');

                    var list = GetByStudentsByCourseId(studentBo.CourseId);
                    var strList=new List<string>();
                    foreach (var s in idArray)
                    {
                        var courseStudentDto = list.Find(p => p.StudentId == s);
                        if (courseStudentDto == null)
                        {
                            strList.Add(s);
                        }
                    }


                    for (int i = 0; i < strList.Count; i++)
                    {
                        var student = connection.Query<StudentBo>(courseSql, new { Id = strList[i] }).FirstOrDefault();
                        if (student != null) studentBo.IDNo = student.IDNo;
                        studentBo.Id = Guid.NewGuid().ToString();
                        studentBo.StudentId = strList[i];
                        connection.Execute(strSql, studentBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentService.BatchAddCourseStudent({0},{1})异常", studentBo, ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 根据课程ID和身份证号取消报名（删除报名数据）
        /// </summary>
        /// <param name="courseId"></param>
        /// <param name="IDNo"></param>
        /// <returns></returns>
        public bool DeleteCourseStudentbyId(string courseId, string IDNo)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlstr = "delete from  tb_coursestudent where IDNo=@IDNo and CourseId=@CourseId;";

                    int aa=connection.Execute(sqlstr, new {IDNo = IDNo, CourseId = courseId});
                    return true;
                    
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentService.DeleteCourseStudentbyId({0},{1})异常", courseId, IDNo), ex);
                return false;
            }
           
        }

        public List<CourseStudentDto> GetByStudentsByCourseId(string courseId)
        {
            string sqlStr = @"SELECT c.*,co.CourseName,s.Name FROM tb_coursestudent c 
                             INNER JOIN `tb_course` co ON co.`Id`=c.`CourseId`
                             INNER JOIN `tb_student` s ON s.`Id`=c.`StudentId` WHERE co.Id=@Id";
            using (var connection = DataBaseConnection.GetMySqlConnection())
            {
                var list = connection.Query<CourseStudentDto>(sqlStr, new {Id=courseId}).ToList();

                return list;
            }
        }
        /// <summary>
        /// 取消报名方法
        /// </summary>
        /// <param name="courseId"></param>
        /// <param name="studentId"></param>
        /// <returns></returns>
        public bool DeleteCourseStudentNew(string courseId, string studentId)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    string courseSql = @"SELECT * FROM `tb_student` WHERE Id=@Id ";
                    var student = connection.Query<StudentBo>(courseSql, new { Id = studentId }).FirstOrDefault();
                    string IDNo = "";
                    if (student != null) IDNo = student.IDNo;

                    var sqlstr = "delete from  tb_coursestudent where IDNo=@IDNo and CourseId=@CourseId;";

                    int aa = connection.Execute(sqlstr, new { IDNo = IDNo, CourseId = courseId });
                    return true;

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentService.DeleteCourseStudentbyId({0},{1})异常", courseId, studentId), ex);
                return false;
            }

        }



        public bool DeleteCourseStudent(String ids)
        {

            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        CourseStudentDto sBo = new CourseStudentDto();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_coursestudent where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentExemptionService.DeleteCourseStudent({0})异常", ids), ex);
                return false;
            }
            return true;
        }
        #endregion

        /// <summary>
        /// 批量修改报名数据方法
        /// </summary>
        /// <param name="courseStudentDtos"></param>
        /// <returns></returns>
        public bool BatchRegistration(List<CourseStudentDto> courseStudentDtos )
        {
            using (var connection = DataBaseConnection.GetMySqlConnection())
            {
                string sql = @"UPDATE `tb_coursestudent` SET `SignDate`=@SignDate,`SignOutDate`=@SignOutDate WHERE `StudentId`=@StudentId AND                                            `CourseId`=@CourseId";
                var trans = connection.BeginTransaction();
                try
                {
                    foreach (var courseStudentDto in courseStudentDtos)
                    {
                        connection.Execute(sql, new
                        {
                            SignDate = courseStudentDto.SignDate,
                            SignOutDate = courseStudentDto.SignOutDate,
                            StudentId = courseStudentDto.StudentId,
                            CourseId = courseStudentDto.CourseId
                        }, trans);
                    }
                    trans.Commit();
                    return true;

                }
                catch (Exception ex)
                {
                    LogHelper.WriteLog(string.Format("CourseStudentService.Registration({0})", courseStudentDtos), ex);
                    trans.Rollback();
                    return false;
                }
                   
            }
        }

        /// <summary>
        /// 报名验证方法
        /// </summary>
        /// <param name="studentId"></param>
        /// <param name="cousreId"></param>
        /// <returns></returns>
        public int IsBaoMing( string studentId,string cousreId)
        {
            string sqlstr = @"select * from tb_student where Id=@Id ";//查询学员表获取学员IDNo
            string sqlCourseStudent = @"select * from tb_coursestudent where CourseId=@CourseId and IDNo=@IDNo;";//根据课程ID和身份证号获取学员报名数据

            string strIdNo = "";
            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    var student = context.Query<StudentBo>(sqlstr, new { Id = studentId }).FirstOrDefault();
                    if (student != null)
                    {
                        strIdNo = student.IDNo;
                    }
                    else
                    {
                        return 0;//请补全身份证信息在进行报名。
                    }

                    var list = context.Query<CourseStudentDto>(sqlCourseStudent, new { CourseId = cousreId, IDNo = strIdNo }).ToList();
                    if (list.Count > 0)
                    {
                        return 1;//标识已经报名，不能进行重复报名
                    }
                    else
                    {
                        return 2;//没有进行过报名，可以报名
                    }
                }


            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.CanBaoMing({0})", cousreId), ex);
                return -1;
            }
        }

        //判断课程是否还允许报名
        public bool CanBaoMing(string courseId)
        {
            CourseService courseService = new CourseService();
            var courseBo=courseService.GetCourseById(courseId);
            if(courseBo.SetApply==1)//允许超额报名
            {
                return true;
            }else
            {
                int maxNumber = courseBo.MaxNumber;

                string sql = @"select id from tb_coursestudent where 1=1  ";

                //sql 查询条件拼接
                var wheres = new StringBuilder();
                var paras = new DynamicParameters();
                if (!string.IsNullOrEmpty(courseId))
                {
                    wheres.Append(" and CourseId=@CourseId ");
                    paras.Add("CourseId", courseId);
                }
                //加where条件
                sql += wheres;
                try
                {
                    using (var context = DataBaseConnection.GetMySqlConnection())
                    {
                        var list = context.Query<CourseStudentBo>(sql, paras).ToList();
                        if (list.Count < maxNumber)
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
                    LogHelper.WriteLog(string.Format("StudentService.CanBaoMing({0})", courseId), ex);
                    return false;
                }

            }

        }


        //取消签到
        public bool CancelQianDao(string id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            try
            {
                string sqlStr = @"UPDATE `tb_coursestudent` SET `Sign` =1,IsCalculate=2 WHERE `Id` = @Id;";
                CourseStudentDto st = new CourseStudentDto();
                st.Id = id;
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, new { Id=st.Id});
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
                LogHelper.WriteLog(string.Format("CourseStudentService.CancelQianDao(id)", id), ex);
                return false;
            }

        }


        //签到
        public bool StudentQianDao(string id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            try
            {
                string sqlStr = @"UPDATE tb_coursestudent SET SIGN =2,IsCalculate=1 WHERE Id = @Id;";
                CourseStudentDto st=new CourseStudentDto();
                st.Id = id;
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, new { Id=st.Id});
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
                LogHelper.WriteLog(string.Format("CourseStudentService.StudentQianDao(id)", id), ex);
                return false;
            }

        }


        //根据考勤ID获取考勤数据
        public CourseStudentDto GetCourseStudentById(string id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var courseStudentBo = new CourseStudentDto { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"SELECT c.*,co.CourseName,s.Name FROM tb_coursestudent c INNER JOIN `tb_course` co ON co.`Id`=c.`CourseId` INNER JOIN `tb_student` s ON s.`Id`=c.`StudentId` where c.Id=@Id";
                    courseStudentBo = connection.Query<CourseStudentDto>(sqlStr, new { Id = id }).FirstOrDefault();
                    if(courseStudentBo.SignDate!=null&&courseStudentBo.SignDate!=DateTime.MinValue)
                    {
                        courseStudentBo.SignDateStr = courseStudentBo.SignDate.ToString();
                    }
                    if (courseStudentBo.SignOutDate != null && courseStudentBo.SignOutDate != DateTime.MinValue)
                    {
                        courseStudentBo.SignOutDateStr = courseStudentBo.SignOutDate.ToString();
                    }

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("CourseStudentService.GetCourseStudentById({0})异常", id), ex);
            }
            return courseStudentBo;
        }


        /// <summary>
        /// 修改学生学时
        /// </summary>
        /// <param name="courseStudentBo"></param>
        /// <returns></returns>
        public bool UpdatePeroid(CourseStudentDto courseStudentBo)
        {
            if (courseStudentBo == null)
                throw new ArgumentNullException("courseStudentBo");
            try
            {
                string sqlStr = @"UPDATE `tb_coursestudent`
                                    SET 
                                      `Period` = @Period,
                                       `IsCalculate` = @IsCalculate 
                                       WHERE `Id` = @Id;";
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    int row = connection.Execute(sqlStr, courseStudentBo);
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
                LogHelper.WriteLog(string.Format("CourseStudentService.UpdatePeroid(studentBo)", courseStudentBo), ex);
                return false;
            }

        }
        /// <summary>
        /// 课程结算功能
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool CourseJieSun(string id)
        {
            try
            {
                var courseStudentFace=new CourseStudentFace();
                var list = courseStudentFace.GetCourseStudentByCourseIdNew(id);//获取该课程所有报名的学员
              
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {

                    string courseSql = @"select * from tb_course where Id=@courseId";

                    var coursebo = connection.Query<CourseBo>(courseSql, new { courseId = id }).FirstOrDefault();

                    var sqlStr = @"UPDATE `tb_coursestudent` SET Period=@Period,IsCalculate=1,Sign=2 WHERE CourseId=@CourseId and Sign=2 and IDNo=@IDNo";

                    foreach (var courseStudentDto in list)
                    {
                        var bbb = courseStudentDto.StudentId;
                        var ccc = courseStudentDto.CourseId;
                        int aa = 0;
                        if (!string.IsNullOrEmpty(courseStudentDto.SignMDate) && courseStudentDto.PeriodM!=0)//判断是否设置了上午学分，考勤时间的上午是否上传
                        {
                            aa += courseStudentDto.PeriodM;
                        }
                        if (!string.IsNullOrEmpty(courseStudentDto.SignADate) && courseStudentDto.PeriodA != 0)//下午
                        {
                            aa += courseStudentDto.PeriodA;
                        }
                        if (!string.IsNullOrEmpty(courseStudentDto.SignNDate) && courseStudentDto.PeriodN != 0)//晚上
                        {
                            aa += courseStudentDto.PeriodN;
                        }

                        if (courseStudentDto.PeriodA == 0 && courseStudentDto.PeriodM == 0 &&
                            courseStudentDto.PeriodN == 0)
                        {
                            if (coursebo != null) aa = coursebo.Period;
                        }
                        
                         connection.Execute(sqlStr, new { Period = aa, CourseId = id,IDNo=courseStudentDto.IDNo });

                      
                    }
                    return true;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.CourseJieSun({0})异常", id), ex);
                return false;
            }
        }


        

        /// <summary>
        /// 批量签到
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool CourseJieSun2(string id)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {

                    string courseSql = @"select * from tb_course where Id=@courseId";

                    var coursebo = connection.Query<CourseBo>(courseSql, new { courseId = id }).FirstOrDefault();
                    int aa = 0;
                    if (coursebo != null)
                    {
                        aa = coursebo.Period;
                    }

                    var sqlStr = @"UPDATE `tb_coursestudent` SET IsCalculate=1,Sign=2 WHERE CourseId=@CourseId";
                    int row = connection.Execute(sqlStr, new { Period = aa, CourseId = id });
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
                LogHelper.WriteLog(string.Format("StudentService.CourseJieSun({0})异常", id), ex);
                return false;
            }
        }

    }
}
