using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.UserInfo
{
    public class StudentTrainBo
    {
        public string Id { get; set; }

        public string StudentId { get; set; }

        public string UserName { get; set; }

        public string ProgramId { get; set; }

        public string ProgrameName { get; set; }

        public string SubProgrameName { get; set; }

        public string SunProgrameName { get; set; }

        public int StuTime { get; set; }

        public string TrainName { get; set; }

        public string TheYear { get; set; }

        public string Comment { get; set; }

        public int SchoolAudit { get; set; }

        public int DistinctSchoolAudit { get; set; }

        public DateTime CreateOn { get; set; } 
    }
}
