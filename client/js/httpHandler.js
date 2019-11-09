(function() {

  const serverUrl = 'http://127.0.0.1:3000';

  //
  // TODO: build the swim command fetcher here
  //
  const swimCommandFetcher= () => {
    // var formData = new FormData();
    // formData.append('file', file);
    $.get({url: serverUrl,  // url
      success: function (data) {  // success callback
        console.log('testing success');
        SwimTeam.move(data);
      },
      complete: function () {
        console.log('success');
        setInterval(swimCommandFetcher, 2000);
      }
    });

  };
  swimCommandFetcher();
  /////////////////////////////////////////////////////////////////////
  // The ajax file uplaoder is provided for your convenience!
  // Note: remember to fix the URL below.
  /////////////////////////////////////////////////////////////////////

  const ajaxFileUplaod = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    $.ajax({
      type: 'POST',
      data: formData,
      url: serverUrl,
      cache: false,
      contentType: false,
      processData: false,
      success: () => {
        // reload the page
        window.location = window.location.href;
        retrieveBackgroundImage('./spec/' + file.name);
      }
    });
  };

  $('form').on('submit', function(e) {
    e.preventDefault();

    var form = $('form .file')[0];
    if (form.files.length === 0) {
      console.log('No file selected!');
      return;
    }

    var file = form.files[0];
    if (file.type !== 'image/jpeg') {
      console.log('Not a jpg file!');
      return;
    }

    ajaxFileUplaod(file);
  });

  const retrieveBackgroundImage = (fileName) => {
    $.get({url: serverUrl + '/' + fileName,  // url
      success: function (data) {  // success callback
        console.log('testing success');
        $('body').css('background-image', 'url(' + fileName + ')');
      },
      complete: function () {
        console.log('success');
      }
    });
  };

})();

