using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.Parameter
{
    public class StudentExemptionBo
    {
        public string Id { get; set; }

        public string StudentID { get; set; }

        public string ExemptionId { get; set; }

        public string TheYear { get; set; }

        public int SchoolAudit { get; set; }

        public DateTime CreateOn { get; set; } 
    }
}
