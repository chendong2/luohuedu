using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.AdminBo;
using Dapper;
using Domain.common;
using Huatong.DAO;
using Services.Course.CourseControl;

namespace Services.Admin.StudentControl
{
    public class StudentService
    {
        public StudentBo VipLogin(string UserName, string PassWord)
        {
            //MD5加密 暂时不用
            //PassWord = MD5Manger.GetInstence().Get32Md5Str(PassWord);

            string sql = @"SELECT * FROM `tb_student` WHERE `UserName`=@UserName AND `PassWord`=@PassWord";

            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    var student =
                        context.Query<StudentBo>(sql, new { UserName = UserName, PassWord = PassWord }).FirstOrDefault();
                    return student;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.Login({0},{1})", UserName, PassWord), ex);
            }

            return null;
        }


        public static StudentBo GetStudentById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var studentBo = new StudentBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"SELECT stu.PassWord,stu.UserName,sex,DATE_FORMAT(Birthday,'%Y-%m-%d') AS BirthdayStr,sc.SchoolName from tb_student stu INNER JOIN tb_school sc ON stu.SchoolId=sc.Id  where stu.Id=@Id";
                    studentBo = connection.Query<StudentBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.GetStudentById({0})异常", id), ex);
            }
            return studentBo;
        }

        public int ChangePassword(StudentBo studentBo)
        {
            try
            {
                string userId = Domain.common.UserInfo.GetUserId().ToString();
                studentBo.Id = userId;
                var data = GetStudentById(userId);
                if (!data.PassWord.Equals(studentBo.OldPassword))
                {
                    return 2;
                }
                else
                {
                    using (var connection = DataBaseConnection.GetMySqlConnection())
                    {
                        var sqlStr = @"update tb_student set PassWord=@PassWord where Id=@Id";
                        int row = connection.Execute(sqlStr, studentBo);
                        if (row > 0)
                        {
                            return 1;
                        }
                        else
                        {
                            return 0;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.ChangePassword({0})异常", studentBo), ex);

                return 0;
            }
        }


        #region 学生信息增删改查基本操作

        /// <summary>
        /// 新增学生信息
        /// </summary>
        /// <param name="studentBo"> 学生信息BO</param>
        /// <returns>bool</returns>
        public bool AddStudent(StudentBo studentBo)
        {
            if (studentBo == null)
                throw new ArgumentNullException("studentBo");
            if (studentBo.Id != null && studentBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String id = Guid.NewGuid().ToString();
                    studentBo.Id = id;
                    studentBo.PassWord = "000000";
                    var sqlStr = @"INSERT INTO tb_student(Id,LoginId,UserName,PassWord,SchoolId,Name,IDNo,Sex,Birthday,Origin,Minority,Profession,Professiontitles,Graduated,HighDegree,StudyPeriod,Staffing,InCharge,Office,FirstTeaching,SecondTeaching,Address,PostCode,Phone,Telephone,Email,HighHonor,RegistrationCode) VALUES(@Id,@LoginId,@UserName,@PassWord,@SchoolId,@Name,@IDNo,@Sex,@Birthday,@Origin,@Minority,@Profession,@Professiontitles,@Graduated,@HighDegree,@StudyPeriod,@InCharge,@Staffing,@Office,@FirstTeaching,@SecondTeaching,@Address,@PostCode,@Phone,@Telephone,@Email,@HighHonor,@RegistrationCode);";
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
                LogHelper.WriteLog(string.Format("StudentService.AddStudent({0})异常", studentBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除学生信息
        /// </summary>
        /// <param name="ids">多个学生信息id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteStudentsByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        StudentBo sBo = new StudentBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_student where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.DeleteStudentsByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改学生信息
        /// </summary>
        /// <param name="studentBo">学生信息BO</param>
        /// <returns></returns>
        public bool UpdateStudent(StudentBo studentBo)
        {
            if (studentBo == null)
                throw new ArgumentNullException("studentBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_student set SchoolId=@SchoolId,Name=@Name,IDNo=@IDNo,Sex=@Sex,Birthday=@Birthday,Origin=@Origin,Minority=@Minority,Profession=@Profession,Professiontitles=@Professiontitles,Graduated=@Graduated,HighDegree=@HighDegree,StudyPeriod=@StudyPeriod,Staffing=@Staffing,InCharge=@InCharge,Office=@Office,FirstTeaching=@FirstTeaching,SecondTeaching=@SecondTeaching,Address=@Address,PostCode=@PostCode,Phone=@Phone,Telephone=@Telephone,Email=@Email,HighHonor=@HighHonor,RegistrationCode=@RegistrationCode where Id=@Id";
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
                LogHelper.WriteLog(string.Format("StudentService.UpdateStudent({0})异常", studentBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过学生id获取学生信息
        /// </summary>
        /// <param name="id">学生信息id</param>
        /// <returns>学生信息BO实体</returns>
        public StudentBo GetAllStudentById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var StudentBo = new StudentBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select tb_student.*,tb_school.SchoolName from tb_student inner join tb_school on tb_student.SchoolId=tb_school.Id where tb_student.Id=@Id";
                    StudentBo = connection.Query<StudentBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.GetStudentById({0})异常", id), ex);
            }
            return StudentBo;
        }


        public StudentBo GetAllStudentById1(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var StudentBo = new StudentBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select *  from tb_student where tb_student.Id=@Id";
                    StudentBo = connection.Query<StudentBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.GetStudentById({0})异常", id), ex);
            }
            return StudentBo;
        }



        //获取数据列表
        public Page<StudentBo> GetStudents(int page, int rows, string sort, string order, StudentBo studentBo)
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
            var pageList = new Page<StudentBo>();

            string strSql = string.Format(@"SELECT tb_student.*,tb_school.SchoolName from tb_student inner join tb_school on tb_student.SchoolId=tb_school.Id where 1=1 ");
            if (studentBo != null)
            {
                if (studentBo.Name != null)
                {
                    strSql += "and Name like @Name ";
                }
                if (studentBo.IDNo != null)
                {
                    strSql += "and IDNo like @IDNo ";
                }
                if (studentBo.SchoolName != null)
                {
                    strSql += "and SchoolName like @SchoolName ";
                }
                if (studentBo.SchoolId != null)
                {
                    strSql += "and SchoolId=@SchoolId";
                }
            }

            switch (sort)
            {
                case "Name":
                    strSql += " order by Name " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<StudentBo>(strSql,
                                            new
                                            {
                                                Name = string.Format("%{0}%", studentBo.Name),
                                                IDNo = string.Format("%{0}%", studentBo.IDNo),
                                                SchoolName = string.Format("%{0}%", studentBo.SchoolName)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<StudentBo>(strSql,
                                                new
                                                {
                                                      Name = string.Format("%{0}%", studentBo.Name),
                                                      IDNo = string.Format("%{0}%", studentBo.IDNo),
                                                      SchoolName = string.Format("%{0}%", studentBo.SchoolName),
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


        //获取数据列表
        public Page<StudentBo> GetStudentCourseList(int page, int rows, string sort, string order, StudentBo studentBo)
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
            var pageList = new Page<StudentBo>();
            string studentid = Domain.common.UserInfo.GetUserId().ToString();

            string strSql = string.Format(@"
SELECT xxb.*,IF(ISNULL(maTime),0,maTime) AS maTime,0 AS exTime,
IF(ISNULL(jizhong+xiaoben+zxpx+xueli+maTime),0,jizhong+xiaoben+zxpx+xueli+maTime) AS total,IF(ISNULL(Countc),0,Countc) AS Countc FROM(
SELECT Id,NAME,RegistrationCode,Profession,SchoolName,SchoolId,TheYear,
MAX(CASE TrainTypeName WHEN '集中培训' THEN Period ELSE 0 END ) jizhong,
MAX(CASE TrainTypeName WHEN '校本培训' THEN Period ELSE 0 END ) xiaoben,
MAX(CASE TrainTypeName WHEN '专项培训' THEN Period ELSE 0 END ) zxpx,
MAX(CASE TrainTypeName WHEN '学历培训' THEN Period ELSE 0 END ) xueli 
 FROM (
SELECT stsc.Id,stsc.Name,RegistrationCode,Profession,stsc.SchoolName,TrainTypeName,SchoolId,IF(ISNULL(Period),0,Period) AS Period,TheYear FROM 
(SELECT st.id,st.Name,RegistrationCode,Profession,tb_school.SchoolName,SchoolId,TrainTypeName FROM(
 SELECT  st.Id,NAME,RegistrationCode,Profession,tb_traintype.TrainType AS TrainTypeName,SchoolId FROM tb_student st,tb_traintype)st 
 LEFT JOIN tb_school ON st.SchoolId=tb_school.Id)stsc LEFT JOIN 

(SELECT StudentId,b.Period,TheYear,tt.TrainType,tt.Id FROM tb_traintype tt INNER  JOIN(
SELECT ct.StudentId,SUM(Period) AS Period,TrainType,TheYear  FROM  tb_coursestudent ct INNER JOIN tb_course co  ON co.id=ct.CourseId AND SIGN=2 
GROUP BY ct.StudentId,TrainType,TheYear )b   ON tt.id=b.TrainType) ttb ON  ttb.StudentId=stsc.id AND stsc.TrainTypeName=ttb.TrainType)ststtb 
GROUP BY Id,NAME,RegistrationCode,Profession,SchoolName,SchoolId,TheYear)xxb 
LEFT JOIN (
SELECT StudentId,TheYear,COUNT(Period) AS Countc  FROM  tb_coursestudent ct INNER JOIN tb_course co  ON co.id=ct.CourseId 
GROUP BY StudentId,TheYear)ccb ON xxb.Id=ccb.StudentId AND xxb.TheYear=ccb.TheYear 
LEFT JOIN (
SELECT studentid,TheYear,SUM(StuTime) AS maTime FROM tb_student st INNER JOIN tb_studenttrain stt ON st.id=stt.StudentID 
INNER JOIN tb_maintrainset mt  ON mt.Id=stt.ProgramId  WHERE  stt.SchoolAudit=2 AND stt.DistinctSchoolAudit=2  GROUP BY studentid,TheYear
)mmb ON xxb.Id=mmb.studentid AND xxb.TheYear=mmb.TheYear WHERE 1=1 ");
            if (studentBo != null)
            {
                if (studentBo.TheYear != null)
                {
                    strSql += "and xxb.TheYear = @TheYear ";
                }
                if (!string.IsNullOrEmpty(studentBo.SchoolId))
                {
                    strSql += "and SchoolId = @SchoolId ";
                }
            }

            switch (sort)
            {
                case "Name":
                    strSql += " order by Name " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<StudentBo>(strSql,
                                            new
                                            {
                                                TheYear = studentBo.TheYear,
                                                SchoolId = studentBo.SchoolId
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<StudentBo>(strSql,
                                                new
                                                {
                                                    TheYear = studentBo.TheYear,
                                                    SchoolId = studentBo.SchoolId,
                                                    pageindex = pageIndex,
                                                    pagesize = pageSize
                                                }).ToList();

                for (int i = 0; i < list.Count;i++ )
                {
                    var stuBo = list[i];
;                   var courService = new AllCourseService();
                    var course = courService.GetCoursePeroid(stuBo.Id, studentBo.TheYear, "集中培训");
                    stuBo.jizhong = course != null ? course.Period : 0;
                    course = courService.GetCoursePeroid(stuBo.Id, studentBo.TheYear, "校本培训");
                    stuBo.xiaoben = course != null ? course.Period : 0;
                    course = courService.GetCoursePeroid(stuBo.Id, studentBo.TheYear, "专项培训");
                    stuBo.zxpx = course != null ? course.Period : 0;
                    course = courService.GetCoursePeroid(stuBo.Id, studentBo.TheYear, "学历培训");
                    stuBo.xueli =course!=null?course.Period:0;
                    stuBo.total = stuBo.jizhong + stuBo.xiaoben + stuBo.zxpx + stuBo.xueli + stuBo.maTime ;
                }

                pageList.ListT = list;
                pageList.PageIndex = page;
                pageList.PageSize = rows;
                pageList.TotalCount = count;
            }

            return pageList;
        }


        /// <summary>
        /// 通过用户姓名获取用户信息
        /// </summary>
        /// <param name="id">学生信息id</param>
        /// <returns>学生信息BO实体</returns>
        public StudentBo GetAllStudentByLoginid(string loginid)
        {
            if (loginid == null)
                throw new ArgumentNullException("loginid");
            var StudentBo = new StudentBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_student  where tb_student.loginid=@loginid";
                    StudentBo = connection.Query<StudentBo>(sqlStr, new { loginid = loginid }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.GetStudentById({0})异常", loginid), ex);
            }
            return StudentBo;
        }

        public List<StudentBo> GetAllStudents()
        {
             List<StudentBo> list;
             using (var connection = DataBaseConnection.GetMySqlConnection())
             {
                 var sqlStr = @"select * from tb_student";
                 list = connection.Query<StudentBo>(sqlStr, new { }).ToList();
             }
            return list;

        }


        //获取考勤列表数据
        public Page<StudentBo> GetKaoqingList(int page, int rows, string sort, string order, StudentBo studentBo)
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
            var pageList = new Page<StudentBo>();
            var sqlStr = @"SELECT  cs.id,st.Name,st.Sex,sc.schoolname,st.office,st.telephone,cs.Sign,st.Birthday FROM tb_student st INNER JOIN tb_coursestudent cs ON st.id=cs.studentId 
INNER JOIN tb_course co ON cs.courseid=co.id  INNER JOIN tb_school sc ON st.schoolid=sc.id WHERE  1=1  ";

            if (studentBo != null )
            {
                if (!string.IsNullOrEmpty(studentBo.courseId))
                {
                    sqlStr += "  and cs.CourseId=@CourseId  ";
                }

                if (!string.IsNullOrEmpty(studentBo.Name))
                {
                    sqlStr += "  and st.Name like @Name  ";
                }

                if (!string.IsNullOrEmpty(studentBo.SchoolName))
                {
                    sqlStr += "  and sc.SchoolName like @SchoolName  ";
                }
            }

          
            sqlStr += " order by Name " + order;


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<StudentBo>(sqlStr,
                                            new
                                            {
                                                Name = string.Format("%{0}%", studentBo.Name),
                                                SchoolName = string.Format("%{0}%", studentBo.SchoolName),
                                                CourseId = studentBo.courseId,
                                            }).Count();
                sqlStr += " limit @pageindex,@pagesize";

                var list = context.Query<StudentBo>(sqlStr,
                                                new
                                                {

                                                    Name = string.Format("%{0}%", studentBo.Name),
                                                    SchoolName = string.Format("%{0}%", studentBo.SchoolName),
                                                    CourseId = studentBo.courseId,
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
