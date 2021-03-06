"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Settings: permet de choisir et configurer les modules à activer de SpawnKill
 */
SK.moduleConstructors.Settings = SK.Module.new();

SK.moduleConstructors.Settings.prototype.title = "Configuration";
SK.moduleConstructors.Settings.prototype.description = "Permet d'ajouter une fenêtre de configuration pour SpawnKill.";
SK.moduleConstructors.Settings.prototype.required = true;

SK.moduleConstructors.Settings.prototype.init = function() {
    this.addSettingsButton();
    this.showSettingsIfNeeded();
};

/* Affiche le panneau de configuration au premier lancement du script */
SK.moduleConstructors.Settings.prototype.showSettingsIfNeeded = function() {
    if(!SK.Util.getValue("seenSettings")) {
        window.setTimeout(function() {
            $("#settings-button > a").click();
            //Le panneau ne doit s'afficher qu'une fois
            SK.Util.setValue("seenSettings", true);
        }, 200);
    }
};

/* Ajoute le bouton de configuration */
SK.moduleConstructors.Settings.prototype.addSettingsButton = function() {

    var $settingsButton = new SK.Button({
        class: "minor settings",
        tooltip: {
            text: "Configuration de SpawnKill",
            position: "right"
        },
        wrapper: {
            id: "settings-button"
        },
        click: function(event) {
            event.preventDefault();
            SK.Util.showModal(this.getModal());
        }.bind(this)
    });

    $(".titre_page").after($settingsButton);

};

/* Retourne la fenêtre modale de configuration */
SK.moduleConstructors.Settings.prototype.getModal = function() {

    var self = this;

    var $okButton = new SK.Button({
        class: "large",
        text: "Valider",
        tooltip: {
            class: "large",
            text: "Confirmer le paramètrage",
            position: "bottom"
        },
        click: function(event) {
            event.preventDefault();
            self.saveSettings();
            window.location.reload();
        }
    });

    var $cancelButton = new SK.Button({
        class: "large minor",
        text: "Annuler",
        tooltip: {
            class: "large",
            text: "Annuler les modifications",
            position: "bottom"
        },
        click: function(event) {
            event.preventDefault();
            SK.Util.hideModal();
        }.bind(this)
    });

    var $modal = new SK.Modal({
        title: "Configuration de SpawnKill",
        content: this.getSettingsUI(),
        buttons: [$cancelButton, $okButton]
    });

    return $modal;
};

SK.moduleConstructors.Settings.prototype.getSettingsUI = function() {

    var ui = "";

    ui += "<ul id='settings-form' >";
        for(var moduleKey in SK.modules) {

            var module = SK.modules[moduleKey];
            ui += "<li class='setting" + (module.required ? " required" : "") + "' data-activated='" + (module.activated ? "1" : "0") + "' data-id='" + moduleKey + "' >";

                ui += "<div class='main-setting' >" + module.title + "</div>";
                ui += "<hr>";
                ui += "<ul class='options fold' >";
                    for(var settingKey in module.settings) {
                        var setting = module.settings[settingKey];
                        ui += "<li class='option' data-value='" + (setting.value ? "1" : "0") + "' data-id='" + settingKey + "' >";
                            ui += module.settings[settingKey].title;
                        ui += "</li>";
                    }    
                ui += "</ul>";
            ui += "</li>";
        }
    ui += "</ul>";

    var $ui = $(ui);

    //On ajoute l'intéractivité (toggle, boutons de sous-options, ...)
    $ui.find(".setting").each(function() {

        var $setting = $(this);
        var $mainSetting = $setting.find(".main-setting");
        var disabled = $mainSetting.parent().hasClass("required");
        var subOptions = $mainSetting.siblings(".options").find(".option");

        //Slide-toggles Settings
        $mainSetting.append(new SK.SlideToggle({
            value: $setting.attr("data-activated") === "1",
            checkbox: {
                disabled: disabled
            }
        }));

        //Boutons sous-options
        var $settingButton = new SK.Button({
            class: "settings",
            tooltip: {
                text: "Afficher/Masquer les options du module"
            },
            wrapper: {
                class: "subsettings-button"
            },
            //Ouverture/fermeture du panneau d'options
            click: function() {
                var $options = $setting.find(".options");

                $options.toggleClass("fold");
            }
        });

        if(subOptions.length > 0) {
            $mainSetting.append($settingButton);
        }

        //Slide-toggles Options
        $setting.find(".option").each(function() {
            var $option = $(this);
            $option.append(new SK.SlideToggle({
                value: $option.attr("data-value") === "1",
            }));
        });
    });

    return $ui;
};

/** Parcourt l'interface de paramètrage et enregistre les préférences */
SK.moduleConstructors.Settings.prototype.saveSettings = function() {
    //On parcourt l'interface et on enregistre les préférences
    $("#settings-form .setting").each(function() {
        var $setting = $(this);
        var settingId = $setting.attr("data-id");
        var settingIsActivated = $setting.find(".main-setting .slide-toggle input").prop("checked");
        SK.Util.setValue(settingId, settingIsActivated);

        //Enregistrement des options des modules
        $setting.find(".option").each(function() {
            var $option = $(this);
            var optionId = settingId + "." + $option.attr("data-id");
            var optionValue = $option.find("input").prop("checked");
            SK.Util.setValue(optionId, optionValue);

        });

    });
};

SK.moduleConstructors.Settings.prototype.shouldBeActivated = function() {
    return (window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/(0|1|2|3)/));
};

SK.moduleConstructors.Settings.prototype.getCss = function() {
    var css = "\
        #col1 {\
            position: relative; \
        }\
        #ft1 {\
            right: 67px !important;\
        }\
        #ft2 {\
            right: 23px !important;\
        }\
        #settings-button {\
            position: absolute;\
                right: 1px;\
                top: 3px;\
        }\
        .sk-button-content.settings {\
            width: 18px;\
            height: 15px;\
            background-image: url('" + GM_getResourceURL("settings") + "');\
            background-position: 1px 0px;\
        }\
        #settings-form {\
            position: relative;\
            left: -10px;\
            width: 420px;\
            margin-bottom: 10px;\
        }\
        #settings-form hr {\
            margin: 0px;\
            position: static;\
        }\
        .main-setting {\
            position: relative;\
            height: 18px;\
            padding: 8px 10px;\
            font-size: 1.2em;\
            color: #666;\
        }\
        .setting .options {\
            max-height: 1000px;\
            overflow: hidden;\
            background-color: #666;\
            box-shadow: \
                inset 0px 11px 6px -10px rgba(0, 0, 0, 0.4),\
                inset 0px -11px 6px -10px rgba(0, 0, 0, 0.4);\
            transition-duration: 300ms;\
        }\
        .setting .option {\
            position: relative;\
            padding: 10px;\
            padding-left: 20px;\
            color: #EEE;\
            border-bottom: solid 1px #888;\
        }\
        .setting .options.fold {\
            max-height: 0px !important;\
        }\
        #settings-form .slide-toggle {\
            position: absolute;\
            right: 34px;\
            top: 5px;           \
        }\
        .subsettings-button {\
            position: absolute !important;\
            right: 10px;\
        }\
    ";
    return css;
};
