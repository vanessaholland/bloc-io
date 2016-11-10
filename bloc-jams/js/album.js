var createSongRow = function (songNumber, songName, songLength) {
      var template =
      '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>';

      var $row = $(template);

      var clickHandler = function() {
        // clickHandler logic
        var songItem = parseInt($(this).attr('data-song-number'));
        if (currentlyPlayingSongNumber !== null) {
          var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
          currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber === songItem) {
          if (currentSoundFile.isPaused()) {
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            $(this).html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
          } else {
            currentSoundFile.pause();
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
          }
        } else if (currentlyPlayingSongNumber !== songItem) {
          $(this).html(pauseButtonTemplate);
          setSong(songItem);
          currentSoundFile.play();
          updateSeekBarWhileSongPlays();

          var $volumeFill = $('.volume .fill');
          var $volumeThumb = $('.volume .thumb');
          $volumeFill.width(currentVolume + '%');
          $volumeThumb.css({left: currentVolume + '%'});
          updatePlayerBarSong();
        }
      };

      var onHover = function(event) {
        var songNumberItem = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberItem.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
          songNumberItem.html(playButtonTemplate);
        }
      };

      var offHover = function(event) {
        var songNumberItem = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberItem.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
          songNumberItem.html(songNumber);
        }
      };

      $row.find('.song-item-number').click(clickHandler);
      // #2
      $row.hover(onHover, offHover);
      // #3
      return $row;
};



var setCurrentAlbum = function (album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
     var i = 0;
     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     // #3
     $albumSongList.empty();

     // #4
     for (i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
     }
};

var updateSeekBarWhileSongPlays = function() {
     if (currentSoundFile) {
         // #10
         currentSoundFile.bind('timeupdate', function(event) {
             // #11
             var seekBarFillRatio = this.getTime() / this.getDuration();
             var $seekBar = $('.seek-control .seek-bar');

             updateSeekPercentage($seekBar, seekBarFillRatio);
             setCurrentTimeInPlayerBar(filterTimeCode(this.getTime()));
         });
     }
 };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    // #1
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);

    // #2
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 };

 var setupSeekBars = function() {
     var $seekBars = $('.player-bar .seek-bar');

     $seekBars.click(function(event) {
         var offsetX = event.pageX - $(this).offset().left;
         var barWidth = $(this).width();
         var seekBarFillRatio = offsetX / barWidth;

         if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio);
        }

         updateSeekPercentage($(this), seekBarFillRatio);
     });
     $seekBars.find('.thumb').mousedown(function(event) {
         // #8
         var $seekBar = $(this).parent();

         // #9
         $(document).bind('mousemove.thumb', function(event){
             var offsetX = event.pageX - $seekBar.offset().left;
             var barWidth = $seekBar.width();
             var seekBarFillRatio = offsetX / barWidth;

             if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }

             updateSeekPercentage($seekBar, seekBarFillRatio);
         });

         // #10
         $(document).bind('mouseup.thumb', function() {
             $(document).unbind('mousemove.thumb');
             $(document).unbind('mouseup.thumb');
         });
     });
 };

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};

var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }
  setSong(currentSongIndex +1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();

  var previousSongNumber = null;
  if (currentSongIndex == 0) {
    previousSongNumber = currentAlbum.songs.length;
  } else {
    previousSongNumber = currentSongIndex;
  }
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(previousSongNumber);

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(previousSongNumber);
}

var previousSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length-1;
  }
  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  updatePlayerBarSong();

  var previousSongNumber = null;
  if (currentSongIndex == currentAlbum.songs.length-1) {
    previousSongNumber = 1;
  } else {
    previousSongNumber = currentSongIndex+2;
  }
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(previousSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(previousSongNumber);
  updateSeekBarWhileSongPlays();
};

var togglePlayFromPlayerBar = function() {
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    if(currentSoundFile.isPaused()) {
      $(this).html(playerBarPauseButton);
      $nextSongNumberCell.html(pauseButtonTemplate);
      currentSoundFile.play();
    } else {
      $(this).html(playerBarPlayButton);
      $nextSongNumberCell.html(playButtonTemplate);
      currentSoundFile.pause();
    }
};

var setCurrentTimeInPlayerBar = function(currentTime) {
  var $currentTimeCell = $('.current-time');
  $currentTimeCell.html(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
  var $totalTimeCell = $('.total-time');
  $totalTimeCell.html(totalTime);
};

var filterTimeCode = function(timeInSeconds) {
  var filteredTime = parseFloat(timeInSeconds);
  var timeMins = Math.floor(filteredTime / 60);
  var timeSecs = Math.floor(filteredTime % 60);
  if (timeSecs < 10) {
      timeSecs = "0" + timeSecs;
  }
  return timeMins + ":" + timeSecs;
};

var setSong = function(songNumber) {
  if (currentSoundFile) {
         currentSoundFile.stop();
  }
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
     setVolume(currentVolume);
};

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

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playPauseButton= $('.main-controls .play-pause');

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     setupSeekBars();
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $playPauseButton.click(togglePlayFromPlayerBar);
     var albums = [albumPicasso, albumMarconi, albumStyrofoam];
     var i = 1;


     document.getElementById("album-cover").addEventListener("click", function(event) {
         setCurrentAlbum(albums[i]);
         i++;
         if(i >= albums.length) {
             i = 0;
         }
     });
 });
