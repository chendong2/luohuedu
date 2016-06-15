using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject
{
    public class CourseStudentMessageBo
    {
        public string Id { get; set; }
        /// 课程ID
        public string CourseId { get; set; }
        /// 学生ID
        public string StudentId { get; set; }
        /// 短信
        public string Message { get; set; }
    }
}
