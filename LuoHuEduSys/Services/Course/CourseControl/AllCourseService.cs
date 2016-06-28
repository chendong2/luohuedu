using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using BusinessObject.Course;
using Dapper;
using Domain.common;
using Huatong.DAO;

namespace Services.Course.CourseControl
{
    public class AllCourseService
    {
        
        public CourseBo GetMyColloctCourse()
        {
            string userId = Domain.common.UserInfo.GetUserId().ToString();
            return new CourseBo();
        }

    }
}
