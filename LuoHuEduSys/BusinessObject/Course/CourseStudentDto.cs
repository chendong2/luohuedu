﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.Course
{
    public  class CourseStudentDto
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

        /// 签到时间
        public string SignDateStr { get; set; }
        /// 签退时间
        public string SignOutDateStr { get; set; }

        //课程ID
        public string CourseId { get; set; }

        /// <summary>
        /// 学分
        /// </summary>
        public int Period { get; set; }

        public int IsCalculate { get; set; }

        /// <summary>
        /// 学生姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 课程名称
        /// </summary>
        public string CourseName { get; set; }

        /// <summary>
        /// 学校名称
        /// </summary>
        public string SchoolName { get; set; }

        /// <summary>
        /// 职务
        /// </summary>
        public string Office { get; set; }

        /// <summary>
        /// 身份证号
        /// </summary>
        public string IDNo { get; set; }

        /// <summary>
        /// 上午签到时间
        /// </summary>
        public string SignMDate { get; set; }

        /// <summary>
        /// 下午签到时间
        /// </summary>
        public string SignADate { get; set; }

        /// <summary>
        /// 晚上签到时间
        /// </summary>
        public string SignNDate { get; set; }

        public string FirstTeaching { get; set; }

        public string SubjectName { get; set; }

        public string Telephone { get; set; }


        public int PeriodM { get; set; }
        public int PeriodA { get; set; }
        public int PeriodN { get; set; }

    }
}
