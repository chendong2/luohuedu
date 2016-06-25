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
        public bool AddPermissions(string[] userPermissionsList, string userId)
        {
            if (userPermissionsList == null)
                throw new ArgumentNullException("userPermissionsList");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String id = Guid.NewGuid().ToString();
                    var sqlStr = @"DELETE  FROM pub_userpermissions;";
                    connection.Execute(sqlStr);
                    for (int i = 0; i < userPermissionsList.Length; i++)
                    {
                        var userPermissionsBo = new UserPermissionsBo()
                                                                  {
                                                                      Id = Guid.NewGuid().ToString(),
                                                                      PermissionsId = userPermissionsList[i],
                                                                      UserId = userId
                                                                  };
                        sqlStr =@"INSERT INTO pub_userpermissions(Id,PermissionsId,UserId) VALUES(@Id,@PermissionsId,@UserId);";
                        int row = connection.Execute(sqlStr, userPermissionsBo);
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
                return true;
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("PermissionsService.AddPermissions({0},{1})异常", userPermissionsList, userId), ex);
                return false;
            }
        }
    }
}
