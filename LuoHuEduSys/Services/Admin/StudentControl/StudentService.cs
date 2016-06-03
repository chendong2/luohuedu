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
        public StudentBo VipLogin(string UserName,string PassWord)
        {
            //MD5加密 暂时不用
            //PassWord = MD5Manger.GetInstence().Get32Md5Str(PassWord);

            string sql = @"SELECT * FROM `tb_student` WHERE `UserName`=@UserName AND `PassWord`=@PassWord";

            try
            {
                using (var context = DataBaseConnection.GetMySqlConnection())
                {
                    var student =
                        context.Query<StudentBo>(sql, new {UserName = UserName, PassWord = PassWord}).FirstOrDefault();
                    return student;
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.Login({0},{1})", UserName, PassWord), ex);
            }

            return null;
        }
        
    }
}
