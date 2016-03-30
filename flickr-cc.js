(function($) {

	// Create a new Flickr API wrapper object
	var flickr = new Flickr('cb2172edd1a978b6c2835d2f8c7c9939');

	// If the page was loaded with a 'q' param...
	if (location.search.substr(0, 3) == '?q=') {

		// Add some user feedback
		$('#photos').html('Hang on a sec...');

		// We start with location.search, something like ?q=wilson%27s+warbler
		var query = location.search.substr(3); // drop the first three chars: wilson%27s+warbler
		query = decodeURIComponent(query);     // decode the URI encoding: wilson's+warbler
		query = query.replace(/\+/g, ' ');     // replace all '+' with ' ': wilson's warbler

		// Insert query into text input
		$('input[name="q"]').val(query);

		// Set up a callback function to handle the photo results
		var callback = function(rsp) {

			// Ok, all ready for photos now
			$('#photos').html('');

			// Iterate over the results, one photo at a time
			$.each(rsp.photos.photo, function(i, photo) {
				var src = photo.src('b').replace('http:', '');
				var img = '<img class="lazy" data-original="' + src + '" alt="">';
				var link = '<a href="' + photo.href() + '">';
				var close = '</a>';
				$('#photos').append(link + img + close);
			});

			// Set up the lazyload plugin
			$("img.lazy").lazyload({
				threshold: 200,
				effect: "fadeIn"
			});
			
			// Add a link back to the official Flickr search results page
			var flickrSearch = 'https://www.flickr.com/search/?tags=' + encodeURIComponent(query) +
			                   '&license=' + encodeURIComponent('7,8,9,10') +
			                   '&sort=relevance';
			$('#see-also').html('Check out this search on the <a href="' + flickrSearch + '">Flickr advanced search page</a>');

		};

		// Search for query we derived from the URL
		// See also: https://www.flickr.com/services/api/flickr.photos.search.html
		flickr.photos.search({
			tags: query,
			sort: 'relevance',
			license: "7,8,9,10" // All the permissively licensed photos
		}, callback);
	}

	// You can uncomment this and check the JS console to see more details about licenses...
	/*flickr.photos.licenses.getInfo({
		text: query,
		license: "7,8,9,10" // All the permissively licensed photos
	}, function(rsp) {
		console.log(rsp);
	});*/

})(jQuery);
