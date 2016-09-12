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

    public class SchoolService
    {
        #region 单位增删改查基本操作

        /// <summary>
        /// 新增单位
        /// </summary>
        /// <param name="schoolBo"> 单位BO</param>
        /// <returns>bool</returns>
        public bool AddSchool(SchoolBo schoolBo)
        {
            if (schoolBo == null)
                throw new ArgumentNullException("schoolBo");
            if (schoolBo.Id != null && schoolBo.Id.Length > 1)
                throw new Exception("不能给Id赋值");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {


                    String id = Guid.NewGuid().ToString();
                    schoolBo.Id = id;
                    schoolBo.CreatedOn = DateTime.Now;
                    schoolBo.CreatedBy = Domain.common.UserInfo.GetUserName();
                    var sqlStr = @"INSERT INTO tb_school(Id,SchoolName,SchoolNo,Administrative,SchoolType,LearnLive,Address,Phone,CreatedBy,CreatedOn) VALUES(@Id,@SchoolName,@SchoolNo,@Administrative,@SchoolType,@LearnLive,@Address,@Phone,@CreatedBy,@CreatedOn);";
                    int row = connection.Execute(sqlStr, schoolBo);
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
                LogHelper.WriteLog(string.Format("SchoolService.AddSchool({0})异常", schoolBo), ex);
                return false;
            }
        }



        /// <summary>
        /// 批量删除单位信息
        /// </summary>
        /// <param name="ids">多个单位id用逗号分隔的字符串</param>
        /// <returns>bool</returns>
        public bool DeleteSchoolsByIds(String ids)
        {
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    String[] idArray = ids.Split(',');
                    for (int i = 0; i < idArray.Length; i++)
                    {
                        SchoolBo sBo = new SchoolBo();
                        sBo.Id = idArray[i];
                        var sqlStr = @"delete from  tb_school where id=@Id;";
                        connection.Execute(sqlStr, sBo);
                    }
                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SchoolService.DeleteSchoolsByIds({0})异常", ids), ex);
                return false;
            }
            return true;
        }

        /// <summary>
        /// 修改单位信息
        /// </summary>
        /// <param name="schoolBo">单位BO</param>
        /// <returns></returns>
        public bool UpdateSchool(SchoolBo schoolBo)
        {
            if (schoolBo == null)
                throw new ArgumentNullException("schoolBo");
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"update tb_school set SchoolName=@SchoolName,SchoolNo=@SchoolNo,Administrative=@Administrative,SchoolType=@SchoolType,LearnLive=@LearnLive,Address=@Address,Phone=@Phone where Id=@Id";
                    int row = connection.Execute(sqlStr, schoolBo);
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
                LogHelper.WriteLog(string.Format("SchoolService.UpdateSchool({0})异常", schoolBo), ex);
                return false;
            }
        }

        /// <summary>
        /// 通过单位id获取单位信息
        /// </summary>
        /// <param name="id">单位id</param>
        /// <returns>单位BO实体</returns>
        public SchoolBo GetSchoolById(String id)
        {
            if (id == null)
                throw new ArgumentNullException("id");
            var SchoolBo = new SchoolBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_school where Id=@Id";
                    SchoolBo = connection.Query<SchoolBo>(sqlStr, new { Id = id }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SchoolService.GetSchoolById({0})异常", id), ex);
            }
            return SchoolBo;
        }

        //获取数据列表
        public Page<SchoolBo> GetSchools(int page, int rows, string sort, string order, SchoolBo schoolBo)
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
            var pageList = new Page<SchoolBo>();

            string strSql = string.Format(@"SELECT tb_school.Id,SchoolName,SchoolNo,case when tb_educationoffice.EducationtName is null then '' else tb_educationoffice.EducationtName end as Administrative,SchoolType,LearnLive,Address,Phone from tb_school left join tb_educationoffice on tb_school.Administrative=tb_educationoffice.Id  where 1=1  ");
            if (schoolBo != null)
            {
                if (!string.IsNullOrEmpty(schoolBo.SchoolName))
                {
                    strSql += "and SchoolName like @SchoolName ";
                }
                if (!string.IsNullOrEmpty(schoolBo.SchoolNo))
                {
                    strSql += "and SchoolNo like @SchoolNo ";
                }
            }

            switch (sort)
            {
                case "SchoolName":
                    strSql += " order by SchoolName " + order;
                    break;
                case "SchoolNo":
                    strSql += "order by SchoolNo " + order;
                    break;
                    
            }


            using (var context = DataBaseConnection.GetMySqlConnection())
            {
                count = context.Query<SchoolBo>(strSql,
                                            new
                                            {
                                                SchoolName = string.Format("%{0}%", schoolBo.SchoolName),
                                                SchoolNo = string.Format("%{0}%", schoolBo.SchoolNo)
                                            }).Count();
                strSql += " limit @pageindex,@pagesize";

                var list = context.Query<SchoolBo>(strSql,
                                                new
                                                {
                                                    SchoolName = string.Format("%{0}%", schoolBo.SchoolName),
                                                    SchoolNo = string.Format("%{0}%", schoolBo.SchoolNo),
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

        //获取全部的学校数据
        public string[] GetAllSchool()
        {
            List<SchoolBo> list;
            string strSql = string.Format(@"SELECT * from tb_school where 1=1 ");
            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<SchoolBo>(strSql,
                                                new { }).ToList();
            }
            string[] data = new string[list.Count];
            for (int i = 0; i < list.Count; i++)
            {
                data[i] = list[i].SchoolName  + "******" + list[i].Id;
            }
            return data;
        }


        public List<SchoolBo> GetAllSchoolNew()
        {
            List<SchoolBo> list;
            string strSql = string.Format(@"SELECT * from tb_school where 1=1 ");
            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<SchoolBo>(strSql,
                                                new { }).ToList();
            }
          
            return list;
        }

        /// <summary>
        /// 获取所有公办学校
        /// </summary>
        /// <returns></returns>
        public List<SchoolBo> GetPlcSchoolByType()
        {
            List<SchoolBo> list;
            string strSql = string.Format(@"SELECT * from tb_school where SchoolType=1 ");

            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<SchoolBo>(strSql,
                                                new { }).ToList();
            }

            return list;
        }
        /// <summary>
        /// 获取所有民办学校
        /// </summary>
        /// <returns></returns>
        public List<SchoolBo> GetPriSchoolByType()
        {
            List<SchoolBo> list;
            string strSql = string.Format(@"SELECT * from tb_school where SchoolType=3 ");

            using (var context = DataBaseConnection.GetMySqlConnection())
            {

                list = context.Query<SchoolBo>(strSql,
                                                new { }).ToList();
            }

            return list;
        }



        /// <summary>
        /// 根据学校编号获取学校Id
        /// </summary>
        /// <param name="id">单位id</param>
        public string GetSchoolIdBycode(string schoolNo)
        {
            if (schoolNo == null)
                throw new ArgumentNullException("schoolNo");
            var SchoolBo = new SchoolBo { };
            try
            {
                using (var connection = DataBaseConnection.GetMySqlConnection())
                {
                    var sqlStr = @"select * from tb_school where SchoolNo=@SchoolNo";
                    SchoolBo = connection.Query<SchoolBo>(sqlStr, new { SchoolNo = schoolNo }).FirstOrDefault();

                }
            }
            catch (Exception ex)
            {
                LogHelper.WriteLog(string.Format("SchoolService.GetSchoolIdBycode({0})异常", schoolNo), ex);
            }
            return SchoolBo.Id;
        }


    }
}
