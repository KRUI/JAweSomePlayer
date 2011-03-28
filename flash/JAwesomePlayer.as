package {
  import flash.display.Sprite;

  public class JAwesomePlayer extends Sprite {
    import flash.external.ExternalInterface;
    import awesome.SoundManager;
    import awesome.EventEmitter;
    import flash.events.*;

    private var _sm:SoundManager;
    private var _jsReady:Boolean = false;

    public function JAwesomePlayer() {
      //Sometimes one or the other is fired and we don't know why
      //So we'll handle both and remove the events when one finishes
      if (!root.loaderInfo.parameters.url) {
        throw new Error("Need a url of a media file to play");
      }
      _sm = new SoundManager(root.loaderInfo.parameters.url);
      loaderInfo.addEventListener(Event.INIT, waitForExternalAvail);
      loaderInfo.addEventListener(Event.COMPLETE, waitForExternalAvail);
      CONFIG::debug {
        trace("Ready to go at: " + new Date());
      }
    }

    private function waitForExternalAvail(... params):void {
      import flash.utils.Timer;
      var t:Timer = new Timer(100, 1);
      t.addEventListener("timer", waitForExternalAvail);
      if(!ExternalInterface.available) {
        t.start();
        return;
      }
      if (!loaderInfo.parameters.checkready) {
        throw new Error("must pass a checkready javascript function reference");
      }
      _jsReady = ExternalInterface.call(loaderInfo.parameters.checkready);
      if(!_jsReady) {
        t.start();
        return;
      } else {
        loaderInfo.removeEventListener(Event.INIT, waitForExternalAvail);
        loaderInfo.removeEventListener(Event.COMPLETE, waitForExternalAvail);
        //ExternalInterface.marshallExceptions = true;
        EventEmitter.externalInterfaceIsAvailable = true;
        loadExternalCallbacks();
      }
    }

    private function loadExternalCallbacks():void {
      ExternalInterface.addCallback('_volume', _sm.volume);
      ExternalInterface.addCallback('_play', _sm.play);
      ExternalInterface.addCallback('_pause', _sm.pause);
      ExternalInterface.addCallback('_paused', _sm.isPaused);
      ExternalInterface.addCallback('_addEventListener', EventEmitter.registerExternal);

      //non-html5 namespaced with double underscore
      ExternalInterface.addCallback('__beginLoading', _sm.beginLoading);
      ExternalInterface.addCallback('__dumpEventList', EventEmitter.dumpEventList);
      ExternalInterface.call(loaderInfo.parameters.onready, ExternalInterface.objectID);
    }

  }
}
