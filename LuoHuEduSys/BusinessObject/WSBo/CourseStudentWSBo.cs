using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.WSBo
{
    public class CourseStudentWSBo
    {
        /// <summary>
        /// 学员ID
        /// </summary>
        public string StudentId { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 身份证号
        /// </summary>
        public string IDNo { get; set; }
        /// <summary>
        /// 课程ID 
        /// </summary>
        public string CourseId { get; set; }

        /// <summary>
        /// 课程名称
        /// </summary>
        public string CourseName { get; set; }

    }
}
