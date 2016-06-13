using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.UserInfo
{
    public class StudentExemptionBo
    {
        public string Id { get; set; }

        public string StudentId { get; set; }

        public string UserName { get; set; }

        public string ExemptionReason { get; set; }

        public string ExemptionId { get; set; }

        public string TheYear { get; set; }

        public int SchoolAudit { get; set; }

        public DateTime CreateOn { get; set; } 
    }
}
