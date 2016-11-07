var createSongRow = function (songNumber, songName, songLength) {
      var template =
      '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
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
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentlyPlayingSongNumber = null;
          currentSongFromAlbum = null;
        } else if (currentlyPlayingSongNumber !== songItem) {
          $(this).html(pauseButtonTemplate);
          setSong(songItem);
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

var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;
  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }
  setSong(currentSongIndex +1);

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

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

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

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
}

var setSong = function(songNumber) {
  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
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
var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
 });
