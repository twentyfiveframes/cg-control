//Constants, libraries and more

const StreamDeck = require('elgato-stream-deck');
const path = require('path');
const myStreamDeck = new StreamDeck();
const { CasparCG } = require("casparcg-connection");
const { AMCP } = require("casparcg-connection");


//Global variables
var fs = require('fs');
var connection = new CasparCG();
var setupDone = false; 
var btnState = { //Pages first, then status
    0: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
    1: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
    2: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
    3: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
    4: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
    5: [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
};
var waitBlinker = 16; //which button should blink when changing between templates
var contents = fs.readFileSync('XML\\graphictext.xml', 'utf8'); //reads from file a boot, just to ahve somthing, content is updated later 
var contents = fs.readFileSync('XML\\pollurl.xml', 'utf8');
var CGcommandNo = 16; //keeping tally on which commando we're going to run
var SDpage = 0; //which page are we on?
var transitionDur = 25;

//----- GRAPHICS AND COMMANDS DEFINITION FOR ALL PAGES -----//

//Button on/off graphics, from pagenumer

var btnGraphicOn = {
    0: {
        0: 'fixtures/SD_thumbs/default_black.png',
        1: 'fixtures/SD_thumbs/misc_todaysshow_on.png',
        2: 'fixtures/SD_thumbs/default_black.png',
        3: 'fixtures/SD_thumbs/interview_splitscreen_subthost_on.png',
        4: 'fixtures/SD_thumbs/default_black.png',
        5: 'fixtures/SD_thumbs/interview_splitscreen_subtplayerprofile_on.png',
        6: 'fixtures/SD_thumbs/standings_eumonth_on.png',
        7: 'fixtures/SD_thumbs/standings_namonth_on.png',
        8: 'fixtures/SD_thumbs/standings_euweek_on.png',
        9: 'fixtures/SD_thumbs/standings_naweeK_on.png',
        10: 'fixtures/SD_thumbs/vtr_menu_on.png',
        11: 'fixtures/SD_thumbs/inout_menu_on.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_on.png',
        13: 'fixtures/SD_thumbs/standings_menu_on.png',
        14: 'fixtures/SD_thumbs/default_black.png'
    },
    1: {
        0: 'fixtures/SD_thumbs/vtr_1_on.png',
        1: 'fixtures/SD_thumbs/vtr_promo_on.png',
        2: 'fixtures/SD_thumbs/breakers_quote.png',
        3: 'fixtures/SD_thumbs/breakers_play.png',
        4: 'fixtures/SD_thumbs/breakers_fail.png',
        5: 'fixtures/SD_thumbs/vtr_3_on.png',
        6: 'fixtures/SD_thumbs/vtr_2_on.png',
        7: 'fixtures/SD_thumbs/vtr_quote_on.png',
        8: 'fixtures/SD_thumbs/vtr_play_on.png',
        9: 'fixtures/SD_thumbs/vtr_fail_on.png',
        10: 'fixtures/SD_thumbs/vtr_menu_on.png',
        11: 'fixtures/SD_thumbs/inout_menu_on.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_on.png',
        13: 'fixtures/SD_thumbs/standings_menu_on.png',
        14: 'fixtures/SD_thumbs/default_black.png'
    },
    2: {
        0: 'fixtures/SD_thumbs/vtr_thanks_weekly_on.png', 
        1: 'fixtures/SD_thumbs/vtr_thanks_live_on.png', 
        2: 'fixtures/SD_thumbs/misc_return_soon_on.png', 
        3: 'fixtures/SD_thumbs/vtr_beginsoon_weekly_on.png', 
        4: 'fixtures/SD_thumbs/vtr_beginsoon_live_on.png',
        5: 'fixtures/SD_thumbs/default_black.png',
        6: 'fixtures/SD_thumbs/default_black.png',
        7: 'fixtures/SD_thumbs/vtr_quote_on.png',
        8: 'fixtures/SD_thumbs/vtr_play_on.png',
        9: 'fixtures/SD_thumbs/vtr_fail_on.png',
        10: 'fixtures/SD_thumbs/vtr_menu_on.png',
        11: 'fixtures/SD_thumbs/inout_menu_on.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_on.png',
        13: 'fixtures/SD_thumbs/standings_menu_on.png',
        14: 'fixtures/SD_thumbs/default_black.png'
    },
    3: {
        0: 'fixtures/SD_thumbs/misc_poll_load_on.png', 
        1: 'fixtures/SD_thumbs/default_black.png', 
        2: 'fixtures/SD_thumbs/interview_splitscreen_guestframe_on.png', 
        3: 'fixtures/SD_thumbs/interview_splitscreen_twoframe_on.png', 
        4: 'fixtures/SD_thumbs/interview_splitscreen_hostframe_on.png', 
        5: 'fixtures/SD_thumbs/misc_poll_on.png', 
        6: 'fixtures/SD_thumbs/interview_splitscreen_subtplayerprofile_on.png', 
        7: 'fixtures/SD_thumbs/interview_splitscreen_subtguest_on.png', 
        8: 'fixtures/SD_thumbs/interview_splitscreen_subtboth_on.png', 
        9: 'fixtures/SD_thumbs/interview_splitscreen_subthost_on.png', 
        10: 'fixtures/SD_thumbs/vtr_menu_on.png',
        11: 'fixtures/SD_thumbs/inout_menu_on.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_on.png',
        13: 'fixtures/SD_thumbs/standings_menu_on.png',
        14: 'fixtures/SD_thumbs/default_black.png'
    },
    4: {
        0: 'fixtures/SD_thumbs/default_black.png', 
        1: 'fixtures/SD_thumbs/default_black.png', 
        2: 'fixtures/SD_thumbs/default_black.png', 
        3: 'fixtures/SD_thumbs/standings_euweek_on.png', 
        4: 'fixtures/SD_thumbs/standings_naweeK_on.png', 
        5: 'fixtures/SD_thumbs/default_black.png', 
        6: 'fixtures/SD_thumbs/default_black.png', 
        7: 'fixtures/SD_thumbs/interview_splitscreen_subtplayerprofile_on.png', 
        8: 'fixtures/SD_thumbs/standings_eumonth_on.png', 
        9: 'fixtures/SD_thumbs/standings_namonth_on.png', 
        10: 'fixtures/SD_thumbs/vtr_menu_on.png',
        11: 'fixtures/SD_thumbs/inout_menu_on.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_on.png',
        13: 'fixtures/SD_thumbs/standings_menu_on.png',
        14: 'fixtures/SD_thumbs/default_black.png'
    },
    5: {
        0: 'fixtures/SD_thumbs/clear_channel_1.png',
        1: 'fixtures/SD_thumbs/default_black.png',
        2: 'fixtures/SD_thumbs/default_black.png',
        3: 'fixtures/SD_thumbs/misc_initialize_live_on.png',
        4: 'fixtures/SD_thumbs/misc_initialize_weekly_on.png',
        5: 'fixtures/SD_thumbs/default_black.png',
        6: 'fixtures/SD_thumbs/default_black.png',
        7: 'fixtures/SD_thumbs/default_black.png',
        8: 'fixtures/SD_thumbs/default_black.png',
        9: 'fixtures/SD_thumbs/default_black.png',
        10: 'fixtures/SD_thumbs/vtr_menu_on.png',
        11: 'fixtures/SD_thumbs/inout_menu_on.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_on.png',
        13: 'fixtures/SD_thumbs/standings_menu_on.png',
        14: 'fixtures/SD_thumbs/default_black.png'
    }
};

var btnGraphicOff = {
    0: {
        0: 'fixtures/SD_thumbs/default_black.png',
        1: 'fixtures/SD_thumbs/misc_todaysshow_off.png',
        2: 'fixtures/SD_thumbs/default_black.png',
        3: 'fixtures/SD_thumbs/interview_splitscreen_subthost_off.png',
        4: 'fixtures/SD_thumbs/default_black.png',
        5: 'fixtures/SD_thumbs/interview_splitscreen_subtplayerprofile_off.png',
        6: 'fixtures/SD_thumbs/standings_eumonth_off.png',
        7: 'fixtures/SD_thumbs/standings_namonth_off.png',
        8: 'fixtures/SD_thumbs/standings_euweek_off.png',
        9: 'fixtures/SD_thumbs/standings_naweeK_off.png',
        10: 'fixtures/SD_thumbs/vtr_menu_off.png',
        11: 'fixtures/SD_thumbs/inout_menu_off.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_off.png',
        13: 'fixtures/SD_thumbs/standings_menu_off.png',
        14: 'fixtures/SD_thumbs/setup_off.png'
    },
    1: {
        0: 'fixtures/SD_thumbs/vtr_1_off.png',
        1: 'fixtures/SD_thumbs/vtr_promo_off.png',
        2: 'fixtures/SD_thumbs/breakers_quote.png',
        3: 'fixtures/SD_thumbs/breakers_play.png',
        4: 'fixtures/SD_thumbs/breakers_fail.png',
        5: 'fixtures/SD_thumbs/vtr_3_off.png',
        6: 'fixtures/SD_thumbs/vtr_2_off.png',
        7: 'fixtures/SD_thumbs/vtr_quote_off.png',
        8: 'fixtures/SD_thumbs/vtr_play_off.png',
        9: 'fixtures/SD_thumbs/vtr_fail_off.png',
        10: 'fixtures/SD_thumbs/vtr_menu_on.png',
        11: 'fixtures/SD_thumbs/inout_menu_off.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_off.png',
        13: 'fixtures/SD_thumbs/standings_menu_off.png',
        14: 'fixtures/SD_thumbs/setup_off.png'
    },
    2: {
        0: 'fixtures/SD_thumbs/vtr_thanks_weekly_off.png', 
        1: 'fixtures/SD_thumbs/vtr_thanks_live_off.png', 
        2: 'fixtures/SD_thumbs/misc_return_soon_off.png', 
        3: 'fixtures/SD_thumbs/vtr_beginsoon_weekly_off.png', 
        4: 'fixtures/SD_thumbs/vtr_beginsoon_live_off.png',
        5: 'fixtures/SD_thumbs/default_black.png',
        6: 'fixtures/SD_thumbs/default_black.png',
        7: 'fixtures/SD_thumbs/default_black.png', 
        8: 'fixtures/SD_thumbs/default_black.png', 
        9: 'fixtures/SD_thumbs/default_black.png', 
        10: 'fixtures/SD_thumbs/vtr_menu_off.png',
        11: 'fixtures/SD_thumbs/inout_menu_on.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_off.png', 
        13: 'fixtures/SD_thumbs/standings_menu_off.png', 
        14: 'fixtures/SD_thumbs/setup_off.png'
    },
    3: {
        0: 'fixtures/SD_thumbs/misc_poll_load_off.png', 
        1: 'fixtures/SD_thumbs/default_black.png', 
        2: 'fixtures/SD_thumbs/interview_splitscreen_guestframe_off.png', 
        3: 'fixtures/SD_thumbs/interview_splitscreen_twoframe_off.png', 
        4: 'fixtures/SD_thumbs/interview_splitscreen_hostframe_off.png', 
        5: 'fixtures/SD_thumbs/misc_poll_off.png', 
        6: 'fixtures/SD_thumbs/interview_splitscreen_subtplayerprofile_off.png', 
        7: 'fixtures/SD_thumbs/interview_splitscreen_subtguest_off.png', 
        8: 'fixtures/SD_thumbs/interview_splitscreen_subtboth_off.png', 
        9: 'fixtures/SD_thumbs/interview_splitscreen_subthost_off.png', 
        10: 'fixtures/SD_thumbs/vtr_menu_off.png',
        11: 'fixtures/SD_thumbs/inout_menu_off.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_on.png', 
        13: 'fixtures/SD_thumbs/standings_menu_off.png', 
        14: 'fixtures/SD_thumbs/setup_off.png'
    },
    4: {
        0: 'fixtures/SD_thumbs/default_black.png', 
        1: 'fixtures/SD_thumbs/default_black.png', 
        2: 'fixtures/SD_thumbs/default_black.png', 
        3: 'fixtures/SD_thumbs/standings_euweek_off.png', 
        4: 'fixtures/SD_thumbs/standings_naweeK_off.png', 
        5: 'fixtures/SD_thumbs/default_black.png', 
        6: 'fixtures/SD_thumbs/default_black.png', 
        7: 'fixtures/SD_thumbs/interview_splitscreen_subtplayerprofile_off.png', 8: 'fixtures/SD_thumbs/standings_eumonth_off.png', 
        9: 'fixtures/SD_thumbs/standings_namonth_off.png', 
        10: 'fixtures/SD_thumbs/vtr_menu_off.png',
        11: 'fixtures/SD_thumbs/inout_menu_off.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_off.png', 
        13: 'fixtures/SD_thumbs/standings_menu_on.png', 
        14: 'fixtures/SD_thumbs/setup_off.png'
    },
    5: {
        0: 'fixtures/SD_thumbs/clear_channel_1.png',
        1: 'fixtures/SD_thumbs/default_black.png',
        2: 'fixtures/SD_thumbs/default_black.png',
        3: 'fixtures/SD_thumbs/misc_initialize_live_off.png',
        4: 'fixtures/SD_thumbs/misc_initialize_weekly_off.png',
        5: 'fixtures/SD_thumbs/default_black.png',
        6: 'fixtures/SD_thumbs/default_black.png',
        7: 'fixtures/SD_thumbs/default_black.png',
        8: 'fixtures/SD_thumbs/default_black.png',
        9: 'fixtures/SD_thumbs/default_black.png',
        10: 'fixtures/SD_thumbs/vtr_menu_off.png',
        11: 'fixtures/SD_thumbs/inout_menu_off.png',
        12: 'fixtures/SD_thumbs/interview_splitscreen_menu_off.png', 
        13: 'fixtures/SD_thumbs/standings_menu_off.png', 
        14: 'fixtures/SD_thumbs/setup_on.png' 
    }
};


var CGgraphic = {
    0: {
        0: '',
        1: 'ESEA/TODAYS_SHOW',
        2: '',
        3: 'ESEA/SUBT_HOST',
        4: '',//initialize button
        5: 'ESEA/PLAYER STANDINGS',
        6: 'ESEA/MAIN STANDINGS',
        7: 'ESEA/MAIN STANDINGS',
        8: 'ESEA/MAIN STANDINGS',
        9: 'ESEA/MAIN STANDINGS',
        10: '', //menu from here 
        11: '',
        12: '',
        13: '',
        14: ''
    },
    1: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: ''
        
    },
    2: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14: ''
        
    },
    3: {
        0: '',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: 'ESEA/PLAYER STANDINGS',
        7: 'ESEA/SUBT_GUEST',
        8: 'ESEA/SUBT_BOTH',
        9: 'ESEA/SUBT_HOST',
        10: '',
        11: '',
        12: '',
        13: '',
        14: ''
        
    },
    4: {
        0: '',
        1: '',
        2: '',
        3: 'ESEA/MAIN STANDINGS',
        4: 'ESEA/MAIN STANDINGS',
        5: '',
        6: '',
        7: 'ESEA/PLAYER STANDINGS',
        8: 'ESEA/MAIN STANDINGS',
        9: 'ESEA/MAIN STANDINGS',
        10: '',
        11: '',
        12: '',
        13: '',
        14: ''
        
    }
};

//which layer? starting by page number
//10's for for inputs
//20's for frames animation
//30's for templates
//40's for breakers and VTRS
//70's for frames (the graphic)
//80s for begin soon and thanks
//90' for menubuttons
var CGgraphicLayer = {
    0: [30, 30, 30, 30, 70, 30, 30, 30, 30, 30, 91, 92, 93, 94, 95],
    1: [40, 81, 40, 40, 40, 40, 40, 40, 40, 40, 91, 92, 93, 94, 95],
    2: [80, 80, 80, 80, 80, 30, 30, 40, 40, 40, 91, 92, 93, 94, 95],
    3: [20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 91, 92, 93, 94, 95],
    4: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 91, 92, 93, 94, 95],
    5: [10, 10, 10, 70, 10, 10, 10, 10, 10, 10, 91, 92, 93, 94, 95]
};


//----- COMMANDS -----//
//starting by page numer, each command is layed out
var CGcommands = {
    0: {
        0: function () {},
        1: function () { 
            contents = fs.readFileSync('XML\\Todays_show.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents); },
        2: function () {},
        3: function () { 
            contents = fs.readFileSync('XML\\SUBT.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        4: function () {},
        5: function () {
            contents = fs.readFileSync('XML\\PlayerProfile_Player01.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        6: function () {
            contents = fs.readFileSync('XML\\Standings_EU_Month.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        7: function () {
            contents = fs.readFileSync('XML\\Standings_NA_Month.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        8: function () {
            contents = fs.readFileSync('XML\\Standings_EU_Week.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        9: function () {
            contents = fs.readFileSync('XML\\Standings_NA_Week.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        10: function () { SDpage = 1; console.log('SD page 1 set by on'); },
        11: function () { SDpage = 2; console.log('SD page 2 set by on'); },
        12: function () { SDpage = 3; console.log('SD page 3 set by on'); },
        13: function () { SDpage = 4; console.log('SD page 4 set by on'); },
        14: function () { SDpage = 5; console.log('SD page 4 set by on');} 
    },
    1: {
        0: function () {connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_1");connection.do(new AMCP.CustomCommand('LOADBG 1-40 EMPTY MIX 20 AUTO\r\n'));},
        1: function () { 
            connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/RANK S PROMO");
            connection.do(new AMCP.CustomCommand('LOADBG 1-81 EMPTY MIX 20 AUTO\r\n')); 
            connection.stop(1, 80);connection.stop(1, 79);
        },
        2: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/BREAKERS/BREAKER_ QUOTE OF THE WEEK"); connection.do(new AMCP.CustomCommand('PLAY 1-30 EMPTY MIX 20\r\n'));connection.do(new AMCP.CustomCommand('PLAY 1-31 EMPTY MIX 20\r\n'));},
        3: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/BREAKERS/BREAKER_ PLAY OF THE WEEK"); connection.do(new AMCP.CustomCommand('PLAY 1-30 EMPTY MIX 20\r\n'));connection.do(new AMCP.CustomCommand('PLAY 1-31 EMPTY MIX 20\r\n'));},
        4: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/BREAKERS/BREAKER_ FAIL OF THE WEEK"); connection.do(new AMCP.CustomCommand('PLAY 1-30 EMPTY MIX 20\r\n'));connection.do(new AMCP.CustomCommand('PLAY 1-31 EMPTY MIX 20\r\n'));},
        5: function () {connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_3");connection.do(new AMCP.CustomCommand('LOADBG 1-40 EMPTY MIX 20 AUTO\r\n'));},
        6: function () {connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_2");connection.do(new AMCP.CustomCommand('LOADBG 1-40 EMPTY MIX 20 AUTO\r\n'));},
        7: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_QUOTE");connection.do(new AMCP.CustomCommand('LOADBG 1-40 EMPTY MIX 20 AUTO\r\n')); },
        8: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_PLAY");connection.do(new AMCP.CustomCommand('LOADBG 1-40 EMPTY MIX 20 AUTO\r\n')); },
        9: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_FAIL");connection.do(new AMCP.CustomCommand('LOADBG 1-40 EMPTY MIX 20 AUTO\r\n')); },
        10: function () { SDpage = 0; console.log('SD page 0 set by on'); },
        11: function () { SDpage = 2; },
        12: function () { SDpage = 3; },
        13: function () { SDpage = 4; },
        14: function () { SDpage = 5; } 
    },
    2: {
        0: function () { 
            connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/FULLSCREENS/THANKS FOR WATCHING_WEEKLY_TEXT", "loop");
            connection.play(1, 79, "ESEA/FULLSCREENS/SMOOTH_DARK", "loop");
        },
        1: function () { 
            connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/FULLSCREENS/THANKS FOR WATCHING_LIVE_TEXT", "loop");
            connection.play(1, 79, "ESEA/FULLSCREENS/SMOOTH_DARK", "loop");
        },
        2: function () { 
            connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/FULLSCREENS/SHOW WILL RETURN SOON_LIVE_TEXT", "loop");
            connection.play(1, 79, "ESEA/FULLSCREENS/SMOOTH_DARK", "loop");
        },
        3: function () {  
            connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/FULLSCREENS/SHOW WILL BEGIN SOON_WEEKLY_TEXT", "loop"); 
            connection.play(1, 79, "ESEA/FULLSCREENS/SMOOTH_DARK", "loop");
        },
        4: function () { 
        connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/FULLSCREENS/SHOW WILL BEGIN SOON_LIVE_TEXT", "loop"); 
            connection.play(1, 79, "ESEA/FULLSCREENS/SMOOTH_DARK", "loop");
        },
        5: function () { },
        6: function () { },
        7: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_QUOTE")},
        8: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_PLAY")},
        9: function () { connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/VTRS/VTR_FAIL")},
        10: function () { SDpage = 1; },
        11: function () { SDpage = 0; },
        12: function () { SDpage = 3; },
        13: function () { SDpage = 4; },
        14: function () { SDpage = 5; } 
    },
    3: { //INTERVIEW SPLITFRAME AND SUBTS
        0: function () {
            contents = fs.readFileSync('XML\\pollurl.xml', 'utf8');
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            amcpcontents = 'LOADBG 1-31 [HTML] "' + contents + '" MIX 60 Linear RIGHT\r\n';
            connection.do(new AMCP.CustomCommand(amcpcontents));
        },
        1: function () { },
        2: function () {
            connection.do(new AMCP.CustomCommand('MIXER 1-10 FILL 0 0 1 1 15 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('MIXER 1-11 CROP 0 0 0 1 15 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('PLAY 1-20 "ESEA/FULLSCREENS/FRAME_FULL_SCREEN_weekly" MIX 5 Linear RIGHT\r\n'));
        },
        3: function () {
            connection.do(new AMCP.CustomCommand('MIXER 1-10 FILL 0.25 0 1 1 15 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('MIXER 1-11 FILL -0.25 0 1 1 15 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('MIXER 1-11 CROP 0 0.000925926 0.75 1 15 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('PLAY 1-20 "ESEA/FULLSCREENS/FRAME_SPLIT_2" MIX 5 Linear RIGHT\r\n'));
        },
        4: function () {
            connection.do(new AMCP.CustomCommand('MIXER 1-11 FILL 0 0 1 1 15 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('MIXER 1-11 CROP 0 0 1 1 15 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('PLAY 1-20 "ESEA/FULLSCREENS/FRAME_FULL_SCREEN_weekly" MIX 5 Linear RIGHT\r\n'));
        },
        5: function () { 
            connection.do(new AMCP.CustomCommand('MIXER 1-31 FILL 0 0 1.5 1.5 1 Linear\r\nT'));
            connection.do(new AMCP.CustomCommand('PLAY 1-30 "ESEA/POLLS/POLL" MIX 15 Linear RIGHT\r\n'));
            connection.do(new AMCP.CustomCommand('PLAY 1-31 \r\n'));
            
        },
        6: function () { 
            contents = fs.readFileSync('XML\\PlayerProfile_Player01.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        7: function () { 
            contents = fs.readFileSync('XML\\SUBT.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        8: function () { 
            contents = fs.readFileSync('XML\\SUBT.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        9: function () { 
            contents = fs.readFileSync('XML\\SUBT.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        10: function () { SDpage = 1; },
        11: function () { SDpage = 2; },
        12: function () { SDpage = 0; },
        13: function () { SDpage = 4; },
        14: function () { SDpage = 5; } 
    },
    4: {
        0: function () { },
        1: function () { },
        2: function () { },
        3: function () { 
            contents = fs.readFileSync('XML\\Standings_EU_Week.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        4: function () { 
            contents = fs.readFileSync('XML\\Standings_NA_Week.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        5: function () { },
        6: function () { },
        7: function () { 
            contents = fs.readFileSync('XML\\PlayerProfile_Player01.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        8: function () { 
            contents = fs.readFileSync('XML\\Standings_EU_Month.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        9: function () { 
            contents = fs.readFileSync('XML\\Standings_NA_Month.xml', 'utf8'); 
            contents = contents.replace(/\r?\n|\r/g, ''); //removes newline from XML with regex, 
            connection.cgAdd(1, CGgraphicLayer[SDpage][CGcommandNo], 1, CGgraphic[SDpage][CGcommandNo], 1, contents);
        },
        10: function () { SDpage = 1; },
        11: function () { SDpage = 2; },
        12: function () { SDpage = 3; },
        13: function () { SDpage = 0; },
        14: function () { SDpage = 5; } 
    },
    5: {
        0: function () { connection.clear(1); },
        1: function () { },
        2: function () { },
        3: function () { 
            connection.do(new AMCP.CustomCommand('PLAY 1-10 DECKLINK DEVICE 3 FORMAT 1080p6000\r\n'));
			connection.do(new AMCP.CustomCommand('PLAY 1-1 DECKLINK DEVICE 4 FORMAT 1080p6000\r\n'));
            connection.do(new AMCP.CustomCommand('MIXER 1-10 FILL 0 0 1 1 0 Linear\r\n'));
        
        }, //SKYPE 
        4: function () { 
            //connection.play(1, CGgraphicLayer[SDpage][CGcommandNo], "ESEA/FULLSCREENS/FRAME_FULL_SCREEN_WEEKLY", 'loop');
            connection.do(new AMCP.CustomCommand('PLAY 1-70 "ESEA/FULLSCREENS/FRAME_FULL_SCREEN_WEEKLY" CUT 1 LInear RIGHT LOOP\r\n'));
            connection.do(new AMCP.CustomCommand('PLAY 1-10 DECKLINK DEVICE 3 FORMAT 1080p6000\r\n')); //SKYPE
            connection.do(new AMCP.CustomCommand('PLAY 1-11 DECKLINK DEVICE 4 FORMAT 1080p6000\r\n')); //WEBCAM
            connection.do(new AMCP.CustomCommand('MIXER 1-10 FILL 0 0 1 1 15 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('MIXER 1-11 FILL 0 0 1 1 25 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('MIXER 1-40 FILL 0.05625 0.117593 0.888021 0.881556 25 Linear\r\n'));
            connection.do(new AMCP.CustomCommand('PLAY 1-20 "ESEA/FULLSCREENS/FRAME_FULL_SCREEN_weekly" MIX 25 Linear RIGHT\r\n'));
            connection.play(1, 1, "ESEA/FULLSCREENS/SMOOTH_DARK", "loop");
        },
        5: function () { },
        6: function () { },
        7: function () { },
        8: function () { },
        9: function () { },
        10: function () { SDpage = 1; },
        11: function () { SDpage = 2; },
        12: function () { SDpage = 3; },
        13: function () { SDpage = 4; },
        14: function () { SDpage = 0; } 
    }
};

//Command off. Starting by page number
var CGcommandsOff = {
    0: {
        0: function () { },
        1: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        2: function () { },
        3: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        4: function () { },
        5: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        6: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        7: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        8: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        9: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        10: function () { SDpage = 1; SDpage = 1; console.log('SD page 1 set by off');},
        11: function () { },
        12: function () { },
        13: function () { },
        14: function () { }
    },
    '1': {
        0: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        1: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        2: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        3: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        4: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        5: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        6: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        7: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        8: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        9: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); },
        10: function () { SDpage = 0; SDpage = 0; console.log('SD page 0 set by off');},
        11: function () { },
        12: function () { },
        13: function () { },
        14: function () { }
    },
    2: {
        0: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); connection.stop(1, 79);},
        1: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); connection.stop(1, 79);},
        2: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); connection.stop(1, 79);},
        3: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); connection.stop(1, 79);},
        4: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]); connection.stop(1, 79);},
        5: function () { },
        6: function () { },
        7: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]);},
        8: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]);},
        9: function () { connection.stop(1, CGgraphicLayer[SDpage][CGcommandNo]);},
        10: function () { },
        11: function () { SDpage = 0; console.log('SD page 0 set by on'); },
        12: function () { },
        13: function () { },
        14: function () { },
    },
    3: {
        0: function () { },
        1: function () { },
        2: function () { },
        3: function () { },
        4: function () { },
        5: function () { connection.stop(1, 31); connection.stop(1, 30);},
        6: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        7: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        8: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        9: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        10: function () { },
        11: function () { },
        12: function () { SDpage = 0; },
        13: function () { },
        14: function () { },
    },
    4: {
        0: function () { },
        1: function () { },
        2: function () { },
        3: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        4: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        5: function () { },
        6: function () { },
        7: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        8: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        9: function () { connection.cgStop(1, CGgraphicLayer[SDpage][CGcommandNo], 1); },
        10: function () { },
        11: function () { },
        12: function () { },
        13: function () { SDpage = 0 },
        14: function () { },
    },
    5: {
        0: function () { },
        1: function () { },
        2: function () { },
        3: function () { },
        4: function () { },
        5: function () { },
        6: function () { },
        7: function () { },
        8: function () { },
        9: function () { },
        10: function () { },
        11: function () { },
        12: function () { },
        13: function () { },
        14: function () { SDpage = 0},
    }
};

//------ END GRAPHICS AND COMMANDS DEFINITION ----- //


//SETUP of the graphics on the buttons 
if (setupDone == false) {
    var i = 0;
    for (i = 0; i < 15; i++) {
        myStreamDeck.fillImageFromFile(i, path.resolve(__dirname, btnGraphicOff[SDpage][i]))
    };
    setupDone = true;
};

//------ BUTTON PUSHES BEGIN -----//
//BUTTON DOWN
myStreamDeck.on('down', keyIndex => {
    console.log('key %d down', keyIndex);

    //checking if theres already a template on same layer, and removes the old, if there is
    var waitNeed = false;
    for (i = 0; i < 15; i++) {
        if (btnState[SDpage][i] != 16 & btnState[SDpage][i] != keyIndex & CGgraphicLayer[SDpage][i] == CGgraphicLayer[SDpage][keyIndex]) {
            myStreamDeck.fillImageFromFile(i, path.resolve(__dirname, btnGraphicOff[SDpage][i]));
            btnState[SDpage][i] = 16;
            CGcommandsOff[SDpage][i]();
            waitNeed = true;
        };
    };

    //If buttons is off, put it on
    var btnNow = keyIndex;
    if (btnState[SDpage][btnNow] == 16) {
        if (waitNeed == true) { waitBlinker = keyIndex; wait(534); };//waiting for 32 frames - crude methode needed untill response from CG can be recieved
        myStreamDeck.fillImageFromFile(keyIndex, path.resolve(__dirname, btnGraphicOn[SDpage][btnNow]));
        CGcommandNo = btnNow;
        CGcommands[SDpage][btnNow]();
    };

    //IF IT was already on, then take it off
    if (btnState[SDpage][btnNow] == keyIndex) {
        myStreamDeck.fillImageFromFile(keyIndex, path.resolve(__dirname, btnGraphicOff[SDpage][btnNow]));
        CGcommandNo = btnNow;
        CGcommandsOff[SDpage][btnNow]();
    };
});

//BUTTON UP - setting new buttonstate, storing the status
myStreamDeck.on('up', keyIndex => {
    var btnNow = keyIndex;
    if (btnState[SDpage][btnNow] == 16 && btnNow != 10 && btnNow != 11 && btnNow != 12 && btnNow != 13 && btnNow != 14) {
        btnState[SDpage][btnNow] = keyIndex;
        console.log('buttonstate &d now');
        console.log(btnNow);
        console.log(btnState[SDpage][btnNow]);
        console.log('sdpage');
        console.log(SDpage);
        singleBtn();
//GETTING MENUS TO WORK
    } else if (btnNow == 10 && btnState[SDpage][btnNow] == 16) {
        btnState[0][10] == 10;
        btnState[1][10] == 10;
        updateSD();
    } else if (btnNow == 10 && btnState[SDpage][btnNow] == 10) {
        btnState[0][10] == 16;
        btnState[1][10] == 16;
        updateSD();
    } else if (btnNow == 12 && btnState[SDpage][btnNow] == 16) {
        btnState[0][12] == 10;
        btnState[3][12] == 10;
        updateSD();
    } else if (btnNow == 12 && btnState[SDpage][btnNow] == 10) {
        btnState[0][12] == 16;
        btnState[3][12] == 16;
        updateSD();
    } else if (btnNow == 11 && btnState[SDpage][btnNow] == 16) {
        btnState[0][11] == 10;
        btnState[2][11] == 10;
        updateSD();
    } else if (btnNow == 11 && btnState[SDpage][btnNow] == 10) {
        btnState[0][11] == 16;
        btnState[2][11] == 16;
        updateSD();
    } else if (btnNow == 13 && btnState[SDpage][btnNow] == 16) {
        btnState[0][13] == 10;
        btnState[4][13] == 10;
        updateSD();
    } else if (btnNow == 13 && btnState[SDpage][btnNow] == 10) {
        btnState[0][13] == 16;
        btnState[4][13] == 16;
        updateSD();
    } else if (btnNow == 14 && btnState[SDpage][btnNow] == 16) {
        btnState[0][14] == 10;
        btnState[5][14] == 10;
        updateSD();
    } else if (btnNow == 14 && btnState[SDpage][btnNow] == 10) {
        btnState[0][14] == 16;
        btnState[5][14] == 16;
        updateSD();
    } else {
        btnState[SDpage][btnNow] = 16;
        console.log('buttonstate');
        console.log(btnState[SDpage][btnNow]);
        console.log('sdpage');
        console.log(SDpage);
    } 
});

myStreamDeck.on('error', error => {
    console.error(error);
});

//Sometime we have to wait
function wait(ms) {
    myStreamDeck.fillColor(waitBlinker, 255, 189, 0);
    var d = new Date();
    var d2 = null;
    do {
        d2 = new Date();
    }
    while (d2 - d < ms);
};

//UPDATING when changing pages
function updateSD() {
    var i = 0;
    for (i = 0; i < 15; i++) {
        if (i == btnState[SDpage][i]) {
            myStreamDeck.fillImageFromFile(i, path.resolve(__dirname, btnGraphicOn[SDpage][i]))
        } else {
            myStreamDeck.fillImageFromFile(i, path.resolve(__dirname, btnGraphicOff[SDpage][i]))
        };
    };
};

//The buttons that are single push, simply get set to off when playing. Stuff like vtrs and breakers
function singleBtn() {
    btnState[1][2] = 16;
    btnState[1][3] = 16;
    btnState[1][4] = 16;

};
