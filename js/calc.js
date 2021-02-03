(function ($) {
    $(document).ready(function () {

        $("body").on("click", ".calc__colitem", function (e) {
            e.preventDefault();
            if ($(this).parent().hasClass("owl-item")) {
                $(this).addClass("calc__colitem-item_active").parent().siblings().find(".calc__colitem").removeClass("calc__colitem-item_active");
            } else{
                $(this).addClass("calc__colitem-item_active").siblings().removeClass("calc__colitem-item_active");
            }
        });


        $("body").on("click", ".js-calc__material-item", function (e) {
            $("#calc-send input[name='calc-material']").val($(this).find(".calc__colitem-name").text());
        });

        $("body").on("click", ".js-calc__height-item", function (e) {
            $("#calc-send input[name='calc-height']").val($(this).find(".calc__colitem-name").text());
        });

        $("body").on("click", ".js-calc__table-item", function (e) {
            $("#calc-send input[name='calc-table']").val($(this).find(".calc__colitem-name").text());
        });

        $(".js-calc__form-item").click(function (e) {
            var form = $(this).attr("data-calcform");
            $(".calc__colitem-image[data-calcform=" + form + "]").show().siblings().hide();
            $("#calc-send input[name='calc-form']").val($(this).find(".calc__colitem-name span").text());
            $(".js-calc__sizes-img").attr("src", $(this).find("img").attr("src"));
            switch (form) {
                case "1":
                    $(".js-calc__sizes-size").hide().siblings(".calc__sizes-size1").show();
                    break;
                case "2":
                    $(".calc__sizes-size1, .calc__sizes-size2, .calc__sizes-size3").show();
                    break;
                case "3":
                    $(".js-calc__sizes-size").hide().siblings(".calc__sizes-size1, .calc__sizes-size2").show();
                    break;
                case "4":
                    $(".js-calc__sizes-size").hide().siblings(".calc__sizes-size1, .calc__sizes-size3").show();
                    break;
                default:
                    break;
            }
            $(".js-calc__sizes-size .calc__sizes-size__input").change();
        });

        $(".js-calc__sizes-size .calc__sizes-size__input").change(function (e) {
            e.preventDefault();
            var form = $(".js-calc__form-item.calc__colitem-item_active").data("calcform");
            var sizes = "";
            switch (form) {
                case 1:
                    sizes += "Ширина: ";
                    sizes += $(".js-calc__sizes-size.calc__sizes-size1 input").val() + "мм\r\n";
                    break;
                case 2:
                    sizes += "Ширина: ";
                    sizes += $(".js-calc__sizes-size.calc__sizes-size1 input").val() + "мм\r\n";
                    sizes += "Левое крыло: ";
                    sizes += $(".js-calc__sizes-size.calc__sizes-size2 input").val() + "мм\r\n";
                    sizes += "Правое крыло: ";
                    sizes += $(".js-calc__sizes-size.calc__sizes-size3 input").val() + "мм\r\n";
                    break;
                case 3:
                    sizes += "Ширина: ";
                    sizes += $(".js-calc__sizes-size.calc__sizes-size1 input").val() + "мм\r\n";
                    sizes += "Левое крыло: ";
                    sizes += $(".js-calc__sizes-size.calc__sizes-size2 input").val() + "мм\r\n";
                    break;
                case 4:
                    sizes += "Ширина: ";
                    sizes += $(".js-calc__sizes-size.calc__sizes-size1 input").val() + "мм\r\n";
                    sizes += "Правое крыло: ";
                    sizes += $(".js-calc__sizes-size.calc__sizes-size3 input").val() + "мм\r\n";
                    break;
                default:
                    break;
            }
            $("#calc-send input[name=calc-size]").val(sizes);
        });

        // $(".js-calc__order-radio").change(function (e) {
            // e.preventDefault();
            // if (jQuery("input[name=calc__order-receiver]:checked").val() != "Email") {
            //     $(".calc__order-row__email").slideUp().find("input").removeAttr("required");
            // } else{
            //     $(".calc__order-row__email").slideDown().find("input").attr("required", "required");
            // }
        // });

        $(".js-calc__map-item__pos").click(function (e) {
            var pos = $(this).attr("data-calcmap");
            var map = $(this).siblings("img[data-calcmap=" + pos + "]");
            var src = map.attr("src").trim();
            map.show().addClass("calc__map-item_active").siblings("img").hide().removeClass("calc__map-item_active");
            $("#calc-send input[name='calc-map']").val(src);
        });

        $(".js-calc__technic-checkbox input").change(function (e) {
            e.preventDefault();
            var technics = "";
            $.each($(this).parents(".calc__technic-row").find("input:checked"), function (i, e) {
                technics += $(e).siblings("label").text() + ", ";
            });
            technics = technics.substring(0, technics.length - 2);
            $("#calc-send input[name='calc-technic']").val(technics);

        });

        $(".js-calc__order-submit").click(function (e) {
            e.preventDefault();
            buildForm();
            sendForm($(this).parents("form"));

        });

        $('.calc__order-input_file').change(function() {
            var files = this.files;
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > 5242880) {
                    $(this).val('');
                    $(".calc__order-dropdown label").append("<span class='error-msg'>Файл слишком большой<br />Максимальный размер 5Мб</span>")
                    setTimeout(function(){
                        $(".calc__order-dropdown label .error-msg").remove();
                    }, 2000);
                }
            }
            var data = new FormData($('.calc__order-form')[0]);
            fileUpload(data);
        });

        // drag form
		var dropZone = $(".calc__order-dropdown");
		if (dropZone.length > 0) {
			dropZone[0].ondragover = function() {
                dropZone.removeClass('drop');
                dropZone.addClass('hover');
                return false;
			};
			dropZone[0].ondragleave = function() {
                dropZone.removeClass('drop');
                dropZone.removeClass('hover');
                return false;
			};
			dropZone[0].ondrop = function(event) {
                event.preventDefault();
                dropZone.removeClass('hover').addClass('drop');
                var file = event.dataTransfer.files[0];
                $('.calc__order-input_file').prop('files', event.dataTransfer.files);
			};
		}

        // $('.owl-carousel').owlCarousel({
        //     items: 4,
        //     loop: true,
        //     nav: true,
        //     responsive: {
        //         0: {
        //             items: 1
        //         },
        //         600: {
        //             items: 2
        //         },
        //         900: {
        //             items: 4
        //         }
        //     }
        // });
    });

    function buildForm() {
        // $("#calc-send input[name=calc-model]").val($(".js-calc__models-item.calc__colitem-item_active .calc__colitem-name span").text());
        $("#calc-send input[name=calc-form]").val($(".js-calc__form-item.calc__colitem-item_active .calc__colitem-name span").text());
        $("#calc-send input[name=calc-material]").val($(".js-calc__material-item.calc__colitem-item_active .calc__colitem-name span").text());
        $("#calc-send input[name=calc-map-m]").val($(".js-calc__map-item-m img:visible").attr("src"));
        $("#calc-send input[name=calc-map-d]").val($(".js-calc__map-item-d img:visible").attr("src"));
        $(".js-calc__sizes-size .calc__sizes-size__input").change();
        $("#calc-send input[name=calc-height]").val($(".js-calc__height-item.calc__colitem-item_active .calc__colitem-name span").text());
        $("#calc-send input[name=calc-table]").val($(".js-calc__table-item.calc__colitem-item_active .calc__colitem-name span").text());
        $("#calc-send input[name=calc-furniture]").val($(".js-calc__furniture-item.calc__colitem-item_active .calc__colitem-name span").text());
        $("#calc-send input[name=calc-date]").val($(".js-calc__date-item.calc__colitem-item_active .calc__colitem-name span").text());
        var technics = "";
        $.each($(".js-calc__technic-checkbox input:checked"), function (i, e) {
            technics += $(e).siblings("label").text() + ", ";
        });
        technics = technics.substring(0, technics.length - 2);
        $("#calc-send input[name='calc-technic']").val(technics);
    }

    function sendForm(form) {
        form = $(form);
        let data = form.serialize();
        var valid = true;
        $.each(form.find('input, textarea'), function (i, el) {
            if (!validInput(el)) {
                valid = false;
            }
        });
        if (valid) {
            $.ajax({
                type: "post",
                url: "/send.php",
                data: data,
                dataType: "json",
                success: function (response) {
                    $(form).fadeOut('fast', function () {
                        if ($(".calc__order-dropdown").length > 0) {
                            $(".success-row").remove();
                            $(".calc__order-dropdown span").show();
                        }
                        $('<h4 class="calc__order-success">Заявка отправлена. В ближайшее время с Вами свяжется наш менеджер</h4>').insertBefore(form);
                        $.each(form.find('input:not([type=button]):not([type=submit]), textarea'), function (index, el) {
                            if (($(el).attr('type') == "checkbox") || ($(el).attr('type') == "radio")) {
                                $(el).prop("checked", false);
                            } else {
                                $(el).val("");
                            }
                        });
                        setTimeout(function () {
                            $(form).fadeIn();
                            form.siblings('h4').remove();
                        }, 12000);
                    });

                },
                error: function (error) {
                    console.error('error');
                    console.error(error);
                }
            });
        }
    }

    function fileUpload(data) {
        var dropZone = $(".calc__order-dropdown");
        $.ajax({
            type: "post",
            url: "/send.php",
            data: data,
            dataType: 'json',
            cache: false,
            contentType: false,
            processData: false,
            xhr: function() {
                var myXhr = $.ajaxSettings.xhr();
                if (myXhr.upload) {
                    myXhr.upload.addEventListener('progress', function(e) {
                        if (e.lengthComputable) {
                            $('progress').fadeIn().attr({
                                value: e.loaded,
                                max: e.total,
                            });
                        }
                    } , false);
                }
                return myXhr;
            },
            success: function (response) {
                $('progress').fadeOut();
                if (response.length > 0) {
                    $(dropZone[0]).find('span').hide();
                    $('form#calc-send').find("input[name=filelist]").val(JSON.stringify(response));
                    if ($(dropZone[0]).find(".success-row").length == 0) {
                        $(dropZone[0]).find("label").append("<div class='success-row'></div>");
                    }
                    for (let i = 0; i < response.length; i++) {
                        $(dropZone[0]).find(".success-row").append("<img src='"+response[i]+"'>");
                    }
                }
            },
            error: function (error) {
                console.error("error", error);
            }
        });
    }
    function validInput(el) {
        var regemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        var validemail = true;
        if ($(el).attr('type') == "email") {
            validemail = regemail.test(String($(el).val()).toLowerCase());
        }
        if ($(el).prop('required') && ((!$(el).val()) || !validemail)) {
            $(el).addClass('has-error');
            $(el).parents('form').find('input[type=submit]').attr('disabled', true);
            return false;
        } else {
            $(el).removeClass('has-error');
            $(el).parents('form').find('input[type=submit]').attr('disabled', false);
            return true;
        }
    }


})(jQuery);
