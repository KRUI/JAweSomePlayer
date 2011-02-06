describe("Flash callbacks", function () { 
  afterEach(function() {
    testHelpers.expectedOutput = "";
  });

  it("should fire callback when playing has started", function () {
    var e = document.getElementById("testSWF");
    testHelpers.playCallback = function () {
      testHelpers.expectedOutput = "Playing has started";
    };
    e.addEventListener('play', 'testHelpers.playCallback'); 
    e.play();
    expect(testHelpers.expectedOutput).toBe("Playing has started");
  });

  it("should fire callback when playing has paused", function () {
    var e = document.getElementById("testSWF");
    testHelpers.pauseCallback = function () {
      testHelpers.expectedOutput = "Playing has paused";
    };
    e.addEventListener('pause', 'testHelpers.pauseCallback');
    e.play();
    e.pause();
    expect(testHelpers.expectedOutput).toBe("Playing has paused");
  });

  it("should fire callback when volume has changed", function () {
    var e = document.getElementById("testSWF");
    testHelpers.volumeChangeCallback = function () {
      testHelpers.expectedOutput = "Volume has changed";
    };
    e.addEventListener('volumechange', 'testHelpers.volumeChangeCallback');
    e.volume(0.5);
    expect(testHelpers.expectedOutput).toBe("Volume has changed");
  });

});
