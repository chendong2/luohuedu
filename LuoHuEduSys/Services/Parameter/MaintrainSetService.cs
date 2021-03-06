﻿using System;
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

    public class MaintrainSetService
    {
        #region 研修主项目增删改查基本操作

        /// <summary>
        /// 新增研修主项目
        /// </summary>
        /// <param name="maintrainSetBo"> 研修主项目BO</param>
        /// <returns>bool</returns>
        public bool AddMaintrainSet(MaintrainSetBo maintrainSetBo)
        {
            if (maintrainSetBo == null)
                throw new ArgumentNullException("maintrainSetBo");
            if (maintrainSetBo.Id != null && maintrainSetBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {


                    String id = Guid.NewGuid().ToString();
                    maintrainSetBo.Id = id;
                    var sqlStr = @"INSERT INTO tb_maintrainset(Id,ProgrameName,SubProgrameName,SunProgrameName,StuTime) VALUES(@Id,@ProgrameName,@SubProgrameName,@SunProgrameName,@StuTime);";
                    int row = connection.Execute(sqlStr, maintrainSetBo);
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
                LogHelper.WriteLog(string.Format("MaintrainSetService.AddMaintrainSet({0})异常", maintrainSetBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除研修主项目信息
        /// </summary>
        /// <param name="ids">多个研修主项目id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteMaintrainSetsByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        MaintrainSetBo sBo = new MaintrainSetBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_maintrainset where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("MaintrainSetService.DeleteMaintrainSetsByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改研修主项目信息
        /// </summary>
        /// <param name="maintrainSetBo">研修主项目BO</param>
        /// <returns></returns>
        public bool UpdateMaintrainSet(MaintrainSetBo maintrainSetBo)
        {
            if (maintrainSetBo == null)
                throw new ArgumentNullException("maintrainSetBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_maintrainset set ProgrameName=@ProgrameName,SubProgrameName=@SubProgrameName,SunProgrameName=@SunProgrameName,StuTime=@StuTime where Id=@Id";
                    int row = connection.Execute(sqlStr, maintrainSetBo);
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
                LogHelper.WriteLog(string.Format("MaintrainSetService.UpdateMaintrainSet({0})异常", maintrainSetBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过研修主项目id获取研修主项目信息
        /// </summary>
        /// <param name="id">研修主项目id</param>
        /// <returns>研修主项目BO实体</returns>
        public MaintrainSetBo GetMaintrainSetById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var MaintrainSetBo = new MaintrainSetBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_maintrainset where Id=@Id";
                    MaintrainSetBo = connection.Query<MaintrainSetBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("MaintrainSetService.GetMaintrainSetById({0})异常", id), ex);
            }
            return MaintrainSetBo;
        }

        //获取数据列表
        public Page<MaintrainSetBo> GetMaintrainSets(int page, int rows, string sort, string order, MaintrainSetBo maintrainSetBo)
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
            var pageList = new Page<MaintrainSetBo>();

            string strSql = string.Format(@"SELECT * from tb_maintrainset  where 1=1 ");
            if (maintrainSetBo != null)
            {
                if (!string.IsNullOrEmpty(maintrainSetBo.ProgrameName))
                {
                    strSql += "and ProgrameName like @ProgrameName ";
                }
                if (!string.IsNullOrEmpty(maintrainSetBo.SubProgrameName))
                {
                    strSql += "and SubProgrameName like @SubProgrameName ";
                }
                if (!string.IsNullOrEmpty(maintrainSetBo.SunProgrameName))
                {
                    strSql += "and SunProgrameName like @SunProgrameName ";
                }
            }

            switch (sort)
            {
                case "ProgrameName":
                    strSql += " order by ProgrameName,SubProgrameName,SunProgrameName " + order;
                    break;
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<MaintrainSetBo>(strSql,
                                            new
                                            {
                                                ProgrameName = string.Format("%{0}%", maintrainSetBo.ProgrameName),
                                                SubProgrameName = string.Format("%{0}%", maintrainSetBo.SubProgrameName),
                                                SunProgrameName = string.Format("%{0}%", maintrainSetBo.SunProgrameName)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<MaintrainSetBo>(strSql,
                                                new
                                                {
                                                    ProgrameName = string.Format("%{0}%", maintrainSetBo.ProgrameName),
                                                    SubProgrameName = string.Format("%{0}%", maintrainSetBo.SubProgrameName),
                                                    SunProgrameName = string.Format("%{0}%", maintrainSetBo.SunProgrameName),
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


        //获取所有的研修主项目数据
        public List<MaintrainSetBo> GetMaintrainSetsList()
        {

            string strSql = string.Format(@"SELECT Id,ProgrameName,SubProgrameName,SunProgrameName,StuTime from tb_maintrainset where 1=1 order by ProgrameName,SubProgrameName,SunProgrameName ");
            var list = new List<MaintrainSetBo>();
            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<MaintrainSetBo>(strSql).ToList();
            }
            return list;
        }

        #endregion

        public string[] GetAllProgram()
        {
            List<MaintrainSetBo> list;
            string strSql = string.Format(@"SELECT distinct ProgrameName from tb_maintrainset where 1=1 ");
            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<MaintrainSetBo>(strSql,
                                                new { }).ToList();
            }
            string[] data = new string[list.Count];
            for (int i = 0; i < list.Count; i++)
            {
                data[i] = list[i].ProgrameName;
            }
            return data;
        }

        public string[] GetSubProgram(string pro)
        {
            List<MaintrainSetBo> list;
            string strSql = string.Format(@"SELECT distinct SubProgrameName from tb_maintrainset where 1=1 and  ProgrameName=@ProgrameName ");
            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<MaintrainSetBo>(strSql,
                                                new
                                                    {
                                                        ProgrameName = pro
                                                    }).ToList();
            }
            string[] data = new string[list.Count];
            for (int i = 0; i < list.Count; i++)
            {
                data[i] = list[i].SubProgrameName;
            }
            return data;
        }

        public string[] GetSunProgram(string pro,string subPro)
        {
            List<MaintrainSetBo> list;
            string strSql = string.Format(@"SELECT distinct Id,SunProgrameName,StuTime from tb_maintrainset where 1=1 and  SubProgrameName=@SubProgrameName  and  ProgrameName=@ProgrameName ");
            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<MaintrainSetBo>(strSql,
                                                new
                                                {
                                                    ProgrameName=pro,
                                                    SubProgrameName = subPro
                                                }).ToList();
            }
            string[] data = new string[list.Count];
            for (int i = 0; i < list.Count; i++)
            {
                data[i] = list[i].SunProgrameName + "/(" + list[i].StuTime + "课时)" + "******" + list[i].Id;
            }
            return data;
        }
    
    }
}
