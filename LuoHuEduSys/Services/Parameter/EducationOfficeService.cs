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

    public class EducationOfficeService
    {
        #region 教办增删改查基本操作

        /// <summary>
        /// 新增教办
        /// </summary>
        /// <param name="educationOfficeBo"> 教办BO</param>
        /// <returns>bool</returns>
        public bool AddEducationOffice(EducationOfficeBo educationOfficeBo)
        {
            if (educationOfficeBo == null)
                throw new ArgumentNullException("educationOfficeBo");
            if (educationOfficeBo.Id != null && educationOfficeBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {


                    String id = Guid.NewGuid().ToString();
                    educationOfficeBo.Id = id;
                    var sqlStr = @"INSERT INTO tb_educationoffice(Id,EducationtName) VALUES(@Id,@EducationtName);";
                    int row = connection.Execute(sqlStr, educationOfficeBo);
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
                LogHelper.WriteLog(string.Format("EducationOfficeService.AddEducationOffice({0})异常", educationOfficeBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除教办信息
        /// </summary>
        /// <param name="ids">多个教办id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteEducationOfficesByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        EducationOfficeBo sBo = new EducationOfficeBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_educationoffice where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("EducationOfficeService.DeleteEducationOfficesByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改教办信息
        /// </summary>
        /// <param name="educationOfficeBo">教办BO</param>
        /// <returns></returns>
        public bool UpdateEducationOffice(EducationOfficeBo educationOfficeBo)
        {
            if (educationOfficeBo == null)
                throw new ArgumentNullException("educationOfficeBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_educationoffice set EducationtName=@EducationtName where Id=@Id";
                    int row = connection.Execute(sqlStr, educationOfficeBo);
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
                LogHelper.WriteLog(string.Format("EducationOfficeService.UpdateEducationOffice({0})异常", educationOfficeBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过教办id获取教办信息
        /// </summary>
        /// <param name="id">教办id</param>
        /// <returns>教办BO实体</returns>
        public EducationOfficeBo GetEducationOfficeById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var EducationOfficeBo = new EducationOfficeBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_educationoffice where Id=@Id";
                    EducationOfficeBo = connection.Query<EducationOfficeBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("EducationOfficeService.GetEducationOfficeById({0})异常", id), ex);
            }
            return EducationOfficeBo;
        }

        //获取数据列表
        public Page<EducationOfficeBo> GetEducationOffices(int page, int rows, string sort, string order, EducationOfficeBo educationOfficeBo)
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
            var pageList = new Page<EducationOfficeBo>();

            string strSql = string.Format(@"SELECT * from tb_educationoffice  where 1=1 ");
            if (educationOfficeBo != null)
            {
                if (!string.IsNullOrEmpty(educationOfficeBo.EducationtName))
                {
                    strSql += "and EducationtName like @EducationtName ";
                }
            }

            switch (sort)
            {
                case "EducationtName":
                    strSql += " order by EducationtName " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<EducationOfficeBo>(strSql,
                                            new
                                            {
                                                EducationtName = string.Format("%{0}%", educationOfficeBo.EducationtName)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<EducationOfficeBo>(strSql,
                                                new
                                                {
                                                    EducationtName = string.Format("%{0}%", educationOfficeBo.EducationtName),
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


        //获取所有的教办数据
        public List<EducationOfficeBo> GetEducationOfficesList()
        {

            string strSql = string.Format(@"SELECT Id,EducationtName from tb_educationoffice where 1=1 order by EducationtName ");
            var list=new List<EducationOfficeBo>();
            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                
                 list = context.Query<EducationOfficeBo>(strSql).ToList();
            }
            return list;
        }

        #endregion
    }
}
