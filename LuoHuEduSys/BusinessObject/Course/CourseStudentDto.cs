﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.Course
{
    public  class CourseStudentDto
    {
        /// <summary>
        /// 报名表ID
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// 姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 身份证号
        /// </summary>
        public string IDNO { get; set; }

        /// <summary>
        /// 年度2015-2016
        /// </summary>
        public string YearNo { get; set; }

        public int TermNo { get; set; }

        /// <summary>
        /// 培训类型
        /// </summary>
        public string CourseType { get; set; }

        /// <summary>
        /// 课程名称
        /// </summary>
        public string CourseName { get; set; }

        /// <summary>
        /// 培训方式
        /// </summary>
        public string StudyType { get; set; }

        /// <summary>
        /// 学时
        /// </summary>
        public int Period { get; set; }

        /// <summary>
        /// 课程开始时间
        /// </summary>
        public string StartDate { get; set; }

        /// <summary>
        /// 课程结束时间
        /// </summary>
        public string EndDate { get; set; }

        /// <summary>
        /// 培训单位
        /// </summary>
        public string TrainDept { get; set; }

        /// <summary>
        /// 课程ID
        /// </summary>
        public string CourseId { get; set; }

        /// <summary>
        /// 签到时间
        /// </summary>
        public DateTime SignDate { get; set; }

        /// <summary>
        /// 签退时间
        /// </summary>
        public DateTime SignOutDate { get; set; }
    }
}
