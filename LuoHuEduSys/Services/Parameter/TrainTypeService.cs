using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Text;
using BusinessObject.Parameter;
using Dapper;
using Domain.common;
using Huatong.DAO;
using System.Linq;
using Dapper;
using DapperExtensions;
using System.Data.Common;
namespace Services.Parameter
{

    public class TrainTypeService
    {
        #region 培训类型增删改查基本操作

        /// <summary>
        /// 新增培训类型
        /// </summary>
        /// <param name="trainTypeBo"> 培训类型BO</param>
        /// <returns>bool</returns>
        public bool AddTrainType(TrainTypeBo trainTypeBo)
        {
            if (trainTypeBo == null)
                throw new ArgumentNullException("trainTypeBo");
            if (trainTypeBo.Id != null && trainTypeBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {


                    String id = Guid.NewGuid().ToString();
                    trainTypeBo.Id = id;
                    var sqlStr = @"INSERT INTO tb_traintype(Id,TrainCode,TrainType,Acess) VALUES(@Id,@TrainCode,@TrainType,@Acess);";
                    int row = connection.Execute(sqlStr, trainTypeBo);
                    if (row > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }

            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("TrainTypeService.AddTrainType({0})异常", trainTypeBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除培训类型信息
        /// </summary>
        /// <param name="ids">多个培训类型id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteTrainTypesByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        TrainTypeBo sBo = new TrainTypeBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_traintype where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("TrainTypeService.DeleteTrainTypesByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改培训类型信息
        /// </summary>
        /// <param name="trainTypeBo">培训类型BO</param>
        /// <returns></returns>
        public bool UpdateTrainType(TrainTypeBo trainTypeBo)
        {
            if (trainTypeBo == null)
                throw new ArgumentNullException("trainTypeBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_traintype set TrainCode=@TrainCode,TrainType=@TrainType,Acess=@Acess where Id=@Id";
                    int row = connection.Execute(sqlStr, trainTypeBo);
                    if (row > 0)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("TrainTypeService.UpdateTrainType({0})异常", trainTypeBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过培训类型id获取培训类型信息
        /// </summary>
        /// <param name="id">培训类型id</param>
        /// <returns>培训类型BO实体</returns>
        public TrainTypeBo GetTrainTypeById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var TrainTypeBo = new TrainTypeBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_traintype where Id=@Id";
                    TrainTypeBo = connection.Query<TrainTypeBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("TrainTypeService.GetTrainTypeById({0})异常", id), ex);
            }
            return TrainTypeBo;
        }

        //获取数据列表
        public Page<TrainTypeBo> GetTrainTypes(int page, int rows, string sort, string order, TrainTypeBo trainTypeBo)
        {
            int count = 0;
            int pageIndex = 0;
            int pageSize = 0;
            if (page < 0)
            {
                pageIndex = 0;
            }
            else
            {
                pageIndex = (page - 1) * rows;
            }
            pageSize = page * rows;
            var pageList = new Page<TrainTypeBo>();

            string strSql = string.Format(@"SELECT * from tb_traintype where 1=1 ");
            if (trainTypeBo != null)
            {
                if (trainTypeBo.TrainType != null)
                {
                    strSql += "and TrainType like @TrainType";
                }

                if (trainTypeBo.TrainCode != null)
                {
                    strSql += "and TrainCode like @TrainCode";
                }
            }

            switch (sort)
            {
                case "TrainCode":
                    strSql += " order by TrainCode " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<TrainTypeBo>(strSql,
                                            new
                                            {
                                                TrainType = string.Format("%{0}%", trainTypeBo.TrainType),
                                                TrainCode = string.Format("%{0}%", trainTypeBo.TrainCode)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<TrainTypeBo>(strSql,
                                                new
                                                {
                                                    TrainType = string.Format("%{0}%", trainTypeBo.TrainType),
                                                    TrainCode = string.Format("%{0}%", trainTypeBo.TrainCode),
                                                    pageindex = pageIndex,
                                                    pagesize = pageSize
                                                }).ToList();

                pageList.ListT = list;
                pageList.PageIndex = page;
                pageList.PageSize = rows;
                pageList.TotalCount = count;
            }

            return pageList;
        }

        #endregion
    }
}
