var myInterval;
var myInterval2;
var _WatchlistCurrentTabIndex = 0;
var _WatchListLength = 0;
var Completedpageno = 0;
var LastPriceDictionary = [];
var BtnIds = [];
var _WatchlistTotalPageNo = 0;
var _WatchlistCurrentPageNo = 1;
var _WatchlistPreviousTotalPageNo = 0;
var _isWatchlistCallBack = false;

var _CompletedTotalPageNo = 0;
var _CompletedPreviousTotalPageNo = 0;
var _CompletedCurrentPageNo = 1;
var _CompletedCallBack = false;

var _ActiveTotalPageNo = 0;
var _ActivePreviousTotalPageNo = 0;
var _ActiveCurrentPageNo = 1;
var _ActiveCallBack = false;
var LevelLoginUser = 0;
var Current_Loop_Valueof_Watchlist = 0;

var allowedTradingUnit;
var companyInitials;
var convertMisToCncModal = $("#convertMisToCncModal");

function ConvertMISToCNC() {
    var id = $(convertMisToCncModal).find("input[name=convertActiveTradeId]").val();
    var st = $(convertMisToCncModal).find("input[name=convertStatus]").val();
    var param = $(convertMisToCncModal).find("input[name=convertParam]").val();
    var intQty = $(convertMisToCncModal).find("input[name=hdQty]").val();
    var request = $.ajax({
        url: "/Trade/ConvertMisToCnc",
        type: "POST",
        data: { ID: id, actionParam: param, status: st, qty: intQty },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
          
            toastr.success(results.exceptionDTO.Msg);
            return false;
        }
    });
    $('#btnconvertMisToCnc').removeAttr('disabled');
    $(convertMisToCncModal).modal('hide');
}

function convertButton(id, param, st, qty, isManualStaratgy) {
    //$(convertMisToCncModal).find(".convertMsg").text('Are you sure to convert MIS to CNC?');
    $(convertMisToCncModal).find("input[name=convertQty]").val(qty);
    $(convertMisToCncModal).find("input[name=hdQty]").val(qty);
    $(convertMisToCncModal).find("input[name=convertActiveTradeId]").val(id);
    $(convertMisToCncModal).find("input[name=convertStatus]").val(st);
    $(convertMisToCncModal).find("input[name=convertParam]").val(param);
    if (isManualStaratgy)
        $(convertMisToCncModal).modal('show');
    else if (confirm("Are you sure to square off?"))
        ConvertMISToCNC();
}

// Control Using Keyboard -- Starting
$(document).keydown(function (event) {
    if (event.keyCode == 9) {
        if (!$("#buySellModel").hasClass('in') && !$("#MarketDepthModal").hasClass('in')) {
            $('td').removeClass('hover');
            if (_WatchlistCurrentTabIndex < _WatchListLength) {
                _WatchlistCurrentTabIndex = _WatchlistCurrentTabIndex + 1;
                $('#tblWatchListTradeListBody > tr:nth-child(' + _WatchlistCurrentTabIndex + ') > td:nth-child(1)').addClass('hover');
            }
            else {
                _WatchlistCurrentTabIndex = 1;
                $('#tblWatchListTradeListBody > tr:nth-child(' + _WatchlistCurrentTabIndex + ') > td:nth-child(1)').addClass('hover');
            }
        }
    }
    else if (event.keyCode == 40) {
        if (!$("#buySellModel").hasClass('in') && !$("#MarketDepthModal").hasClass('in')) {
            $('td').removeClass('hover');
            event.preventDefault();
            if (_WatchlistCurrentTabIndex < _WatchListLength) {
                _WatchlistCurrentTabIndex = _WatchlistCurrentTabIndex + 1;
                $('#tblWatchListTradeListBody > tr:nth-child(' + _WatchlistCurrentTabIndex + ') > td:nth-child(1)').addClass('hover');
            }
            else {
                _WatchlistCurrentTabIndex = 1;
                $('#tblWatchListTradeListBody > tr:nth-child(' + _WatchlistCurrentTabIndex + ') > td:nth-child(1)').addClass('hover');
            }
        }
    }
    else if (event.keyCode == 38) {
        if (!$("#buySellModel").hasClass('in') && !$("#MarketDepthModal").hasClass('in')) {
            event.preventDefault();
            if (_WatchlistCurrentTabIndex > 1) {
                $('td').removeClass('hover');
                _WatchlistCurrentTabIndex = _WatchlistCurrentTabIndex - 1;
                $('#tblWatchListTradeListBody > tr:nth-child(' + _WatchlistCurrentTabIndex + ') > td:nth-child(1)').addClass('hover');
            }
            else {
                $('td').removeClass('hover');
                _WatchlistCurrentTabIndex = _WatchListLength;
                $('#tblWatchListTradeListBody > tr:nth-child(' + _WatchlistCurrentTabIndex + ') > td:nth-child(1)').addClass('hover');
            }
        }
        else if (!$("#Price").is(":focus") && !$("#txtStopLoss").is(":focus") && !$("#txtTarget").is(":focus") && document.getElementById('rbtnLimit').checked) {
            event.preventDefault();
            $("#Price").focus();
        }
        else if (!$("#TriggerPrice").is(":focus") && !$("#txtTarget").is(":focus") && !$("#txtStopLoss").is(":focus") && (document.getElementById('rbtnSL').checked || document.getElementById('rbtnSLM').checked)) {
            event.preventDefault();
            $("#TriggerPrice").focus();
        }
    }
    else if (event.keyCode == 112) {
        event.preventDefault();
        if (_WatchlistCurrentTabIndex > 0) {
            var BtnId = BtnIds[_WatchlistCurrentTabIndex - 1].BuyBtnId;
            $("#" + BtnId + "").trigger('click');
            $("#MarketDepthModal").modal('hide');
            $("#CompletedTradeModal").modal('hide');

        }
    }
    else if (event.keyCode == 113) {
        event.preventDefault();
        if (_WatchlistCurrentTabIndex > 0) {
            var BtnId = BtnIds[_WatchlistCurrentTabIndex - 1].SellBtnId;
            $("#" + BtnId + "").trigger('click');
            $("#MarketDepthModal").modal('hide');
            $("#CompletedTradeModal").modal('hide');
        }
    }
    else if (event.keyCode == 46) {
        if (_WatchlistCurrentTabIndex > 0) {
            event.preventDefault();
            var BtnId = BtnIds[_WatchlistCurrentTabIndex - 1].DeleteBtnId;
            $("#" + BtnId + "").trigger('click');
        }
    }
    else if (event.keyCode == 114) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $('#tblActiveTradeList').offset().top
        }, 2000);
    }
    else if (event.keyCode == 115) {
        event.preventDefault();
        $("#btnMoreInfoCompletedTrade2").trigger('click');
        $("#buySellModel").modal('hide');
        $("#MarketDepthModal").modal('hide');

    }
    else if (event.keyCode == 116) {
        event.preventDefault();
        if (_WatchlistCurrentTabIndex > 0) {
            var BtnId = BtnIds[_WatchlistCurrentTabIndex - 1].MarketDepthBtnId;
            $("#" + BtnId + "").trigger('click');
            $("#buySellModel").modal('hide');
            $("#CompletedTradeModal").modal('hide');
        }
    }
    else if (event.keyCode == 27) {
        event.preventDefault();
        $("#buySellModel").modal('hide');
        $("#CompletedTradeModal").modal('hide');
        $("#MarketDepthModal").modal('hide');
    }
});
// Control Using Keyboard -- Ending

$(document).ready(function () {
    companyInitials = $("#CompanyInitial").val();
    LevelLoginUser = $('#LevelLoginUser').text();
    SetTradeData();

    $('#tblActiveTradeList').DataTable({
        "paging": false,
        "lengthChange": false,
        "info": false,
        responsive: true
    });
    ///  
    $('#tblCompletedTradeList').DataTable({
        "paging": false,
        "lengthChange": false,
        "order": [[5, 0, "desc"]],
        "info": false
    });
    //
    $('#tblWatchListTradeList').DataTable({
        "paging": false,
        "lengthChange": false,
        "processing": true,
        "ordering": false,
        responsive: true
    });
    $('.select2').select2();


    myInterval2 = setInterval(function () { SetWalletBalance(); }, 1000);


    $('input[name=MarketType]').on('click', function (ele) {
        var value = $(ele.currentTarget).val();
        var priceval = $('#hdnPrice').val();
        var Triggerval = $('#hdnPrice').val();;
        $('#txtTarget').removeAttr('disabled');
        $('#txtTarget').removeAttr('readonly');
        $('#txtStopLoss').removeAttr('disabled');
        $('#txtStopLoss').removeAttr('readonly');
        if (value == 'LIMIT') {
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').val(priceval);
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
        }
        else if (value == 'SL') {
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').val(priceval);
            $('#buySellModel #TriggerPrice').val(Triggerval);
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
        }
        else if (value == 'SL-M') {
            $('#buySellModel #TriggerPrice').removeAttr('disabled');
            $('#buySellModel #TriggerPrice').removeAttr('readonly');
            $('#buySellModel #TriggerPrice').val(Triggerval);
            $('#buySellModel #Price').val('0');
            $('#buySellModel #Price').attr('disabled', 'disabled');
            $('#txtTarget').attr('disabled', 'disabled');
            $('#txtTarget').attr('readonly', 'readonly');
            $('#txtStopLoss').attr('disabled', 'disabled');
            $('#txtStopLoss').attr('readonly', 'readonly');
        }
        else if (value == 'MARKET') {
            $('#buySellModel #Price').val('0');
            $('#buySellModel #Price').attr('disabled', 'disabled');
            $('#buySellModel #Price').attr('readonly', 'readonly');
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
            $('#buySellModel #TriggerPrice').attr('readonly', 'readonly');
        }
    });
});
function DeleteActiveTrade(TransactionId, UserID) {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        var request = $.ajax({
            url: "/Trade/DeleteActiveTrade?ID=" + TransactionId + "&userid=" + UserID,
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
function SetActiveTradeDetails(item) {
    var btnName = 'btn';
    var deleteTradeBtn = "";
    var roleid = $("#Role_Id").val();
    if (roleid == 4 || roleid == 5) {
        if (item.Status != "CANCELED" && item.Status != "REJECTED") {
            deleteTradeBtn = '<button class="btn btn-primary btn-sm btn-sell" href="javascript:void(0)" onclick="DeleteActiveTrade(' + item.ActiveTradeID + ',' + item.UserID + ')" data-bind=' + item.ActiveTradeID + ' style="margin-left:5px;" ><i class="fa fa-trash-o"></i> </button> ';
        }
    }
    else {
        deleteTradeBtn = "";
    }
    var sQty;
    var tradingUnit;
    var convertButton = "";
    var symbolParam = '\'' + item.TradeSymbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var productType = '\'' + item.ProductType + '\'';
    var priceType = '\'' + item.PriceType + '\'';
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
    var buyButton = "";
    var sellButton = "";
    var action = "'EDIT'";
    var isManualStaratgy = false;
    if (item.StrategyName == "Manual")
        isManualStaratgy = true;
    var RoleId = $("#Role_Id").val();

    var currentPosition = item.CurrentPosition;
    var buyorsell = 2;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ObjScriptDTO.ScriptLotSize;
        tradingUnit = item.TRADING_UNIT;
    }
    else {
        tradingUnit = item.TRADING_UNIT;
        if (item.ObjScriptDTO.ScriptLotSize > 10 && item.ObjScriptDTO.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ObjScriptDTO.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    var editButton = "";
    var syncButton = "";
    var addbutton = "";

    if (item.Status.toUpperCase() != "REJECTED") {
        if (item.CurrentPositionNew == "BUY")
            buyorsell = 1;
        editButton = ' <button class="btn btn-primary btn-sm" onclick="buySellPopUp(' + item.BuyQtyWiseOrLot + ',' + item.ScriptCode + ',' + buyorsell + ',' + symbolParam + ',' + item.WID + ',' + item.OrderPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + sQty + ',' + item.ObjScriptDTO.ScriptLotSize + ',' + item.high + ',' + item.low + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + priceType + ',' + productType + ',' + item.ActiveTradeID + ',' + st + ',' + item.isLive + ',' + action + ',' + item.TRADING_UNIT_TYPE + ')" type="button" style="margin-left:5px;" ><i class="fa fa-pencil"></i></button> ';
        //if (item.OrderID > 0 && item.OrderSync == 0 && item.Status.toUpperCase() != "COMPLETE")
        //    syncButton = ' &nbsp <button class="btn btn-primary btn-sm" type="button" onclick="CallSync(' + item.ActiveTradeID + ')"><i class="fa fa-refresh"></i></button>';
        buyButton = ' <button class="btn btn-primary btn-sm" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button" style="margin-left:5px;">Sqr Off</button> ';
        sellButton = ' <button class="btn btn-danger btn-sm btn-sell" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button" style="margin-left:5px;">Sqr Off</button> ';
        if (item.Status.toUpperCase() != "OPEN" && isManualStaratgy)
            addbutton = '<button class="btn btn-primary btn-sm btn-sell" onclick="AddQty(' + item.ActiveTradeID + ',' + pos + ',' + st + ')" type="button" style="margin-left:5px;"><i class="fa fa-plus"></i></button>';
        if (item.ProductType == "MIS")
            convertButton = ' <button title="Convert MIS to CNC" class="btn btn-primary btn-sm" onclick="convertButton(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button" style="margin-left:5px;"><i class="fa fa-exchange"></i></button> ';

    }
    if (item.CurrentPositionNew == "BUY") {
        //currentPosition = currentPosition + " " + sellButton;
        currentPosition = sellButton;

    }
    else if (item.CurrentPositionNew == "SELL") {
        //currentPosition = currentPosition + " " + buyButton;
        currentPosition = buyButton;
    }
    var RejectedOrderDeleteBtn = '';
    if (item.Status.toUpperCase() == "REJECTED") {
        RejectedOrderDeleteBtn = '<button onclick = "DeleteRejectedTrade(' + item.ActiveTradeID + ')" type = "button" class="btn btn-warning btn-sm btn-delete" style="margin-left:5px;" > <i class="fa fa-trash-o"></i></button >';
    }
    if (companyInitials == "KT") {
        addbutton = "";
    }

    var actionButton = editButton + syncButton + addbutton + RejectedOrderDeleteBtn + deleteTradeBtn + convertButton;
    buttons: [
        'copy', 'excel', 'pdf'
    ];
    if (parseInt(RoleId) == 2 && item.IsCopyTradeFlag == true) {
        actionButton = "-";
        currentPosition = "-";
    }
    if (item.ScriptType == "FOREX" && $("#CompanyInitial").val() == "RT") {
        item.OrderPrice = (item.OrderPrice).toFixed(5);
        item.TriggerPrice = (item.TriggerPrice).toFixed(5);
        item.ObjScriptDTO.LastPrice = (item.ObjScriptDTO.LastPrice).toFixed(5);
        item.ProfitOrLoss = (item.ProfitOrLoss).toFixed(5);
        item.SL = (item.SL).toFixed(5);
        item.TGT2 = (item.TGT2).toFixed(5);
    }
    var CompletedOrOpenStatus = item.Status;
    var TableNameForActive = '';
        TableNameForActive = '#tblActiveTradeList';
    var UnitWise = "";
    if (item.BuyQtyWiseOrLot == 0) {
        UnitWise = ' ';
    }
    else {
        UnitWise = ' Unit';
    }
    var TriggerPrice = parseFloat(item.TriggerPrice);
    $(TableNameForActive).DataTable().row.add([
        currentPosition,
        actionButton,
        item.TradeSymbol,
        sQty,
        tradingUnit,
        item.Email,
        item.CurrentPositionNew,

        item.OrderPrice,
        TriggerPrice,
        item.ObjScriptDTO.LastPrice,
        //item.SLDiff,

        item.ProfitOrLoss,
        item.Status,
        //item.SLTrailing,
        item.SL,
        item.TGT2,
        item.TGT3,
        item.TGT4,
        item.OrderDate,
        item.OrderTime,
        item.ProductType,
        item.IsLive,
        item.StrategyName,

        item.WatchListName,
        item.PublishName,
        item.FundManagerName,

    ]).draw();


    if (CompletedOrOpenStatus == 'COMPLETE')
        var table = document.getElementById("tblActiveTradeBody");
    else
        var table = document.getElementById("tblOpenTradeBody");

    for (var i = 0; i < table.rows.length; i++) {
        var orderPrice = parseFloat($(table.rows[i].cells[5]).text());
        var currentPosition = $(table.rows[i].cells[0]).text();
        var tgt = parseFloat($(table.rows[i].cells[11]).text());
        var tgt2 = parseFloat($(table.rows[i].cells[12]).text());
        var P_L = parseFloat($(table.rows[i].cells[10]).text());

        if ($(table.rows[i].cells[0]).text() == item.TradeSymbol) {

            if (item.ExpireDays == 0) {
                $(table.rows[i].cells[0]).append('<br /><span style="font-size:10px;color:red;"><b>(Expired)</b></span>');
            }
            else if (item.ExpireDays != 4) {
                $(table.rows[i].cells[0]).append('<br /><span style="font-size:10px;color:red;"><b>(Expires ' + item.ExpireDays + ' days)</b></span>');
            }
        }
        if ((orderPrice >= tgt && tgt > 0 && currentPosition == "BUY") || (orderPrice <= tgt && tgt > 0 && currentPosition == "SELL")) {
            $(table.rows[i].cells[8]).css("background-color", "#14a964");
            $(table.rows[i].cells[8]).css("color", "white");
        }
        if ((orderPrice >= tgt2 && tgt2 > 0 && currentPosition == "BUY") || (orderPrice <= tgt2 && tgt2 > 0 && currentPosition == "SELL")) {
            $(table.rows[i].cells[9]).css("background-color", "#14a964");
            $(table.rows[i].cells[9]).css("color", "white");
        }
        if (P_L >= 0) {
            $(table.rows[i].cells[10]).css("background-color", "green");
            $(table.rows[i].cells[10]).css("color", "white");
        }
        else {
            $(table.rows[i].cells[10]).css("background-color", "red");
            $(table.rows[i].cells[10]).css("color", "white");
        }
    }



}
function SetCompletedTradeDetails(item) {
    if (item.Status == "TGT2")
        item.Status = "TARGET";
    else if (item.Status == "TGT3")
        item.Status = "TARGET2";
    else if (item.Status == "TGT4")
        item.Status = "TARGET3";

    else if (item.Status == "SL")
        item.Status = "STOPLOSS";

    var btnName = 'btn';
    var editButton = ' <a class="btn btn-primary btn-sm" href="/Trade/ManageTrade/ ' + item.CompletedTradeID + ' "><i class="fa fa-pencil"></i></a> ';
    var deleteButton = ' <a href="javascript:void(0)" id="' + item.CompletedTradeID + '" data-tradeId="' + item.CompletedTradeID + '" class="delete-prompt"><button type="button" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button></a> ';
    var actionButton = editButton + deleteButton;

    var sQty = item.Qty;
    //if (item.ScriptLotSize > 1 && item.ScriptExchange != 'NFO')
    sQty = item.Qty / item.ScriptLotSize;

    if (item.BuyQtyWiseOrLot == 1 && item.ScriptExchange == "NFO") {
        var sQty = item.Qty;
    }

    buttons: [
        'copy', 'excel', 'pdf'
    ];
    if (item.ScriptType == "FOREX" && $("#CompanyInitial").val() == "RT") {
        item.EntryPrice = (item.EntryPrice).toFixed(5);
        item.ExitPrice = (item.ExitPrice).toFixed(5);
        item.ObjScriptDTO.LastPrice = (item.ObjScriptDTO.LastPrice).toFixed(5);
        item.ProfitOrLoss = (item.ProfitOrLoss).toFixed(5);
        item.NetProfitOrLoss = (item.NetProfitOrLoss).toFixed(5);
    }
    var comptable = $('#tblCompletedTradeList').DataTable().row.add([
        item.CompletedTradeID,
        item.TradeSymbol,
        sQty,
        item.CurrentPosition,
        item.EntryTime,
        item.EntryPrice,
        item.ExitTime,
        item.ExitPrice,
        item.ProfitOrLoss,
        item.Brokerage,
        item.NetProfitOrLoss,
        item.Status,
        item.ProductType,
        item.isLive,
        item.StrategyName,
        item.WatchListName,
        item.PublishName,
        item.FundManagerName

        //actionButton
    ]).order([0, 'desc']).draw();
    //$("#tblCompletedTradeList").on('page.dt', function () {
    //    var info = comptable.page.info();
    //    Completedpageno = info.page;
    //});
    //comptable.page(Completedpageno).draw('page');

    var ctable = document.getElementById("tblCompletedTradeList");
    for (var i = 0; i < ctable.rows.length; i++) {
        var status = $(ctable.rows[i].cells[11]).text();
        if (status == "TARGET" || status == "TARGET2" || status == "TARGET3") {
            $(ctable.rows[i].cells[11]).css("background-color", "#14a964");
            $(ctable.rows[i].cells[11]).css("color", "white");
        }
        if (status == "STOPLOSS") {
            $(ctable.rows[i].cells[11]).css("background-color", "#d83824");
            $(ctable.rows[i].cells[11]).css("color", "white");
        }
    }


}

function SetWatchTradeDetails(item) {

    var PreviousLastPrice = 0.0;
    var PreviousBidPrice = 0.0;
    var PreviousAskPrice = 0.0;
    var LastColor = "";
    for (var keys in LastPriceDictionary) {
        if (LastPriceDictionary[keys].key == item.ScriptCode) {
            PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
            PreviousBidPrice = parseFloat(LastPriceDictionary[keys].Bid);
            PreviousAskPrice = parseFloat(LastPriceDictionary[keys].Ask);
            LastColor = LastPriceDictionary[keys].color;
            break;
        }
    }
    if (item.ScriptType == "FOREX" && $("#CompanyInitial").val() == "RT") {
        item.LastPrice = (item.LastPrice).toFixed(5);
        item.Bid = (item.Bid).toFixed(5);
        item.Ask = (item.Ask).toFixed(5);
    }
    var LastPriceHtml = "";
    if (parseFloat(item.LastPrice) > PreviousLastPrice) {
        LastPriceHtml = '<span class="lp">' + item.LastPrice + '</span>';
        LastColor = 'green';
    }
    if (parseFloat(item.LastPrice) < PreviousLastPrice) {
        LastPriceHtml = '<span class="lp">' + item.LastPrice + '</span>';
        LastColor = 'red';
    }
    if (item.LastPrice == PreviousLastPrice) {
        LastPriceHtml = '<span class="lp">' + item.LastPrice + '</span>';
    }

    var LastBidHtml = "";
    if (parseFloat(item.Bid) > PreviousBidPrice) {
        LastBidHtml = '<span class="green">' + item.Bid + '</span>';
    }
    if (parseFloat(item.Bid) < PreviousBidPrice) {
        LastBidHtml = '<span class="red">' + item.Bid + '</span>';
    }
    if (item.Bid == PreviousBidPrice) {
        LastBidHtml = '<span class="green">' + item.Bid + '</span>';
    }

    var LastAskHtml = "";
    if (parseFloat(item.Ask) > PreviousAskPrice) {
        LastAskHtml = '<span class="green">' + item.Ask + '</span>';
    }
    if (parseFloat(item.Ask) < PreviousAskPrice) {
        LastAskHtml = '<span class="red">' + item.Ask + '</span>';
    }
    if (item.Ask == PreviousAskPrice) {
        LastAskHtml = '<span class="green">' + item.Ask + '</span>';
    }

    var btnName = 'btn';
    var symbolParam = item.ScriptName.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var script_Trading_Symbol = item.ScriptTradingSymbol.replace(/'/g, "");
    script_Trading_Symbol = '\'' + script_Trading_Symbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ScriptExchange.toString() + '\'';

    var PerChange = "";
    var perCentageHtml = "";
    var perCentage = "";
    if (item.ScriptType == "FOREX") {
        perCentageHtml = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp 0.00000 %</i>';
    }
    else if (item.ScriptType != "BINANCE") {
        if ($("#rdPercentage").prop('checked') == true) {
            PerChange = parseFloat(item.LastPrice) - parseFloat(item.close);
            if (PerChange < 0) {
                perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
                perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + perCentage.toFixed(5) + '&nbsp%</i>';
            }
            else if (PerChange >= 0) {
                perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
                perCentageHtml = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + perCentage.toFixed(5) + '&nbsp%</i>';
            }
        }
        else if ($("#rdAbsolute").prop('checked') == true) {
            PerChange = parseFloat(item.LastPrice) - parseFloat(item.close);
            if (PerChange < 0) {
                perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + PerChange.toFixed(5) + '</i>';
            }
            else if (PerChange >= 0) {
                perCentageHtml = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + PerChange.toFixed(5) + '</i>';
            }
        }
    }
    else if (item.ScriptType == "BINANCE") {
        if ($("#rdPercentage").prop('checked') == true) {

            if (item.PerChange < 0) {
                perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + item.PerChange.toFixed(5) + '&nbsp%</i>';
            }
            else if (item.PerChange >= 0) {
                perCentageHtml = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + item.PerChange.toFixed(5) + '&nbsp%</i>';
            }
        }
        else if ($("#rdAbsolute").prop('checked') == true) {
            if (item.ChangeInRupee < 0) {
                perCentageHtml = '<i style="color:red;font-weight:bold;" class="fa fa-angle-down">&nbsp&nbsp&nbsp' + item.ChangeInRupee.toFixed(2) + '</i>';
            }
            else if (item.ChangeInRupee >= 0) {
                perCentageHtml = '<i style="color:green;font-weight:bold;" class="fa fa-angle-up">&nbsp&nbsp&nbsp' + item.ChangeInRupee.toFixed(2) + '</i>';
            }
        }
    }
    var qty = 1;
    //if (item.ScriptExchange == "NFO" && isLiveOrder != "False")
    //    qty = item.ScriptLotSize;

    var btnBuyid = "btnBuy" + item.ScriptCode;
    var btnSellid = "btnSell" + item.ScriptCode;
    var btnMarketDepth = "btnMarketDepth" + item.ScriptCode;
    //var editButton = ' <a class="btn btn-primary btn-sm" href="/Watchlist/AddWatchList/ID?=' + item.WID + '&Type=View"><i class="fa fa-pencil"></i></a> ';
    var deleteButton = ' <button id="btnName' + item.ScriptCode + '" onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ';
    var buyButton = '<br/><div tabindex="-1" class="b-btn"><button id="' + btnBuyid + '" onclick="buySellPopUp(0,' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + qty + ',' + item.ScriptLotSize + ',' + item.high + ',' + item.low + ',' + item.LastPrice + ')" type="button" class="btn btn-success btn-sm btn-buy"> B </button> ';
    var sellButton = '<button id="' + btnSellid + '" onclick="buySellPopUp(0,' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + qty + ',' + item.ScriptLotSize + ',' + item.high + ',' + item.low + ',' + item.LastPrice + ')" type="button" class="btn btn-danger btn-sm btn-sell"> S </button> ';
    var marketDepthButton = ' <button id=' + btnMarketDepth + ' class="btn btn-primary btn-sm btn-depth" onclick="MarketDepthPop(' + item.ScriptCode + ',' + script_Trading_Symbol + ')" type="button"><i class="fa fa-bars"></i></button> </div>';
    var hiddenCode = '<input name="hiddenCode" value="' + item.ScriptCode + '" type="hidden" >';
    var scriptType = '<input name="scriptType" value="' + item.ScriptType + '" type="hidden" >';
    var actionButton = buyButton + sellButton + deleteButton + marketDepthButton + hiddenCode + scriptType;

    var RoleId = $("#Role_Id").val();


    if (companyInitials == "RT" && RoleId == "2") {
        actionButton = hiddenCode + scriptType;
    }
    var ScriptExpiry = "";
    if (item.ScriptExpiry != "") {
        var date = item.ScriptExpiry.split(" ");
        ScriptExpiry = '<span style="color: red;font-size: 13px;">Expires On : ' + date[0] + '</span>';
    }
    //if (item.high == 0 || item.low == 0) {
    //    actionButton = "";
    //}
    if ($('#buySellModel #lblScriptCode').text() == item.ScriptCode.toString()) {
        var ltp = item.LastPrice.toString();
        $('#buySellModel #lblLastPrice').text(ltp);
        $('#buySellModel #lblLastBid').text(item.Bid);
        $('#buySellModel #lblLastAsk').text(item.Ask);
        $('#buySellModel #hdnPrice').val(ltp);
    }

    buttons: [
        'copy', 'excel', 'pdf'
    ];
    var finalTradingSymbol = "";
    if (item.ScriptType == "FOREX") {
        finalTradingSymbol = item.ScriptTradingSymbol + " / " + item.ScriptSegment;
    }
    else {
        finalTradingSymbol = item.ScriptTradingSymbol;
    }
    var wtable = $('#tblWatchListTradeList').DataTable().row.add([

        //actionButton,
        finalTradingSymbol + actionButton + ScriptExpiry,
        LastPriceHtml,
        perCentageHtml,
        item.BidQty,
        LastBidHtml,
        LastAskHtml,
        item.AskQty,
        item.open,
        item.high,
        item.low,
        item.close
    ]).draw();

    var Watchtable = document.getElementById("tblWatchListTradeList");
    if (LastColor == 'green') {
        $(Watchtable.rows[Current_Loop_Valueof_Watchlist + 1].cells[1]).css("background-color", "green");
    }
    else if (LastColor == 'red') {
        $(Watchtable.rows[Current_Loop_Valueof_Watchlist + 1].cells[1]).css("background-color", "red");
    }
    else {
        $(Watchtable.rows[Current_Loop_Valueof_Watchlist + 1].cells[1]).css("background-color", "red");
    }

    $("#tblWatchListTradeList").removeClass("collapsed");
    //Adding Class For UI/UX
    //$("#tblWatchListTradeListBody > tr > td:nth-child(8)").addClass('ttd');
    $("#tblWatchListTradeListBody > tr > td").addClass('padding-0px');


    var IsExistsLTP = false;
    for (var keys in LastPriceDictionary) {
        if (LastPriceDictionary[keys].key == item.ScriptCode) {
            IsExistsLTP = true;
            LastPriceDictionary[keys].value = item.LastPrice;
            LastPriceDictionary[keys].color = LastColor;
        }
    }
    if (!IsExistsLTP) {
        LastPriceDictionary.push({
            key: item.ScriptCode,
            value: item.LastPrice,
            color: LastColor,
            Bid: item.Bid,
            Ask: item.Ask

        });
    }

    var IsExists = false;
    for (var keys in BtnIds) {
        if (BtnIds[keys].BuyBtnId == btnBuyid) {
            IsExists = true;
        }
    }
    if (!IsExists) {
        BtnIds.push({
            BuyBtnId: btnBuyid,
            SellBtnId: btnSellid,
            DeleteBtnId: "btnName" + item.ScriptCode,
            MarketDepthBtnId: btnMarketDepth
        });
    }
}
var pageno = 0;
function removeScript(ScriptCode, intWID) {
    var result = confirm("Are you sure you want to delete?");
    if (result && ScriptCode > 0 && intWID > 0) {
        var request = $.ajax({
            url: "/Watchlist/DeleteScript",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {
                    toastr.error('Can Not Delete This Record.There Is One Active Trade.');
                    return false;
                }
                else {
                    var table = $('#tblList').DataTable();
                    table.row($("#btnName" + ScriptCode).parents('tr')).remove().draw(false);
                    toastr.success('Script Deleted Successfully.');
                    return false;
                }

            }
        });
    }
}
function SetWalletBalance() {
    var request = $.ajax({
        url: "/Admin/GetBalance",
        type: "GET",
        dataType: 'json',
        async: true,
        success: function (data) {
            $("#WalletBalance").text(data);

        }
    });
}

function SetTradeData() {
    try {
        var input = "";
        if ($('#rdAll').prop('checked') == true) {
            input = { 'tradetype': 0 };
        }
        else if ($('#rdLive').prop('checked') == true) {
            input = { 'tradetype': 1 };
        }
        else {
            input = { 'tradetype': 2 };
        }
        var request = $.ajax({
            url: "/Trade/GetDataManageTransaction",
            type: "GET",
            data: input,
            dataType: 'json',
            traditional: true,
            success: function (data) {
                SetResult(data);
                myInterval = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
            }
        });

    } catch (e) {
        toastr.error('Error On SetTradeData.');
    }
}

function SetTradeDataForRefresh() {
    try {
        var Wid = $("#watchlistHiddenId").val();
        var selectedScriptExchange = $("#cboScriptExchange option:selected").val();
        if ($('#UserIds option:selected').text() != '--Select--') {
            var userIdForTrade = $('#UserIds').val();
            var IsAdminOrBroker = '0';
        }
        if (LevelLoginUser == 1 || LevelLoginUser == 2) {
            if ($('#AdminIds option:selected').text() != '--Select--') {
                var userIdForTrade = $('#AdminIds').val();
                var IsAdminOrBroker = '1';
            }
        }
        if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3) {
            if ($('#BrokerIds option:selected').text() != '--Select--') {
                var userIdForTrade = $('#BrokerIds').val();
                var IsAdminOrBroker = '1';
            }
        }
        if (LevelLoginUser == 4) {
            if ($('#UserIds option:selected').text() != '--Select--') {
                var userIdForTrade = $('#UserIds').val();
                var IsAdminOrBroker = '1';
            }
        }

        var input = "";
        if ($('#rdAll').prop('checked') == true) {
            input = { 'tradetype': 0, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo, 'UserId': userIdForTrade, 'IsAdmin': IsAdminOrBroker };
        }
        else if ($('#rdLive').prop('checked') == true) {
            input = { 'tradetype': 1, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo, 'UserId': userIdForTrade, 'IsAdmin': IsAdminOrBroker };
        }
        else {
            input = { 'tradetype': 2, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo, 'UserId': userIdForTrade, 'IsAdmin': IsAdminOrBroker };
        }

        var request = $.ajax({
            url: "/Trade/GetDataManageTransaction",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,
            success: function (data) {
                SetResult(data);
            }
        });

    } catch (e) {
        toastr.error('Error On SetTradeData.');
    }
}

function SetResult(data) {
    var results = JSON.parse(data);

    if (results != null) {


        //#region Set data for Active trade
        if (results.ActiveTrade != null) {
            var _CheckActiveCurrentPage;

            var tblActiveTradeList = $('#tblActiveTradeList').DataTable();
            tblActiveTradeList.clear().draw();
            tblActiveTradeList.innerHTML = "";
            if (results.ActiveTrade.length > 0) {
                for (var i = 0; i < results.ActiveTrade.length; i++) {
                    var result = results.ActiveTrade[i];
                    _ActiveTotalPageNo = results.ActiveTrade[i].TOTAL_PAGE;
                    _CheckActiveCurrentPage = results.ActiveTrade[i].TOTAL_PAGE;
                    SetActiveTradeDetails(result);
                }
            }
            else {
                _ActiveTotalPageNo = 1;
                _CheckActiveCurrentPage = 0;
            }
            if (_ActivePreviousTotalPageNo != _CheckActiveCurrentPage) {
                ActiveTradePaginationDestroy();
            }
            if (results.ActiveTrade.length > 0) {
                _ActivePreviousTotalPageNo = results.ActiveTrade[0].TOTAL_PAGE;
            }
            else {
                _ActivePreviousTotalPageNo = 1;
            }
            SetActiveTradePagination();

            $('.TotalActiveTradeProfitOrLoss > h3').text(results.TotalActiveTradeProfitOrLoss);
            $('.TotalActiveTrade > h3').text(results.TotalActiveTradeCount);
            if (results.TotalActiveTradeProfitOrLoss >= 0) {
                $('.dvTotalActiveTradeProfitOrLoss').addClass("bg-green");
                $('.dvTotalActiveTradeProfitOrLoss').removeClass("bg-red");
            }
            else {
                $('.dvTotalActiveTradeProfitOrLoss').addClass("bg-red");
                $('.dvTotalActiveTradeProfitOrLoss').removeClass("bg-green");
            }
            if (results.TotalCompletedTradeProfitOrLoss >= 0) {
                $('.dvTotalCompletedTradeProfitOrLoss').addClass("bg-green");
                $('.dvTotalCompletedTradeProfitOrLoss').removeClass("bg-red");
            }
            else {
                $('.dvTotalCompletedTradeProfitOrLoss').addClass("bg-red");
                $('.dvTotalCompletedTradeProfitOrLoss').removeClass("bg-green");
            }
        }
        else {
            var tblActiveTradeList = $('#tblActiveTradeList').DataTable();
            tblActiveTradeList.clear().draw();
            tblActiveTradeList.innerHTML = "";
        }
        //#endregion


        if (results.TotalCompletedTradeCount > 0)
            $('.TotalCompletedTrade > h3').text(results.TotalCompletedTradeCount);
        else
            $('.TotalCompletedTrade > h3').text('0');

        $('.TotalCompletedTradeProfitOrLoss > h3').text(results.TotalCompletedTradeProfitOrLoss);

        //#region Set data for WatchList trade
        if (results.objLstWatchList != null) {
            if (results.objLstWatchList.length > 0) {
                var tblWatchTradeList = $('#tblWatchListTradeList').DataTable();
                tblWatchTradeList.clear().draw();
                tblWatchTradeList.innerHTML = "";
                var _CheckPage;
                for (var i = 0; i < results.objLstWatchList.length; i++) {
                    _WatchlistTotalPageNo = results.objLstWatchList[i].TOTAL_PAGE;
                    _WatchListLength = results.objLstWatchList.length;
                    _CheckPage = results.objLstWatchList[i].TOTAL_PAGE;
                    var result = results.objLstWatchList[i];
                    Current_Loop_Valueof_Watchlist = i;
                    SetWatchTradeDetails(result);
                }
                if (_WatchlistCurrentTabIndex > 0) {
                    $('#tblWatchListTradeListBody > tr:nth-child(' + _WatchlistCurrentTabIndex + ') > td:nth-child(1)').addClass('hover');
                }
                if (_WatchlistPreviousTotalPageNo != _CheckPage) {
                    WatchlistPaginationDestroy();
                }
                if (results.objLstWatchList.length > 0) {
                    _WatchlistPreviousTotalPageNo = results.objLstWatchList[0].TOTAL_PAGE;
                }
                else {
                    _WatchlistPreviousTotalPageNo = 1;
                }
                SetWatchlistPagination();
            }
            else {
                var tblWatchTradeList = $('#tblWatchListTradeList').DataTable();
                tblWatchTradeList.clear().draw();
                tblWatchTradeList.innerHTML = "";
            }
        }
        else {
            var tblWatchTradeList = $('#tblWatchListTradeList').DataTable();
            tblWatchTradeList.clear().draw();
            tblWatchTradeList.innerHTML = "";
        }
        //#endregion

        //End
        if (results.OrderExceptionList != null) {
            if (results.OrderExceptionList.length > 0) {
                var html = '<table class="table table-bordered table-striped" id="exceptionsTable"><thead><tr><th>TradingSymbol</th><th>Quantity</th><th>Price</th><th>BuyOrSell</th><th>Message</th></tr></thead><tbody>';
                for (var i = 0; i < results.OrderExceptionList.length; i++) {
                    html += '<tr><td>' + results.OrderExceptionList[i].Tradingsymbol + '</td><td>' + results.OrderExceptionList[i].Quantity + '</td><td>' + results.OrderExceptionList[i].Price + '</td><td>' + results.OrderExceptionList[i].TransactionType + '</td><td>' + results.OrderExceptionList[i].Message + '</td></tr>';
                }
                html += '</tbody></table>';
                $("#errorModal .modal-body").html(html);
                $("#errorModal").modal('show');
            }
        }
    }

}

$('#btnexport').click(function () {
    var search = $('#tblCompletedTradeList_filter input[type="search"]').val();
    window.location = '/Trade/download?search="' + search + '"';
});
$('#btnAddWatchList').on('click', function () {
    var selectedValue = $("#watchList option:selected").val();
    if (selectedValue == null || selectedValue == '') {
        window.location.href = "/WatchList/AddWatchList?ID=0";
    }
    else {
        window.location.href = "/WatchList/AddWatchList?ID=" + selectedValue;
    }
});
$('#watchList').on('change', function () {
    var selectedValue = this.value;
    $("#watchlistHiddenId").val(selectedValue);
    if (selectedValue != null && selectedValue != "") {

        var value = { 'Wid': selectedValue };
        try {
            var input = "";
            if ($('#rdAll').prop('checked') == true) {
                input = { 'tradetype': 0 };
            }
            else if ($('#rdLive').prop('checked') == true) {
                input = { 'tradetype': 1 };
            }
            else {
                input = { 'tradetype': 2 };
            }
            var request = $.ajax({
                url: "/Trade/GetWatchListTradeByWid",
                type: "GET",
                data: value,
                dataType: 'json',
                success: function (data) {
                    SetWishlistResult(data);
                }
            });

        } catch (e) {
            alert("Error On SetTradeData.");
        }
    }
});
$('#cboScriptExchange').on('change', function () {
    try {
        SetTradeDataForRefresh();
    }
    catch (e) {
        toastr.error('Error On SetTradeData.');
    }

});
function SetWishlistResult(data) {

    var results = JSON.parse(data);

    if (results != null) {

        //Set data for active trade
        var tblWatchTradeList = $('#tblWatchListTradeList').DataTable(
        );
        tblWatchTradeList.clear();
        tblWatchTradeList.innerHTML = "";

        for (var i = 0; i < results.objLstWatchList.length; i++) {
            var result = results.objLstWatchList[i];
            SetWatchTradeDetails(result);
        }
        if (results.objLstWatchList.length == 0) {
            tblWatchTradeList.clear();
            tblWatchTradeList.innerHTML = "";
        }

        //End

    }

}
function buySellPopUp(BuyQtyWiseOrLot, ScriptCode, no, ScriptSymbol, Wid, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, high = 0, low = 0, Triggerprice = 0, SL = 0, Target = 0, PriceType = '', producttype = '', TradeID = 0, sttus = '', isLive = '', action = '', TRADING_UNIT_TYPE='') {
    $('.upperClause :input').removeAttr('disabled');
    $('#btnProceedBuySell').removeAttr('disabled');
    $("#Price").removeClass("has-error");
    $('#buySellModel .modal-title').css("color", "#fff");
    $('#buySellModel #Terror').hide();
    $('#buySellModel #Quantity-error').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    $("#buySellModel #hdnHigh").val(high);
    $("#buySellModel #hdnLow").val(low);

    if (isLive == '')
        isLive = $('#hdnIsLiveOrder').val();

    $("#buySellModel #hdnIsLive").val(isLive);

    var companyInitials = $("#CompanyInitial").val();
    if (companyInitials == "VM") {
        $(".ProductTypeDiv").css("display", "none");
        $(".TriggerPriceDiv").css("display", "none");
        $(".rbtnSLDiv").css("display", "none");
        $("#tgtSLDiv").css("display", "none");
        $("#RememberDiv").css("display", "none");
    }
    if (companyInitials == "EXPO") {
        $(".TriggerPriceDiv").css("display", "none");
        $(".rbtnSLDiv").css("display", "none");
        $("#RememberDiv").css("display", "none");
    }


    if (ScriptExchange != "MCX") {
        $('#QuantityWiseBuy').css('display', 'none');
        $('#marketTypeDiv').addClass('col-md-offset-4');
    }
    else {
        $('#QuantityWiseBuy').css('display', 'block');
        $('#marketTypeDiv').removeClass('col-md-offset-4');
    }

    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'BUY';
        $('#buySellModel .modal-title').css("background-color", "#00a65a");

    }
    else if (no == 2) {
        CurrentPosition = 'SELL';
        $('#buySellModel .modal-title').css("background-color", "#dd4b39");
    }

    $('#dropTradingUnit').html('');
    if (allowedTradingUnit != null) {
        if (allowedTradingUnit.length > 0) {
            var data = allowedTradingUnit.filter(opt => opt.ScriptExchange == ScriptExchange);
            var units = [];
            if (instumentType == "FUT" || instumentType == "CE" || instumentType == "PE") {
                if (instumentType == "FUT") {
                    if (data[0].FUTURE_TRADING_UNIT_TYPE == null || data[0].FUTURE_TRADING_UNIT_TYPE == '' || data[0].FUTURE_TRADING_UNIT_TYPE == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].FUTURE_TRADING_UNIT_TYPE.split(",");
                    }
                }
                else {
                    if (data[0].OPTIONS_TRADING_UNIT_TYPE == null || data[0].OPTIONS_TRADING_UNIT_TYPE == '' || data[0].OPTIONS_TRADING_UNIT_TYPE == undefined) {
                        units.push(1);
                    } else {
                        units = data[0].OPTIONS_TRADING_UNIT_TYPE.split(",");
                    }
                }
            } else {
                if (data[0].OPTIONS_TRADING_UNIT_TYPE == null || data[0].OPTIONS_TRADING_UNIT_TYPE == '' || data[0].OPTIONS_TRADING_UNIT_TYPE == undefined) {
                    units.push(1);
                }
                else {
                    units = data[0].EQUITY_TRADING_UNIT_TYPE.split(",");
                }
            }
            $.each(units, function (i, item) {
                if (item == "0")
                    item = "1";
                $('#dropTradingUnit').append($("<option></option>").val(parseInt(item)).html(item == "1" ? "LOT" : "QTY"));
            });

        } else {
            $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("LOT"));
        }
    }
    else {
        $('#dropTradingUnit').append($("<option></option>").val(parseInt(1)).html("LOT"));
    }
    $("#lblScriptSymbol").text(ScriptSymbol.toString());
    $("#lblScriptCode").text(ScriptCode.toString());
    $("#lblCurrentPosition").text(CurrentPosition);
    $("#Wid").val(Wid);
    $("#hdnPrice").val(price);
    $("#hdnTradeID").val(TradeID.toString());
    $("#Price").val('0');
    $("#TriggerPrice").val(Triggerprice.toString());
    $("#hdnTriggerPrice").val(Triggerprice.toString());
    $("#txtStopLoss").val(SL.toString());
    $("#txtTarget").val(Target.toString());
    $("#Quantity").val(Quantity.toString());
    if (instumentType != 'EQ') {
        $('#rbtnNrml').val('NRML');
        $('#Itype').text('NRML');
    }
    else {
        $('#rbtnNrml').val('CNC');
        $('#Itype').text('CNC');
    }

    if ($('#IsTargetStopLossAbsolute').val() == 'True' && action == 'EDIT') {
        if (CurrentPosition.toLowerCase() == "buy") {
            $("#txtStopLoss").val(SL > 0 ? price - SL : 0);
            $("#txtTarget").val(Target > 0 ? price + Target : 0);
        }
        else {
            $("#txtStopLoss").val(SL > 0 ? price + SL : 0);
            $("#txtTarget").val(Target > 0 ? price - Target : 0);
        }
    }
    if (PriceType.length == 0) {

        var RememberData = localStorage.getItem("RememberTargetStoploss");
        if (RememberData != null) {
            RememberData = JSON.parse(RememberData);
            $("#cbxRememberTargetStoploss").prop('checked', true);
            // $("#txtTarget").val(RememberData.TGT);
            // $("#txtStopLoss").val(RememberData.SL);

            if (RememberData.PRODUCT_TYPE != null && RememberData.PRODUCT_TYPE != '') {
                if (RememberData.PRODUCT_TYPE == 'MIS') {
                    $('#rbtnIntraday').prop('checked', true);
                } else {
                    $('#rbtnNrml').prop('checked', true);
                }
            }
            if (RememberData.PRICE_TYPE != null && RememberData.PRICE_TYPE != '') {
                if (RememberData.PRICE_TYPE == 'MARKET') {
                    $('#rbtnMarket').prop('checked', true);
                } else if (RememberData.PRICE_TYPE == 'LIMIT') {
                    $('#rbtnLimit').prop('checked', true);
                }
                else if (RememberData.PRICE_TYPE == 'SL') {
                    $('#rbtnSL').prop('checked', true);
                }
                else if (RememberData.PRICE_TYPE == 'SL-M') {
                    $('#rbtnSLM').prop('checked', true);
                }

            }
            PriceType = $('input[name=MarketType]:checked').val();
        }
        else {
            $("#rbtnMarket").prop('checked', true);
            $('#rbtnNrml').prop('checked', true);
        }
    }


    if (PriceType != null && PriceType != '') {
        if (PriceType == 'LIMIT') {
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').val(price);
            $('#buySellModel #TriggerPrice').val('0');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
            $("#rbtnLimit").prop('checked', true);
        }
        else if (PriceType == 'SL') {
            $("#rbtnSL").prop('checked', true);
            $('#buySellModel #Price').removeAttr('disabled');
            $('#buySellModel #Price').removeAttr('readonly');
            $('#buySellModel #Price').val(price);

            $('#buySellModel #TriggerPrice').removeAttr('disabled');

        }
        else if (PriceType == 'SL-M') {
            $("#rbtnSLM").prop('checked', true);
            $('#buySellModel #Price').val(price);
            $('#buySellModel #Price').attr('readonly', 'readonly');
            $('#buySellModel #Price').attr('disabled', 'disabled');
        }
        else if (PriceType == 'MARKET') {
            $("#rbtnMarket").prop('checked', true);
            $('#buySellModel #Price').val(0);
            $('#buySellModel #Price').attr('disabled', 'disabled');
            $('#buySellModel #Price').attr('readonly', 'readonly');
            $('#buySellModel #TriggerPrice').attr('disabled', 'disabled');
        }
    }


    if (producttype != null && producttype != '') {
        if (producttype == 'MIS') {
            //$('#tgtSLDiv').hide();
            //$('#txtTarget').val('0');
            //$('#txtStopLoss').val('0');
            $('#rbtnIntraday').prop('checked', true);
        }
        else {
            $('#tgtSLDiv').show();
        }
    }
    if (sttus == 'COMPLETE')
        $('.upperClause :input').attr('disabled', 'disabled');
    else if (sttus == 'Open') {
        $('.upperClause :input').removeAttr('disabled');
        //$('#cbxQuanityWise').attr('disabled', 'disabled');
    }
    else
        $('.upperClause :input').removeAttr('disabled');

    
    $('#buySellModel').modal({
        backdrop: false,
        show: true
    });
    $('.modal-dialog').draggable({
        handle: ".modal-header"
    });

    $("body").removeClass('modal-open');
    $("#hdnSt").val(sttus);
    //$("#buySellModel").modal('show');
    //ProceedBuySell();
    if (TRADING_UNIT_TYPE != '')
        $('#dropTradingUnit option[value=' + TRADING_UNIT_TYPE + ']').attr('selected', 'selected');
    $('#dropTradingUnit').removeAttr('disabled');
    if (sttus == 'Open')
        $('#dropTradingUnit').attr('disabled', 'disabled');

    
    
    var IsOneClickEnabled = localStorage.getItem("IsOneClickEnabled");
    if (IsOneClickEnabled == "1" && action != 'EDIT') {
        ProceedBuySell();
    }
    marginInterval = setInterval(function () { GetRequiredMargin(); }, 1000);
}
function GetRequiredMargin() {

    var MisOrNot = 0;
    var Size = $("#buySellModel #hdnScriptLotSize").val();
    $('#buySellModel #DivGetLotSize').text(Size);
    var SCode = $("#lblScriptCode").text();
    var qty = $("#Quantity").val();
    var WalletBalance = $("#WalletBalance");
    var balance = WalletBalance.text();
    var Lp = $('#lblLastPrice').text();
    var intradayradiobutton = document.getElementById('rbtnIntraday');
    var CurrentPosition = $("#lblCurrentPosition").text();
    var scriptExchange = $("#buySellModel #hdnScriptExchange").val();
    var userIdForTrade = 0;
    if (intradayradiobutton.checked == true) {
        MisOrNot = 1;
    }
    if ($('#UserIds option:selected').text() != '--Select--') {
        userIdForTrade = $('#UserIds').val();
    }
    if (LevelLoginUser == 1 || LevelLoginUser == 2) {
        if ($('#AdminIds option:selected').text() != '--Select--') {
            userIdForTrade = $('#AdminIds').val();
        }
    }
    if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3) {
        if ($('#BrokerIds option:selected').text() != '--Select--') {
            userIdForTrade = $('#BrokerIds').val();
        }
    }
    if (LevelLoginUser == 4) {
        if ($('#UserIds option:selected').text() != '--Select--') {
            userIdForTrade = $('#UserIds').val();
        }
    }

    if (CurrentPosition == 'BUY')
        Lp = $('#lblLastBid').text();
    else
        Lp = $('#lblLastAsk').text();

    if (Lp != '' && Lp != null) {
        var input = "";
        input = { 'ScriptLotSize': Size, 'ScriptCode': SCode, 'quantity': qty, 'Totalwalletbalance': balance, 'MisOrNot': MisOrNot, 'LastPrice': Lp, 'TRADING_UNIT_TYPE': $("#dropTradingUnit").val(), 'scriptExchange': scriptExchange, 'USERID': userIdForTrade };

        var request = $.ajax({
            url: "/Trade/GetRequiredMargin",
            type: "GET",
            data: input,
            dataType: 'json',
            success: function (data) {
                SetRequiredMargin(data);
            }
        });
    }
}

function SetRequiredMargin(item) {
    if (item.length != null) {
        if (item.length > 0) {
            if (item[0].RequiredMargin > item[0].AvailableMargin)
                $('#DivGetAvailableMargin').css('color', 'red');
            else
                $('#DivGetAvailableMargin').css('color', 'green');

            $('#buySellModel #DivGetRequiredMargin').text(item[0].RequiredMargin);
            $('#buySellModel #DivGetAvailableMargin').text(item[0].AvailableMargin);
            $('#buySellModel #DivGetUsedMargin').text(item[0].UsedMargin);
        }
        else {
            $('#buySellModel #DivGetRequiredMargin').text(0);
            $('#buySellModel #DivGetAvailableMargin').text(0);
            $('#buySellModel #DivGetUsedMargin').text(0);
        }
    }
}

function ProceedBuySell() {
    var quantity = $("#Quantity").val();
    if (quantity < 0.01) {
        toastr.error("Invalid Qty");
        HidePopUp();
        return;
    }
    if ($("#cbxRememberTargetStoploss").prop('checked') == true) {
        var data = {  PRODUCT_TYPE: $('input[name=ProductType]:checked').val(), PRICE_TYPE: $('input[name=MarketType]:checked').val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(data));
    }
    else {
        localStorage.removeItem("RememberTargetStoploss");
    }
    var iscbxAutoBinanceSlTrailEnabled = 0;
    if ($("#cbxAutoBinanceSlTrail").prop('checked') == true) {
        iscbxAutoBinanceSlTrailEnabled = 1;
    }
    else {
        iscbxAutoBinanceSlTrailEnabled = 0;
    }

    var ScriptCode = $("#lblScriptCode").text();
    var CurrentPosition = $("#lblCurrentPosition").text();
    intWID = $("#Wid").val();
    var target = $("#txtTarget").val();
    var stopLoss = $("#txtStopLoss").val();
    var quantity = $("#Quantity").val();
    var scriptExchange = $("#buySellModel #hdnScriptExchange").val();
    var scriptLotSize = $("#buySellModel #hdnScriptLotSize").val();
    var high = $("#buySellModel #hdnHigh").val();
    var low = $("#buySellModel #hdnLow").val();
    var isLive = $("#buySellModel #hdnIsLive").val();
    var price = $("#Price").val();
    var triggerPrice = $("#TriggerPrice").val();
    var tradeID = $("#hdnTradeID").val();
    var productType = $('input[name=ProductType]:checked').val();
    var marketType = $('input[name=MarketType]:checked').val();
    var hdprice = $('#buySellModel #hdnPrice').val();
    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        alert("Please enter correct details");
        return;
    }
    var HighLowCircuitRequired = $("#HighLowCircuitRequired").val();
    if (HighLowCircuitRequired == 0) {
        var companyInitials = $("#CompanyInitial").val();
        //if (marketType == 'MARKET' && companyInitials != "EXPO") {
        //    if ((hdprice <= low || hdprice >= high) && scriptExchange != 'FOREX' && scriptExchange != 'BINANCE') {
        //        toastr.error('Cannot trade for this script as the current price is higger than Higher circuit or lower than lower circuit.');
        //        HidePopUp();
        //        $('#btnProceedBuySell').removeAttr('disabled');
        //        return;
        //    }
        //}
        if (marketType == "SL" || marketType == "SL-M") {
            var oprice = parseFloat(price);
            var tprice = parseFloat(triggerPrice);

            var hdnPrice = parseFloat(hdprice);
            var showError = false;
            var msg = "";

            if (marketType == "SL" && companyInitials != "EXPO") {
                //if ((parseFloat(tprice) <= low || parseFloat(tprice) >= high || parseFloat(oprice) <= low || parseFloat(oprice) >= high) && scriptExchange != 'FOREX' && scriptExchange != 'BINANCE') {
                //    toastr.error('Cannot trade for this script as the current price is higger than Higher circuit or lower than lower circuit.');
                //    HidePopUp();
                //    $('#btnProceedBuySell').removeAttr('disabled');
                //    return;
                //}
                if (CurrentPosition == "SELL" && marketType == "SL" && oprice > tprice) {
                    showError = true;
                    msg = "Trigger price connot be less than order price";
                }
                else if (CurrentPosition == "BUY" && marketType == "SL" && oprice < tprice) {
                    showError = true;
                    msg = "Trigger price Cannot be higher than order price";
                }
            }
            //if ((parseFloat(tprice) <= low || parseFloat(tprice) >= high) && scriptExchange != 'FOREX' && scriptExchange != 'BINANCE' && companyInitials != "EXPO") {
            //    toastr.error('Cannot trade for this script as the current price is higger than Higher circuit or lower than lower circuit.');
            //    HidePopUp();
            //    $('#btnProceedBuySell').removeAttr('disabled');
            //    return;
            //}
            if (CurrentPosition == "SELL" && tprice > hdnPrice) {
                showError = true;
                msg = "Trigger price Cannot be higher than last price";
            }
            else if (CurrentPosition == "BUY" && tprice < hdnPrice) {
                showError = true;
                msg = "Trigger price connot be less than last price";
            }
            if (showError) {
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }

        }
        if (marketType == "LIMIT") {
            var oprice = parseFloat(price);
            var hdprice = $('#buySellModel #hdnPrice').val();
            var hdnPrice = parseFloat(hdprice);
            var showError = false;
            var msg = "";
            //if ((parseFloat(price) <= low || parseFloat(price) >= high) && scriptExchange != 'FOREX' && scriptExchange != 'BINANCE' && companyInitials != "EXPO") {
            //    toastr.error('Cannot trade for this script as the current price is higger than Higher circuit or lower than lower circuit.');
            //    HidePopUp();
            //    $('#btnProceedBuySell').removeAttr('disabled');
            //    return;
            //}
            if (CurrentPosition == "SELL" && oprice < hdnPrice) {
                showError = true;
                msg = "Limit price Cannot be less than last price";
            }
            else if (CurrentPosition == "BUY" && oprice > hdnPrice) {
                showError = true;
                msg = "Limit price connot be greater than last price";
            }
            if (showError) {
                $("#Price").addClass("has-error");
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }


        }
    }
    if (((stopLoss != '' && stopLoss != '0') || (target != '' && target != '0')) && isLive.toLowerCase() == 'false') {
        var dTarget = parseFloat(target);
        var dStoploss = parseFloat(stopLoss);
        var dHigh = parseFloat(high);
        var dLow = parseFloat(low);
        var oprice = parseFloat(price);
        var lastPrice = parseFloat(hdprice);
        if (oprice > 0) {
            lastPrice = oprice;
        }
        else {
            oprice = lastPrice;
        }

        companyInitials = $("#CompanyInitial").val();

        if (companyInitials == "TB") {
            var msg = "";
            if (CurrentPosition == 'BUY') {
                if (dTarget > 0) {
                    dTarget = (lastPrice + dTarget);
                    if (dTarget < dHigh)
                        msg = 'Target should be greater than High price';
                }
                if (dStoploss > 0) {
                    dStoploss = (lastPrice - dStoploss);
                    if (dStoploss > dLow)
                        msg = 'StopLoss should be less than Low price';
                }

            }
            else {
                if (dTarget > 0) {
                    dTarget = (lastPrice - dTarget);
                    if (dTarget < dLow)
                        msg = 'Target should be less than Low price';
                }
                if (dStoploss > 0) {
                    dStoploss = (lastPrice + dStoploss);
                    if (dStoploss > dHigh)
                        msg = 'StopLoss  should be greater than High price';
                }

            }
            if (msg != '') {
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }
        }
        if ($('#IsTargetStopLossAbsolute').val() == 'True') {
            var msg = "";
            if (CurrentPosition == 'BUY') {
                if (dTarget > 0) {
                    if (dTarget < oprice)
                        msg = 'Target should be greater than Order price';
                }
                if (dStoploss > 0) {
                    if (dStoploss > oprice)
                        msg = 'StopLoss should be less than Order price';
                }

            }
            else {
                if (dTarget > 0) {
                    if (dTarget > oprice)
                        msg = 'Target should be less than Order price';
                }
                if (dStoploss > 0) {
                    if (dStoploss < oprice)
                        msg = 'StopLoss  should be greater than Order price';
                }

            }
            if (msg != '') {
                toastr.error(msg);
                $('#btnProceedBuySell').removeAttr('disabled');
                return;
            }
        }
    }
    var st = $("#hdnSt").val();

    var TRADING_UNIT = $("#dropTradingUnit").val();



    if (ScriptCode > 0 && intWID > 0 && quantity != '' && quantity != '0') {
        var request = $.ajax({
            url: "/Trade/ProceedBuySell",
            type: "POST",
            data: { intWID: intWID, ScriptCode: ScriptCode, CurrentPosition: CurrentPosition, allUsers: false, target: target, stopLoss: stopLoss, Quantity: quantity, Price: price, TriggerPrice: triggerPrice, ProductType: productType, MarketType: marketType, TradeID: tradeID, Status: st, iscbxAutoBinanceSlTrailEnabled: iscbxAutoBinanceSlTrailEnabled, TRADING_UNIT: TRADING_UNIT },
            dataType: 'json',
            async: true,
            success: function (data) {
                var results = JSON.parse(data);

                if (results.IsError) {

                    HidePopUp();
                    toastr.error(results.TypeName);
                    //alert(results.TypeName);
                    return false;
                }
                else {
                    //var table = $('#tblList').DataTable();
                    //table.row($("#btnName" + ScriptCode).parents('tr')).remove().draw(false);
                    //alert("Script deleted successfully.");
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
    HidePopUp();
    $('#btnProceedBuySell').removeAttr('disabled');
}

function HidePopUp() {
    $("#buySellModel").modal('hide');
}
var sqModal = $("#sqOfModal");
function SquareOff(id, param, st, qty, isManualStaratgy) {
    $(sqModal).find(".sqMsg").text('');
    $(sqModal).find("input[name=sqQty]").val(qty);
    $(sqModal).find("input[name=hdQty]").val(qty);
    $(sqModal).find("input[name=sqActiveTradeId]").val(id);
    $(sqModal).find("input[name=sqStatus]").val(st);
    $(sqModal).find("input[name=sqParam]").val(param);
    if (isManualStaratgy)
        $(sqModal).modal('show');
    else if (confirm("Are you sure to square off?"))
        ProceedSqOf();

}
function ProceedSqOf() {
    $(sqModal).find(".sqMsg").text('');
    var sqQty = $(sqModal).find("input[name=sqQty]").val();
    var initQty = $(sqModal).find("input[name=hdQty]").val();
    var intQty = 0;
    if (sqQty != '' && sqQty != '0') {
        intQty = parseInt(sqQty, 10);
        if (intQty > parseInt(initQty, 10)) {
            $('#btnProceedSquareOff').removeAttr('disabled');
            $(sqModal).find(".sqMsg").text('Invalid Qty');
            return false;
        }
    }
    else {
        $('#btnProceedSquareOff').removeAttr('disabled');
        $(sqModal).find(".sqMsg").text('Invalid Qty');
        return false;
    }
    var id = $(sqModal).find("input[name=sqActiveTradeId]").val();
    var st = $(sqModal).find("input[name=sqStatus]").val();
    var param = $(sqModal).find("input[name=sqParam]").val();
    var request = $.ajax({
        url: "/Trade/ManageTradeSquareOff",
        type: "POST",
        data: { ID: id, actionParam: param, status: st, qty: intQty, isSupAdmin: 1 },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            if (results.exceptionDTO.id == 1) {             
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 0) {              
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {            
                toastr.success(results.exceptionDTO.Msg);
            }


            return false;
        }
    });
    $('#btnProceedSquareOff').removeAttr('disabled');
    $(sqModal).modal('hide');
}
function CallSync(activeTradeID) {
    if (confirm("Are you sure to sync order?")) {
        var request = $.ajax({
            url: "/Trade/CallSync",
            type: "POST",
            data: { ID: activeTradeID },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);              
                toastr.success('Order Sync request sent successfully');

                return false;
            }
        });
    }
}
var marketDepthInterval;
function MarketDepthPop(scriptCode, symbolParam) {
    var htmlString = '<button type="button" class="btn btn-success" onclick="HideDepthModal();$(\'#btnBuy' + scriptCode + '\').click()">Buy</button>';
    htmlString += '<button type="button" class="btn btn-danger" onclick="HideDepthModal();$(\'#btnSell' + scriptCode + '\').click()">Sell</button>';
    $("#MarketDepthModal #buySellButtonDiv").html(htmlString);
    $("#MarketDepthModal #lblDepthScriptSymbol").text(symbolParam);
    $("#MarketDepthModal #hdnDepthScriptCode").val(scriptCode);
    var request = $.ajax({
        url: "/Trade/_MarketDepth",
        type: "POST",
        data: { ScriptCode: scriptCode },

        success: function (data) {
            //var results = JSON.parse(data);

            $("#MarketDepthModal .modal-body").html(data);
            //$("#MarketDepthModal").modal('show');
            $('#MarketDepthModal').modal({
                backdrop: false,
                show: true
            });
            $("body").removeClass('modal-open');
            marketDepthInterval = setInterval(function () { SetMarketDepthForRefresh(); }, 1000);
            return false;
        }
    });
}
function SetMarketDepthForRefresh() {
    var scriptCode = $("#MarketDepthModal #hdnDepthScriptCode").val();
    var request = $.ajax({
        url: "/Trade/_MarketDepth",
        type: "POST",
        data: { ScriptCode: scriptCode },
        async: true,
        success: function (data) {
            //var results = JSON.parse(data);
            $('#MarketDepthModal #lblDepthLtp').text("(" + $("#hdnDepthLtp").val() + ")");
            $("#MarketDepthModal .modal-body").html(data);

            return false;
        }
    });
}
function HideDepthModal() {
    clearInterval(marketDepthInterval);
    $("#MarketDepthModal").modal('hide');
}
function HideCompletedTradeModal() {
    $("#CompletedTradeModal").modal('hide');
}
function btnLoginToTradeUsingModal() {
    var url = $('#btnKiteLogin').attr("href");
    var request = $.ajax({
        url: url,
        type: "GET",
        data: {},
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = data;

            if (results == "") {
                $("#txtScript").val("");
                //alert("Duplicate record.");
                ShowAlertMessage(1, "Login Sccuessfully.");
                return false;
            }
            else {
                window.location.href = results;
                return;
            }
        }
    });
    return false;
}

function SetWatchlistPagination() {
    $('#WatchlistPagination').twbsPagination({
        totalPages: _WatchlistTotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (_isWatchlistCallBack) {
                _WatchlistCurrentPageNo = page;
                LastPriceDictionary = new Array();
                BtnIds = new Array();
                _WatchlistCurrentTabIndex = 0;
            }
            else
                _isWatchlistCallBack = true;
        }
    });
}
function WatchlistPaginationDestroy() {
    $('#WatchlistPagination').empty();
    $('#WatchlistPagination').removeData("twbs-pagination");
    $('#WatchlistPagination').unbind("page");
}
function SetCompletedPagination() {
    $('#CompletedPagination').twbsPagination({
        totalPages: _CompletedTotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (_CompletedCallBack) {
                _CompletedCurrentPageNo = page;
                SetCompletedTradeModalData();
            }
            else
                _CompletedCallBack = true;
        }
    });
}
function CompletedPaginationDestroy() {
    $('#CompletedPagination').empty();
    $('#CompletedPagination').removeData("twbs-pagination");
    $('#CompletedPagination').unbind("page");
}
function SetActiveTradePagination() {
    $('#ActiveTradePagination').twbsPagination({
        totalPages: _ActiveTotalPageNo,
        visiblePages: 2,
        onPageClick: function (event, page) {
            if (_ActiveCallBack)
                _ActiveCurrentPageNo = page;
            else
                _ActiveCallBack = true;
        }
    });
}
function ActiveTradePaginationDestroy() {
    $('#ActiveTradePagination').empty();
    $('#ActiveTradePagination').removeData("twbs-pagination");
    $('#ActiveTradePagination').unbind("page");
}
$("#btnMoreInfoCompletedTrade").on('click', function () {
    if ($('#UserIds option:selected').text() != '--Select--') {
        var userIdForTrade = $('#UserIds').val();
    }
    if (LevelLoginUser == 1 || LevelLoginUser == 2) {
        if ($('#AdminIds option:selected').text() != '--Select--') {
            var userIdForTrade = $('#AdminIds').val();
        }
    }
    if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3) {
        if ($('#BrokerIds option:selected').text() != '--Select--') {
            var userIdForTrade = $('#BrokerIds').val();
        }
    }
    if (LevelLoginUser == 4) {
        if ($('#UserIds option:selected').text() != '--Select--') {
            var userIdForTrade = $('#UserIds').val();
        }
    }
    if (userIdForTrade != '' && userIdForTrade != null) {
        SetCompletedTradeModalData();
        $("#CompletedTradeModal").modal('show');
    }
    else {
        toastr.error('Please Select User From Dropdown');
    }
});
$("#btnMoreInfoCompletedTrade2").on('click', function () {
    if ($('#UserIds option:selected').text() != '--Select--') {
        var userIdForTrade = $('#UserIds').val();
    }
    if (LevelLoginUser == 1 || LevelLoginUser == 2) {
        if ($('#AdminIds option:selected').text() != '--Select--') {
            var userIdForTrade = $('#AdminIds').val();
        }
    }
    if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3) {
        if ($('#BrokerIds option:selected').text() != '--Select--') {
            var userIdForTrade = $('#BrokerIds').val();
        }
    }
    if (LevelLoginUser == 4) {
        if ($('#UserIds option:selected').text() != '--Select--') {
            var userIdForTrade = $('#UserIds').val();
        }
    }
    if (userIdForTrade != '' && userIdForTrade != null) {
        SetCompletedTradeModalData();
        $("#CompletedTradeModal").modal('show');
    }
    else {
        toastr.error('Please Select User From Dropdown');
    }
});
function SetCompletedTradeModalData() {

    try {
        var Wid = $("#watchlistHiddenId").val();
        var selectedScriptExchange = $("#cboScriptExchange option:selected").val();

        if ($('#UserIds option:selected').text() != '--Select--') {
            var userIdCompleteTrade = $('#UserIds').val();
            var IsAdmin = '0';
        }
        if (LevelLoginUser == 1 || LevelLoginUser == 2) {
            if ($('#AdminIds option:selected').text() != '--Select--') {
                var userIdCompleteTrade = $('#AdminIds').val();
                var IsAdmin = '1';
            }
        }
        if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3) {
            if ($('#BrokerIds option:selected').text() != '--Select--') {
                var userIdCompleteTrade = $('#BrokerIds').val();
                var IsAdmin = '1';
            }
        }
        if (LevelLoginUser == 4) {
            if ($('#UserIds option:selected').text() != '--Select--') {
                var userIdForTrade = $('#UserIds').val();
                var IsAdmin = '1';
            }
        }

        var input = "";
        if ($('#rdAll').prop('checked') == true) {
            input = { 'tradetype': 0, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'CompletedListPage': _CompletedCurrentPageNo, 'UserId': userIdCompleteTrade, 'IsAdminOrNot': IsAdmin };
        }
        else if ($('#rdLive').prop('checked') == true) {
            input = { 'tradetype': 1, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'CompletedListPage': _CompletedCurrentPageNo, 'UserId': userIdCompleteTrade, 'IsAdminOrNot': IsAdmin };
        }
        else {
            input = { 'tradetype': 2, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'CompletedListPage': _CompletedCurrentPageNo, 'UserId': userIdCompleteTrade, 'IsAdminOrNot': IsAdmin };
        }
        var request = $.ajax({
            url: "/Trade/SetCompletedTradeDataForManageTransaction",
            type: "GET",
            data: input,
            dataType: 'json',
            async: true,

            success: function (data) {
                var results = JSON.parse(data);
                if (results != null) {
                    var tblCompletedTradeList = $('#tblCompletedTradeList').DataTable();
                    tblCompletedTradeList.clear().draw();
                    tblCompletedTradeList.innerHTML = "";
                    if (results.CompletedTrade != null && results.CompletedTrade.length > 0) {
                        var _CheckCurrentPage;

                        for (var i = 0; i < results.CompletedTrade.length; i++) {
                            _CompletedTotalPageNo = results.CompletedTrade[i].TOTAL_PAGE;
                            _CheckCurrentPage = results.CompletedTrade[i].TOTAL_PAGE;
                            var result = results.CompletedTrade[i];
                            SetCompletedTradeTableDetails(result);
                            $('#CompletedTradeModal td:first-child').addClass('CompletedTradeModal_First_Td');
                            BindClick();
                            bindHideClick();
                        }
                        if (_CompletedPreviousTotalPageNo != _CheckCurrentPage) {
                            CompletedPaginationDestroy();
                        }
                        if (results.CompletedTrade.length > 0) {
                            _CompletedPreviousTotalPageNo = results.CompletedTrade[0].TOTAL_PAGE;
                        }
                        else {
                            _CompletedPreviousTotalPageNo = 1;
                        }
                        SetCompletedPagination();
                    }
                }
            }
        });

    } catch (e) {
        alert("Error On SetTradeData.");
    }

}
function bindHideClick() {
    $(".hideTranDetailRow").bind('click', function () {
        $(this).css("display", "none");
        $("#TranDetail").remove();
    });
}
function SetCompletedTradeTableDetails(item) {
    if (item.Status == "TGT2")
        item.Status = "TARGET";
    else if (item.Status == "TGT3")
        item.Status = "TARGET2";
    else if (item.Status == "TGT4")
        item.Status = "TARGET3";
    else if (item.Status == "SL")
        item.Status = "STOPLOSS";
    var BtnClick = '<a href="javascript:void(0)" id="GetCompletedTradeDetail" data-bind=' + item.CompletedTradeID + ' ><i class="fa fa-info-circle"></i> </a> ' +
        '<a href="javascript:void(0)" id="DeleteCompletedTrade" data-bind=' + item.CompletedTradeID + ' style="margin-left:10px;" ><i class="fa fa-trash-o"></i> </a> <a href="javascript:void(0)" class="hideTranDetailRow"  style = "margin-left: 15px;font-size:15px;display:none;" ><i class="fa fa-arrow-circle-up"></i></a> <p style="margin-left: 10px;">  ' + item.CompletedTradeID + '</p> ';

    var sQty;
    var tradingUnit;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ScriptLotSize;
        tradingUnit = item.TRADING_UNIT;
    }
    else {
        tradingUnit = item.TRADING_UNIT;
        if (item.ScriptLotSize > 10 && item.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    buttons: [
        'copy', 'excel', 'pdf'
    ];

    if (item.ScriptType == "FOREX" && $("#CompanyInitial").val() == "RT") {
        item.ProfitOrLoss = (item.ProfitOrLoss).toFixed(5);
    }
    var comptable = $('#tblCompletedTradeList').DataTable().row.add([
        BtnClick,
        item.TradeSymbol,
        sQty,
        tradingUnit,
        item.ProfitOrLoss,
        item.EntryTime,
        item.CurrentPosition,
        item.Status
    ]).order([0, 'desc']).draw();

    var ctable = document.getElementById("tblCompletedTradeList");
    for (var i = 0; i < ctable.rows.length; i++) {
        var status = $(ctable.rows[i].cells[6]).text();
        if (status == "TARGET" || status == "TARGET2" || status == "TARGET3") {
            $(ctable.rows[i].cells[6]).css("background-color", "#14a964");
            $(ctable.rows[i].cells[6]).css("color", "white");
        }
        if (status == "STOPLOSS") {
            $(ctable.rows[i].cells[6]).css("background-color", "#d83824");
            $(ctable.rows[i].cells[6]).css("color", "white");
        }
        var profitLoss = $(ctable.rows[i].cells[3]).text();
        if (parseFloat(profitLoss) >= 0) {
            $(ctable.rows[i].cells[3]).css("background-color", "#14a964");
            $(ctable.rows[i].cells[3]).css({ "color": "white", "font-weight": "bold" });
        }
        else if (parseFloat(profitLoss) < 0) {
            $(ctable.rows[i].cells[3]).css("background-color", "#d83824");
            $(ctable.rows[i].cells[3]).css({ "color": "white", "font-weight": "bold" });
        }
    }
}
$('#SqrOffAllBtn').on('click', function () {
    var result = confirm("Are You Sure You Want To Sqr-Off All Trades ?");
    if (result) {
        window.location.href = "/Trade/SqrOffAll";
    }
});
function BindClick() {
    $('#GetCompletedTradeDetail').bind('click', function () {

        $(".hideTranDetailRow").hide();
        var tr = $(this).closest('tr');
        var upButton = $(tr).find('.hideTranDetailRow');
        $(upButton).show();
        var TransactionId = $(this).data('bind');
        var request = $.ajax({
            url: "/Trade/SetCompletedTradeDetailData?CompletedTradeId=" + TransactionId,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    $("#TranDetail").remove();
                    $(data).insertAfter(tr);
                }
            }
        });
    });
    $('#DeleteCompletedTrade').bind('click', function () {
        var TransactionId = $(this).data('bind');
        var request = $.ajax({
            url: "/Trade/SoftDeleteCompletedTrade?ID=" + TransactionId,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    toastr.success(data);
                    SetCompletedTradeModalData();
                }
            }
        });
    });
}
var addQtyModal = $("#addQtyModal");
function AddQty(id, param, st) {
    $(addQtyModal).find(".sqMsg").text('');
    $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
    $(addQtyModal).find("input[name=sqActiveTradeId]").val(id);
    $(addQtyModal).find("input[name=sqStatus]").val(st);
    $(addQtyModal).find("input[name=sqParam]").val(param);
    $(addQtyModal).modal('show');
}
function ProceedAddQty() {
    $(addQtyModal).find(".sqMsg").text('');
    var sqQty = $(addQtyModal).find("input[name=sqQty]").val();

    var intQty = 0;
    if (sqQty != '' && sqQty != '0') {
        intQty = parseInt(sqQty, 10);

    }
    else {
        $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
        $(addQtyModal).find(".sqMsg").text('Invalid Qty');
        return false;
    }
    var id = $(addQtyModal).find("input[name=sqActiveTradeId]").val();
    var st = $(addQtyModal).find("input[name=sqStatus]").val();
    var param = $(addQtyModal).find("input[name=sqParam]").val();
    var request = $.ajax({
        url: "/Trade/AddQtyToActiveTrade",
        type: "POST",
        data: { ID: id, actionParam: param, status: st, qty: intQty },
        dataType: 'json',
        traditional: true,
        success: function (data) {
            var results = JSON.parse(data);
            if (results.exceptionDTO.id == 1) {              
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 0) {             
                toastr.success(results.exceptionDTO.Msg);
            }
            else if (results.exceptionDTO.id == 2) {              
                toastr.success(results.exceptionDTO.Msg);
            }


            return false;
        }
    });
    $(addQtyModal).find('#btnProceedAddQty').removeAttr('disabled');
    $(addQtyModal).modal('hide');
}

$("#UserIds").on('change', function () {
    if ($('#UserIds').val() != '') {
        $('#AdminIds').val(null).trigger('change');
        $('#BrokerIds').val(null).trigger('change');
        $("#SqrOffBtn").show();
        $("#btnAddWatchList").show();
        SetTotalBrokrage($('#UserIds').val());
        LastPriceDictionary = new Array();
        BtnIds = new Array();
        _WatchlistCurrentTabIndex = 0;
        clearInterval(myInterval);
        getTradingUnit($('#UserIds').val());
        myInterval = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
    }
    else {
        $("#SqrOffBtn").hide();
        $("#btnAddWatchList").hide();
        LastPriceDictionary = new Array();
        BtnIds = new Array();
        _WatchlistCurrentTabIndex = 0;
    }
});
function getTradingUnit(userId) {
    $.ajax({
        url: "/Trade/GetTradingUnitAccess?userId=" + userId,
        type: "GET",
        dataType: "json",
        success: function (data) {
            if (data != null && data != '') {
                allowedTradingUnit = JSON.parse(data);
            }
        }
    });
}
$("#AdminIds").on('change', function () {
    if ($('#AdminIds').val() != '') {
        $('#BrokerIds').val(null).trigger('change');
        $('#UserIds').val(null).trigger('change');
        $("#SqrOffBtn").show();
        $("#btnAddWatchList").show();
        LastPriceDictionary = new Array();
        BtnIds = new Array();
        SetTotalBrokrage($('#AdminIds').val());
        getTradingUnit($('#AdminIds').val());
        _WatchlistCurrentTabIndex = 0;
        clearInterval(myInterval);
        myInterval = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
    }
    else {
        $("#SqrOffBtn").hide();
        $("#btnAddWatchList").hide();
        LastPriceDictionary = new Array();
        BtnIds = new Array();
        _WatchlistCurrentTabIndex = 0;
    }
});
$("#BrokerIds").on('change', function () {
    if ($('#BrokerIds').val() != '') {
        $('#AdminIds').val(null).trigger('change');
        $('#UserIds').val(null).trigger('change');
        $("#SqrOffBtn").show();
        $("#btnAddWatchList").show();
        LastPriceDictionary = new Array();
        BtnIds = new Array();
        _WatchlistCurrentTabIndex = 0;
        clearInterval(myInterval);
        SetTotalBrokrage($('#BrokerIds').val());
        getTradingUnit($('#BrokerIds').val());
        myInterval = setInterval(function () { SetTradeDataForRefresh(); }, 1000);
    }
    else {
        $("#SqrOffBtn").hide();
        $("#btnAddWatchList").hide();
        LastPriceDictionary = new Array();
        BtnIds = new Array();
        _WatchlistCurrentTabIndex = 0;
    }
});
function SetTotalBrokrage(data) {
    var request = $.ajax({
        url: "/Trade/GetTotalBrokrage",
        type: "Get",
        data: { userId: data },
        dataType: 'json',
        traditional: true,
        success: function (dataa) {
            $("#TotalBrokrage").html(dataa);
        }
    });
}
function SqrOffAllForManageTransaction() {
    if (confirm("Are you sure to square off All?")) {
        if ($('#UserIds option:selected').text() != '--Select--') {
            var userId = $('#UserIds').val();
            var username = $('#UserIds option:selected').text();
        }
        if (LevelLoginUser == 1 || LevelLoginUser == 2) {
            if ($('#AdminIds option:selected').text() != '--Select--') {
                var userId = $('#AdminIds').val();
                var username = $('#AdminIds option:selected').text();
            }
        }
        if (LevelLoginUser == 1 || LevelLoginUser == 2 || LevelLoginUser == 3) {
            if ($('#BrokerIds option:selected').text() != '--Select--') {
                var userId = $('#BrokerIds').val();
                var username = $('#BrokerIds option:selected').text();
            }
        }

        var request = $.ajax({
            url: "/Trade/SqrOffAllForManageTransaction",
            type: "Get",
            data: { UserId: userId, username: username },
            dataType: 'json',
            traditional: true,
            success: function (data) {
                var results = JSON.parse(data);
                if (results.exceptionDTO.id == 1) {
                    toastr.success(results.exceptionDTO.Msg);
                }
                else if (results.exceptionDTO.id == 0) {
                    toastr.error(results.exceptionDTO.Msg);
                }
                else if (results.exceptionDTO.id == 2) {
                    toastr.error(results.exceptionDTO.Msg);
                }
            }
        });
    }
}
function DeleteRejectedTrade(data) {
    var result = confirm("Are you sure you want to delete?");
    if (result) {
        var request = $.ajax({
            url: "/Trade/DeleteRejectedTrade?ID=" + data,
            type: "GET",
            async: true,
            success: function (data) {
                if (data != null) {
                    toastr.success(data);
                }
                SetTradeDataForRefresh();
            }
        });
    }
}




