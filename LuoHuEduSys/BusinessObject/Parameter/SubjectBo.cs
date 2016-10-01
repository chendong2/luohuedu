using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BusinessObject.Parameter
{
    public class SubjectBo
    {
        public string Id { get; set; }

        public string SubjectName { get; set; }
     
        /// <summary>
        /// 是否教学科目
        /// </summary>
        public int IsTeachingSubject { get; set; }
    }
}
