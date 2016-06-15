using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject
{
    public class SchoolBo
    {
        /// 主键ID
        public string Id { get; set; }
        /// 学校名称
        public string SchoolName { get; set; }
        /// 学校编号:该号码为单位学校的全国统一编号（一般为12位数字，如 ：440201001201的后六位数001201.）
        public string SchoolNo { get; set; }
        /// 所属教办
        public string Administrative { get; set; }
        /// 办学方式(1,公办，2国有民办,3民办学校,4其他)
        public string SchoolType { get; set; }
        /// 学段设定(可以多选,1幼儿园,2,小学,3初中,4高中)
        public string LearnLive { get; set; }
        /// 学校地址
        public string Address { get; set; }
        /// 联系电话
        public string Phone { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ModifiyBy { get; set; }
        public DateTime ModifiyOn { get; set; }
    }
}
