using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.AdminBo;
using Dapper;
using Domain.common;
using Huatong.DAO;

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

    }
}
