JAweSomePlayer 1.0 * 10\*\*-10

WHAT IS IT
===

JAweSomePlayer is a pure Javascript library to assist in playing media files 
with as little effort as possible to the web developer.  It will utilize HTML5 
media elements and tags if they are available as a playback engine, otherwise 
it will fall back to Flash as the playback engine.  The actual controls are 
done completely in HTML regardless of playback engine.  It does not require any
external dependencies or libraries such as jQuery or Prototype, although using
a library to initialize the player is highly recommended due to these 
libraries taking the pain out of messing with each browser's DOM.

JAweSomePlayer is licensed under the BSD 3-clause license.

Source at [Github]("http://github.com/RoryO/jawesomeplayer"), with a pretty
[homepage]("http://metricgnome.net/awesome/jawesomeplayer") containing latest
version and documentation.

HOW TO USE IT QUICKLY
===
Copy the example CSS, images and javascripts from the respective
directories to your environment.  The CSS provided expects images to
reside in ../images relative to the CSS file.

Create an empty DIV in your document where you want the player and, optionally,
give the DIV an ID.  If you don't need different types of players and only 
have one player per page, you can give the DIV an ID of \#jsPlayer for 
automatic configuration.
    <div id="myPlayer"></div>

Include the player library using the script tag, preferably at 
[the bottom](http://developer.yahoo.com/performance/rules.html#js_bottom) of 
the document.
    <script src="/js/js_player.js"></script>

After the script has been loaded, create a new player object in
Javascript.  This is done with the jsPlayer.create() function.  The first argument 
is the URL of the media file location, the second parameter is an options object for 
controlling how and where the player is built (see [options object](#options))

You can do this with a window.onload event, however this is best done after the
DOM is loaded to ensure JAweSomePlayer can find the ID and construct the elements 
needed.  Utilizing a proven library will take the pain out of this for you.

With [jQuery](http://jquery.org)
    jQuery(document).ready(function() {
      var player = jsPlayer.create("http://localhost/my_file.mp3", {elementId: "myPlayer"})
    })

[Prototype](http://prototypejs.org)
    Event.observe('dom:loaded', function() {
      var player = jsPlayer.create("http://localhost/my_file.mp3", {elementId:"myPlayer"})
    })

Without either, the following should work but the reliability is
questionable in complex documents.  This uses addEventListener on
browsers that support it, and IE's non-standard 'defer' option that
executes scripts only after the DOM is ready.
    <script type="text/javascript" charset="utf-8">
    var init = function () {
      var player = jsPlayer.create("http://localhost/my_file.mp3",
          {elementId:"myPlayer"}
    if (window.addEventListener) {
      window.addEventListener('load', init, false);
    }
    </script>
    <!--[if lte IE 8]>
    <script defer>
      init();
    </script>
    <![endif]-->

The library will automatically attempt to determine the MIME type of
the media file and if the browser can play it natively or not.  If
the browser can play it back natively, it will use the native HTML tag
element and place it as the first child of the div ID.  If
the browser cannot play it natively, it will automatically fall back to
an embedded 1x1 Flash player as the first child of the provided div
ID.  If the automatic detection proves buggy or unreliable, the options
parameters useFlash or useNative will force using the Flash or native
media elements respectively.  The player will also build a start/stop
div as a button underneath the ID provided by default.  See 'customizing
controls' if you want to build other controls or change how the controls
are built.


OPTIONS OBJECT
===

elementId: Default: "jsPlayer".

Set this to the element ID that you wish to wrap around.

useFlash: Default: undefined.

Set to something truthy to use only the Flash playback engine.  If combined 
with useNative, will have no effect.

useNative: Default: undefined.

Set to something truthy to use only the native browser playback engine.  If 
combined with useFlash, will have no effect.

useNativeControls: Default: undefined.

Set to something truthy to use the native OS playback controls of the
media element instead of constructing an HTML interface.  Does not work
with Flash.

mimeType: Default: autodetected

Set the MIME type of the media.  This is critical when dealing with
video files, where the container filename gives no hints as to what the
type of file actually is.

codecString: Default: undefined
Sometimes the MIME type doesn't give enough information.  For instance,
'video/mpeg' doesn't say what the mpeg file was encoded with.  Provide
this if the browser can't figure out how to play the file with just a
MIME string.  See [RFC 4281](http://tools.ietf.org/html/rfc4281).

CUSTOMIZING CONTROLS
===
The controls object located in the options object is used to control
what and how the HTML controls are automatically built by create(). By
default, create() will only build a start/stop div, but you can build
other types of controls by using a function as a factory.  The function
accepts two parameters, the first is the ID of the root element, the
second is a reference to the engine object.  Using these the function
can create the controls needed however you choose and bind events to the engine.
An anonymous or named function will work.  For example

    var buildStartStop = function (elementId, engine) {
      var e = document.createElement("div");
      e.setAttribute("class", "startStopButton");
      document.getElementById(elementId).appendChild(e);
      engine.bind('play', function () {
        //removing classes, adding classes, interacting with other HTML elements on the page, and so forth
      }
      //contuining on with constucting elements, binding events and however you see fit
    }

Then using that function
    jsPlayer.create("something.mp3", {elementId: "player",
                                      controls: { startStop: buildStartStop }
                                      }

The available control functions are
startStop: Building the start and stop button.  Enabled by
default
volume: Building the volume control.  Disabled by default

CONTROLLING THE MEDIA
===
The jsPlayer.create() function is mostly just a constructor function, deciding what
type of playback element to use and creating the relevant elements,
constructing the HTML controls and initializing the playback engine.
The playback engine is a gateway object that routes external method
calls to the playback element.  It is very strongly recommended not to 
manipulate the playback element itself, as it could cause the engine to 
fall out of sync with the state of the playback element.  Instead, use the 
exposed methods on the engine object.  The engine is accessed through
the engine property of the return object called from the jsPlayer.create()
constructor, i.e
    var player = jsPlayer.create("awesome.mp3");
    player.engine.play();

You can also register callbacks for all of the events handled by the
engine.  This is normally done with constructing control elements, but
it can also be useful to add events after the fact for enabling or
disabling certain other HTML elements based upon what is happening.
Register a new event with the .bind function on the engine, the internal
private functions of the bind() function handles the translation of
Flash or HTML events and organizes the functions internally.

    player.engine.bind('timeChange', function (t) { console.log('Time changed to ' + t)});

The available events to bind to have the same name as the HTML media
event names listed at
[The W3C media element page](http://www.w3.org/TR/html5/video.html#mediaevents)

The presently supported events are
play, pause, volumechange, loadeddata
ENGINE CONTROL METHODS
===
play(): Starts playback

pause(): Pauses playback

volume(n): Changes the volume, must be between 0 and 1.0

seekTo(n): Set the position of playback, in seconds


ENGINE PROPERTIES
===
isPlaying(): Boolean if engine is playing

volume(): Decimal value of the current volume

currentPosition(): Current playback position in seconds

isFlash(): True if the playback engine element is Flash

length(): Returns the length of the media element, in seconds.

ENGINE CALLBACKS
===
By using the engine.bind() function, you can bind events to the media
element.  
CONTRIBUTING
===

Bug fixes and code simplifications are very welcome.  Adding features
should be discussed on the Github project page first.  Contributing is
standard Github procedure to make things simpler for everyone

-Fork the project on Github

-Perform the work on your own branch

-Create a working test for the work you did if anything changed

-Ensure all the tests pass

-Rebuild the JavaScript files by running 'rake' or the flash
component by running 'rake flash flash\_debug'

-Push back to Github

-If it does not already exist, open a bug or feature ticket report on the 
Github page describing the work

-Submit a pull request with your branch

QUESTIONS
===
Q: Why not use jQuery or something similar?

A: jQuery is immensely popular for sure, but not everybody uses it.
Some like Prototype for it's class structure, YUI for the ease of
developing small applets, Dojo for constructing an interface
rapidly, Objective-J for a full stack app framework, and so forth.  
It's not my place to hoist these choices on someone. Furthermore, 
with JavaScript being put into a great deal of applications outside the 
browser as of late, I wanted to learn how to wrangle JavaScript correctly 
where a browser library is not available.

Q: How do I make unique players?

A: jAweSomePlayer is centered around a DOM id, and each instance only
manipulates the children of that id.  This naturally provides a unique
namespace for CSS.  For example

    .playerStarted {
      background-image: url("/images/player_started.png");
    }

    .playerStopped {
      background-image: url("/images/player_stopped.png");
    }

    #largePlayer {
      font-size: 150%;
      font-weight: 500;
    }

    #largePlayer .playerStarted {
      background-image: url("/images/player_started_large");
    }

    #largePlayer .playerStopped {
      background-image: url("/images/player_stopped_large.png")
    }

The same technique can also be used for providing a class of players,
such as one for video and one for audio and styled appropriately in the
CSS file.

    <div id="videoStream" class="vidPlayer"></div>
    <div id="radioPlayer" class="audioPlayer"></div>

UPCOMING
===
Video support
Media playlists

#### Many many many thanks to the absolutely awesome [Unobtrusive Javascript Slider](http://www.frequency-decoder.com/2010/11/18/unobtrusive-slider-control-html5-input-range-polyfill), without which this would never have gotten as far as it did.
#### Thanks to the [SoundCloud API player](https://github.com/soundcloud/soundcloud-custom-player) for inspiration.

(c) Rory O'Connell
