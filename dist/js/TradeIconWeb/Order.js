﻿var ActiveTradeInterval;
var CurrentActiveTradeID = 0;
var IsFindButtonClicked = false;
$(document).ready(function () {
    $('#Drp-Segment').select2({
        'placeholder': 'Segment',
        'allowClear': true
    });
    $('#Drp-Segment').val(null).trigger('change');
    $('#Drp-Symbol').select2({
        'placeholder': 'Symbol',
        'allowClear': true
    });
    $('#Drp-Symbol').val(null).trigger('change');
    $('#Drp-Client').select2({
        'placeholder': 'Client',
        'allowClear': true
    });
    $('#Drp-Client').val(null).trigger('change');
    $('#Drp-Order').select2({
        'placeholder': 'Order T',
        'allowClear': true
    });
    $('#Drp-Order').val(null).trigger('change');
    $("#show").click(function () {
        $(".popup").show(500);
    });
    $("#pendingorder").click(function () {
        $(".completedorder").hide();
        $(".pendingorder").show();
    });
    $("#completedorder").click(function () {
        $(".pendingorder").hide();
        $(".completedorder").show();
    });

    $("#edit").click(function () {
        $("#save").show();
        $("#close").show();
        $("#edit").hide();
    });

    $("#close").click(function () {
        $("#save").hide();
        $("#close").hide();
        $("#edit").show();
    });

    $("#save").click(function () {
        $("#save").hide();
        $("#close").hide();
        $("#edit").show();
    });

    ActiveTradeInterval = window.setInterval(function () { GetPendingData(); }, 1000);
});

function checkdelete() {
    return confirm('Are you sure want to Delete this Record');
}
function checkexecute() {

    var result = confirm('Are you sure to execute this order by market');
    if (result) {

    }
}
function savedata() {
    toastr.success("save successfully");
}
$(document).on('change', '#Drp-Segment', function () {
    if ($('#Drp-Segment option:selected').text() != "")
        SetScriptNameData();
});
function SetScriptNameData() {
    var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
    var Wid = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
    var ScriptInstrumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
    var input = { 'ScriptExchange': Wid, 'ScriptInstrumentType': ScriptInstrumentType };


    var request = $.ajax({
        url: "/Trade/GetScriptNameWithExchangeName",
        type: "GET",
        data: input,
        dataType: 'json',
        async: true,
        success: function (data) {
            SetNameResult(data);
        }
    });
}
function SetNameResult(results) {
    //var results = JSON.parse(data);
    $('#Drp-Symbol').html('');
    if (results != null) {
        //Set data for WatchList trade
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var result = results[i].ScriptName;
                $('#Drp-Symbol').append(new Option(result, result));
            }
            $('#Drp-Symbol').val(null).trigger('change');
        }
        else {
            $('#Drp-Symbol').html('');
        }

    }
}

//Trades data starts from here
function GetPendingData() {
    var TotalPending = 0;
    var TotalCompleted = 0;
    if (IsFindButtonClicked == true) {
        var UserId = $('#Drp-Client option:selected').text() != "" ? $('#Drp-Client').val() : 0;
        var Tempscriptname = $('#Drp-Segment option:selected').text() != "" ? $('#Drp-Segment').val() : "";
        var Wid = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[0] : "";
        var ScriptInstrumentType = $('#Drp-Segment option:selected').text() != "" ? Tempscriptname.split('>')[1] : "";
        var ScriptName = $('#Drp-Symbol option:selected').text() != "" ? $('#Drp-Symbol').val() : "";
        var input = { 'IsAdminWise': 1, 'UserId': UserId, 'scriptExchangeType': Wid, 'ScriptInstrumentType': ScriptInstrumentType, 'ScriptName': ScriptName };
        //IsFindButtonClicked = false;
    }
    else {
        var input = { 'IsAdminWise': 1 };
    }
    $.ajax({
        url: "/Trade/GetDataManageTransaction",
        type: "GET",
        dataType: "json",
        data: input,
        success: function (result) {
            var data = JSON.parse(result);
            if (data != null) {
                $('#tblPendingBody').html('');
                $('#tblcompleteBody').html('');
                if (data.ActiveTrade.length > 0) {
                    for (var i = 0; i < data.ActiveTrade.length; i++) {
                        var inputdata = data.ActiveTrade[i];
                        if (inputdata.Status.toUpperCase() != "COMPLETE") {
                            TotalPending += 1;
                            SetPendingData(inputdata, "tblPendingBody");
                        }
                        if (inputdata.Status.toUpperCase() == "COMPLETE") {
                            TotalCompleted += 1;
                            SetCompletedData(inputdata, "tblcompleteBody");
                        }
                    }
                    $('#PendingCount').html(TotalPending);
                    $('#CompletedCount').html(TotalCompleted);
                    if (CurrentActiveTradeID > 0) {
                        EditTrade(CurrentActiveTradeID);
                    }
                }
                var Executetable = document.getElementById("tblPendingBody");
                for (var i = 0; i < Executetable.rows.length; i++) {
                    if ($(Executetable.rows[i].cells[5]).text() == 'BUY') {
                        $(Executetable.rows[i].cells[5]).css("color", "dodgerblue");

                    }
                    else if ($(Executetable.rows[i].cells[5]).text() == 'SELL') {
                        $(Executetable.rows[i].cells[5]).css("color", "#f1a2a2");

                    }
                }
                var Completedtable = document.getElementById("tblcompleteBody");
                for (var i = 0; i < Completedtable.rows.length; i++) {
                    if ($(Completedtable.rows[i].cells[5]).text() == 'BUY') {
                        $(Completedtable.rows[i].cells[5]).css("color", "dodgerblue");

                    }
                    else if ($(Completedtable.rows[i].cells[5]).text() == 'SELL') {
                        $(Completedtable.rows[i].cells[5]).css("color", "#f1a2a2");

                    }
                }
            }
        }
    });
}
function SetPendingData(item, TableName) {
    var user = "";
    if (item.UserRoleID == 1)
        user = "Administrator";
    if (item.UserRoleID == 2)
        user = "User";
    if (item.UserRoleID == 3)
        user = "Broker";
    if (item.UserRoleID == 4)
        user = "SuperAdministrator";
    if (item.UserRoleID == 5)
        user = "Support";
    if (item.UserRoleID == 6)
        user = "Fund Manager";
    if (item.UserRoleID == 7)
        user = "Sub Broker";

    var symbolParam = '\'' + item.TradeSymbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var productType = '\'' + item.ProductType + '\'';
    var priceType = '\'' + item.PriceType + '\'';
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
    var buyorsell = item.CurrentPositionNew == "BUY" ? 1 : 0;

    var sQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
    }
    else {
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    var deleteTrade = '<a href="#" style="color:red;font-weight:bold;font-size:25px;padding-left:30px;" onclick="DeleteActiveTrade(' + item.ActiveTradeID + ',' + item.UserID + ',0)">x</a>';

    var HighPrice = "<span style='display:inline-flex;font-size:12px;'>H : " + item.high + "</span><br /> ";
    var LowPrice = "<span style='display:inline-flex;font-size:12px;'>L : " + item.low + "</span><br /> ";
    var BidPrice = "<span style='display:inline-flex;font-size:12px;'>BR : " + item.ObjScriptDTO.Bid + "</span><br /> ";
    var AskPrice = "<span style='display:inline-flex;font-size:12px;'>AR : " + item.ObjScriptDTO.Ask + "</span><br /> ";
    var LastPrice = "<span style='display:inline-flex;font-size:12px;font-weight:bold;'>LTP : " + item.ObjScriptDTO.LastPrice + "</span><br /> ";
    var InputOrderPrice = '<input type="text" id="InputPrice' + item.ActiveTradeID + '" value="' + item.OrderPrice + '" /><br />';
    var InputQTY = '<input type="text" id="InputQTY' + item.ActiveTradeID + '" value="' + sQty + '" /><br />';
    var ModificationSection = '<a class="fa fa-edit" id="EDIT' + item.ActiveTradeID + '" onclick="EditTrade(' + item.ActiveTradeID + ')" ></a>' + '<a style="display:none;" class="fa fa-save" id="UPDATE' + item.ActiveTradeID + '" onclick="UpdateTrade(' + item.ActiveTradeID + ',' + item.WID + ',' + item.ScriptCode + ',' + pos + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + sQty + ',' + item.OrderPrice + ',' + productType + ',' + priceType + ',' + st + ')" ></a>' + '<a style="display:none;" class="fa fa-close" id="CANCEL' + item.ActiveTradeID + '" onclick="CancelTrade(' + item.ActiveTradeID + ')" ></a>';
    var ExecutionSection = '<a class="fa fa-play" id="EXECUTE' + item.ActiveTradeID + '" onclick="ExecuteOrder(' + item.ActiveTradeID + ',' + item.WID + ',' + item.ScriptCode + ',' + pos + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + sQty + ',' + item.ObjScriptDTO.LastPrice + ',' + productType + ',' + priceType + ',' + st + ')" ></a>';

    var OrderPrice = "<div Id='divOrderPrice" + item.ActiveTradeID + "'>" + item.OrderPrice + "</div>";
    var LtpDiv = '<br /><div style="display:none;" id="LtpDiv' + item.ActiveTradeID + '">' + InputOrderPrice + LastPrice + AskPrice + BidPrice + HighPrice + LowPrice + "</div>";

    var status = item.Status.toUpperCase == "OPEN" ? ExecutionSection : "<div style='color:transparent'>_</div>";
    var Modif = item.Status.toUpperCase == "OPEN" ? ModificationSection : "<div style='color:transparent'>_</div>";
    var Htmp = "<tr>" +
        '<td data-title="Execute">' + status + '</td>' +
        '<td data-title="O.Time">' + item.OrderTime + '</td>' +
        '<td data-title="Segment">' + item.ObjScriptDTO.ScriptExchange + '</td>' +
        '<td data-title="Client">' + item.UserName + '</td>' +
        '<td data-title="Symbol">' + item.TradeSymbol + '</td>' +
        '<td data-title="Buy/Sell">' + item.CurrentPosition + '</td>' +
        '<td data-title="Order_Type">' + item.CurrentPosition + "LIMIT" + '</td>' +
        '<td data-title="Lott">' + '<div id="HTMLQTY' + item.ActiveTradeID + '">' + sQty + '</div>' + '<div style="display:none;" id="DIVQTY' + item.ActiveTradeID + '">' + InputQTY + '</div>' + '</td>' +
        '<td data-title="Qty">' + item.Qty + '</td>' +
        '<td data-title="Order_Price">' + OrderPrice + LtpDiv + '</td>' +
        '<td data-title="Status">' + item.Status + '</td>' +
        '<td data-title="User">' + user + '</td>' +
        '<td data-title="User Ip">' + item.UserIP + '</td>' +
        '<td data-title="Modify">' + Modif + '</td>' +
        '<td data-title="Cancel">' + deleteTrade + '</td>' +
        '</tr>';
    $('#' + TableName).append(Htmp);
}
function EditTrade(ActiveTradeID = 0) {
    $('#EDIT' + ActiveTradeID).css('display', 'none');
    $('#divOrderPrice' + ActiveTradeID).css('display', 'none');
    $('#HTMLQTY' + ActiveTradeID).css('display', 'none');
    $('#LtpDiv' + ActiveTradeID).css('display', 'initial');
    $('#DIVQTY' + ActiveTradeID).css('display', 'initial');
    $('#UPDATE' + ActiveTradeID).css('display', 'initial');
    $('#CANCEL' + ActiveTradeID).css('display', 'initial');
    CurrentActiveTradeID = ActiveTradeID;
    window.clearInterval(ActiveTradeInterval);

}
function ExecuteOrder(ActiveTradeID, intWID, ScriptCode, CurrentPosition, triggerPrice, stopLoss, target, quantity, price, productType, marketType, st) {
    var result = window.confirm('Are you sure you want to execute this order?');
    if (result) {
        $('#EDIT' + ActiveTradeID).css('display', 'initial');
        $('#UPDATE' + ActiveTradeID).css('display', 'none');
        $('#CANCEL' + ActiveTradeID).css('display', 'none');
        CurrentActiveTradeID = 0;
        if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
            var request = $.ajax({
                url: "/Trade/ProceedBuySell",
                type: "POST",
                data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, Price: price, TriggerPrice: triggerPrice, ProductType: productType, MarketType: marketType, TradeID: ActiveTradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: 0, TRADING_UNIT: 1 },
                dataType: 'json',
                async: true,
                success: function (data) {
                    var results = JSON.parse(data);

                    if (results.IsError) {
                        toastr.error(results.TypeName);
                        return false;
                    }
                    else {
                        if (tradeID != '0') {
                            toastr.success('Order Updated successfully');
                        }
                        else {
                            toastr.success('Order Placed successfully');
                        }
                        return false;
                    }

                }
            });
        }



        ActiveTradeInterval = window.setInterval(function () { GetPendingData(); }, 1000);
    }
}
function UpdateTrade(ActiveTradeID, intWID, ScriptCode, CurrentPosition, triggerPrice, stopLoss, target, quantity, price, productType, marketType, st) {
    var result = window.confirm('Are you sure you want to update this order?');
    if (result) {
        CurrentActiveTradeID = 0;
        price = $('#InputPrice' + ActiveTradeID).val();
        quantity = $('#InputQTY' + ActiveTradeID).val();
        if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
            var request = $.ajax({
                url: "/Trade/ProceedBuySell",
                type: "POST",
                data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, Price: price, TriggerPrice: triggerPrice, ProductType: productType, MarketType: marketType, TradeID: ActiveTradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: 0, TRADING_UNIT: 1 },
                dataType: 'json',
                async: true,
                success: function (data) {
                    var results = JSON.parse(data);

                    if (results.IsError) {
                        toastr.error(results.TypeName);
                        return false;
                    }
                    else {
                        if (ActiveTradeID != '0') {
                            toastr.success('Order Updated successfully');
                        }
                        else {
                            toastr.success('Order Placed successfully');
                        }
                        return false;
                    }

                }
            });
        }

        ActiveTradeInterval = window.setInterval(function () { GetPendingData(); }, 1000);
    }
}
function CancelTrade(ActiveTradeID) {
    CurrentActiveTradeID = 0;
    ActiveTradeInterval = window.setInterval(function () { GetPendingData(); }, 1000);
}
function SetCompletedData(item, TableName) {
    var user = "";
    if (item.UserRoleID == 1)
        user = "Administrator";
    if (item.UserRoleID == 2)
        user = "User";
    if (item.UserRoleID == 3)
        user = "Broker";
    if (item.UserRoleID == 4)
        user = "SuperAdministrator";
    if (item.UserRoleID == 5)
        user = "Support";
    if (item.UserRoleID == 6)
        user = "Fund Manager";
    if (item.UserRoleID == 7)
        user = "Sub Broker";

    userip = item.UserIP.length > 0 ? item.UserIP : '<div style="color:transparent">_</div>';
    var Htmp = '<tr>' +
        '<td data-title="O.Time">' + item.OrderTime + '</td>' +
        '<td data-title="T.Time">' + item.TradeExecutedOn + '</td>' +
        '<td data-title="Segment">' + item.ObjScriptDTO.ScriptExchange + '</td>' +
        '<td data-title="Client">' + item.UserName + '</td>' +
        '<td data-title="Symbol">' + item.TradeSymbol + '</td>' +
        '<td data-title="Buy/Sell">' + item.CurrentPosition + '</td>' +
        '<td data-title="Order_Type">' + item.CurrentPosition + "LIMIT" + '</td>' +
        '<td data-title="Lott">' + item.ObjScriptDTO.ScriptLotSize + '</td>' +
        '<td data-title="Qty">' + item.Qty + '</td>' +
        '<td data-title="Trade Price">' + item.OrderPrice + '</td>' +
        '<td data-title="User">' + user + '</td>' +
        '<td data-title="User Ip">' + userip + '</td>' +
        '</tr>';
    $('#' + TableName).append(Htmp);
}
function DeleteActiveTrade(TransactionId, UserID, IsAdminWise) {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        var request = $.ajax({
            url: "/Trade/DeleteActiveTrade?ID=" + TransactionId + "&userid=" + UserID + "&IsAdminWise=" + IsAdminWise,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    toastr.success(data);
                }
            }
        });
    }
}
function DeleteAllOpenTrades() {
    var UserID = $('#UserId').val();
    var IsAdminWise = 1;
    var TransactionId = 0;
    var result = confirm("Are you sure you want to delete all open trades?");
    if (result) {
        var request = $.ajax({
            url: "/Trade/DeleteActiveTrade?ID=" + TransactionId + "&userid=" + UserID + "&IsAdminWise=" + IsAdminWise,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    toastr.success(data);
                }
            }
        });
    }
}
