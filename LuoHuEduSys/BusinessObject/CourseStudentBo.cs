using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject
{
    public class CourseStudentBo
    {
        public string Id { get; set; }
        /// 课程编码
        public string CourseNumber { get; set; }
        /// 学生ID
        public string StudentId { get; set; }
        /// 签到（1未签，2已签）
        public int Sign { get; set; }
        /// 反馈（1未反馈，2已反馈）
        public int Feedback { get; set; }
        /// 作业文件名称
        public string TaskName { get; set; }
        /// 作业文件路径
        public string TaskUrl { get; set; }
        /// 签到时间
        public DateTime SignDate { get; set; }
        /// 签退时间
        public DateTime SignOutDate { get; set; }
    }
}
