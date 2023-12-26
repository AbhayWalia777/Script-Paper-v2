﻿var myInterval;
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
var allObj = [];
var websocket;
var marketDepthInterval;

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
var sqModal;
var addQtyModal;
var allowedTradingUnit;
var SocketInterval;
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
    initSocket();
    SocketInterval = setInterval(function () { initSocket(); }, 1000);
    LevelLoginUser = $('#LevelLoginUser').text();
    SetTradeData();

    $('#tblActiveTradeList').DataTable({
        "paging": false,
        "lengthChange": false,
        "info": false
    });
    $('#tblOpenTradeList').DataTable({
        "paging": false,
        "lengthChange": false,
        "info": false
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
        "info": true,
        "ordering": false,
        "searching": false
    });
    /*    $('.select2').select2();*/


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
    //#region Buy Sell Div Details
    $('.mobileBuyBtn').on('click', function () {
        $("#" + mobilebuyBtn + "").trigger('click');
        $('.mobile-context-menu').css('display', 'none');
    });
    $('.mobileSellBtn').on('click', function () {
        $("#" + mobilesellBtn + "").trigger('click');
        $('.mobile-context-menu').css('display', 'none');
    });
    $('.mobileDeleteBtn').on('click', function () {
        $("#" + mobiledeleteBtn + "").trigger('click');
        $('.mobile-context-menu').css('display', 'none');
    });
    $('.mobileSqrBtn').on('click', function () {
        sqModal = $("#sqOfModal");
        $("#" + mobileSqrBtn + "").trigger('click');
        $('.mobile-context-menu-Active').css('display', 'none');
    });
    $('.mobileAddBtn').on('click', function () {
        addQtyModal = $("#addQtyModal");
        $("#" + mobileAddBtn + "").trigger('click');
        $('.mobile-context-menu-Active').css('display', 'none');
    });
    $('.mobileEditBtn').on('click', function () {
        $("#" + mobileEditBtn + "").trigger('click');
        $('.mobile-context-menu-Active').css('display', 'none');
    });
    $('.mobileDeleteActiveBtn').on('click', function () {
        $("#" + mobileDeleteActiveBtn + "").trigger('click');
        $('.mobile-context-menu-Active').css('display', 'none');
    });

    $("#watchlistDiv").delegate('.watchlistRowViewNEWUI', 'click', function () {
        if (screen.width <= 768) {
            window.clearInterval(marketDepthInterval);
            clicked_Watchlist_InstrumentToken = $(this).attr('id');
            $('#marketDepthDiv').html('');
            $('#marketDepthDiv').append('<photo class="shine-watchlist"></photo>' +
                '<photo class= "shine-watchlist"></photo>');
            clicked_Watchlist_ScriptExchange = $(this).attr('data-scriptexchange');
            $('#scriptTradingSymbolMobileContextMenu').html($(this).attr('data-scripttradingsymbol') + ' ' + '<span style="font-size:12px;"> (' + clicked_Watchlist_ScriptExchange + ')</span>');
            var newL = allObj.filter(opt => opt.InstrumentToken == clicked_Watchlist_InstrumentToken);
            if (newL.length > 0)
                $('#lastPriceMobileContextMenu').html('LTP : ' + newL[0].LastPrice);
            mobilebuyBtn = $($(this).find('.btn-buy')).find('.btn-buy').prevObject[0].id;
            mobilesellBtn = $($(this).find('.btn-sell')).find('.btn-sell').prevObject[0].id;
            mobiledeleteBtn = $($(this).find('.btn-delete')).find('.btn-delete').prevObject[0].id;
            $('.mobile-context-menu').css('display', 'block');
            if (clicked_Watchlist_InstrumentToken != '')
                MarketDepthPop(clicked_Watchlist_InstrumentToken, $(this).attr('data-scripttradingsymbol'), 0);
        }
    });
    $("#ActiveTradeDiv").delegate('.activeTradeRow', 'click', function () {
        if (screen.width <= 768) {
            clicked_Watchlist_InstrumentToken = $(this).attr('id');


            clicked_Watchlist_ScriptExchange = $(this).attr('data-scriptexchange');
            $('#scriptTradingSymbolMobileContextMenuActive').html($(this).attr('data-scripttradingsymbol') + ' ' + '<span style="font-size:12px;"> (' + clicked_Watchlist_ScriptExchange + ')</span>');
            $('#lastPriceMobileContextMenuActive').html(clicked_Watchlist_InstrumentToken);
            $('#QtyMobileContextMenuActive').html('Qty: ' + $(this).attr('data-Qty'));
            $('#ProfitLossContextMenuActive').html('PL: ' + $(this).attr('data-PL'));

            mobileSqrBtn = $($(this).find('.btn-Sqroff')).find('.btn-Sqroff').prevObject[0].id;
            mobileAddBtn = $($(this).find('.btn-Add')).find('.btn-Add').prevObject[0].id;
            mobileEditBtn = $($(this).find('.btn-Edit')).find('.btn-Edit').prevObject[0].id;
            mobileDeleteActiveBtn = $($(this).find('.btn-DelActive')).find('.btn-DelActive').prevObject[0].id;
            //mobilesellBtn = $($(this).find('.btn-sell')).find('.btn-sell').prevObject[0].id;
            //mobiledeleteBtn = $($(this).find('.btn-delete')).find('.btn-delete').prevObject[0].id;

            $('.mobile-context-menu-Active').css('display', 'block');
        }
    });

    //#endregion
    $(document).on('click', '.completedTradeRow', function () {
        var ScriptCode = $(this).attr('data-id');
        var scriptTradingSymbol = $(this).attr('data-scriptName');
        var request = $.ajax({
            url: "/Trade/SetMobileReportDetailData",
            type: "POST",
            data: { CompletedTradeId: ScriptCode, scriptTradingSymbol: scriptTradingSymbol },

            success: function (data) {
                $("#MarketDepthModal .modal-body").html(data);
                $('#MarketDepthModal').modal({
                    backdrop: false,
                    show: true
                });
                $("body").removeClass('modal-open');
                return false;
            }
        });
    });

});
function initSocket() {
    $.ajax({
        url: '/Home/ConnectWebSocket',
        type: 'GET',
        dataType: 'json',
        success: function (event) {
            if (event != 'undefined') {
                var allActiveAndWatchObj = JSON.parse(event);
                if (allActiveAndWatchObj.hasOwnProperty("Table")) {
                    allObj = allActiveAndWatchObj.Table;
                    wt();
                }
            }
        }
    });
}
function wt() {
    var nData = allObj;
    if (nData != null && nData != 'undefined' && nData.length > 0) {
        var table = document.getElementById("watchlistDiv");
        var i = 0;
        while (i < table.children.length) {
            var htmlDivId = (table.children[i].id);
            var SCRIPT_TYPE = (table.children[i].dataset.scripttype);
            if (htmlDivId != undefined && htmlDivId != '') {

                var newL = nData.filter(opt => opt.InstrumentToken == $("#" + htmlDivId + "").find('input[name=hiddenCode]').val());
                if (newL.length > 0) {
                    var item = newL[0];

                    var PreviousLastPrice = 0.0;
                    var PreviousBidPrice = 0.0;
                    var PreviousAskPrice = 0.0;
                    var LtpColor = "";
                    var AskColor = "";
                    var BidColor = "";
                    for (var keys in LastPriceDictionary) {
                        if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                            PreviousLastPrice = parseFloat(LastPriceDictionary[keys].value);
                            PreviousBidPrice = parseFloat(LastPriceDictionary[keys].Bid);
                            PreviousAskPrice = parseFloat(LastPriceDictionary[keys].Ask);
                            LtpColor = (LastPriceDictionary[keys].LtpColor);
                            AskColor = (LastPriceDictionary[keys].AskColor);
                            BidColor = (LastPriceDictionary[keys].BidColor);
                            break;
                        }
                    }
                    var LastAskHtml = "";
                    if (parseFloat(item.Ask) > PreviousAskPrice) {
                        LastAskHtml = '<div class="price-up">' + item.Ask.toFixed(2) + '</div>';
                        AskColor = "price-up";
                    }
                    if (parseFloat(item.Ask) < PreviousAskPrice) {
                        LastAskHtml = '<div class="price-down">' + item.Ask.toFixed(2) + '</div>';
                        AskColor = "price-down";
                    }
                    if (item.Ask == PreviousAskPrice) {
                        if (AskColor == "")
                            AskColor = "price-up";
                        LastAskHtml = '<div class="' + AskColor + '">' + item.Ask.toFixed(2) + '</div>';
                    }
                    var LastBidHtml = "";
                    if (parseFloat(item.Bid) > PreviousBidPrice) {
                        LastBidHtml = '<div class="price-up">' + item.Bid.toFixed(2) + '</div>';
                        BidColor = "price-up";
                    }
                    if (parseFloat(item.Bid) < PreviousBidPrice) {
                        LastBidHtml = '<div class="price-down">' + item.Bid.toFixed(2) + '</div>';
                        BidColor = "price-down";
                    }
                    if (item.Bid == PreviousBidPrice) {
                        if (BidColor == "")
                            BidColor = "price-up";
                        LastBidHtml = '<div class="' + BidColor + '">' + item.Bid.toFixed(2) + '</div>';
                    }

                    if (item.Close == null)
                        item.Close = 0;

                    var PerChange = parseFloat(item.LastPrice) - parseFloat(item.Close);
                    var perCentageHtml = "";
                    var perChangeInDigit = "";
                    var perCentage = "";
                    if (PerChange < 0) {
                        perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                        if (SCRIPT_TYPE == "BINANCE") {
                            perCentage = item.Change;
                        }
                        if (SCRIPT_TYPE == "FOREX") {
                            perCentage = 0.00;
                        }
                        perCentageHtml = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
                        /*                    perChangeInDigit = '<i class="fa percentage-price-down">&nbsp&nbsp' + item.ChangeInRupee.toFixed(2) + '</i>';*/
                    }
                    else if (PerChange >= 0) {
                        perCentage = (parseFloat(PerChange) / parseFloat(item.Close)) * 100;
                        if (SCRIPT_TYPE == "BINANCE") {
                            perCentage = item.Change;
                        }
                        if (SCRIPT_TYPE == "FOREX") {
                            perCentage = 0.00;
                        }
                        perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
                        /*perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + item.ChangeInRupee.toFixed(2) + '</i>';*/
                    }
                    var LastPriceHtml = "";
                    if (parseFloat(item.LastPrice) > PreviousLastPrice) {
                        LastPriceHtml = 'LTP : <span class="price-up">' + item.LastPrice.toFixed(2) + '</span>';
                        LtpColor = "price-up";
                    }
                    if (parseFloat(item.LastPrice) < PreviousLastPrice) {
                        LastPriceHtml = 'LTP : <span class="price-down">' + item.LastPrice.toFixed(2) + '</span>';
                        LtpColor = "price-down";
                    }
                    if (item.LastPrice == PreviousLastPrice) {
                        if (LtpColor == "")
                            LtpColor = "price-up";
                        LastPriceHtml = 'LTP : <span class="' + LtpColor + '">' + item.LastPrice.toFixed(2) + '</span>';
                    }

                    if ($('#buySellModel #lblScriptCode').text() == item.ScriptCode) {
                        var ltp = item.LastPrice.toString();
                        $('#buySellModel #lblLastPrice').text(ltp);
                        $('#buySellModel #lblLastBid').text(item.Bid);
                        $('#buySellModel #lblLastAsk').text(item.Ask);
                        $('#buySellModel #hdnPrice').val(ltp);
                    }
                    var IsExistsLTP = false;
                    for (var keys in LastPriceDictionary) {
                        if (LastPriceDictionary[keys].key == item.InstrumentToken) {
                            IsExistsLTP = true;
                            LastPriceDictionary[keys].value = item.LastPrice;
                            LastPriceDictionary[keys].Bid = item.Bid;
                            LastPriceDictionary[keys].Ask = item.Ask;
                            LastPriceDictionary[keys].LtpColor = LtpColor;
                            LastPriceDictionary[keys].AskColor = AskColor;
                            LastPriceDictionary[keys].BidColor = BidColor;
                            break;
                        }
                    }
                    if (!IsExistsLTP) {
                        LastPriceDictionary.push({
                            key: item.InstrumentToken,
                            value: item.LastPrice,
                            Bid: item.Bid,
                            Ask: item.Ask,
                            LtpColor: LtpColor,
                            AskColor: AskColor,
                            BidColor: BidColor
                        });
                    }


                }
            }

            if ($('#buySellModel').hasClass('in')) {
                var newL = nData.filter(opt => opt.InstrumentToken == $('#buySellModel #lblScriptCode').text());
                if (newL.length > 0) {
                    $('#buySellModel #lblLastPrice').text(newL[0].LastPrice);
                    $('#buySellModel #lblLastBid').text(newL[0].Bid);
                    $('#buySellModel #lblLastAsk').text(newL[0].Ask);
                    $('#buySellModel #hdnHigh').text(newL[0].High);
                    $('#buySellModel #hdnLow').text(newL[0].Low);
                    $('#buySellModel #hdnPrice').val(newL[0].LastPrice);
                }
            }
            if ($('.mobile-context-menu').css('display') == 'block') {
                var newL = nData.filter(opt => opt.InstrumentToken == clicked_Watchlist_InstrumentToken);
                if (newL.length > 0) {
                    $('#lastPriceMobileContextMenu').html('LTP : ' + newL[0].LastPrice);
                }
            }
            i++;
        }
    }
}

document.body.addEventListener('click', function (event) {
    var element = document.querySelector('ul.mobile-context-menu-list.list-flat');
    var element2 = document.querySelector('#watchlistDiv');
    var element3 = document.querySelector('#ActiveTradeDiv');
    var element4 = document.querySelector('ul.mobile-context-menu-Active-list.list-flat');
    if (element != '' && element != null) {
        if (!element.contains(event.target) && !element2.contains(event.target)) {
            window.clearInterval(marketDepthInterval);
            $('.mobile-context-menu').css('display', 'none');
        }
    }
    if (element3 != '' && element3 != null) {
        if (!element3.contains(event.target) && !element4.contains(event.target)) {
            $('.mobile-context-menu-Active').css('display', 'none');
        }
    }
});

function MarketDepthPop(scriptCode, symbolParam, lastprice) {
    var request = $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: scriptCode },

        success: function (data) {
            $("#marketDepthDiv").html(data);
            marketDepthInterval = setInterval(function () { SetMarketDepthForRefresh(scriptCode, symbolParam, lastprice); }, 1000);
            return true;
        }
    });

}

function SetActiveTradeDetails(item, TableName) {



    var btnName = 'btn';

    var symbolParam = '\'' + item.TradeSymbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var productType = '\'' + item.ProductType + '\'';
    var priceType = '\'' + item.PriceType + '\'';
    var pos = '\'' + item.CurrentPosition.toString() + '\'';
    var st = '\'' + item.Status.toString() + '\'';
    var ScriptExchange = '\'' + item.ObjScriptDTO.ScriptExchange.toString() + '\'';
    var buyButton = "";
    var sellButton = "";

    var isManualStaratgy = false;
    if (item.StrategyName == "Manual")
        isManualStaratgy = true;
    var RoleId = $("#Role_Id").val();

    var currentPosition = item.CurrentPosition;
    var buyorsell = 2;
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
    var GetQtyType = item.TRADING_UNIT.toLowerCase() == "qty" ? 'U' : '';
    var editButton = "";
    var syncButton = "";
    var addbutton = "";

    if (item.Status.toUpperCase() != "REJECTED") {
        if (item.CurrentPositionNew == "BUY")
            buyorsell = 1;
        editButton = ' <button class="btn btn-primary btn-sm btn-Edit" id="btn-Edit' + item.ActiveTradeID + '" onclick="buySellPopUp(' + item.BuyQtyWiseOrLot + ',' + item.ScriptCode + ',' + buyorsell + ',' + symbolParam + ',' + item.WID + ',' + item.OrderPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + sQty + ',' + item.ObjScriptDTO.ScriptLotSize + ',' + item.TriggerPrice + ',' + item.SLNew + ',' + item.TGNew + ',' + priceType + ',' + productType + ',' + item.ActiveTradeID + ',' + st + ')" type="button"><i class="fa fa-pencil"></i></button> ';
        //if (item.OrderID > 0 && item.OrderSync == 0 && item.Status.toUpperCase() != "COMPLETE")
        //    syncButton = ' &nbsp <button class="btn btn-primary btn-sm" type="button" onclick="CallSync(' + item.ActiveTradeID + ')"><i class="fa fa-refresh"></i></button>';
        buyButton = ' <button class="btn btn-primary btn-sm btn-Sqroff" id="btn-Sqroff' + item.ActiveTradeID + '" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
        sellButton = ' <button class="btn btn-danger btn-sm btn-sell btn-Sqroff" id="btn-Sqroff' + item.ActiveTradeID + '" onclick="SquareOff(' + item.ActiveTradeID + ',' + pos + ',' + st + ',' + sQty + ',' + isManualStaratgy + ')" type="button">Sqr Off</button> ';
        if (item.Status.toUpperCase() != "OPEN" && isManualStaratgy)
            addbutton = '<button class="btn btn-primary btn-sm btn-sell btn-Add" id="btn-Add' + item.ActiveTradeID + '" onclick="AddQty(' + item.ActiveTradeID + ',' + pos + ',' + st + ')" type="button"><i class="fa fa-plus"></i></button>';

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
    if (item.Status.toUpperCase() == "REJECTED" || item.Status.toUpperCase() == "CANCELED") {
        RejectedOrderDeleteBtn = '<button id="btn-DelActive' + item.ActiveTradeID + '" onclick = "DeleteRejectedTrade(' + item.ActiveTradeID + ')" type = "button" class="btn btn-warning btn-sm btn-DelActive" > <i class="fa fa-trash-o"></i></button > ';
    }
    var roleid = $("#Role_Id").val();
    if (roleid == 4 || roleid == 5) {
        if (item.Status != "CANCELED" && item.Status != "REJECTED") {
            RejectedOrderDeleteBtn = '<button class="btn btn-primary btn-sm btn-sell btn-DelActive" href="javascript:void(0)" id="btn-DelActive' + item.ActiveTradeID + '" onclick="DeleteActiveTrade(' + item.ActiveTradeID + ',' + item.UserID + ')" data-bind=' + item.ActiveTradeID + ' style="margin-right:10px;margin-left:5px;" ><i class="fa fa-trash-o"></i> </button> ';
        }
    }

    var deleteButton = ' <a href="javascript:void(0)" id="' + item.ActiveTradeID + '" data-tradeId="' + item.ActiveTradeID + '" class="delete-prompt"><button type="button" class="btn btn-danger btn-sm"><i class="fa fa-trash-o"></i></button></a> ';
    var actionButton = currentPosition + editButton + syncButton + addbutton + RejectedOrderDeleteBtn; //+ deleteButton
    buttons: [
        'copy', 'excel', 'pdf'
    ];
    var companyINitials = $("#companyInitials").val();
    if (item.ObjScriptDTO.ScriptExchange == "FOREX" && companyINitials == "RT") {
        item.ObjScriptDTO.LastPrice = (item.ObjScriptDTO.LastPrice).toFixed(5);
        item.OrderPrice = (item.OrderPrice).toFixed(5);
        item.TriggerPrice = (item.TriggerPrice).toFixed(5);
        item.SL = (item.SL).toFixed(5);
        item.TGT2 = (item.TGT2).toFixed(5);
        item.TGT3 = (item.TGT3).toFixed(5);
        item.TGT4 = (item.TGT4).toFixed(5);
    }
    var P_L = "";
    var CP = "";
    if (parseFloat(item.ProfitOrLoss) >= 0) {
        P_L = '<font style="color:#4987ee !important;font-weight:bold;">' + item.ProfitOrLoss + '</font>';
    }
    else if (parseFloat(item.ProfitOrLoss) < 0) {
        P_L = '<font style="color:#ff4a4a;font-weight:bold;">' + item.ProfitOrLoss + '</font>';
    }
    var css = "row-New-Theme p-2 watchlistRow";
    var Div_SL_TGT_STATUS = '';
    item.Email = item.Email.split('@')[0];
    if (item.SL == 0 && item.TGT2 == 0 && item.TGT3 == 0 && item.TriggerPrice < 0.1 && item.Status == "COMPLETE" || item.Status == "OPEN") {
        Div_SL_TGT_STATUS = '<div class="col-12" >' +
            '   <p class="watchlist-p" style="display:none;font-size: 11px;  margin-bottom: 5px;"> SL : ' + item.SL + ' | TGT : ' + item.TGT2 + ' | TGT2 : ' + item.TGT3 + ' | TGT3 : ' + item.TGT4 + '</p>' +
            '   <p class="watchlist-p" style="display:none;font-size: 11px;  margin-bottom: 5px;"> TRIGGER : ' + item.TriggerPrice + ' |  STATUS : ' + item.Status + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;">Date : ' + item.OrderDate + ' ' + item.OrderTime + ' | Name: ' + item.Email + ' | CP: ' + item.CurrentPositionNew + ' </p>' +
            '</div>';
    }
    else {
        Div_SL_TGT_STATUS = '<div class="col-12" >' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;"> SL : ' + item.SL + ' | TGT : ' + item.TGT2 + ' | TGT2 : ' + item.TGT3 + ' | TGT3 : ' + item.TGT4 + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;"> TRIGGER : ' + item.TriggerPrice + ' |  STATUS : ' + item.Status + '</p>' +
            '   <p class="watchlist-p" style="font-size: 11px;  margin-bottom: 5px;">Date : ' + item.OrderDate + ' ' + item.OrderTime + ' | Name: ' + item.Email + ' | CP: ' + item.CurrentPositionNew + ' </p>' +
            '</div>';
    }
    var html = '<div class="row p-2 activeTradeRow" id="' + item.OrderDate + "_" + item.OrderTime + '" data-scripttradingsymbol="' + item.TradeSymbol + '" data-scriptexchange="' + item.ObjScriptDTO.ScriptExchange + '" data-PL="' + item.ProfitOrLoss + '" data-Qty="' + sQty + '">' +
        '<div class="col-12" >' +
        '<div class="' + css + '">' +
        '<div class="card-body" style="padding:5px;">' +
        '   <div class="row">' +
        '<div class="col-6">' +
        ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px;">' + item.TradeSymbol + '</p>' +
        '</div>' +
        '<div class="col-6">' +
        '     <div class="row" style="margin-top:3px;">' +
        '          <div class="col-5">' +
        '               <label class="watchlist-p" style="font-size: 12px">' + sQty + GetQtyType + '</label>' +
        '          </div>' +
        '             <div class="col-7" style="margin-left:-7px;">' +
        '                  <span class="watchlist-p" style="font-size: 12px;font-weight:bold"> LTP: ' +
        '               ' + item.ObjScriptDTO.LastPrice + '' +
        '                        </span>' +
        '                 </div>' +
        '              </div>' +
        '           </div>' +
        '<div style="display:none;">' + actionButton + '</div>' +
        '<div class="col-5">' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;">AVG : ' + item.OrderPrice + ' </p>' +
        '</div>' +
        '<div class="col-5">' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;"> P&L : ' + P_L + ' </p>' +
        '</div>' +
        Div_SL_TGT_STATUS +
        '        </div>' +
        '     </div>' +
        '  </div>' +
        '</div >' +
        '</div >';
    $('#' + TableName).append(html);


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

    var sQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ScriptLotSize;
    }
    else {
        if (item.ScriptLotSize > 10 && item.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    var GetQtyType = item.TRADING_UNIT.toLowerCase() == "qty" ? 'U' : '';

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
        sQty + GetQtyType,
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
    var LastAskHtml = '<div class="price-up">' + item.Ask.toFixed(2) + '</div>';
    var LastBidHtml = '<div class="price-up">' + item.Bid.toFixed(2) + '</div>';
    var LastPriceHtml = ' LTP <span class="price-up" >' + item.LastPrice.toFixed(2) + '</span>';

    var symbolParam = item.ScriptName.replace(/'/g, "");
    symbolParam = '\'' + symbolParam + '\'';

    var script_Trading_Symbol = item.ScriptTradingSymbol.replace(/'/g, "");
    script_Trading_Symbol = '\'' + script_Trading_Symbol + '\'';
    var ScriptInstrumentType = '\'' + item.ScriptInstrumentType + '\'';
    var ScriptExchange = '\'' + item.ScriptExchange.toString() + '\'';

    var PerChange = parseFloat(item.LastPrice) - parseFloat(item.close);
    var perCentageHtml = "";
    var perCentage = "";
    var perChangeInDigit = "";
    if (PerChange < 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.ScriptType == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.ScriptType == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-down percentage-price-down">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-down">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    else if (PerChange >= 0) {
        perCentage = (parseFloat(PerChange) / parseFloat(item.close)) * 100;
        if (item.ScriptType == "BINANCE") {
            perCentage = item.PerChange;
        }
        if (item.ScriptType == "FOREX") {
            perCentage = 0.00;
        }
        perCentageHtml = '<i class="fa fa-angle-up percentage-price-up">&nbsp&nbsp' + perCentage.toFixed(2) + '</i>';
        perChangeInDigit = '<i class="fa percentage-price-up">&nbsp&nbsp' + PerChange.toFixed(2) + '</i>';
    }
    var qty = 1;

    var hiddenCode = '<input name="hiddenCode" value="' + item.ScriptCode + '" type="hidden" >';
    var btnBuyid = "btnBuy" + item.ScriptCode;
    var btnSellid = "btnSell" + item.ScriptCode;
    var btnMarketDepth = "btnMarketDepth" + item.ScriptCode;
    var btnDeleteid = "btnDelete" + item.ScriptCode;
    var deleteButton = ' <button id="' + btnDeleteid + '" onclick="removeScript(' + item.ScriptCode + ',' + item.WID + ')" type="button" class="btn btn-warning btn-sm btn-delete"><i class="fa fa-trash-o"></i></button> ';
    var buyButton = '<div tabindex="-1" style="display:none;" class="b-btn"><button class="btn-buy" id="' + btnBuyid + '" onclick="buySellPopUp(0,' + item.ScriptCode + ',1,' + symbolParam + ',' + item.WID + ',' + item.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + qty + ',' + item.ScriptLotSize + ',' + item.LastPrice + ')" type="button" class="btn btn-success btn-sm btn-buy">B </button> ';
    var sellButton = '<button class="btn-sell" id="' + btnSellid + '" onclick="buySellPopUp(0,' + item.ScriptCode + ',2,' + symbolParam + ',' + item.WID + ',' + item.LastPrice + ',' + ScriptInstrumentType + ',' + ScriptExchange + ',' + qty + ',' + item.ScriptLotSize + ',' + item.LastPrice  + ')" type="button" class="btn btn-danger btn-sm btn-sell"> S </button> ';
    var marketDepthButton = '</div>';
    var actionButton = buyButton + sellButton + deleteButton + marketDepthButton + hiddenCode;

    var btnMarketDepthForClick = "'#" + btnMarketDepth + "'";
    var companyInitials = $("#CompanyInitial").val();
    if (item.ScriptType == "FOREX" && companyInitials == "RT") {
        item.open = (item.open).toFixed(5);
        item.LastPrice = (item.LastPrice).toFixed(5);
        item.high = (item.high).toFixed(5);
        item.low = (item.low).toFixed(5);
        item.close = (item.close).toFixed(5);
    }
    var html = "";

    var ScriptExpiry = "";
    if (item.ScriptExpiry != "") {
        var date = item.ScriptExpiry.split(" ");
        ScriptExpiry = '<span style="color: red;font-size: 13px;">' + date[0] + '</span>';
    }
    var scriptInstumentType = '';
    if (item.ScriptInstrumentType == "FUT") {
    }
    else if (item.ScriptInstrumentType == "PE" || item.ScriptInstrumentType == "CE") {
        scriptInstumentType = item.ScriptInstrumentType;
    }
    if (item.ScriptName == "")
        item.ScriptName = item.ScriptTradingSymbol;
    if (item.ScriptName.length > 18) {
        item.ScriptName = item.ScriptName.substring(0, 18) + "...";
    }

    html = '<div class="row watchlistRowViewNEWUI" style="border-bottom: 1px solid #ddd;" id="' + item.ScriptCode + '" data-scriptType="' + item.ScriptType + '"  data-scripttradingsymbol="' + item.ScriptTradingSymbol + '" data-scriptexchange="' + item.ScriptExchange + '">' +
        '<div class="col-12" >' + actionButton + ' ' +
        '<div class="watchlist-card c-left-border watchlist-table">' +
        '<div class="card-body" id="' + btnMarketDepth + '" style="padding:5px;">' +
        '   <div class="row">' +
        '<div class="col-6">' +
        '  <p class="watchlist-p watchlist-text-BBR Percentage_SEGMENT">  ' + perChangeInDigit + '(' + perCentageHtml + ')</p>' +
        '</div>' +
        '<div class="col-5">' +
        '  <p class="watchlist-p watchlist-text-BBR LTP_SEGMENT" style="margin-left:-13px;float:left;padding-left: 4px;">  ' + LastPriceHtml + '</p>' +
        '</div>' +
        '<div class="col-6">' +
        ' <p class="watchlist-p watchlist-text-BBR">' + item.ScriptName + scriptInstumentType + '</p>' +
        '</div>' +
        '<div class="col-5">' +
        '     <div class="row BID_ASK_SEGMENT" style="margin-left:2px;">' +
        '             <div class="col-5" style="margin-left:-15px;display: flex;font-size: 20px !important;">' +
        '               ' + '<div class="price-up" style="padding-bottom:0px;">' + item.Bid.toFixed(2) + '</div>' +
        '             </div>' +
        '            <div class="col-7" style="display:flex;margin-left:15px;font-size: 20px !important;">' +
        '              ' + '<div class="price-up" style="padding-bottom:0px;">' + item.Ask.toFixed(2) + '</div>' +
        '       </div> ' +
        '              </div>' +
        '           </div>' +
        /*'<div class="col-12" style="display:flex">' +*/
        '<div class="col-4">' +
        '  <p class="watchlist-p watchlist-text-BBR">' + ScriptExpiry + '</p>' +
        '</div>' +
        '<div class="col-7">' +
        '  <p class="watchlist-p watchlist-text-BBR HIGH_LOW" style="float: left;padding-left: 57px;"> H : ' + item.high + ' |   L : ' + item.low + '</p>' +
        '</div>' +
        /*            '</div>' +*/
        '        </div>' +
        '     </div>' +
        '  </div>' +
        '</div >' +
        '</div >';

    $('#watchlistDiv').append(html);

}
var pageno = 0;
function removeScript(ScriptCode, intWID) {

    newconfirmMobile("Delete This Record", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
            if (ScriptCode > 0 && intWID > 0) {
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
    });


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
        toastr.error("Error On SetTradeData.");
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
            input = { 'tradetype': 0, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo, 'UserId': userIdForTrade, 'IsAdmin': IsAdminOrBroker, 'searchedData': $("#searchText").val() };
        }
        else if ($('#rdLive').prop('checked') == true) {
            input = { 'tradetype': 1, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo, 'UserId': userIdForTrade, 'IsAdmin': IsAdminOrBroker, 'searchedData': $("#searchText").val() };
        }
        else {
            input = { 'tradetype': 2, 'Wid': Wid, 'scriptExchangeType': selectedScriptExchange, 'WatchListPage': _WatchlistCurrentPageNo, 'CompletedListPage': _CompletedCurrentPageNo, 'ActiveTradePage': _ActiveCurrentPageNo, 'UserId': userIdForTrade, 'IsAdmin': IsAdminOrBroker, 'searchedData': $("#searchText").val() };
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
        toastr.error("Error On SetTradeData.");
    }
}

function SetResult(data) {
    var Total_Active = 0, Total_Pending = 0;
    var results = JSON.parse(data);

    if (results != null) {

        if (results.TotalCompletedTradeCount > 0)
            $('.TotalCompletedTrade > h3').text(results.TotalCompletedTradeCount);
        else
            $('.TotalCompletedTrade > h3').text('0');

        $('.TotalCompletedTradeProfitOrLoss > h3').text(results.TotalCompletedTradeProfitOrLoss);

        $('#watchlistDiv').html('');
        if (results.objLstWatchList != null) {
            for (var i = 0; i < results.objLstWatchList.length; i++) {
                var result = results.objLstWatchList[i];
                SetWatchTradeDetails(result);
            }
            if (results.objLstWatchList.length == 0) {
                $('#watchlistDiv').html('');
            }
        }
        if (results.ActiveTrade != null) {
            //Set data for WatchList trade
            if (results.ActiveTrade.length > 0) {
                $('#ActiveTradeDiv').html('');
                $('#PendingTradeDiv').html('');
                var Table_Name;
                for (var i = 0; i < results.ActiveTrade.length; i++) {
                    var result = results.ActiveTrade[i];
                    var Status = result.Status;
                    if (Status == "COMPLETE") {
                        Total_Active += 1;
                        Table_Name = 'ActiveTradeDiv';
                        SetActiveTradeDetails(result, Table_Name);
                    }
                    else {
                        Total_Pending += 1;
                        Table_Name = 'PendingTradeDiv';
                        SetActiveTradeDetails(result, Table_Name);
                    }

                }
                $('#Total_Pending').html('');
                $('#Total_Active').html('');
                $('#Total_Pending').html(Total_Pending);
                $('#Total_Active').html(Total_Active);
            }
            else {
                $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
                $('#Total_Pending').html('');
                $('#Total_Active').html('');
                $('#Total_Pending').html(Total_Pending);
                $('#Total_Active').html(Total_Active);
            }
            $('.TotalActiveTradeProfitOrLoss > h3').text(results.TotalActiveTradeProfitOrLoss);
            $('.TotalActiveTrade > h3').text(results.TotalActiveTradeCount);
            if (results.TotalActiveTradeProfitOrLoss >= 0) {
                $('.dvTotalActiveTradeProfitOrLoss').addClass("bg-Purple");
                $('.dvTotalActiveTradeProfitOrLoss').removeClass("bg-Danger1");
            }
            else {
                $('.dvTotalActiveTradeProfitOrLoss').addClass("bg-Danger1");
                $('.dvTotalActiveTradeProfitOrLoss').removeClass("bg-Purple");
            }
            if (results.TotalCompletedTradeProfitOrLoss >= 0) {
                $('.dvTotalCompletedTradeProfitOrLoss').addClass("bg-Purple");
                $('.dvTotalCompletedTradeProfitOrLoss').removeClass("bg-Danger1");
            }
            else {
                $('.dvTotalCompletedTradeProfitOrLoss').addClass("bg-Danger1");
                $('.dvTotalCompletedTradeProfitOrLoss').removeClass("bg-Purple");
            }
        }
        else {
            $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
            $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
            $('#Total_Pending').html('');
            $('#Total_Active').html('');
            $('#Total_Pending').html(Total_Pending);
            $('#Total_Active').html(Total_Active);
        }
    }
    else {
        $('#ActiveTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
        $('#PendingTradeDiv').html('<p class="text-center" style="color:#fff">No Active Trade Available.</p>');
        $('#Total_Pending').html('');
        $('#Total_Active').html('');
        $('#Total_Pending').html(Total_Pending);
        $('#Total_Active').html(Total_Active);
    }

}
$("#searchText").on('keyup', function () {
    SetTradeDataForRefresh();
});
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
            toastr.error("Error On SetTradeData.");
        }
    }
});
$('#cboScriptExchange').on('change', function () {
    try {
        SetTradeDataForRefresh();
    }
    catch (e) {
        toastr.error("Error On SetTradeData.");
    }

});
function SetWishlistResult(data) {

    var results = JSON.parse(data);

    if (results != null) {

        //Set data for active trade
        $('#watchlistDiv').html('');

        for (var i = 0; i < results.objLstWatchList.length; i++) {
            var result = results.objLstWatchList[i];
            SetWatchTradeDetails(result);
        }
        if (results.objLstWatchList.length == 0) {
            $('#watchlistDiv').html('');
        }

        //End

    }

}
function buySellPopUp(BuyQtyWiseOrLot, ScriptCode, no, ScriptSymbol, Wid, price, instumentType, ScriptExchange, Quantity = 1, ScriptLotSize = 1, Triggerprice = 0, SL = 0, Target = 0, PriceType = '', producttype = '', TradeID = 0, sttus = '') {
    $('.upperClause :input').removeAttr('disabled');
    if ($("#CompanyInitial").val() == "EXPO") {

        $(".TriggerPriceDiv").css("display", "none");
        $(".rbtnSLDiv").css("display", "none");
        $("#RememberDiv").css("display", "none");
    }

    $('#btnProceedBuySell').removeAttr('disabled');
    $('#buySellModel .modal-title').css("color", "#fff");
    $('#buySellModel #Terror').hide();
    $('#buySellModel #Quantity-error').hide();

    $("#buySellModel #hdnScriptExchange").val(ScriptExchange);
    $("#buySellModel #hdnScriptLotSize").val(ScriptLotSize);
    var CurrentPosition = "";
    if (no == 1) {
        CurrentPosition = 'BUY';
        $('#buySellModel .modal-title').css("background-color", "#00a65a");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#4987ee");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("BUY");
    }
    else if (no == 2) {
        CurrentPosition = 'SELL';
        $('#buySellModel .modal-title').css("background-color", "#dd4b39");
        $('#buySellModel #btnProceedBuySell').css("background-color", "#ff4a4a");
        $('#buySellModel #btnProceedBuySell').css("color", "#fff");
        $('#buySellModel #btnProceedBuySell').text("SELL");
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

        }
        else {
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

    if (PriceType.length == 0) {

        var RememberData = localStorage.getItem("RememberTargetStoploss");
        if (RememberData != null) {
            RememberData = JSON.parse(RememberData);
            $("#cbxRememberTargetStoploss").prop('checked', true);
            // $("#txtTarget").val(RememberData.TGT);
            // $("#txtStopLoss").val(RememberData.SL);

            if (RememberData.PRODUCT_TYPE != null && RememberData.PRODUCT_TYPE != '') {
                RememberData.PRODUCT_TYPE == 'MIS' ? $('input[name=ProductType]#rbtnIntraday').trigger('click') : $('input[name=ProductType]#rbtnNrml').trigger('click');
            }
            if (RememberData.PRICE_TYPE != null && RememberData.PRICE_TYPE != '') {
                if (RememberData.PRICE_TYPE == 'MARKET') {
                    $('input[name=MarketType]#rbtnMarket').trigger('click');
                } else if (RememberData.PRICE_TYPE == 'LIMIT') {
                    $('input[name=MarketType]#rbtnLimit').trigger('click');
                }
                else if (RememberData.PRICE_TYPE == 'SL') {
                    $('input[name=MarketType]#rbtnSL').trigger('click');
                }
                else if (RememberData.PRICE_TYPE == 'SL-M') {
                    $('input[name=MarketType]#rbtnSLM').trigger('click');
                }
            }
            PriceType = $('input[name=MarketType]:checked').val();
        }
        else {
            $("input[name=MarketType]#rbtnMarket").trigger('click');
            $('input[name=ProductType]#rbtnNrml').trigger('click');
        }
    }
    if (PriceType != null && PriceType != '') {
        if (PriceType == 'MARKET') {
            $('input[name=MarketType]#rbtnMarket').trigger('click');
        } else if (PriceType == 'LIMIT') {
            $('input[name=MarketType]#rbtnLimit').trigger('click');
        }
        else if (PriceType == 'SL') {
            $('input[name=MarketType]#rbtnSL').trigger('click');
        }
        else if (PriceType == 'SL-M') {
            $('input[name=MarketType]#rbtnSLM').trigger('click');
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
    var companyInitials = $("#CompanyInitial").val();
    if ($('#IsTargetStopLossAbsolute').val()=='True') {
        if (CurrentPosition.toLowerCase() == "buy") {
            $("#txtStopLoss").val(SL > 0 ? price - SL : 0);
            $("#txtTarget").val(Target > 0 ? price + Target : 0);
        }
        else {
            $("#txtStopLoss").val(SL > 0 ? price + SL : 0);
            $("#txtTarget").val(Target > 0 ? price - Target : 0);
        }
    }

    var RememberData = localStorage.getItem("RememberTargetStoploss");
    if (RememberData != null) {
        RememberData = JSON.parse(RememberData);
        $("#cbxRememberTargetStoploss").prop('checked', true);
        $("#txtTarget").val(RememberData.TGT);
        $("#txtStopLoss").val(RememberData.SL);
    }
}

function ProceedBuySell() {

    if ($("#cbxRememberTargetStoploss").prop('checked') == true) {
        var data = { TGT: $("#txtTarget").val(), SL: $("#txtStopLoss").val() };
        localStorage.setItem("RememberTargetStoploss", JSON.stringify(data));
    }
    else {
        localStorage.removeItem("RememberTargetStoploss");
    }

    var ScriptCode = $("#lblScriptCode").text();
    var CurrentPosition = $("#lblCurrentPosition").text();
    intWID = $("#Wid").val();
    var target = $("#txtTarget").val();
    var stopLoss = $("#txtStopLoss").val();
    var quantity = $("#Quantity").val();
    var scriptExchange = $("#buySellModel #hdnScriptExchange").val();
    var scriptLotSize = $("#buySellModel #hdnScriptLotSize").val();
    var price = $("#Price").val();
    var triggerPrice = $("#TriggerPrice").val();
    var tradeID = $("#hdnTradeID").val();
    var productType = $('input[name=ProductType]:checked').val();
    var marketType = $('input[name=MarketType]:checked').val();
    if (ScriptCode == null || ScriptCode == "" ||
        CurrentPosition == null || CurrentPosition == "") {
        toastr.error("Please enter correct details");
        return;
    }
    if (marketType == "SL" || marketType == "SL-M") {
        var oprice = parseFloat(price);
        var tprice = parseFloat(triggerPrice);
        var hdprice = $('#buySellModel #hdnPrice').val();
        var hdnPrice = parseFloat(hdprice);
        var showError = false;
        var msg = "";

        if (marketType == "SL") {
            if (CurrentPosition == "SELL" && marketType == "SL" && oprice > tprice) {
                showError = true;
                msg = "Trigger price connot be less than order price";
            }
            else if (CurrentPosition == "BUY" && marketType == "SL" && oprice < tprice) {
                showError = true;
                msg = "Trigger price Cannot be higher than order price";
            }
        }
        if (CurrentPosition == "SELL" && tprice > hdnPrice) {
            showError = true;
            msg = "Trigger price Cannot be higher than last price";
        }
        else if (CurrentPosition == "BUY" && tprice < hdnPrice) {
            showError = true;
            msg = "Trigger price connot be less than last price";
        }
        if (showError) {
            $('#buySellModel #Terror').text(msg);
            $('#buySellModel #Terror').show();
            $('#btnProceedBuySell').removeAttr('disabled');
            return;
        }
        if (oprice > 0) {
            lastPrice = oprice;
        }
        else {
            oprice = lastPrice;
        }
        var companyInitials = $("#CompanyInitial").val();
        if ($('#IsTargetStopLossAbsolute').val()=='True') {
            var msg = "";
            if (CurrentPosition == 'BUY') {
                if (target > 0) {
                    if (target < oprice)
                        msg = 'Target should be greater than Order price';
                }
                if (stopLoss > 0) {
                    if (stopLoss > oprice)
                        msg = 'StopLoss should be less than Order price';
                }

            }
            else {
                if (target > 0) {
                    if (target > oprice)
                        msg = 'Target should be less than Order price';
                }
                if (stopLoss > 0) {
                    if (stopLoss < oprice)
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
    var iscbxAutoBinanceSlTrailEnabled = 0;
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
                    $("#errorModal .modal-body").html('<p class="text-danger">' + results.TypeName + '</p>');
                    $("#errorModal").modal('show');
                    //toastr.errorresults.TypeName);
                    return false;
                }
                else {
                    //var table = $('#tblList').DataTable();
                    //table.row($("#btnName" + ScriptCode).parents('tr')).remove().draw(false);
                    //toastr.error("Script deleted successfully.");
                    if (tradeID != '0') {
                        $("#errorModal .modal-body").html('<p class="text-success">Order Updated successfully</p>');
                        $("#errorModal").modal('show');
                    }
                    else {
                        $("#errorModal .modal-body").html('<p class="text-success">Order Placed successfully</p>');
                        $("#errorModal").modal('show');
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
function SquareOff(id, param, st, qty, isManualStaratgy) {
    $(sqModal).find(".sqMsg").text('');
    $(sqModal).find("input[name=sqQty]").val(qty);
    $(sqModal).find("input[name=hdQty]").val(qty);
    $(sqModal).find("input[name=sqActiveTradeId]").val(id);
    $(sqModal).find("input[name=sqStatus]").val(st);
    $(sqModal).find("input[name=sqParam]").val(param);
    if (isManualStaratgy)
        $(sqModal).modal('show');
    else {
        newconfirmMobile("square off?", function () {
            var resp = $('body').find('.cresp').html();
            $('body').find('.cresp').remove();
            if (resp == 'Yes') {
                ProceedSqOf();
            }
        });
    }

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
    newconfirmMobile("sync order?", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
            var request = $.ajax({
                url: "/Trade/CallSync",
                type: "POST",
                data: { ID: activeTradeID },
                dataType: 'json',
                traditional: true,
                success: function (data) {
                    var results = JSON.parse(data);

                    $("#errorModal .modal-body").html('<p class="text-success">Order Sync request sent successfully</p>');
                    $("#errorModal").modal('show');


                    return false;
                }
            });
        }
    });
}
//var marketDepthInterval;
//function MarketDepthPop(scriptCode, symbolParam) {
//    var htmlString = '<button type="button" class="btn btn-success" onclick="HideDepthModal();$(\'#btnBuy' + scriptCode + '\').click()">Buy</button>';
//    htmlString += '<button type="button" class="btn btn-danger" onclick="HideDepthModal();$(\'#btnSell' + scriptCode + '\').click()">Sell</button>';
//    $("#MarketDepthModal #buySellButtonDiv").html(htmlString);
//    $("#MarketDepthModal #lblDepthScriptSymbol").text(symbolParam);
//    $("#MarketDepthModal #hdnDepthScriptCode").val(scriptCode);
//    var request = $.ajax({
//        url: "/Trade/_MarketDepth",
//        type: "POST",
//        data: { ScriptCode: scriptCode },

//        success: function (data) {
//            //var results = JSON.parse(data);

//            $("#MarketDepthModal .modal-body").html(data)
//            //$("#MarketDepthModal").modal('show');
//            $('#MarketDepthModal').modal({
//                backdrop: false,
//                show: true
//            });
//            $("body").removeClass('modal-open');
//            marketDepthInterval = setInterval(function () { SetMarketDepthForRefresh(); }, 1000);
//            return false;
//        }
//    });
//}
function SetMarketDepthForRefresh(scriptCode) {
    var request = $.ajax({
        url: "/Trade/_MarketDepthMobile",
        type: "POST",
        data: { ScriptCode: scriptCode },
        async: true,
        success: function (data) {
            $("#marketDepthDiv").html(data);
            return true;
        }
    });
}
//function HideDepthModal() {
//    clearInterval(marketDepthInterval);
//    $("#MarketDepthModal").modal('hide');
//}
function HideDepthModal() {
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
                //toastr.error("Duplicate record.");
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
function GetCompletedData() {
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
    }
    else {
        toastr.error('Please Select User From Dropdown');
    }
}
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
                    $('#CompletedTradeDiv').html('');
                    if (results.CompletedTrade != null && results.CompletedTrade.length > 0) {
                        var _CheckCurrentPage;

                        for (var i = 0; i < results.CompletedTrade.length; i++) {
                            var result = results.CompletedTrade[i];
                            SetCompletedTradeTableDetails(result);
                            BindClick();
                        }
                    }
                }
            }
        });

    } catch (e) {
        toastr.error("Error On SetTradeData.");
    }

}
function SetCompletedTradeTableDetails(item) {
    var P_L = "";
    var CP = "";
    if (parseFloat(item.ProfitOrLoss) >= 0) {
        P_L = '<font style="color:rgb(91, 233, 91);font-weight:bold;">' + item.ProfitOrLoss + '</font>';
    }
    else if (parseFloat(item.ProfitOrLoss) < 0) {
        P_L = '<font style="color:#ff4a4a;font-weight:bold;">' + item.ProfitOrLoss + '</font>';
    }


    var sQty;
    if (item.TRADING_UNIT_TYPE == 1) {
        sQty = item.Qty / item.ScriptLotSize;
    }
    else {
        if (item.ScriptLotSize > 10 && item.ScriptExchange == "MCX" && ((item.COMPANY_INITIAL == "EXPO" && item.TENANT_ID == 51) || (item.COMPANY_INITIAL == "ASR" && item.TENANT_ID == 57) || item.COMPANY_INITIAL == "RVERMA")) {
            sQty = item.Qty / (item.ScriptLotSize / 10);
        } else {
            sQty = item.Qty;
        }
    }
    var GetQtyType = item.TRADING_UNIT.toLowerCase() == "qty" ? 'U' : '';
    var css = "row-New-Theme watchlistRow";

    if (item.ScriptExchange == "FOREX" && $("#companyINitials").val() == "RT") {
        item.EntryPrice = (item.EntryPrice).toFixed(5);
        item.ExitPrice = (item.ExitPrice).toFixed(5);
    }
    var html = '<div class="row completedTradeRow" data-id=' + item.CompletedTradeID + ' data-scriptName=' + item.TradeSymbol + '>' +
        '<div class="col-12" >' +
        '<div class="' + css + '">' +
        '<div class="card-body" style="padding: 0px 0px 0px 5px;">' +
        '   <div class="row">' +
        '<div class="col-7">' +
        ' <p class="watchlist-p" style="font-size: 14px; margin-bottom: 5px;margin: 0px 0px 0px 30px;">' + item.TradeSymbol + '</p>' +
        '</div>' +
        '<div class="col-5">' +
        '     <div class="row" style="margin-top:0px;">' +
        '          <div class="col-5">' +
        '               <label class="watchlist-p" style="font-size: 12px"margin: 0px 0px 0px 30px;> QTY: ' + sQty + GetQtyType + '</label>' +
        '          </div>' +

        '              </div>' +
        '           </div>' +
        '<div class="col-5">' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;margin: 0px 0px 0px 30px;">ENTRY : ' + item.EntryPrice + ' </p>' +
        '</div>' +
        '<div class="col-5">' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;margin: 0px 0px 0px 30px;">EXIT : ' + item.ExitPrice + ' </p>' +
        '</div>' +
        '<div class="col-12" >' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;margin: 0px 0px 0px 30px;"> P&L : ' + P_L + ' | CP : ' + item.CurrentPosition + '</p>' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;margin: 0px 0px 0px 30px;">ENTRY TIME :  ' + item.EntryDate + " " + item.EntryTime + '  </p>' +
        '  <p class="watchlist-p" style="font-size: 13px;  margin-bottom: 7px;margin-top:7px;margin: 0px 0px 0px 30px;">EXIT TIME :  ' + item.ExitDate + " " + item.ExitTime + '  </p>' +
        '</div>' +
        '        </div>' +
        '     </div>' +
        '  </div>' +
        '</div >' +
        '</div >';

    $('#CompletedTradeDiv').append(html);
}
$('#SqrOffAllBtn').on('click', function () {
    newconfirmMobile("sqr-Off All Trades ?", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
            window.location.href = "/Trade/SqrOffAll";
        }
    });
});
function BindClick() {

}
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
        LastPriceDictionary = new Array();
        BtnIds = new Array();
        getTradingUnit($('#UserIds').val());
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
$("#AdminIds").on('change', function () {
    if ($('#AdminIds').val() != '') {
        $('#BrokerIds').val(null).trigger('change');
        $('#UserIds').val(null).trigger('change');
        $("#SqrOffBtn").show();
        $("#btnAddWatchList").show();
        LastPriceDictionary = new Array();
        BtnIds = new Array();
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
        getTradingUnit($('#BrokerIds').val());
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
function SqrOffAllForManageTransaction() {
    newconfirmMobile("square off All?", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
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
    });
}
function DeleteRejectedTrade(data) {
    newconfirmMobile("delete?", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
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
    });
}
function DeleteActiveTrade(TransactionId, UserID) {
    newconfirmMobile("Delete This Record", function () {
        var resp = $('body').find('.cresp').html();
        $('body').find('.cresp').remove();
        if (resp == 'Yes') {
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
    });
}