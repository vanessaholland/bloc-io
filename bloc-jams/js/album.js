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
        var songItem = $(this).attr('data-song-number');
        if (currentlyPlayingSongNumber !== null) {
          var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
          currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber === songItem) {
          $(this).html(playButtonTemplate);
          $('.main-controls .play-pause').html(playerBarPlayButton);
          currentlyPlayingSongNumber = null;
          currentSongFromAlbum = null;
        } else if (currentlyPlayingSongNumber !== songItem) {
          $(this).html(pauseButtonTemplate);
          currentlyPlayingSongNumber = songItem;
          currentSongFromAlbum = currentAlbum.songs[songItem - 1];
          updatePlayerBarSong();
        }
      };

      var onHover = function(event) {
        var songNumberItem = $(this).find('.song-item-number');
        var songNumber = songNumberItem.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
          songNumberItem.html(playButtonTemplate);
        }
      };

      var offHover = function(event) {
        var songNumberItem = $(this).find('.song-item-number');
        var songNumber = songNumberItem.attr('data-song-number');

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

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;


$(document).ready(function() {
     setCurrentAlbum(albumPicasso);
 });
