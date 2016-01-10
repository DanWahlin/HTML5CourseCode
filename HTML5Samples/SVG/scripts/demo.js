var navMenu = {};
var navItems = {};
var optionsMenu = {};
var optionsMenuText = {};
var blogs = {};
var sidebar = {};

function initDemo() {
    jQuery.ajaxSettings.cache = false;

    initNavMenu();
    initNavItems();
    initOptionsMenu();
} // initDemo

function initNavMenu() {
    navMenu = $("#navMenu");
    navMenu.click(function () {
        navMenu.toggle();
        optionsMenu.css({ "left": -89, "top": -50 });
        optionsMenu.animate({ "left": "50" }, "slow");
    });
} // initNavMenu

function initNavItems() {
    blogs = $("#blogs");
    sidebar = $("#sidebar");
    navItems = $("#navItemsList li");
    navItems.click(function () {
        navItems.removeClass("selected");
        var navItem = $(this);
        var navItemText = navItem.text();
        navItem.addClass("selected");
        loadBlogsContent(navItemText);
    });
} // initNavItems

function initOptionsMenu() {
    optionsMenu = $("#optionsMenu");
    optionsMenuText = $("#optionsMenuText");
    $("#opt1").data("msg", "HTML5!!!").data("content", "html5");
    $("#opt2").data("msg", "Shazam!").data("content", "shazam");
    $("#opt3").data("msg", "Palermo 4").data("content", "palermo4");
    $("#opt4").data("msg", "Exit Door").data("content", "exit");
    $("#opt5").data("msg", "Handy").data("content", "hand");
} // initOptionsMenu

function loadBlogsContent(content, hideSidebar) {
    var contentPath = "content/" + content.toLowerCase() + ".htm";
    if (hideSidebar) sidebar.hide();
    blogs.fadeTo(400, 0.1, function () {
        blogs.load(contentPath).fadeTo(500, 1.0);
        if (!hideSidebar) sidebar.show();
    });
} // loadBlogsContent

function rectSelected(src) {
    var opt = $(src);
    var content = opt.data("content");
    if (content == "exit") {
        optionsMenu.animate({ "top": -330 }, "slow");
        navMenu.toggle();
    } else {
        loadBlogsContent(content, true);
    }
    
} // exitOptions

function changeOptionsText(src) {
    optionsMenuText.text($(src).data("msg"));
} // changeOptionsText

function clearOptionsText() {
    optionsMenuText.text("");
} // clearOptionsText