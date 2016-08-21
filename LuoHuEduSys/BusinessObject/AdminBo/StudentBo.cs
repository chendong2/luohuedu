using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.AdminBo
{
    public class StudentBo
    {
        public string Id { get; set; }

        public string LoginId { get; set; }

        public string UserName { get; set; }

        public string PassWord { get; set; }

        public string OldPassword { get; set; }

        /// <summary>
        /// 学校ID
        /// </summary>
        public string SchoolId { get; set; }

        /// <summary>
        /// 学校名称
        /// </summary>
        public string SchoolName { get; set; }

        /// <summary>
        /// 学员姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 身份证号
        /// </summary>
        public string IDNo { get; set; }

        public string ImgUrl { get; set; }

        public int Sex { get; set; }

        public DateTime? Birthday { get; set; }


        public string BirthdayStr
        {
            get { return Birthday.HasValue ? Birthday.Value.ToString("yyyy-MM-dd") : ""; }
            set { Birthday = string.IsNullOrEmpty(value) ? (DateTime?)null : Convert.ToDateTime(value); }
        }

        public string Origin { get; set; }

        public string Minority { get; set; }

        public string Profession { get; set; }

        public string Professiontitles { get; set; }

        public string Graduated { get; set; }

        public int HighDegree { get; set; }

        public int StudyPeriod { get; set; }

        public int Staffing { get; set; }

        public int InCharge { get; set; }

        public string Office { get; set; }

        public string FirstTeaching { get; set; }

        public string SecondTeaching { get; set; }

        public string Address { get; set; }

        public string PostCode { get; set; }

        public string Phone { get; set; }

        public string Telephone { get; set; }

        public string Email { get; set; }

        public string HighHonor { get; set; }

        public string RegistrationCode { get; set; }


        public string TheYear { get; set; }

        public int jizhong { get; set; }
        public int zxpx { get; set; }
        public int xiaoben { get; set; }
        public int xueli { get; set; }
        public int maTime { get; set; }
        public int exTime { get; set; }
        public int total { get; set; }
        public int Countc { get; set; }

        public int Sign { get; set; }

        public string courseId;
    }
}
