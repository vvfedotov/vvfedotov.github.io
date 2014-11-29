var dataInfo = {
    isDataHome:         false,
    isDataSearch:       false,
    isSearchCategory:   false,
    homeJson:           "assets/data/featured-products.json",
    searhJson:          "assets/data/search-results.json",
    searhTemplate:      "#data-search-template",
    homeTemplate:       "#data-home-template",
    searchCategory:     "#data-category-template"
};

function showData(jsonFile, viewTemplate, page){
    $(".data-home-template").hide();
    $(".data-search-template").hide();
    switch (page){
        case "Home":
            $(".data-home-template").show();
            if(dataInfo.isDataHome)
                return;
            dataInfo.isDataHome = true;
            break;
        case "Search":
            $(".data-search-template").show();
            if(dataInfo.isDataSearch)
                return;
            dataInfo.isSearchCategory = true;
            dataInfo.isDataSearch = true;
            break
    }
    $.getJSON(jsonFile , function(data) {
        var template = Handlebars.compile($(viewTemplate).html());
        $("#items").append(template(data.items));
        if(dataInfo.isSearchCategory){
            var categoryTmpl = Handlebars.compile($(dataInfo.searchCategory).html());
            $(".dropdown-category").append(categoryTmpl(data.items));
        }
    }).fail(function() {
        //show error read data file
    });
}

$(".money-to").number( true, 0 );
$(".money-from").number( true, 0 );
$(".money-to").change(function () {
    changeSliderValue();
});

$(".money-from").change(function () {
    changeSliderValue();
});

$('.datepicker').datetimepicker({
    pickTime: false
});

$(".slider").slider({
    min:        0,
    max:        10000,
    step:       50,
    tooltip:    "hide",
    value:      [2500,5500]
}).on('slide', function(ev){
    $(".money-from").val(ev.value[0]);
    $(".money-to").val(ev.value[1]);
});

$(".slider-horizontal").width("100%");
$(".spinner").TouchSpin({
    initval: 20,
    min: 5,
    max: 40
});

function changeSliderValue(){
    var values = [];
    if($(".money-to").val() > $(".money-from").val()){
        values[0] = $(".money-from").val();
        values[1] = $(".money-to").val();
    }else{
        values[1] = $(".money-from").val();
        values[0] = $(".money-to").val();
    }
    $(".slider").slider('setValue', values);
    $(".money-from").val(values[0]);
    $(".money-to").val(values[1]);
}

$(document).ready(function(){
    $('ol.breadcrumb li').click(function(e){
        var tagA = $(this).find('a');
        setActiveBreadcrumbs(tagA.text());
        switch(tagA.text()){
            case "Search Results":
                breadcrumbSearchResults();
                disabledFooter("search");
                break;
            case "Home":
                breadcrumbHome();
                disabledFooter("home");
                break;
        }

    });

    $('ul.nav-pills li').click(function(e){
        var tagA = $(this).find('a');
        switch(tagA.text()){
            case "Search":
                breadcrumbSearchResults();
                disabledFooter("search");
                break;
            case "Home":
                breadcrumbHome();
                disabledFooter("home");
                break;
        }

    });

});


function setActiveBreadcrumbs(item){
    $.grep($('ol.breadcrumb li'), function(el){
        var tagLI = $(el).find('a');
        if(tagLI.text() == item || $(el).text() == item){
            if(tagLI.length > 0)
                tagLI.remove();
            $(el).addClass("active");
            $(el).text(item);
        }else{
            if(!tagLI.length && tagLI.text() != item){
                var text = $(el).text();
                $(el).removeClass("active");
                $(el).text("");
                $(el).append('<a href="#">' + text + '</a>');
            }
        }
    });
    disabledFooter("search");
}

function breadcrumbSearchResults(){
    $(".carousel").hide();
    $(".navbar-form").hide();
    showData(dataInfo.searhJson, dataInfo.searhTemplate, "Search");
    $(".ext-search-panel").show();
    setActiveBreadcrumbs("Search Results");

    $(function(){
        setInterval(function(){
            var ctSpan = $(".current-time");
            var currentTime  = moment.utc(moment.utc().format('YYYY-MM-DD HH:mm:ss')).toDate();
            ctSpan.text(moment(currentTime).format('MMM DD HH:mm'));
        },1000);
    });
};

function breadcrumbHome(){
    $(".carousel").show();
    $(".navbar-form").show();
    showData(dataInfo.homeJson, dataInfo.homeTemplate, "Home");
    $(".ext-search-panel").hide();

};


$(".navbar-form").submit(function( event ) {
    breadcrumbSearchResults();
    event.preventDefault();
});

function disabledFooter(link){
    $(".footer-home").removeClass("disabled");
    $(".footer-search").removeClass("disabled");
    $(".footer-about").removeClass("disabled");
    $(".footer-service").removeClass("disabled");
    $(".footer-" + link).addClass("disabled");
}

disabledFooter("home");
breadcrumbHome();

