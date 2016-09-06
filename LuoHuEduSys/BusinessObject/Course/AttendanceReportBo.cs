using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.Course
{
    public class AttendanceReportBo
    {
        /// <summary>
        /// 报名表ID
        /// </summary>
        public string Id { get; set; }
      
        /// 学生ID
        public string StudentId { get; set; }

        /// <summary>
        /// 学生姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 课程名称
        /// </summary>
        public string CourseName { get; set; }

        /// <summary>
        /// 课程开始时间
        /// </summary>
        public string TimeStart { get; set; }

        /// <summary>
        /// 课程结束时间
        /// </summary>
        public string TimeEnd { get; set; }

        /// <summary>
        /// 年度
        /// </summary>
        public string TheYear { get; set; }

        /// <summary>
        /// 学时
        /// </summary>
        public int Period { get; set; }


        /// 签到时间
        public DateTime SignDate { get; set; }

        /// 签退时间
        public DateTime SignOutDate { get; set; }

        /// 签到（1未签，2已签）
        public int Sign { get; set; }

        /// <summary>
        /// 是否计算
        /// </summary>
        public int IsCalculate { get; set; }
    }
}
