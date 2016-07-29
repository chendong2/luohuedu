using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Script.Serialization;
namespace BusinessObject.Course
{
    public class CourseBo
    {
        public string Id{ get; set; }

        /// 授课教师Id
        public string TeacherId{ get; set; }

        /// <summary>
        /// 教师姓名
        /// </summary>
        public string TeacherName { get; set; }

        /// 课程名称
        public string CourseName { get; set; }

        /// 年度
        public string TheYear{ get; set; }

        /// 培训类型(培训类型ID)
        public string TrainType{ get; set; }

        /// 培训科目(存储科目表的名称或则ID)
        public string Subject{ get; set; }

        /// 授课教师电话
        public string Phone{ get; set; }

        /// 学时
        public int Period{ get; set; }

        /// 培训费用(单位元)
        public float Cost{ get; set; }

        /// 收费对象（逗号分隔的字符,1在编教师，2非在编教师）
        public string ChargeObj{ get; set; }

        /// 考勤设定（1签到考勤，2输入课时考勤）
        public int SetCheck{ get; set; }

        /// 选修OR必修（1.选修,2必修)
        public int IsMust{ get; set; }

        /// 培训地址
        public string Address{ get; set; }

        /// 额定人数
        public int MaxNumber{ get; set; }

        /// 预报设定(0,超出额定人数不允许报名,1超出额定人数允许报名)
        public int SetApply{ get; set; }

        /// 组织单位名称
        public string OrganizationalName{ get; set; }

        /// 设计思想
        public string DesignIdea{ get; set; }

        /// 培训目标
        public string TrainingAim{ get; set; }

        /// 课程开发特色
        public string Distinctive{ get; set; }

        /// 预期效果分析及检测评价要素
        public string EffectAnalysis{ get; set; }

        /// 上课日期
        public string CourseDate{ get; set; }

        /// 上课时间开始
        //[ScriptIgnore]
        public DateTime TimeStart{ get; set; }

        public string TimeStartStr { get { return TimeStart.ToString("yyyy-MM-dd HH:mm"); } }
        /// 上课时间结束
        //[ScriptIgnore]
        public DateTime TimeEnd{ get; set; }

        public string TimeEndStr { get { return TimeEnd.ToString("yyyy-MM-dd HH:mm"); } }

        /// 课程代码
        public string CourseCode{ get; set; }

        /// 报名要求（1允许所有教师报名。2允许学校管理员增加名单）
        public int Requirement{ get; set; }

        /// 授课对象（1幼儿教师，2小学教师，3初中教师，4高中教师，5其他）
        public int TeachingObject{ get; set; }

        /// 授课对象编制（1在编教师，2非在编教师）
        public int ObjectEstablish{ get; set; }

        /// 授课对象学科（对应多个学科，可以用逗号分离）
        public string ObjectSubject{ get; set; }

        /// 课程状态（1待审核状态，2审核通过并开放，3审核不通过）
        public int CourseState{ get; set; }

        /// 审批时间
        public DateTime AduitTime{ get; set; }

        /// 学科评审意见（初审）
        public string FirstAduit{ get; set; }

        /// 评审小组意见（终审）
        public string EndAduit{ get; set; }

        /// 中心审批意见
        public string CenterAduit{ get; set; }

        /// 考勤表文件名称
        public string AttendanceName{ get; set; }

        /// 考勤表文件路径
        public string AttendanceUrl{ get; set; }

        /// 是否锁定课程（1锁定，2不锁定）
        public int Locked{ get; set; }

        /// 评定等级（1A+，2A，3A-，4B，5C，6D）
        public int Assessmentlevel{ get; set; }

        public string CreatedBy{ get; set; }

        public DateTime CreatedOn{ get; set; }

        public string ModifiyBy{ get; set; }

        public DateTime ModifiyOn{ get; set; }

        /// <summary>
        /// 考勤次数
        /// </summary>
        public int Times { get; set; }
        
        /// <summary>
        /// 授课教师姓名
        /// </summary>
        public string Name { get; set; }

        public int Sex { get; set; }

        public string Profession { get; set; }

        public string SubjectName { get; set; }

        public string Teachername { get; set; }

        public int Sign { get; set; }

        public string CourseDateStr { get; set; }

    }
}
