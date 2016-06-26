using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.AdminBo;
using Dapper;
using Domain.common;
using Huatong.DAO;

namespace Services.Admin.Permissions
{
    public class PermissionsService
    {

        /// <summary>
        /// 新增权限信息
        /// </summary>
        /// <param name="userPermissionsList"> 权限信息BO</param>
        /// <returns>bool</returns>
        public bool AddPermissions(string userPermissionsList, string userId)
        {
            if (userPermissionsList == null)
                throw new ArgumentNullException("userPermissionsList");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String id = Guid.NewGuid().ToString();
                    var perList = userPermissionsList.Split(',');
                    var userBo = new UserPermissionsBo() { UserId = userId };
                    var sqlStr = @"DELETE  FROM pub_userpermissions where UserId=@UserId;";
                    connection.Execute(sqlStr, userBo);
                    for (int i = 0; i < perList.Length; i++)
                    {
                        var userPermissionsBo = new UserPermissionsBo()
                                                                  {
                                                                      Id = Guid.NewGuid().ToString(),
                                                                      PermissionsId = perList[i],
                                                                      UserId = userId
                                                                  };
                        sqlStr = @"INSERT INTO pub_userpermissions(Id,PermissionsId,UserId) VALUES(@Id,@PermissionsId,@UserId);";
                        connection.Execute(sqlStr, userPermissionsBo);
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("PermissionsService.AddPermissions({0},{1})异常", userPermissionsList, userId), ex);
                return false;
            }
        }

        public List<UserPermissionsBo> getAllPermissionsList()
        {
            List<UserPermissionsBo> userPerList = null;

            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"SELECT * FROM pub_permissions ORDER BY(CASE WHEN ModuleName='学校管理员' THEN 1 WHEN ModuleName='系统管理员' THEN 2 
WHEN ModuleName='培训信息' THEN 3 WHEN ModuleName='培训管理' THEN 4 WHEN ModuleName='用户信息' THEN 5 WHEN ModuleName='参数管理' THEN 6
WHEN ModuleName='系统设置' THEN 7 ELSE 8 END),Soft ";
                    userPerList = connection.Query<UserPermissionsBo>(sqlStr, new { }).ToList();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.GetStudentById()异常"), ex);
            }
            return userPerList;
        }

        public string getUserPermissionsList(string userId)
        {
            string perStrList = string.Empty;

            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"SELECT pub_permissions.*,pub_userpermissions.userId FROM tb_student INNER JOIN pub_userpermissions ON pub_userpermissions.UserId=tb_student.Id  INNER JOIN pub_permissions ON pub_userpermissions.permissionsid=pub_permissions.ID WHERE pub_userpermissions.userId=@Id";
                    var userPerList = connection.Query<UserPermissionsBo>(sqlStr, new { Id = userId }).ToList();
                    foreach (var userPermissionsBo in userPerList)
                    {
                        perStrList = perStrList + userPermissionsBo.PermissionsName + ",";
                    }

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("StudentService.GetStudentById({0})异常", userId), ex);
            }
            return perStrList;
        }
    }
}
