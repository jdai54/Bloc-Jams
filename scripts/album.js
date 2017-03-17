// Create a setSong function that takes one argument, songNumber, and assigns currentlyPlayingSongNumber and currentSongFromAlbum a new value based on the new song number.
var setSong = function(songNumber) {
  // to prevent concurrent playback the conditional statement checks for a defined currentSoundFile and then stops it if true
  if (currentSoundFile) {
    currentSoundFile.stop();
  }
  
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1]; 
  // assign a new Buzz sound object. The audio file is passed via the audioUrl proerty ont he currentSongFromAlbum object
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    // passed in a settings object that has two properties defined, formats and preload. formats is an array of strings with acceptable audio formats. Setting the preload property to true tells Buzz that we want the mp3s loaded as soon as the page loads
    formats: [ 'mp3' ],
    preload: true
  });
  
  setVolume(currentVolume);
};

// seek() uses the Buzz setTime() method to change the position in a song to a specified time
var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};

var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function (songNumber, songName, songLength) {
  
  var template =
    '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  var $row = $(template);
  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

	if (currentlyPlayingSongNumber !== null) {
      // Revert to song number for currently playing song because user started playing new song.
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      
      currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
                                
	if (currentlyPlayingSongNumber !== songNumber) {
      // Switch from Play -> Pause button to indicate new song is playing and play the song
      setSong(songNumber);
      currentSoundFile.play();
      updateSeekBarWhileSongPlays();
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      // update clickHandler() to set the CSS of the volme seek bar to equal the currentVolume
      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume + '%');
      $volumeThumb.css({left: currentVolume + '%'});
      
      $(this).html(pauseButtonTemplate);
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      updatePlayerBarSong();
	} else if (currentlyPlayingSongNumber === songNumber) {
      // if the user clicks on the play/pause button for the same song that is playing, check if the currentSoundFile is paused and switch from Pause -> Play button and vice versa
      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
      } else {
        $(this).html(playButtonTemplate);$('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
      
    }
    
  };
  
  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(playButtonTemplate);
    }
  };
  
  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(songNumber);
    }
  };
  // jQuery find method is similar to querySelector. Called here to find th element with the .song-item-number class that's contained in whichever row is clicked. jQuery's click event listener executes the callback we pass to it when the target element is clicked.
  $row.find('.song-item-number').click(clickHandler);
  // the hover event listener combines the mouseover and mouseleave functions. The first argument is a callback that executes when the user jouses over the $row element and the second is a callback executed when the mouse leaves $row
  $row.hover(onHover, offHover);
  return $row;
};

var setCurrentAlbum = function(album) {
  currentAlbum = album;
  // #1
  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  // #2
  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  // #3
  $albumSongList.empty();

  // #4
  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    // bind() the timeupdate event to currentSoundFile. timeupdate is a custom Buzz event that fires repeatedly while time elapses during song playback
    currentSoundFile.bind('timeupdate', function(event) {
      // use Buzz's getTime() method for calculating the seekBarFillRatio. It gets the current time of the song and we use the getDuration() method for getting the total length of the song. Both values return time in seconds
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');
      
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
  }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  // start by multiplying the ratio by 100 to determine a percentage
  var offsetXPercent = seekBarFillRatio * 100;
  // use te built-in JavaScript Math.max() function to make sure our percentage isn't less than zero and the Math.min() function to make sure it doesn't exceed 100
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);
  
  // convert the percentage to a string and add the % character. CSS interprets the value of the width of the .fill class and the left value of the .thumb class as a percent
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};

var setupSeekBars = function() {
  // function works for any seek bar by selecting both. Use jQuery to find all elements in the DOM with the class of "seek-bar" that are contained within the element wth class of "player-bar". This will return a jQuery wrapped array containing both the song seek control and the volume control
  var $seekBars = $('.player-bar .seek-bar');
  
  $seekBars.click(function(event) {
    // pageX event object is a jQuery specific event value which holds the X coodinate at which the event occurred. We subtract the offset() of the seek bar held in $(this) from the left side
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    // divide offsetX by the width of the entire bar to calculate seekBarFillRatio
    var seekBarFillRatio = offsetX / barWidth;
    // check the class of the seek bar's parent to determine whether the current seek bar is changing volume or seeking to a song position. If it's the playback seek bar, seek to the positon of the song determined by the seekBarFillRatio; otherwise set the volume based on the seekBarFillRatio
    
    if ($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }
    
    // pass $(this) as the $seekBar argument and seekBarFillRatio for its eponymous argument to updateSeekBarPercentage() 
    updateSeekPercentage($(this), seekBarFillRatio);
  });
  // find elements with a class of .thumb inside our $seekBars and add an event listener for the mousedown event. A click event fires when a mouse is pressed and released quickly, but the mousedown even will fire as soon as the mouse button is pressed down. mouseup event is the opposite: it fires when the mouse button is released
  $seekBars.find('.thumb').mousedown(function(event) {
    // take the context of the event and wrap it in jQuery. this will be equal to the .thumb node that was clicked. Since an event is attached to both the song seek and volume control, this determines which of these nodes dispatched the event. Then use the parent method to select the immediate parent of the node which is whichever seek bar this .thumb belongs to
    var $seekBar = $(this).parent();
    
    // a new way to track events, jQuery's bind() event behaves similarly to addEventListener() in that it takes a string of an event instead of a wrapping the event in a method. bind() is used because it allows us to namespace event listeners. The event handler inside the bind() call is identical to the click behavior. We've attached the mousemove event to $(document) to make sure that we can drag the thumb after mousing down, even when the mouse leaves the seek bar. Allows for smoother experience for seeking a song position 
    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;
      // check the class of the seek bar's parent to determine whether the current seek bar is changing volume or seeking to a song position. If it's the playback seek bar, seek to the positon of the song determined by the seekBarFillRatio; otherwise set the volume based on the seekBarFillRatio
      if ($seekBar.parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        setVolume(seekBarFillRatio);
      }
    
      updateSeekPercentage($seekBar, seekBarFillRatio);
    });
    
    // bind the mouseup event with a .thumb namespace. The event handler uses the unbind() event method which removes the prevous event listeners that we just added. If we fail to unbind() them, the thumb and fill would continue to move event after the user released the mouse. 
    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};

// helper method that returns the index of a song fund in album's songs array
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  // updates the HTML of the play/pause button to the cotent of the playerBarPauseButton
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var previousSong = function() {
  // Obtains the previous song number and accounts for when the next song is the first song of the album allowing it to "loop" from last song to first song - conditional ternary operator
  var getLastSongNumber = function(index) {
    return index == (currentAlbum.songs.length -1) ? 1 : index + 2;
  };
  // Decrements the index of the current song down one with the use of trackIndex helper function
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum)
    currentSongIndex--;
  // resets the previous song to the last song of the album of the user selects previous song from the first song
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }
  // Set a new current song and play it
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  
  // Update the Player Bar information to show the new song
  updatePlayerBarSong();
  
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
  
  // update the HTML of the new song's .song-item-number element with a pause button
  $previousSongNumberCell.html(pauseButtonTemplate);
  // update the HTML of the previous song's .song-item-number element with a number
  $lastSongNumberCell.html(lastSongNumber);
};

var nextSong = function() {
  // Obtains the previous song number and accounts for when the next song is the first song of the album allowing it to "loop" from last song to first song - conditional ternary operator
  var getLastSongNumber = function(index) {
    return index == 0 ? currentAlbum.songs.length : index;
  };
  // Increments the index of the current song up one with the use of trackIndex helper function
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum)
    currentSongIndex++;
  // resets the next song to the first song of the album if the player finishes the last song
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }
  // Set a new current song and play it
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  // Update the Player Bar information to show the new song
  updatePlayerBarSong();
  
  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
  
  // update the HTML of the new song's .song-item-number element with a pause button
  $nextSongNumberCell.html(pauseButtonTemplate);
  // update the HTML of the previous song's .song-item-number element with a number
  $lastSongNumberCell.html(lastSongNumber);
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
// the two templates below hold the Ionicon for the play and pause button, so we can easily set the HTML of the player bar when we've played a new song
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// Store state of playing songs
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
// Added variable below to hold the curently playing song object from the songs array
var currentSongFromAlbum = null;
// use the currentSongFile variable to store the sound object when we set a new current song
var currentSoundFile = null;
// Buzz sound object methods for handling volume are based on a scale of 0-100
var currentVolume = 80;
// create variables to hold jQuery selectors for the next and previous buttons
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setupSeekBars();
  // jQuery click event handlers on each respective variable
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});