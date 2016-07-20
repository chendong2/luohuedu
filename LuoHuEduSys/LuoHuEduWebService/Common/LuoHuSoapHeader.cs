using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Services.Protocols;
using Domain.common;

namespace LuoHuEduWebService.Common
{
    public class LuoHuSoapHeader : SoapHeader
    {
          //系统配置的用户名密码
        private static readonly string _userName = ConfigurationManager.AppSettings["userName"];
        private static readonly string _passWord = ConfigurationManager.AppSettings["passWord"];

        public LuoHuSoapHeader() { }
        public string UserName;
        public string PassWord;
        
        public  bool ValideUser(string userName, string passWord)
        {
            return (userName == _userName) && (passWord == _passWord);
            //return (userName == _userName) && (MD5Manger.GetInstence().Get32Md5Str(passWord) == _passWord);
        }
    }
}