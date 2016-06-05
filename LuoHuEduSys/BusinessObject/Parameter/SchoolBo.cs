using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.Parameter
{
    public class SchoolBo
    {
        public string Id { get; set; }

        public string SchoolName { get; set; }

        public string SchoolNo { get; set; }

        public string Administrative { get; set; }

        public string SchoolType { get; set; }

        public string LearnLive { get; set; }

        public string Address { get; set; }

        public string Phone { get; set; }

        public string CreatedBy { get; set; }

        public DateTime CreatedOn { get; set; }

        public string ModifiyBy { get; set; }

        public DateTime ModifiyOn { get; set; }
    }
}
