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
    /// Summary description for MaintrainSet
    /// </summary>
    [WebService(Namespace = "http://tempuri.org/")]
    [WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
    [System.ComponentModel.ToolboxItem(false)]
    // To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
     [System.Web.Script.Services.ScriptService]
    public class MaintrainSet : System.Web.Services.WebService
    {

        //新增数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool AddMaintrainSet(MaintrainSetBo maintrainSetBo)
        {

            var maintrainSetService = new MaintrainSetService();
            return maintrainSetService.AddMaintrainSet(maintrainSetBo);
        }

        //编辑数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool UpdateMaintrainSet(MaintrainSetBo maintrainSetBo)
        {

            var maintrainSetService = new MaintrainSetService();
            return maintrainSetService.UpdateMaintrainSet(maintrainSetBo);
        }

  

        //批量删除数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public bool DeleteMaintrainSetsByIds(String ids)
        {
            var maintrainSetService = new MaintrainSetService();
            return maintrainSetService.DeleteMaintrainSetsByIds(ids);
        }

        //获取数据列表
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public object GetMaintrainSetList(int page, int rows, string sort, string order, MaintrainSetBo maintrainSetBo)
        {

            var maintrainSet = new MaintrainSetService();
            var list = maintrainSet.GetMaintrainSets(page, rows, sort, order, maintrainSetBo);
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
        public MaintrainSetBo GetMaintrainSetById(String id)
        {

            var maintrainSetService = new MaintrainSetService();
            var maintrainSetBo = maintrainSetService.GetMaintrainSetById(id);
            return maintrainSetBo;
        }

        //根据Id获取数据
        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public List<MaintrainSetBo> GetMaintrainSetsList()
        {

            var maintrainSetService = new MaintrainSetService();
            var list = maintrainSetService.GetMaintrainSetsList();
            return list;
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public string[] GetAllProgram()
        {
            var maintrainSetService = new MaintrainSetService();
            var maintrainList = maintrainSetService.GetAllProgram();
            return maintrainList;
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public string[] GetSubProgram(string pro)
        {
            var maintrainSetService = new MaintrainSetService();
            var maintrainList = maintrainSetService.GetSubProgram(pro);
            return maintrainList;
        }

        [ScriptMethod]
        [WebMethod(EnableSession = true)]
        public string[] GetSunProgram(string pro,string subPro)
        {
            var maintrainSetService = new MaintrainSetService();
            var maintrainList = maintrainSetService.GetSunProgram(pro,subPro);
            return maintrainList;
        }

    }
}
