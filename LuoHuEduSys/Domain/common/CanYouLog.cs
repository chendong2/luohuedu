using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using log4net;

namespace Domain.common
{
    /***
    * 如何移动或使用，将整个Log文件夹移动到项目中的顶层目录中
    * 添加log4Net引用
    * 在AssemblyInfo.cs中添加
    * [assembly: log4net.Config.XmlConfigurator(ConfigFile = @"Log\log4net.config", Watch = true)]
    * 建立log4Net数据表请使用Log4Net.sql
    * **/
    /// <summary>
    /// 日志等级
    /// </summary>
    public enum LoggerLevel
    {
        /// <summary>
        /// 这个等级表示用于调试程序的正常的事件信息
        /// </summary>
        Debug,
        /// <summary>
        /// 表示较严重的错误等级，但是程序可以继续运行的信息。
        /// </summary>
        Error,
        /// <summary>
        /// 表示非常严重的错误等级，记录极有可能导致应用程序终止运行的致命错误信息。
        /// </summary>
        Fatal,
        /// <summary>
        /// 默认的等级。
        /// </summary>
        Info,
        /// <summary>
        /// 表示可能对系统有损害的情况。
        /// </summary>
        Warn


    }

    /// <summary>
    /// 残友异常类，该异常类将自动记录错误日志。Version 1.1
    /// modify by laq on 2013
    /// </summary>
    public class CanYouLog
    {

        /// <summary>
        /// 残友异常类构造函数，日志等级默认为Debug
        /// modify by laq on 2013
        /// </summary>
        /// <param name="pType">异常抛出者的Type</param>
        /// <param name="pMessage">异常描述</param>
        /// <param name="pException">异常</param>
        private CanYouLog(Type pType, string pMessage, System.Exception pException)
        {
            WriteLog(pType, LoggerLevel.Debug, pMessage, pException);
        }
        /// <summary>
        /// 残友异常类构造函数，推荐使用这种构造。
        /// </summary>
        /// <param name="pType">异常抛出者的Type</param>
        /// <param name="pLevel">日志等级</param>
        /// <param name="pMessage">异常描述</param>
        /// <param name="pException">异常</param>
        public CanYouLog(Type pType, LoggerLevel pLevel, string pMessage, System.Exception pException)
        {
            WriteLog(pType, pLevel, pMessage, pException);
        }

        private void WriteLog(Type pType, LoggerLevel pLevel, string pMessage, System.Exception pException)
        {
            switch (pLevel)
            {
                case LoggerLevel.Debug:
                    LogManager.GetLogger(pType).Debug(pMessage, pException);
                    break;
                case LoggerLevel.Error:
                    LogManager.GetLogger(pType).Error(pMessage, pException);
                    break;
                case LoggerLevel.Fatal:
                    LogManager.GetLogger(pType).Fatal(pMessage, pException);
                    break;
                case LoggerLevel.Info:
                    LogManager.GetLogger(pType).Info(pMessage, pException);
                    break;
                case LoggerLevel.Warn:
                    LogManager.GetLogger(pType).Warn(pMessage, pException);
                    break;
                default:
                    LogManager.GetLogger(pType).Debug(pMessage, pException);
                    break;
            }
        }



    }

   
}
