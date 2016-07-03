using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.Script.Services;
using System.Web.Services;
using BusinessObject.Parameter;
using Services.Parameter;

namespace LuoHuEdu.WebServices.Parameter
{
    /// <summary>
    /// Summary description for TrainType
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class TrainType : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddTrainType(TrainTypeBo trainTypeBo)
        {

            var trainTypeService = new TrainTypeService();
            return trainTypeService.AddTrainType(trainTypeBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateTrainType(TrainTypeBo trainTypeBo)
        {

            var trainTypeService = new TrainTypeService();
            return trainTypeService.UpdateTrainType(trainTypeBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteTrainTypesByIds(String ids)
        {
            var trainTypeService = new TrainTypeService();
            return trainTypeService.DeleteTrainTypesByIds(ids);
        }

        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetTrainTypeList(int page, int rows, string sort, string order, TrainTypeBo trainTypeBo)
        {

            var trainType = new TrainTypeService();
            var list = trainType.GetTrainTypes(page, rows, sort, order, trainTypeBo);
            if (list != null)
            {
                return new
                {
                    total = list.TotalCount,
                    rows = list.ListT
                };
            }
            else
            {
                return new { total = 0, rows = 0 };
            }
        }

        //根据Id获取数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public TrainTypeBo GetTrainTypeById(String id)
        {

            var trainTypeService = new TrainTypeService();
            var trainTypeBo = trainTypeService.GetTrainTypeById(id);
            return trainTypeBo;
        }


          //根据Id获取数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public string[] GetAllTrainType()
        {

            var trainTypeService = new TrainTypeService();
            var trainType = trainTypeService.GetAllTrainType();
            return trainType;
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public List<TrainTypeBo> GetAllTrainTypeNew()
        {
            var trainTypeService = new TrainTypeService();
            return trainTypeService.GetAllTrainTypeNew();
        }



    }
}
