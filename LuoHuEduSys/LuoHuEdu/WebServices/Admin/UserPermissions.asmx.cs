using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.AdminBo;
using BusinessObject.Parameter;
using Services.Admin.Permissions;

namespace LuoHuEdu.WebServices.Admin
{
    /// <summary>
    /// Summary description for UserPermissions
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class UserPermissions : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddPermissions(string[] userPermissionsList, string userId)
        {

            var perService = new PermissionsService();
            return perService.AddPermissions(userPermissionsList, userId);
        }


    }
}
