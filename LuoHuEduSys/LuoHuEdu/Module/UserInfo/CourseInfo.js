

//获取JSON数据并填充到相应表单
getTheYear();
ajaxCRUD({
    url: '/WebServices/Admin/Student.asmx/GetAllStudent',
    success: function (data) {
        fillData();
    }
});


//获取年份数据
function getTheYear() {
    var currentYear = new Date().getFullYear();
    $("#sTheYear").empty();
    for (var i = 1; i <= 15; i++) {
        var data = currentYear - i + "-" + (currentYear - i + 1);
        var option = "<option value='" + data + "'>" + data + "</option>";
        $("#sTheYear").append(option);
    }
}

function fillData() {
    var theyear = $("#sTheYear").val();

    $("#tdTheYear").html(theyear);
    $("#kemu").nextAll().remove();
    $("#tdCount").nextAll().remove();

    $("#tb2").nextAll().remove();
    $("#tdCount").html(0);
    ajaxCRUD({
        url: '/WebServices/Parameter/TrainType.asmx/GetAllTrainType',
        async: false,
        success: function (data) {
            var total = 0;
            for (var i = 0; i < data.length; i++) {
                var value = data[i].toString().split('******');
                var td = "<td  style='font-weight: bolder;'>" + value[0] + "课时</td>";
                $("#kemu").parent().append(td);
                ajaxCRUD({
                    url: '/WebServices/Course/AllCourseServices.asmx/GetMyColloctCourse',
                    data: "{theYear:'" + theyear + "',trainType:'" + value[1] + "'}",
                    async: false,
                    success: function (data1) {
                        if (data1 != null) {
                            var td1 = "<td  style='font-weight: bolder;'>" + data1.Period + "</td>";
                            total = total + data1.Period;
                            $("#tdCount").parent().append(td1);

                            $("#tdName").html(data1.Name);
                            $("#tdSex").html(data1.Sex == 1 ? "男" : "女");
                            $("#tdProfession").html(data1.Profession);
                        } else {
                            var td2 = "<td  style='font-weight: bolder;'>0</td>";
                            $("#tdCount").parent().append(td2);
                        }

                    }
                });

                //培训列表
                var table = "<table  class='custom_forms_popup1'  style='border:1px solid black'><tr> <td colspan='11' style='text-align: left;font-weight: bolder;'>" +
                            value[0] + "列表</td></tr>";
                ajaxCRUD({
                    url: '/WebServices/Course/AllCourseServices.asmx/GetMyCourseList',
                    data: "{theYear:'" + theyear + "',trainType:'" + value[1] + "'}",
                    async: false,
                    success: function (data4) {
                        for (var m = 0; m < data4.length; m++) {

                            var tr = "<tr><td  style='font-weight: bolder;'>课程名称</td><td colspan='2'>" + data4[m].CourseName +
                                "</td><td  style='font-weight: bolder;'>种类</td><td>" + (data4[m].IsMust == 1 ? "选修" : "必修") +
                                    "</td><td  style='font-weight: bolder;width:7%' >类型</td><td style='width:9%'>" + value[0] +
                                        "</td><td  style='font-weight: bolder;'>授课对象</td><td style='width:8%'>" +
                                            (data4[m].TeachingObject == 1 ? "幼儿教师" : data4[m].TeachingObject == 2 ? "小学教师" : data4[m].TeachingObject == 3 ? "初中教师" : data4[m].TeachingObject == 3 ? "高中教师" : "其他") +
                                                "</td><td rowspan='3' style='width:8%;font-weight: bolder;'>有效课时</td><td rowspan='3' style='width:8%'>" + (data4[m].Sign == 2 ? data4[m].Period : 0) +
                                                    "</td></tr><tr><td  style='font-weight: bolder;'>培训类型</td><td style='width:8%'>" + data4[m].SubjectName +
                                                        "</td> <td  style='font-weight: bolder;'>授课教师</td><td>" + data4[m].Teachername + "</td><td  style='font-weight: bolder;'>单位</td>" +
                                                            "<td  colspan='2' style='width:10%'>" + data4[m].OrganizationalName + "</td><td  style='font-weight: bolder;'>授课地点</td>" +
                                                                "<td style='width:8%'>" + data4[m].Address + "</td></tr><tr><td  style='font-weight: bolder;'>课时</td>" +
                                                                    "<td>" + data4[m].Period + "</td><td  style='font-weight: bolder;' colspan='2'>授课时间及考勤</td><td class='datestr' colspan='5'>" + data4[m].CourseDateStr + " (" + (data4[m].Sign == 2 ? data4[m].Period : 0) + "课时)</td></tr>";
                            table = table + tr;
                        }
                    }
                });

                table = table + "</table>";
                $("#tb2").parent().append(table);

                $(".datestr").each(function() {

                });
            }
            td = "<td  style='font-weight: bolder;'>课时汇总</td>";
            $("#kemu").parent().append(td);
            td = "<td  style='font-weight: bolder;'>" + total + "</td>";
            $("#tdCount").parent().append(td);

            ajaxCRUD({
                url: '/WebServices/UserInfo/StudentTrain.asmx/GetMyStudentTrain',
                data: "{theYear:'" + theyear + "'}",
                async: false,
                success: function (data2) {
                    td = "<td  style='font-weight: bolder;'>校本研修课时</td>";
                    $("#kemu").parent().append(td);
                    if (data2 != null) {
                        td = "<td  style='font-weight: bolder;'>" + data2.StuTime + "</td>";
                        total = total + data2.StuTime;
                    } else {
                        td = "<td  style='font-weight: bolder;'>0</td>";
                    }
                    $("#tdCount").parent().append(td);

                    td = "<td  style='font-weight: bolder;'>总课时</td>";
                    $("#kemu").parent().append(td);
                    td = "<td  style='font-weight: bolder;'>" + total + "</td>";
                    $("#tdCount").parent().append(td);
                }
            });

            //科目数
            ajaxCRUD({
                url: '/WebServices/Course/AllCourseServices.asmx/GetCount',
                data: "{theYear:'" + theyear + "'}",
                async: false,
                success: function (data3) {
                    $("#tdCount").html(data3.Period);
                }
            });


        }
    });
}
