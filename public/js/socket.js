// Generated by CoffeeScript 1.9.3
(function() {
  var socket;

  socket = io();

  $(function() {
    var card_box, ctx, data, post, u_id;
    post = $("#post");
    card_box = $("#card_box");
    u_id = $("#user_id");
    $("#post_form").submit(function(e) {
      var body, data;
      e.preventDefault();
      post.hide();
      body = $("#post_body");
      data = {};
      data.body = body.val();
      data.user_id = u_id.val();
      data.socket_id = socket.id;
      socket.emit("send_post_card", data);
      $("#create_post").closeModal();
      body.val("");
      return post.fadeIn();
    });
    socket.on("failed_save_data", function(data) {
      if (data) {
        return console.log("unsaved!");
      }
    });
    socket.on("hand_out_post_card", function(data) {
      var create_delete_form, current_user_id, friends_id, post_card;
      friends_id = $("#friends_id").val().split("_");
      friends_id.shift();
      create_delete_form = function(data, current_user_id) {
        if (data.user_id === current_user_id) {
          return "<a href='/posts/" + data.id + "/edit'>編集</a><i id='delete_post_" + data.id + "_" + data.user_id + "' class='mdi-action-delete red-text tiny delete_post_form right'></i>";
        } else {
          return "";
        }
      };
      if (friends_id.indexOf("" + data.user_id) >= 0) {
        current_user_id = $("#current_user_id").val();
        post_card = "<article id='posted_card_" + data.id + "' class='col s12 m6'> <div class='card'> <div class='card-content'> <div class='row'> <div class='col s2 m3 l2'> <img src='" + (data.user_image !== "/thumb/null" ? "" + data.user_image : "/images/amethyst_flat.png") + "' class='circle responsive-img'></div> <div class='col s10 m9 l10'><span class='card-title cyan-text'>" + data.user_name + "</span></div> </div> <p>" + (data.body.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>")) + "</p> <span class='font_size_10 right'>" + data.created_at + "</span> </div> <div class='card-action'> <a href='/posts/" + data.id + "/' class='teal-text'>コメント</a> " + (create_delete_form(data, current_user_id)) + " </div> </div> </article>";
        return card_box.prepend(post_card);
      }
    });
    socket.emit("send_circle_talk", {
      firsr_check: true,
      room_id: $("#room_id").val()
    });
    $("#submit_talk").on("click", function() {
      var data;
      data = {};
      data.body = $("#circle_talk").val();
      if (data.body.length >= 1) {
        data.user_id = $("#user_id").val();
        data.user_name = $("#user_name").val();
        data.user_image = $("#user_image").val();
        data.circle_id = $("#circle_id").val();
        data.room_id = $("#room_id").val();
        data.firsr_check = false;
        socket.emit("send_circle_talk", data);
        return $("#circle_talk").val("");
      }
    });
    socket.on("sent_talk_from_server", function(data) {
      var card_panel;
      card_panel = "<article class='card " + (data.user_id === $('#user_id').val() ? 'blue' : 'grey') + " lighten-1 white-text'> <div class='card-content'> <div class='row'> <div class='col s2'> <img src='" + (data.user_image ? "/thumb/" + data.user_image : '/images/colorfull2.jpg') + "' class='circle responsive-img blue'> </div> <div class='col s10'> <h5 class='font_size_18'>" + data.user_name + "</h5> </div> </div> <div class='row'> <div class='col s12'> <p class='font_size_12'>" + (data.body.replace(/\n/g, '<br/>')) + "</p> </div> </div> </div> </article>";
      return $("#cotery_comments_field").append(card_panel);
    });
    if (location.pathname.match(/posts\/[0-9]*$/)) {
      data = {
        first_check: true,
        room_id: $("#room_id").val()
      };
      socket.emit("create_new_comment", data);
    }
    $("#make_comment").submit(function(e) {
      e.preventDefault();
      data = {};
      data.room_id = $("#room_id").val();
      data.body = $("#comment_body").val();
      data.user_id = $("#user_id").val();
      data.user_name = $("#user_name").val();
      data.user_image = $("#user_image").val();
      data.post_id = $("#post_id").val();
      data.first_check = false;
      return socket.emit("create_new_comment", data);
    });
    socket.on("sent_create_new_comment", function(data) {
      var comment_data;
      comment_data = "<li class='collection-item avatar'> <img src='" + (data.user_image != null ? data.user_image : "/images/amethyst_flat.png") + "' class='circle'> <span class='title'>" + data.user_name + "</span> <p>" + data.body + "</p> </li>";
      $("#comments").append(comment_data);
      return $("#comment_body").val("");
    });
    $(document).on("click", ".song_card", function() {
      data = {
        song_id: $(this).attr("id").split("_")[1]
      };
      return socket.emit("play_song", data);
    });
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioContext();
    return socket.on("send_song_data", function(data) {
      return ctx.decodeAudioData(data, function(buffer) {
        var buf_node;
        buf_node = ctx.createBufferSource();
        buf_node.buffer = buffer;
        buf_node.connect(ctx.destination);
        buf_node.start(0);
        $(".song_controller").slideDown();
        return $(document).on("click", ".stop", function() {
          console.log("Stop");
          return buf_node.stop();
        });
      }, function() {
        return console.log("Failed decode");
      });
    });
  });

}).call(this);
