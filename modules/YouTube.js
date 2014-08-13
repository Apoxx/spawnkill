"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * YouTube : Remplace les liens vers une vidéo YouTube par la vidéo elle-même.
 */
SK.moduleConstructors.YouTube = SK.Module.new();

SK.moduleConstructors.YouTube.prototype.title = "Intégration YouTube";
SK.moduleConstructors.YouTube.prototype.description = "Remplace les liens vers une vidéo YouTube par la vidéo elle-même.";
SK.moduleConstructors.YouTube.prototype.required = false;

SK.moduleConstructors.YouTube.prototype.init = function() {
    /**
     * Fonction qui analyse un lien.Si il correspond à une vidéo YouTube, il retourne une version "embed" du lien, sinon null.
     * http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
     */
    function normalizeYTUrl(url) {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);
            if (match && match[2].length == 11) {
                return "http://www.youtube.com/embed/" + match[2];
            } else {
                return null;
            }
        }
    
    /**
     * Fonction qui crée l'élément à intégrer à la page.
     */
    function createVideoElement(ytLink) {
            var $el = $('<iframe>');
            $el.attr('src', ytLink);
            $el.attr('width', "400");
            $el.attr('height', "225");
            $el.attr('allowfullscreen', 1);
            $el.attr('frameborder', 0);
            $el.css('margin', '10px');
            $el.addClass('youtube-video');
            return $el;
        }
        
    /**
     * Fonction qui ajoute le bouton afficher/masquer les vidéos à un post.
     */
    function addButtonToPost($post) {
            var showVideos = true;
            SK.Util.addButton($post, btnOpts(function() {
                showVideos = !showVideos;
                $post.find('.youtube-video').toggle(showVideos);
                $post.find('.youtube-link').toggle(!showVideos);
                if (!showVideos) $(this).css("text-decoration", "line-through");
                else $(this).css("text-decoration", "none");
            }));
        }
        
    /**
     * Fonction qui génère les options du bouton afficher/masquer les vidéos.
     */
    function btnOpts(clickHandler) {
            return {
                location: "right",
                tooltip: {
                    text: "Masquer/Afficher la/les vidéo(s) de ce post.",
                    class: "youtube-button",
                    position: "top"
                },
                text: "\u25B6",
                css: {
                    "line-height": "12px",
                    "text-align": "center",
                    "background-color": "red",
                    "color": "white",
                },
                click: clickHandler
            };
        }
        
    /**
     * Parcourt des posts à la recherche de liens YouTube,
     * remplacement des liens pas les vidéos et ajout d'un bouton masquer/afficher au post si nécessaire.
     */
    $('.msg').each(function(id, post) {
        var $post = $(post);
        var linkCpt = 0;
        $post.find('.post a').each(function(id, lien) {
            var ytLink = normalizeYTUrl(lien.href);
            if (ytLink !== null) {
                var $lien = $(lien);
                var $video = createVideoElement(ytLink);
                $lien.after($video);
                $lien.addClass('youtube-link');
                $lien.hide();
                linkCpt++;
            }
        });
        if (linkCpt > 0) addButtonToPost($post);
    });
};

SK.moduleConstructors.YouTube.prototype.shouldBeActivated = function() {
    return window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1/);
};


SK.moduleConstructors.YouTube.prototype.getCss = function() {
    return "";
};

SK.moduleConstructors.YouTube.prototype.settings = {};
