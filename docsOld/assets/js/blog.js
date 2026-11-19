$(document).ready(function() {


	var base_url = '',
        contents = 'contents.json',
        blog_dir = 'blog/',
        static_dir = 'pages/',
        pages = [],
        blog = [],
        current_page = null,
        settings = null,
        posts = [],
        title = null,
        md_converter = new Attacklab.showdown.converter();

        // init
        $.getJSON(contents, function(data) {

            settings = data;

            var h1 = settings.title + ' <small>'+settings.tagline+'</small>';
            document.title = settings.title;
            title = settings.title;
            $('header h1 a').html(h1);
            $('sidebar').html(md_converter.makeHtml(settings.blurb));
            $('sidebar').append('<ul>');

            settings.posts.reverse();

            // show 5 most recent posts
            $.each(settings.posts, function(post) {
                var article = settings.posts[post];
                var file = article.file.replace('.md', '');
                $('sidebar').append('<li><a href="#'+file+'">'+article.title+'</a><date>'+article.date+'</date></li>');
            });
            $('sidebar').append('<li><a href="#archive">Archive</a></li>');
            $('sidebar').append('</ul>');

            $('#loading').hide();
            router();
        });
   

   var findPost = function(key, val) {
  
        for (var i = 0; i < settings.posts.length; i += 1) {
            if (settings.posts[i][key] == val) {
                return { 
                    data: settings.posts[i],
                    id: i
                }
            }

        }
   
   };

    var loadPage = function(page) {
  
        $('#main').html('Loading...');
        var target = blog_dir + page + '.md';
        var find = findPost('file', page+'.md');

        if (typeof find === 'undefined') {
            $('#main').html('<h2>Page not found</h2>');
            return;
        }

        $.get(target, function(data) {
            var html = md_converter.makeHtml(data);
            $('#main').html(html);

            // next & prev links
            var prev = settings.posts[find.id + 1];
            var next = settings.posts[find.id - 1];

            if (typeof prev === 'object') {
                $('#main').append('<p class="prev"><a href="#'+prev.file.replace('.md', '')+'">&laquo; '+prev.title+'</a></p>');
            }
        
            if (typeof next === 'object') {
                $('#main').append('<p class="next"><a href="#'+next.file.replace('.md', '')+'">&raquo; '+next.title+'</a></p>');
            }

        });

    };


    var router = function() {
    
        if (settings === null) {
            return;
        }
        var chk = window.location.hash.replace('#', '') || 'home';

        if (chk !== current_page) {
            switch(chk) {
            
                case 'archive':
                    $('#main').html('Archive');
                    page = 'archive';
                break;

                case 'home':
                    var page = settings.posts[0].file;
                    page = page.replace('.md', '');
                    loadPage(page);
                break;

                default:
                    loadPage(chk);
                break;

            } 
            current_page = chk;
        }

        setTimeout(router, 60);
    }



});
