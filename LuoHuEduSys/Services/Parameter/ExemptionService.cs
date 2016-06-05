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

    public class ExemptionService
    {
        #region 免修增删改查基本操作

        /// <summary>
        /// 新增免修
        /// </summary>
        /// <param name="exemptionBo"> 免修BO</param>
        /// <returns>bool</returns>
        public bool AddExemption(ExemptionBo exemptionBo)
        {
            if (exemptionBo == null)
                throw new ArgumentNullException("exemptionBo");
            if (exemptionBo.Id != null && exemptionBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {


                    String id = Guid.NewGuid().ToString();
                    exemptionBo.Id = id;
                    var sqlStr = @"INSERT INTO tb_exemption(Id,ExemptionReason,Comment) VALUES(@Id,@ExemptionReason,@Comment);";
                    int row = connection.Execute(sqlStr, exemptionBo);
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
                LogHelper.WriteLog(string.Format("ExemptionService.AddExemption({0})异常", exemptionBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除免修信息
        /// </summary>
        /// <param name="ids">多个免修id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteExemptionsByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        ExemptionBo sBo = new ExemptionBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_exemption where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("ExemptionService.DeleteExemptionsByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改免修信息
        /// </summary>
        /// <param name="exemptionBo">免修BO</param>
        /// <returns></returns>
        public bool UpdateExemption(ExemptionBo exemptionBo)
        {
            if (exemptionBo == null)
                throw new ArgumentNullException("exemptionBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_exemption set ExemptionReason=@ExemptionReason,Comment=@Comment where Id=@Id";
                    int row = connection.Execute(sqlStr, exemptionBo);
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
                LogHelper.WriteLog(string.Format("ExemptionService.UpdateExemption({0})异常", exemptionBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过免修id获取免修信息
        /// </summary>
        /// <param name="id">免修id</param>
        /// <returns>免修BO实体</returns>
        public ExemptionBo GetExemptionById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var ExemptionBo = new ExemptionBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_exemption where Id=@Id";
                    ExemptionBo = connection.Query<ExemptionBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("ExemptionService.GetExemptionById({0})异常", id), ex);
            }
            return ExemptionBo;
        }

        //获取数据列表
        public Page<ExemptionBo> GetExemptions(int page, int rows, string sort, string order, ExemptionBo exemptionBo)
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
            var pageList = new Page<ExemptionBo>();

            string strSql = string.Format(@"SELECT * from tb_exemption where 1=1 ");
            if (exemptionBo != null)
            {
                if (exemptionBo.ExemptionReason != null)
                {
                    strSql += "and ExemptionReason like @ExemptionReason ";
                }
            }

            switch (sort)
            {
                case "ExemptionReason":
                    strSql += " order by ExemptionReason " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<ExemptionBo>(strSql,
                                            new
                                            {
                                                ExemptionReason = string.Format("%{0}%", exemptionBo.ExemptionReason)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<ExemptionBo>(strSql,
                                                new
                                                {
                                                    ExemptionReason = string.Format("%{0}%", exemptionBo.ExemptionReason),
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
