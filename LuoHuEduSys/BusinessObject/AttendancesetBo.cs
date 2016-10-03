using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject
{
    public class AttendancesetBo
    {
        public int Id { get; set; }
        public string Morning { get; set; }
        public string Afternoon { get; set; }

        public string Night { get; set; }
        public int MorningPeriod { get; set; }

        public int AfternoonPeriod { get; set; }

        public int  NightPeriod { get; set; }

        public string  AttendanceDate { get; set; }

        public string CourseId { get; set; }
    }
}
