$(function(){function n(){$("form.signin p.error, form.signup p.error").remove(),$("form.signin input, form.signup input").removeClass("error")}var o=!0;$(".switch-button").on("click",function(t){t.preventDefault(),$("input").val(""),n(),o?(o=!1,$(".signup").show("slow"),$(".signin").hide()):(o=!0,$(".signin").show("slow"),$(".signup").hide())}),$("form.signin input, form.signup input").on("focus",function(){n()}),$(".signup-button").on("click",function(o){o.preventDefault(),n();var t={login:$("#signup-login").val(),password:$("#signup-password").val(),passwordConfirm:$("#signup-password-confirm").val()};$.ajax({type:"POST",data:JSON.stringify(t),contentType:"application/json",url:"/api/auth/signup"}).done(function(n){n.ok?$(location).attr("href","/"):($(".signup h2").after('<p class="error">'+n.error+"</p>"),n.fields&&n.fields.forEach(function(n){$("input[name="+n+"]").addClass("error")}))})}),$(".signin-button").on("click",function(o){o.preventDefault(),n();var t={login:$("#signin-login").val(),password:$("#signin-password").val()};$.ajax({type:"POST",data:JSON.stringify(t),contentType:"application/json",url:"/api/auth/signin"}).done(function(n){n.ok?$(location).attr("href","/"):($(".signin h2").after('<p class="error">'+n.error+"</p>"),n.fields&&n.fields.forEach(function(n){$("input[name="+n+"]").addClass("error")}))})})}),$(function(){function n(){$(".post-form p.error").remove(),$(".post-form input, #post-body").removeClass("error")}$(".post-form input, #post-body").on("focus",function(){n()}),$(".publish-button, .save-button").on("click",function(o){o.preventDefault(),n();var t="save-button"===$(this).attr("class").split(" ")[0],i={title:$("#post-title").val(),body:$("#post-body").val(),isDraft:t,postId:$("#post-id").val()};$.ajax({type:"POST",data:JSON.stringify(i),contentType:"application/json",url:"/post/add"}).done(function(n){console.log(n),n.ok?t?$(location).attr("href","/post/edit/"+n.post.id):$(location).attr("href","/posts/"+n.post.url):($(".post-form h2").after('<p class="error">'+n.error+"</p>"),n.fields&&n.fields.forEach(function(n){$("#post-"+n).addClass("error")}))})}),$("#file").on("change",function(){var n=new FormData;n.append("postId",$("#post-id").val()),n.append("file",$("#file")[0].files[0]),$.ajax({type:"POST",url:"/upload/image",data:n,processData:!1,contentType:!1,success:function(n){console.log(n),$("#fileinfo").prepend('<div class="img-container"><img src="/uploads'+n.filePath+'" alt="" /></div>')},error:function(n){console.log(n)}})}),$(".img-container").on("click",function(){var n=$(this).attr("id"),o=$("#post-body"),t=o[0].selectionStart,i=o.val(),r="![alt text](image"+n+")";o.val(i.substring(0,t)+r+i.substring(t))})}),$(function(){function n(n,i){if($(".reply").show(),o&&o.remove(),t=null,o=$(".comment").clone(!0,!0),n)o.find(".cancel").hide(),o.appendTo(".comment-list");else{var r=$(i).parent();t=r.attr("id"),$(i).after(o)}o.css({display:"flex"})}var o,t;n(!0),$(".reply").on("click",function(){n(!1,this),$(this).hide()}),$("form.comment .cancel").on("click",function(t){t.preventDefault(),o.remove(),n(!0)}),$("form.comment .send").on("click",function(i){i.preventDefault();var r={post:$(".comments").attr("id"),body:o.find("textarea").val(),parent:t};$.ajax({type:"POST",data:JSON.stringify(r),contentType:"application/json",url:"/comment/add"}).done(function(t){if(t.ok){var i='<ul><li style="background-color:#ffffe0;"><div class="head"><a href="/users/'+t.login+'">'+t.login+'</a><spam class="date">Только что</spam></div>'+t.body+"</li></ul>";$(o).after(i),n(!0)}else void 0===t.error&&(t.error="Неизвестная ошибка"),$(o).prepend('<p class="error">'+t.error+"</p>")})})});