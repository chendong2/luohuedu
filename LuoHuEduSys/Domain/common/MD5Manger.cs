using System;
using System.Security.Cryptography;
using System.Text;

namespace Domain.common
{
    /// <summary>
    /// MD5散列加密  刘彻  2012-11-12
    /// </summary>
    public class MD5Manger
    {
         private static MD5Manger _md5;
        private static readonly  object _syncBoot=new object();
        private MD5Manger()
        {
            
        }
        public static MD5Manger GetInstence()
        {
            if (_md5 == null)
            {
                lock (_syncBoot)
                {
                    if (_md5 == null)
                    {
                        _md5 = new MD5Manger();
                    }
                }
            }
            return _md5;
        }
        /// <summary>
        /// 16位加密
        /// </summary>
        /// <param name="convertString"></param>
        /// <returns></returns>
        public  string Get16Md5Str(string convertString)
        {
            MD5CryptoServiceProvider md5 = new MD5CryptoServiceProvider();
            string t2 = BitConverter.ToString(md5.ComputeHash(UTF8Encoding.Default.GetBytes(convertString)), 4, 8);
            t2 = t2.Replace("-", "");
            return t2;
        }
        /// <summary>
        /// 32位加密
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public string Get32Md5Str(string str)
        {
            string cl = str;
            string pwd = "";
            MD5 md5 = MD5.Create();//实例化一个md5对像
            // 加密后是一个字节类型的数组，这里要注意编码UTF8/Unicode等的选择
            byte[] s = md5.ComputeHash(Encoding.UTF8.GetBytes(cl));
            // 通过使用循环，将字节类型的数组转换为字符串，此字符串是常规字符格式化所得
            for (int i = 0; i < s.Length; i++)
            {
                // 将得到的字符串使用十六进制类型格式。格式后的字符是小写的字母，如果使用大写（X）则格式后的字符是大写字符
                pwd = pwd + s[i].ToString("X");

            }
            return pwd;
        }

    }
}