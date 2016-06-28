

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

            //集中培训列表
            ("#tb2").nextAll("table").remove();
            
        }
    });
}
