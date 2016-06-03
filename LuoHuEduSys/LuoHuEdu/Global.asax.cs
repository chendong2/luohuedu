using System;
using System.Web;
using System.Web.Configuration;
using Domain.common;

namespace HuaTongSystem
{
    public class Global : System.Web.HttpApplication
    {
       // private AdminFacade adminFacade;
        //权限初始化标志位
        public  static bool isRightInitial = false;

        public Global()
        {
            // 在应用程序启动时运行的代码
            //初始化日志文件 
            var path = AppDomain.CurrentDomain.SetupInformation.ApplicationBase +
                           WebConfigurationManager.AppSettings["log4net"];
            var fi = new System.IO.FileInfo(path);
            log4net.Config.XmlConfigurator.Configure(fi);
        }

        void Application_Start(object sender, EventArgs e)
        {
            //开发期间监测sql语句的打印
            //HibernatingRhinos.Profiler.Appender.NHibernate.NHibernateProfiler.Initialize();
        }

        void Application_End(object sender, EventArgs e)
        {
            //  在应用程序关闭时运行的代码

        }

        void Application_Error(object sender, EventArgs e)
        {
            // 在出现未处理的错误时运行的代码
            Exception error = HttpContext.Current.Server.GetLastError();
            LogHelper.WriteLog("HuatongMis发现未经捕获的异常", error);
			if(HttpContext.Current!=null)
			{
				HttpContext.Current.Response.Write("对不起,服务器出现异常");
			}
        }

        void Session_Start(object sender, EventArgs e)
        {
            // 在新会话启动时运行的代码

        }

        void Session_End(object sender, EventArgs e)
        {
            // 在会话结束时运行的代码。 
            // 注意: 只有在 Web.config 文件中的 sessionstate 模式设置为
            // InProc 时，才会引发 Session_End 事件。如果会话模式设置为 StateServer 
            // 或 SQLServer，则不会引发该事件。
        }

        void Application_BeginRequest(object sender, EventArgs e)
        {
           
        }
        void Application_EndRequest(object sender, EventArgs e)
        {

        }
        //webservice安全机制
        void Application_AcquireRequestState(object sender, EventArgs e)
        {
        }
    }
}
