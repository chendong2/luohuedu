using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.AdminBo
{
    public class StudentBo
    {
        public string Id { get; set; }

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

        public DateTime Birthday { get; set; }

        public string BirthdayStr { get; set; }

        public string Origin { get; set; }
    }
}
