using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HuaTongSystem.Common
{
    public class SysCommonHelper
    {
        /// <summary>
        /// 传入搜索日期：昨日、今天、上周、本周、上月、本月
        /// add by jjx on 2013-10-25
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        public static Dictionary<string, string> GetSelectDate(string date)
        {
            var startAndEndDate = new Dictionary<string, string>();
            string startDate = string.Empty;
            string endDate = string.Empty;
            DateTime tempDate;

            if (string.IsNullOrEmpty(date) || DateTime.TryParse(date, out tempDate))
            {
                return startAndEndDate;
            }

            switch (date)
            {
                case "yesterday": // 昨日
                    startDate = DateTime.Now.AddDays(-1).ToShortDateString();
                    endDate = DateTime.Now.AddDays(-1).ToShortDateString();
                    break;
                case "today":     // 今天
                    startDate = DateTime.Now.ToShortDateString();
                    endDate = DateTime.Now.ToShortDateString();
                    break;
                case "thisWeek":  // 本周
                    startDate = DateTime.Now.AddDays(Convert.ToDouble((0 - Convert.ToInt16(DateTime.Now.DayOfWeek)))).ToShortDateString();
                    endDate = DateTime.Now.AddDays(Convert.ToDouble((6 - Convert.ToInt16(DateTime.Now.DayOfWeek)))).ToShortDateString();
                    break;
                case "lastWeek":  // 上周
                    startDate = DateTime.Now.AddDays(Convert.ToDouble((0 - Convert.ToInt16(DateTime.Now.DayOfWeek))) - 7).ToShortDateString();
                    endDate = DateTime.Now.AddDays(Convert.ToDouble((6 - Convert.ToInt16(DateTime.Now.DayOfWeek))) - 7).ToShortDateString();
                    break;
                case "thisMonth": // 本月
                    startDate = DateTime.Now.ToString("yyyy-MM-01");
                    endDate = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-01")).AddMonths(1).AddDays(-1).ToShortDateString();
                    break;
                case "lastMonth": // 上月
                    startDate = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-01")).AddMonths(-1).ToShortDateString();
                    endDate = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-01")).AddDays(-1).ToShortDateString();
                    break;
            }
            startAndEndDate.Add("startDate", startDate);
            startAndEndDate.Add("endDate", endDate);
            return startAndEndDate;
        }

        /// <summary>
        /// 金额小写转中文大写。
        /// 整数支持到万亿；小数部分支持到分(超过两位将进行Banker舍入法处理)
        /// add by jjx 2013-12-24
        /// </summary>
        /// <param name="Num">需要转换的双精度浮点数</param>
        /// <returns>转换后的字符串</returns>
        public static String NumGetStr(Double Num)
        {

            String[] Ls_ShZ = { "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾" };
            String[] Ls_DW_Zh = { "元", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟", "万" };
            String[] Num_DW = { "", "拾", "佰", "仟", "万", "拾", "佰", "仟", "亿", "拾", "佰", "仟", "万" };
            String[] Ls_DW_X = { "角", "分" };

            Boolean iXSh_bool = false;//是否含有小数，默认没有(0则视为没有)
            Boolean iZhSh_bool = true;//是否含有整数,默认有(0则视为没有)

            string NumStr;//整个数字字符串
            string NumStr_Zh;//整数部分
            string NumSr_X = "";//小数部分
            string NumStr_DQ;//当前的数字字符
            string NumStr_R = "";//返回的字符串

            Num = Math.Round(Num, 2);//四舍五入取两位

            //各种非正常情况处理
            if (Num < 0)
                Num = -Num;
            if (Num == 0)
                return Ls_ShZ[0];

            //判断是否有整数
            if (Num < 1.00)
                iZhSh_bool = false;

            NumStr = Num.ToString();

            NumStr_Zh = NumStr;//默认只有整数部分
            if (NumStr_Zh.Contains("."))
            {//分开整数与小数处理
                NumStr_Zh = NumStr.Substring(0, NumStr.IndexOf("."));
                NumSr_X = NumStr.Substring((NumStr.IndexOf(".") + 1), (NumStr.Length - NumStr.IndexOf(".") - 1));
                iXSh_bool = true;
            }


            if (NumSr_X == "" || int.Parse(NumSr_X) <= 0)
            {//判断是否含有小数部分
                iXSh_bool = false;
            }

            if (iZhSh_bool)
            {//整数部分处理
                NumStr_Zh = string.Join("", NumStr_Zh.ToArray().Reverse());//反转字符串

                for (int a = 0; a < NumStr_Zh.Length; a++)
                {//整数部分转换
                    NumStr_DQ = NumStr_Zh.Substring(a, 1);
                    if (int.Parse(NumStr_DQ) != 0)
                        NumStr_R = Ls_ShZ[int.Parse(NumStr_DQ)] + Ls_DW_Zh[a] + NumStr_R;
                    else if (a == 0 || a == 4 || a == 8)
                    {
                        if (NumStr_Zh.Length > 8 && a == 4)
                            continue;
                        NumStr_R = Ls_DW_Zh[a] + NumStr_R;
                    }
                    else if (int.Parse(NumStr_Zh.Substring(a - 1, 1)) != 0)
                        NumStr_R = Ls_ShZ[int.Parse(NumStr_DQ)] + NumStr_R;

                }

                if (!iXSh_bool)
                    return NumStr_R + "整";

                //NumStr_R += "零";
            }

            for (int b = 0; b < NumSr_X.Length; b++)
            {//小数部分转换
                NumStr_DQ = NumSr_X.Substring(b, 1);
                if (int.Parse(NumStr_DQ) != 0)
                    NumStr_R += Ls_ShZ[int.Parse(NumStr_DQ)] + Ls_DW_X[b];
                else if (b != 1 && iZhSh_bool)
                    NumStr_R += Ls_ShZ[int.Parse(NumStr_DQ)];
            }

            return NumStr_R;

        }

        /// <summary>
        /// 根据传入的类型，确定默认的查询时间段
        /// 搜索类型，后台处理时间
        /// type昨天1， 本周2，上周3，上月4
        /// 默认本月0，
        /// 返回索引0其实时间段，1结束时间段
        /// add by ys on 2013-10-25
        /// </summary>
        /// <param name="type"></param>
        /// <returns></returns>
        public static string[] SetQueryTimeBuket(int type)
        {
            string[] returnDatas = new string[2];
            string startDate = string.Empty;
            string endDate = string.Empty;
            switch (type)
            {
                case 1: //昨天
                    startDate = DateTime.Now.Date.AddDays(-1).ToString("yyyy-MM-dd");
                    endDate = DateTime.Now.Date.AddDays(-1).ToString("yyyy-MM-dd");
                    break;
                case 2: //本周
                    startDate =
                        DateTime.Now.AddDays(Convert.ToDouble((0 - Convert.ToInt16(DateTime.Now.DayOfWeek)))).
                            ToShortDateString();
                    endDate =
                        DateTime.Now.AddDays(Convert.ToDouble((6 - Convert.ToInt16(DateTime.Now.DayOfWeek)))).
                            ToShortDateString();
                    break;
                case 3: //上周
                    startDate =
                        DateTime.Now.AddDays(Convert.ToDouble((0 - Convert.ToInt16(DateTime.Now.DayOfWeek))) - 7).
                            ToShortDateString();
                    endDate =
                        DateTime.Now.AddDays(Convert.ToDouble((6 - Convert.ToInt16(DateTime.Now.DayOfWeek))) - 7).
                            ToShortDateString();
                    break;
                case 4: //上月
                    startDate =
                        DateTime.Parse(DateTime.Now.ToString("yyyy-MM-01")).AddMonths(-1).ToShortDateString();
                    endDate =
                        DateTime.Parse(DateTime.Now.ToString("yyyy-MM-01")).AddDays(-1).ToShortDateString();
                    break;
                default:
                    startDate = DateTime.Now.ToString("yyyy-MM-01");
                    endDate = DateTime.Now.Date.ToString("yyyy-MM-dd");
                    break;

            }
            returnDatas[0] = startDate;
            returnDatas[1] = endDate;
            return returnDatas;
        }
    }
}