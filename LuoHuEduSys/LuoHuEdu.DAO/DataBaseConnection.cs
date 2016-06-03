using System.Collections.Generic;
using System.Configuration;
using System.Data.Common;
using System.Data.SqlClient;
using System.Reflection;
using DapperExtensions;
using DapperExtensions.Mapper;
using DapperExtensions.Sql;
using Oracle.ManagedDataAccess.Client;
using MySql.Data.MySqlClient;
using StackExchange.Profiling;

namespace Huatong.DAO
{
    public class DataBaseConnection
    {
        #region "封装基于dapper的connection"
        
        public static DbConnection GetSqlServerConnection()
        {
            var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["SqlServerIDROA"].ConnectionString);
            connection.Open();
            return new StackExchange.Profiling.Data.ProfiledDbConnection(connection, MiniProfiler.Current);
        }

        public static DbConnection GetOracleConnection()
        {
            var connection = new OracleConnection(ConfigurationManager.ConnectionStrings["OracleConnectionStr"].ConnectionString);
            connection.Open();
            return new StackExchange.Profiling.Data.ProfiledDbConnection(connection, MiniProfiler.Current);
        }

        public static DbConnection GetMySqlConnection()
        {
            var connection = new MySqlConnection(ConfigurationManager.ConnectionStrings["huatongdb"].ConnectionString);
            connection.Open();
            return connection;
        }
        #endregion

        #region "封装dapperExtensions扩展操作方法"

        public static IDatabase GetMySqlDataBase()
        {
            var config = new DapperExtensionsConfiguration(typeof(AutoClassMapper<>), new List<Assembly>(), new MySqlDialect());
            var sqlGenerator = new SqlGeneratorImpl(config);
            IDatabase db = new Database(GetMySqlConnection(), sqlGenerator);
            return db;
        }


        public static IDatabase GetSqlServerDataBase()
        {
            var config = new DapperExtensionsConfiguration(typeof(AutoClassMapper<>), new List<Assembly>(), new MySqlDialect());
            var sqlGenerator = new SqlGeneratorImpl(config);
            IDatabase db = new Database(GetSqlServerConnection(), sqlGenerator);
            return db;
        }

        public static IDatabase GetOracleDataBase()
        {
            var config = new DapperExtensionsConfiguration(typeof(AutoClassMapper<>), new List<Assembly>(), new MySqlDialect());
            var sqlGenerator = new SqlGeneratorImpl(config);
            IDatabase db = new Database(GetOracleConnection(), sqlGenerator);
            return db;
        }
        #endregion
    }
}
