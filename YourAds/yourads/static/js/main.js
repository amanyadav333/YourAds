////////////////////// variables  ////////////////////
////   register,login,otp,forget
var mainotp='';
var mainemail='';
var session='';

////////  user ////////
var arrayprice=[];
var arraypages=[];
var arraycolorprice=[];
var arraycolor=[];


/// vender  /////
var global_tmp;
var global_id;
var spanarray = [];
var displayprice=[];
var displaypage=[];
var i=0;
var vendermarker=[];
var myLatLng='';
var map='';

///// desgine  /////
var profilenavlistitem='';

////////////////   body   ///////////////////////

function Body(){
    var id=document.getElementById('edit');
    var c=id.children;
    c[3].removeChild(c[3].childNodes[0]);
    var y=c[2].children;
    y[0].style.display='none';
    y[1].style.width='250px';
    y[1].style.marginLeft='380px';
    y[1].id='#myCanvas';
    alert('Ankit');
}

///////////////////////////////////////////////////////////// Verificiation  /////////////////////////////////////////////////////////////////

////////////////////  Register  //////////////////

function register(value,tmp){
    alert(1);
    var name=$('#username').val();
    var email=$('#useremail').val();
    var password=$('#userpassword').val();
    var contact=$('#usercontact').val();
    var child=tmp.parentNode.children;
    if(email != '' && password != '' && name != '' && contact != ''){
        var check=/^[A-Z a-z]*$/;
        if(check.test(name)){
            check=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(check.test(email)){
               check=new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,16})");
               if(check.test(password)){
                         check=/^[0-9]*$/;
                         if(check.test(contact) && contact.length == 10){
                                var url='';
                                if(value=="user"){
                                    url='/ajax/userregister/';
                                }else{
                                    url='/ajax/venderregister/';
                                }
                                loadingshowvalidation(true,tmp);
                                $.ajax(
                                {
                                    type:"post",
                                    url: url,
                                    data: {
                                        name: name,
                                        email: email,
                                        password: password,
                                        contact: contact
                                    },
                                    success: function( data )
                                    {
                                        loadingshowvalidation(false,this);
                                        if(data.user == "Success"){
                                            document.getElementById('userotpblock').style.display="block";
                                            document.getElementById('demo').style.display="none";
                                        }else if(data.user == "Invalid Feild"){
                                           alert("Input Feilds are Not Valid");
                                        }else if(data.user == "error" || data.user == "Internet Problem"){
                                           alert("Please Try Again? Internet Problem");
                                        }else if(data.user == "User Allready Exist"){
                                            alert("User Allready Exist");
                                        }
                                    },
                                     error: function(xhr) {
                                        loadingshowvalidation(false,this);
                                        alert("Ajax Not Send");
                                     }
                                 });
                         }else{
                            relateTologin(child,"Invalid Mobile No:(10 Digit No)",7);
                         }
               }else{
                relateTologin(child,"Invalid Password.like:(a-z0-9) len(8-16)",5);
               }
            }else{
                relateTologin(child,"Invalid Email.Like a@example.com",3);
            }
        }else{
            relateTologin(child,"Invalid Name.Like: John Bravo ",1);
        }
    }
}


////////////////////  login  //////////////////

function login(value,tmp) {
    var child=tmp.parentNode.children;
    var email=document.getElementById('userlogemail').value;
    var password=document.getElementById('userlogpassword').value;
    if(email != '' && password != ''){
        var z=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(z.test(email)){
           var check=new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,16})");
           if(check.test(password)){
               if(password.length>=8 && password.length<=16){
                    var url='';
                    if(value=="user"){
                     url='ajax/userlogin/';
                   }else{
                     url='ajax/venderlogin/';
                   }
                    loadingshowvalidation(true,tmp);
                   $.ajax(
                    {
                        type:"post",
                        url: url,
                        data: {
                            email: email,
                            password: password
                        },
                        success: function( data )
                        {
                            loadingshowvalidation(false,tmp);
                            if(data.login == 'success'){
                                window.location.reload();
                            }else if(data.login == 'invalid'){
                                alert('Password Not Correct');
                            }else if(data.login == 'deactive'){
                                alert('please register');
                            }else if(data.login == 'not exist'){
                                alert('User not exist.please register');
                            }else if(data.login == 'venderemail'){
                                alert('User Register with Vender Side');
                            }else if(data.login == 'useremail'){
                                alert('User Register with User Side');
                            }
                        },
                         error: function(xhr) {
                             loadingshowvalidation(false,tmp);
                            alert("Ajax Not Send");
                         }
                     });
               }else{
                  relateTologin(child,"Password length: (8-16) Digit",3);
               }
           }else{
            relateTologin(child,"Invalid Password.like: (a-z0-9)",3);
           }
        }else{
            relateTologin(child,"Invalid Email.Like a@example.com",1);
        }
    }
}


////////////////////  otp verify  //////////////////

function otpverify(value,tmp){
    var valueotp=document.getElementById('otp').value;
    var child=tmp.parentNode.children;
    if(valueotp != ''){
       if(valueotp.length==4){
            var otpurl='';
            if(value=="user"){
             otpurl='ajax/userotp';
           }else{
             otpurl='ajax/venderotp';
           }
            loadingshowvalidation(true,tmp);
            $.ajax(
            {
                type:"post",
                url: otpurl,
                data: {
                    otp: valueotp,
                },
                success: function( data )
                {
                    loadingshowvalidation(false,tmp);
                    if(data.otp=="right"){
                     window.location.reload();
                    }else if(data.otp=="wrong"){
                        child[1].style.textAlign='center';
                        relateTologin(child,"Wrong Otp",1);
                    }else if(data.otp=="session"){
                        alert("Session is clear:Please Register");
                    }else{
                        alert("Please Try Again? Internet Problem");
                    }
                },
                 error: function(xhr) {
                    loadingshowvalidation(false,tmp);
                    alert("Ajax Not Send");
                 }
             });
       }else{
          child[1].style.textAlign='center';
          relateTologin(child,"Invalid Otp: Length is Four",1);
       }
    }
}

////////////////////  resend otp  //////////////////

function Resendotp(value,tmp){
  alert(value);
  var child=tmp.parentNode.children;
  var otpurl=''
   if(value=="user" || value=="userforget"){
     otpurl="ajax/userresendotp/";
   }else{
     otpurl="ajax/venderresendotp/";
   }

    $.ajax(
    {
        type:"post",
        url: otpurl,
        data: {
            value: value,
            email:mainemail
        },
        success: function( data )
        {
           if(data.resend=="success"){
                mainotp=data.otp
                alert(mainotp);
                document.getElementById('resendotp').style.display="none";
                document.getElementById('resendotp2').style.display="none";
            }else if(data.resend=="try again" || data.email=="error"){
                child[1].style.textAlign='center';
                relateTologin(child,"Please Resend OTP",1);
            }
        },
         error: function(xhr) {
            alert("Ajax Not Send");
         }
     });
}

////////////////////  change email and goto register  //////////////////

function changeemail(value) {
    alert(value);
    var url='';
    if(value == 'user' || value == 'vender'){
       if(value=="user"){
         url="ajax/userchangeemail/";
       }else{
         url="ajax/venderchangeemail/";
       }
       document.getElementById('userotpblock').style.display="none";
       document.getElementById('demo').style.display="block";
       $.ajax({
          url: url,
          data: {
            'otp': ''
          },
          dataType: 'json',
          success: function (data) {

          },
             error: function(xhr) {
                alert("Ajax Not Send");
             }
        });
    }else{
      document.getElementById('userotpblock').style.display="none";
      document.getElementById('demo').style.display="block";
    }
}

////////////////////  forget password to email verify   //////////////////

function foregetemailverify(value,tmp){
    var email=$('#forgetemail').val();
    var child=tmp.parentNode.children;
    if(email != ''){
       var z=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       if(z.test(email)){
           var url=''
           if(value=="user"){
             url="/ajax/userforgetemailverify";
           }else{
             url="/ajax/venderforgetemailverify";
           }
            loadingshowvalidation(true,tmp);
            $.ajax(
            {
                type:"post",
                url: url,
                data: {
                    email: email
                },
                success: function( data )
                {
                    loadingshowvalidation(false,tmp);
                    if(data.email=="User Not Exist"){
                     alert("Email Not Exist.Please Signup");
                    }else if(data.email=="success"){
                        alert("success");
                        mainotp=data['otp']
                        mainemail=email
                        alert(mainotp);
                        document.getElementById('userforgetblock').style.display='block';
                        document.getElementById('demo').style.display='none';

                    }else if(data.email=="try again" || data.email=="error"){
                        alert("Please Try Again? Internet Problem");
                    }
                },
                 error: function(xhr) {
                    loadingshowvalidation(false,tmp);
                    alert("Ajax Not Send");
                 }
             });
       }else{
          child[1].style.textAlign='center';
          relateTologin(child,"Invalid Email.Like a@example.com",1);
       }
    }
}

////////////////////  foreget password  //////////////////

function forgetpasswordchange(value,tmp){

   var otp=document.getElementById('forgetotp').value;
   var password=document.getElementById('forgetpassword').value;
   var repassword=document.getElementById('forgetrepassword').value;
   var child=tmp.parentNode.children;

   if(otp != '' && password !='' && repassword!=''){
       if(otp.length==4){
           var check=new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,16})");
           if(check.test(password)){
                  if(password == repassword){
                       var url='';
                       if(value=="user"){
                         url="/ajax/userforgetpassword";
                       }else{
                         url="/ajax/venderforgetpassword";
                       }
                       alert(typeof(otp)+"--"+typeof(mainotp) )
                       if(otp==mainotp){
                          if(password == repassword){
                              loadingshowvalidation(true,tmp);
                               $.ajax(
                                {
                                    type:"post",
                                    url: url,
                                    data: {
                                        email: mainemail,
                                        password: password
                                    },
                                    success: function( data )
                                    {
                                        loadingshowvalidation(false,tmp);
                                        if(data.forget=="reenter password"){
                                         alert("Password is Not change.Please ReEnter");
                                        }else if(data.forget=="success"){
                                            alert("success");
                                            window.location.reload();
                                        }else if(data.forget=="change email"){
                                            alert("email not found.please register");
                                        }else if(data.forget=="Invalid Feild" || data.forget=="error"){
                                            alert("Please Try Again? Internet Problem");
                                        }
                                    },
                                     error: function(xhr) {
                                        loadingshowvalidation(false,tmp);
                                        alert("Ajax Not Send");
                                     }
                                 });
                          }else{
                            alert('Re-password are not Same');
                          }
                       }else {
                           alert('wrong otp');
                       }
                  }else{
                      relateTologin(child,"Password are Not Same",7);
                  }
           }else{
            relateTologin(child,"Invalid Password.like:(a-z0-9) len(8-16)",5);
           }
       }else{
          child[1].style.textAlign='center';
          relateTologin(child,"Invalid Otp: Length is Four",1);
       }
    }
}
////////////////////  login, register and other function relation    //////////////////

// coursel slide
function courselslide(value){
    if(value=="right"){
       document.getElementById('rightcourdel').click();
    }else{
       document.getElementById('leftcourdel').click();
    }

}

//  time out function relato to login
function relateTologin(child,str,num) {
      child[num].textContent=str;
      child[num].style.display='block';
      child[num-1].style.marginBottom='0px';
      window.setTimeout(function (num,child) {
          //clearInterval(myInterval);
          child[num].style.display='none';
          child[num-1].style.marginBottom='20px';
      },4000,num,child);
}

// loding show function
function loadingshowvalidation(show,button) {
    var loadingblockvalidation=document.getElementById('loadingblockregister');
    if(show == true){
       loadingblockvalidation.style.display='block';
       button.disabled = true;
    }else{
       loadingblockvalidation.style.display='none';
       button.disabled = false;
    }
}


///////////////////////////  user news paper methods  ////////////////////////////

function classifiedcolor(val){
    alert(arraycolorprice[parseInt(val.value)]);
    var color=document.getElementById("classcolor");
    var textarea=document.getElementById("classtextarea");
    color.textContent="Color("+arraycolorprice[parseInt(val.value)]+")";
    textarea.style.backgroundColor=""+arraycolor[parseInt(val.value)];
}

function classword(pointer){
    var price=document.getElementById("classprice");
    var wordcount=document.getElementById("classcharacter");
    var wordprice=document.getElementById("classcharacter2");
    var color=$("input[name='colors']:checked").val();
    var word=pointer.value;
    var arr=word.split(" ");
    wordcount.textContent=arr.length;
    wordprice.textContent=arr.length*10;
    if(color=="yellow"){
       price.textContent=200+arr.length*10;
    }else if(color=="lightyellow"){
       price.textContent=150+arr.length*10;
    }else if(color=="pink"){
       price.textContent=100+arr.length*10;
    }else if(color=="white"){
       price.textContent=50+arr.length*10;
    }
}

function readURL(input) {

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function(e) {
      document.getElementById("newspaperimageblock").style.display="block";
      $('#newspaperimageblock2').attr('src', e.target.result);
      document.getElementById("newspaperimageblock2").style.backgroundColor="white";
    }

    reader.readAsDataURL(input.files[0]);
  }
}

$("#imgInp").change(function() {
  readURL(this);
});

function adssize(val){
    document.getElementById("newspaperimageblock").style.display="block";
    var block=document.getElementById("newspaperimageblock2");
    block.style.marginTop="0px";
    if(val.value=="quarter"){
      block.style.width="50%";
      block.style.height="50%";
      block.style.marginTop="175px";
      document.getElementById('adscustom').style.display="none";
    }else if(val.value=='half'){
      block.style.width="100%";
      block.style.height="50%";
      block.style.marginTop="175px";
      document.getElementById('adscustom').style.display="none";
    }else if(val.value=='full'){
      block.style.width="100%";
      block.style.height="90%";
      block.style.marginTop="35px";
      document.getElementById('adscustom').style.display="none";
    }else if(val.value=='custom'){
      document.getElementById('adscustom').style.display="block";
      x=400/33;
      y=400/54;
      block.style.width=x+"%";
      block.style.height=y+"%";
      block.style.marginTop="33px";
    }
}

function adssizewidth(val){
    var block=document.getElementById("newspaperimageblock2");
    var x=((parseInt(val.value))*100)/33;
    block.style.width=x+"%";
}

function adssizeheight(val){
    var block=document.getElementById("newspaperimageblock2");
    var y=((parseInt(val.value))*100)/54;
    block.style.height=y+"%";
}

function Getcitynewsname(point){
  var parent='';
  if(point.id=="ndispcity"){
    parent=document.getElementById('ndispnewspapername'); // select
    $("#ndispnewspapername option").remove();
  }else{
    parent=document.getElementById('newspaperselect2'); // select
    $("#newspaperselect2 option").remove();
  }
  var option = document.createElement("option"); // create newspaper options
  option.textContent="Select Newspaper";
  parent.appendChild(option);
  $.ajax(
    {
        type:"post",
        url: "/ajax/getcitynewsname/",
        data:{
            'value': point.value
        },
        success: function( data )
        {
          var v=data.user;
          if(v=="success"){
              var obj = data.npname;
              var obj2 = data.npnameid;
              for(i in obj){
                  var option = document.createElement("option"); // create newspaper options
                  option.textContent=""+obj[i];
                  option.value=""+obj2[i];
                  parent.appendChild(option);
              }
          }else if(v=="firebase"){
              alert("Error: Internet Browsing Slow.Please Refresh WebSite");
          }else if(v=="Invalid Feild"){
              alert("Error: Your Feild is Invaild.Please Try Again");
          }else if(v=="error"){
              alert("Error: Network Problem.Please Try Again");
          }
        },
         error: function(xhr) {
                alert("Error: Internet Browsing Slow.Please Refresh WebSite");
         }
     });
}

function Getnewspaperpage(point){
  var parent=document.getElementById('ndispsupplements'); // select
  $("#ndispsupplements option").remove();
  var option = document.createElement("option"); // create newspaper options
  option.textContent="Select Supplements";
  parent.appendChild(option);
  $.ajax(
    {
        type:"post",
        url: "/ajax/getnewspaperpage/",
        data:{
            'newspaper': point.value,
            'city': $('#ndispcity').val()
        },
        success: function( data )
        {
          var v=data.user;
          if(v=="success"){
              var obj = data.page;
              var obj2 = data.price;
              for(i in obj){
                  var option = document.createElement("option"); // create newspaper options
                  option.textContent=""+obj[i];
                  option.value=""+i;
                  parent.appendChild(option);
                  arrayprice.push(obj2[i]);
                  arraypages.push(obj[i]);
              }
          }else if(v=="firebase"){
              alert("Error: Internet Browsing Slow.Please Refresh WebSite");
          }else if(v=="Invalid Feild"){
              alert("Error: Your Feild is Invaild.Please Try Again");
          }else if(v=="error"){
              alert("Error: Network Problem.Please Try Again");
          }
        },
         error: function(xhr) {
                alert("Error: Internet Browsing Slow.Please Refresh WebSite");
         }
     });
}

function Getnewspaperclasstext(point){
  $.ajax(
    {
        type:"post",
        url: "/ajax/getnewspaperclasstext/",
        data:{
            'newspaper': point.value,
            'city': $('#city2').val()
        },
        success: function( data )
        {
          var color=data.color;
          var price=data.price;
          var colorradio=[document.getElementById('colorradio1'),document.getElementById('colorradio2'),document.getElementById('colorradio3'),document.getElementById('colorradio4')];
          var colorback=[document.getElementById('colorback1'),document.getElementById('colorback2'),document.getElementById('colorback3'),document.getElementById('colorback4')];
           for(var i=0;i<colorback.length;i++){
               colorback[i].style.backgroundColor=color[i]+"";
               colorradio[i].value=i+"";
               arraycolor.push(color[i]);
               arraycolorprice.push(price[i]);
           }
        }
     });
}

function setprice(val){
    var index=parseInt(val.value);
    alert(arrayprice[index]);
    document.getElementById('pageprice').textContent=arrayprice[index]+"";
}

function adssize(val){
    document.getElementById("newspaperimageblock").style.display="block";
    var block=document.getElementById("newspaperimageblock2");
    block.style.marginTop="0px";
    if(val.value=="quarter"){
      block.style.width="50%";
      block.style.height="50%";
      block.style.marginTop="160px";
      document.getElementById('adscustom').style.display="none";
      $('#adssizename').text('Quarter Size');
      calculateprice(16,25);
    }else if(val.value=='half'){
      block.style.width="100%";
      block.style.height="50%";
      block.style.marginTop="160px";
      document.getElementById('adscustom').style.display="none";
      $('#adssizename').text('Half Size');
      calculateprice(33,25);
    }else if(val.value=='full'){
      block.style.width="100%";
      block.style.height="100%";
      block.style.marginTop="30px";
      document.getElementById('adscustom').style.display="none";
      $('#adssizename').text('Full Size');
      calculateprice(33,49);
    }else if(val.value=='custom'){
      document.getElementById('adscustom').style.display="block";
      x=400/33;
      y=400/54;
      block.style.width=x+"%";
      block.style.height=y+"%";
      block.style.marginTop="30px";
      $('#adssizename').text('Custom Size 4x4cm');
      calculateprice(4,4);
    }
}

function adssizewidth(val){
    var block=document.getElementById("newspaperimageblock2");
    var x=((parseInt(val.value))*100)/33;
    block.style.width=x+"%";
    x=parseInt(document.getElementById('ndispheight2').value);
    calculateprice(x,parseInt(val.value))
}

function adssizeheight(val){
    var block=document.getElementById("newspaperimageblock2");
    var y=((parseInt(val.value))*100)/54;
    block.style.height=y+"%";
    y=parseInt(document.getElementById('ndispwidth2').value);
    calculateprice(parseInt(val.value),y);
}

function calculateprice(heigth,width){
    var price=document.getElementById('pageprice').textContent;
    price=price.split(' ');
    price=(parseInt(price[0])/2)/10;
    var len=price * heigth;
    var wid=price * width;
    $('#pageprice2').text(len*wid+" Rs");
    //var len_wid=(price[0]/2)/10;
}

function newspaperdispaly(){
    alert("ok");

    /*var form =document.getElementById("newspaperdisplayform");
    var input=document.createElement('input');
    input.setAttribute('name',"page");
    var val=parseInt($('#newspaperpageselect').val());
    input.setAttribute('value',""+arraypages[val]);
    form.appendChild(input);
    var input2=document.createElement('input');
    input2.setAttribute('name',"price");
    input2.setAttribute('value',""+document.getElementById('pageprice2').innerHTML);
    form.appendChild(input2);
    $('#newspaperdisplayform').submit();*/
}

function newspaperdispalycartadd(){
    var city=$('#ndispcity').val();
    var newspapername=$('#ndispnewspapername').val();
    var suplle=$('#ndispsupplements').val();
    alert(newspapername);
}


/* ============================================== carousel =============================================== */

$(document).ready(function () {
  var itemsMainDiv = ('.MultiCarousel');
  var itemsDiv = ('.MultiCarousel-inner');
  var itemWidth = "";

  $('.leftLst, .rightLst').click(function () {
      var condition = $(this).hasClass("leftLst");
      if (condition)
          click(0, this);
      else
          click(1, this)
  });

  ResCarouselSize();




  $(window).resize(function () {
      ResCarouselSize();
  });

  //this function define the size of the items
  function ResCarouselSize() {
      var incno = 0;
      var dataItems = ("data-items");
      var itemClass = ('.item');
      var id = 0;
      var btnParentSb = '';
      var itemsSplit = '';
      var sampwidth = $(itemsMainDiv).width();
      var bodyWidth = $('body').width();
      $(itemsDiv).each(function () {
          id = id + 1;
          var itemNumbers = $(this).find(itemClass).length;
          btnParentSb = $(this).parent().attr(dataItems);
          itemsSplit = btnParentSb.split(',');
          $(this).parent().attr("id", "MultiCarousel" + id);


          if (bodyWidth >= 1200) {
              incno = itemsSplit[3];
              itemWidth = sampwidth / incno;
          }
          else if (bodyWidth >= 992) {
              incno = itemsSplit[2];
              itemWidth = sampwidth / incno;
          }
          else if (bodyWidth >= 768) {
              incno = itemsSplit[1];
              itemWidth = sampwidth / incno;
          }
          else {
              incno = itemsSplit[0];
              itemWidth = sampwidth / incno;
          }
          $(this).css({ 'transform': 'translateX(0px)', 'width': itemWidth * itemNumbers });
          $(this).find(itemClass).each(function () {
              $(this).outerWidth(itemWidth);
          });

          $(".leftLst").addClass("over");
          $(".rightLst").removeClass("over");

      });
  }


  //this function used to move the items
  function ResCarousel(e, el, s) {
      var leftBtn = ('.leftLst');
      var rightBtn = ('.rightLst');
      var translateXval = '';
      var divStyle = $(el + ' ' + itemsDiv).css('transform');
      var values = divStyle.match(/-?[\d\.]+/g);
      var xds = Math.abs(values[4]);
      if (e == 0) {
          translateXval = parseInt(xds) - parseInt(itemWidth * s);
          $(el + ' ' + rightBtn).removeClass("over");

          if (translateXval <= itemWidth / 2) {
              translateXval = 0;
              $(el + ' ' + leftBtn).addClass("over");
          }
      }
      else if (e == 1) {
          var itemsCondition = $(el).find(itemsDiv).width() - $(el).width();
          translateXval = parseInt(xds) + parseInt(itemWidth * s);
          $(el + ' ' + leftBtn).removeClass("over");

          if (translateXval >= itemsCondition - itemWidth / 2) {
              translateXval = itemsCondition;
              $(el + ' ' + rightBtn).addClass("over");
          }
      }
      $(el + ' ' + itemsDiv).css('transform', 'translateX(' + -translateXval + 'px)');
  }

  //It is used to get some elements from btn
  function click(ell, ee) {
      var Parent = "#" + $(ee).parent().attr("id");
      var slide = $(Parent).attr("data-slide");
      ResCarousel(ell, Parent, slide);
  }

});

/* ============================================== carousel =============================================== */







//////////////////////////////////////////   vender  /////////////////////////////////////////////////////////

function selectmodal(value,tmp,id){
    var len=spanarray.length;
    for(var i=0;i<len;i++){
        var val="#"+spanarray.pop();
        $(val).remove();
        displaypage.pop();
        displayprice.pop();
    }
    global_id=id;
    global_tmp=tmp;
    if(value==1){
       $('#venderdisplaymodal').css('display','block');
       $('#vendertextmodel').css('display','none');
       $('#venderdisplay2modal').css('display','none');
    }else if(value==2){
       $('#venderdisplaymodal').css('display','none');
       $('#vendertextmodel').css('display','block');
       $('#venderdisplay2modal').css('display','none');
    }else if(value==3){
       $('#venderdisplaymodal').css('display','none');
       $('#vendertextmodel').css('display','none');
       $('#venderdisplay2modal').css('display','block');
    }else if(value=='u1'){
       $('#userdisplaymodel').css('display','block');
       $('#usertextmodel').css('display','none');
       $('#userdisplaymodel2').css('display','none');
       $('#exampleModalLabel').text('Newspaper Display');
    }else if(value=='u2'){
       $('#userdisplaymodel').css('display','none');
       $('#usertextmodel').css('display','block');
       $('#userdisplaymodel2').css('display','none');
       $('#exampleModalLabel').text('Classified Text');
    }else if(value=='u3'){
      $('#userdisplaymodel2').css('display','block');
         $('#userdisplaymodel').css('display','none');
         $('#usertextmodel').css('display','none');
         $('#exampleModalLabel').text('Classified Display');
    }
    $('#modalbutton').click();
}


function addvenderdisplay(tmp){
    var page=document.getElementById('displaypage');
    var price=document.getElementById('displayprice');
    var check=/^[A-Z a-z]*$/;
    if(check.test(page.value) && page.value != ''){
        check=/^[0-9]*$/;
        if(check.test(price.value) && price.value != ''){
            spanarray.push("spantag"+i);
            var block=document.getElementById('addvenderdisplayblock');
            var span = document.createElement("span");
            var itag = document.createElement("button");
            span.textContent=page.value+"-"+price.value+" Rs";
            span.style.marginLeft="15px";
            span.id="spantag"+i;
            span.style.fontSize="13px";
            span.style.marginTop="8px";
            span.style.backgroundColor="#f1f3f4";
            span.style.padding="4px 10px";
            span.style.borderRadius="25px";
            span.appendChild(itag);
            block.appendChild(span);
            displaypage.push(page.value);
            displayprice.push(price.value+" Rs");
            i++;
            document.getElementById('vclear').style.display='block';
        }else{
             var node=tmp.parentNode.parentNode.parentNode.children[1].children[1].children[2];
             node.textContent="Error: Invalid Price";
             node.style.display='block';
             vendervalidtimeout(node);
        }
    }else{
         var node=tmp.parentNode.parentNode.parentNode.children[0].children[1].children[1];
         node.textContent="Error: Invalid Supplements only Character Allow";
         node.style.display='block';
         vendervalidtimeout(node);
    }

}

function deletevdisp(){
    var val="#"+spanarray.pop();
    $(val).remove();
    displaypage.pop();
    displayprice.pop();
    if(displayprice.length==0){
        document.getElementById('vclear').style.display='none';
    }
}


function colorset(value){
    $('#colorcode').val(value);
    document.getElementById('colorcode').style.backgroundColor=value;
}

function addvenderclasstext(tmp){
    var color=document.getElementById('colorcode');
    var price=document.getElementById('colorprice');
    var check=/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})*$/;
    if(check.test(color.value) && color.value != '' && color.value.length == 7){
        check=/^[0-9]*$/;
        if(check.test(price.value) && price.value != ''){
            spanarray.push("spantag"+i);
            var block=document.getElementById('addvenderclasstextblock');
            var span = document.createElement("span");
            span.textContent=color.value+"-"+price.value+" Rs";
            span.style.marginLeft="15px";
            span.id="spantag"+i;
            span.style.fontSize="13px";
            span.style.marginTop="8px";
            span.style.backgroundColor=color.value+"";
            span.style.padding="4px 10px";
            span.style.borderRadius="25px";
            block.appendChild(span);
            displaypage.push(color.value);
            displayprice.push(price.value+" Rs");
            i++;
            document.getElementById('vclear2').style.display='block';
        }else{
             var node=tmp.parentNode.parentNode.parentNode.children[1].children[1].children[2];
             node.textContent="Error: Invalid Price";
             node.style.display='block';
             vendervalidtimeout(node);
        }
    }else{
         var node=tmp.parentNode.parentNode.parentNode.children[0].children[0].children[2];
         node.textContent="Error: Invalid ColorCode";
         node.style.display='block';
         vendervalidtimeout(node);
    }
}

function deletevclasstext(){
    var val="#"+spanarray.pop();
    $(val).remove();
    displaypage.pop();
    displayprice.pop();
    if(displayprice.length==0){
        document.getElementById('vclear2').style.display='none';
    }
}



///////////////////   ajax ////////////////////////

function venderdisplaybook(tmp){
    alert(1);
    var city=$('#displaycity option:selected').val();
    var npname=$('#displaynpname option:selected').val();
    var page=JSON.stringify(displaypage);
    var price=JSON.stringify(displayprice);
    var flag=true;
    /*if(session == ''){
       flag=false;
       tmp.parentNode.parentNode.parentNode.children[0].children[1].children[0].click();
       $('#venderloginbutton').click();
    }*/
    if(city!='' && flag==true){
       if(npname!=''){
          if(displaypage.length != 0 && displayprice.length != 0){
           $.ajax(
            {
                type:"post",
                url: "/ajax/vendernewspaperdisplay/",
                data:{
                    city: city,
                    npname: npname,
                    page: page,
                    price: price,
                    id: global_id,
                },
                success: function( data )
                {
                    alert(data.date);
                    var v=data.date;
                    if(v=="success"){
                       snackbarshow("Successfull Newspaper Display Saved","success");
                       if(global_id!=''){
                            var child=global_tmp.parentNode.parentNode.parentNode.children[0];
                            child.children[0].textContent=$('#displaynpname option:selected').text()+"";
                            child.children[2].children[1].textContent=$('#displaycity option:selected').text()+"";
                            child=global_tmp.parentNode.parentNode.parentNode.parentNode.children[1].children[1];
                            child.style.display='none';
                            child=global_tmp.parentNode.parentNode.parentNode.parentNode.children[1];
                            for(var i=0;i<displayprice.length;i++){
                                var divtag=document.createElement('div');
                                divtag.textContent=displaypage[i]+"-"+displayprice[i];
                                divtag.className='card m-1';
                                divtag.style.borderRadius='30px';
                                divtag.style.padding='0px 12px';
                                child.appendChild(divtag);
                            }
                       }
                    }else if(v=="firebase"){
                        snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                    }else if(v=="invalid feilds"){
                        alert(1);
                        snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                    }else if(v=="invalid session"){
                        snackbarshow("Error: Your Session is Required.Please Login","");
                    }else if(v=="error"){
                        snackbarshow("Error: Network Problem.Please Try Again","");
                    }else if(v=="update"){
                        snackbarshow("Successfull Newspaper Display Update","success");
                    }
                    var len=spanarray.length;
                    for(var i=0;i<len;i++){
                        var val="#"+spanarray.pop();
                        $(val).remove();
                        displaypage.pop();
                        displayprice.pop();
                    }
                },
                error: function(xhr) {
                    snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                 }
             });
          }else{
               var node=document.getElementById('validptag2');
               node.textContent="Error: Supplements and Price Should Be Add to a Button";
               node.style.fontSize='13px';
               node.style.display='block';
               vendervalidtimeout(node);
          }
       }else{
           var node=tmp.parentNode.parentNode.children[0].children[1].children[2];
           node.textContent="Error: Please Select Newspaper";
           node.style.display='block';
           vendervalidtimeout(node);
       }
    }else{
       var node=tmp.parentNode.parentNode.children[0].children[0].children[2];
       node.textContent="Error: Please Select City";
       node.style.display='block';
       vendervalidtimeout(node);
    }
}

function venderclassitextbook(tmp){
    var city=$('#textcity option:selected').val();
    var npname=$('#textnpname option:selected').val();
    var color=JSON.stringify(displaypage);
    var price=JSON.stringify(displayprice);
    var flag=true;
    alert(session);
    /*if(session == ''){
       flag=false;
       tmp.parentNode.parentNode.parentNode.children[0].children[1].children[0].click();
       $('#venderloginbutton').click();
    }*/
    if(city != '' && flag==true){
       if(npname != ''){
          if(displaypage.length != 0 && displayprice.length != 0){
              if(displaypage.length < 5){
                  $.ajax(
                    {
                        type:"post",
                         url: "/ajax/venderclassifiedtext/",
                        data:{
                            city: city,
                            npname: npname,
                            color: color,
                            price: price,
                            id: global_id,
                        },
                        success: function( data )
                        {
                            alert(data.date);
                            var v=data.date;
                            if(data.date=="success"){
                               if(global_id!=''){
                                    child.children[0].textContent=$('#textnpname option:selected').text()+"";
                                    child.children[2].children[1].textContent=$('#textcity option:selected').text()+"";
                                    child=global_tmp.parentNode.parentNode.parentNode.parentNode.children[1].children[1];
                                    child.style.display='none';
                                    child=global_tmp.parentNode.parentNode.parentNode.parentNode.children[1];
                                    for(var i=0;i<displayprice.length;i++){
                                        var divtag=document.createElement('div');
                                        divtag.textContent=displaypage[i]+"-"+displayprice[i];
                                        divtag.className='card m-1';
                                        divtag.style.borderRadius='30px';
                                        divtag.style.backgroundColor=''+displaypage[i];
                                        divtag.style.padding='0px 12px';
                                        child.appendChild(divtag);
                                    }
                               }
                            }else if(v=="firebase"){
                                snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                            }else if(v=="invalid feilds"){
                                snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                            }else if(v=="invalid session"){
                                snackbarshow("Error: Your Session is Required.Please Login","");
                            }else if(v=="error"){
                                snackbarshow("Error: Network Problem.Please Try Again","");
                            }else if(v=="update"){
                                snackbarshow("Successfull Newspaper Display Update","success");
                            }
                            var len=spanarray.length;
                            for(var i=0;i<len;i++){
                                var val="#"+spanarray.pop();
                                $(val).remove();
                                displaypage.pop();
                                displayprice.pop();
                            }
                        },error: function(xhr) {
                            snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                         }
                     });
              }else{
                   var node=document.getElementById('validptag3');
                   node.textContent="Error: Only 5 Color is Add Please clear";
                   node.style.fontSize='13px';
                   node.style.display='block';
                   vendervalidtimeout(node);
              }
          }else{
               var node=document.getElementById('validptag3');
               node.textContent="Error: ColorCode and Price Should Be Add to a Button";
               node.style.fontSize='13px';
               node.style.display='block';
               vendervalidtimeout(node);
          }
       }else{
           var node=tmp.parentNode.parentNode.children[0].children[1].children[2];
           node.textContent="Error: Please Select Newspaper";
           node.style.display='block';
           vendervalidtimeout(node);
       }
    }else{
       var node=tmp.parentNode.parentNode.children[0].children[0].children[2];
       node.textContent="Error: Please Select City";
       node.style.display='block';
       vendervalidtimeout(node);
    }
}

function venderclassidisplay(tmp){
    var city=$('#classdisplaycity option:selected').val();
    var black=$('#blackprice').val();
    var white=$('#whiteprice').val();
    var npname=$('#classdisplaynpname option:selected').val();
    var adssize=$("input[name='optradio']:checked").val();
    alert(adssize);
    var flag=true;
    /*if(session == ''){
       flag=false;
       tmp.parentNode.parentNode.parentNode.children[0].children[1].children[0].click();
       $('#venderloginbutton').click();
    }*/
    if(city != '' && flag==true){
       if(npname != ''){
          var check=/^[0-9]*$/;
          if(check.test(black) && black != ''){
              if(check.test(white) && white != ''){

                  $.ajax(
                {
                    type:"post",
                    url: "/ajax/venderclassifieddisplay/",
                    data:{
                        city: city,
                        npname: npname,
                        white: white,
                        black: black,
                        id: global_id,
                        size: adssize,
                    },
                    success: function( data )
                    {
                        alert(data.date);
                        if(data.date=="success"){
                           if(global_id!=''){
                                child.children[0].textContent=$('#classdisplaynpname option:selected').text()+"";
                                child.children[2].children[1].textContent=adssize;
                                child.children[3].children[1].textContent=$('#classdisplaycity option:selected').text()+"";
                                child=global_tmp.parentNode.parentNode.parentNode.parentNode.children[1].children[1].textContent=white;
                                child=global_tmp.parentNode.parentNode.parentNode.parentNode.children[1].children[1].textContent=black;
                           }
                        }else if(v=="firebase"){
                            snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                        }else if(v=="invalid feilds"){
                            snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                        }else if(v=="invalid session"){
                            snackbarshow("Error: Your Session is Required.Please Login","");
                        }else if(v=="error"){
                            snackbarshow("Error: Network Problem.Please Try Again","");
                        }else if(v=="update"){
                            snackbarshow("Successfull Newspaper Display Update","success");
                        }
                        var len=spanarray.length;
                        for(var i=0;i<len;i++){
                            var val="#"+spanarray.pop();
                            $(val).remove();
                            displaypage.pop();
                            displayprice.pop();
                        }
                    },error: function(xhr) {
                        snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                     }
                 });
              }else{
                   var node=tmp.parentNode.parentNode.children[2].children[1].children[1].children[1];
                   node.textContent="Error: Invalid Price";
                   node.style.display='block';
                   vendervalidtimeout(node);
              }
          }else{
               var node=tmp.parentNode.parentNode.children[2].children[0].children[2].children[1];
               node.textContent="Error: Invalid Price";
               node.style.display='block';
               vendervalidtimeout(node);
          }
       }else{
           var node=tmp.parentNode.parentNode.children[0].children[1].children[2];
           node.textContent="Error: Please Select Newspaper";
           node.style.display='block';
           vendervalidtimeout(node);
       }
    }else{
       var node=tmp.parentNode.parentNode.children[0].children[0].children[2];
       node.textContent="Error: Please Select City";
       node.style.display='block';
       vendervalidtimeout(node);
    }

}

function vendervalidtimeout(child) {
      window.setTimeout(function (child) {
          //clearInterval(myInterval);
          child.style.display='none';
      },4000,child);
}


///////////////////////////////////////////////////////////  vender map   ////////////////////////////

function venderbody(value){
    alert(12);
    if(value==''){
       //window.open('http://localhost:8000/vender','_self');
    }else{
        alert(session);
        session=value
    }
}


function init() {
   alert("world");
     map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -33.8688, lng: 151.2195},
      zoom: 13,
      mapTypeId: 'roadmap'
    });


    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    map.addListener('click', function(event) {
        var marker = new google.maps.Marker({
         position: event.latLng,
         map: map
        });
        vendermarker.push(marker);
      myLatLng=event.latLng;
      markermodal(marker);
     });

    addYourLocationButton(map);
}


function addYourLocationButton(map)
{
    var controlDiv = document.createElement('div');

    var firstChild = document.createElement('button');
    firstChild.style.backgroundColor = '#fff';
    firstChild.style.border = 'none';
    firstChild.style.outline = 'none';
    firstChild.style.width = '40px';
    firstChild.style.height = '40px';
    firstChild.style.borderRadius = '2px';
    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
    firstChild.style.cursor = 'pointer';
    firstChild.style.marginRight = '10px';
    firstChild.style.padding = '0px';
    firstChild.title = 'Your Location';
    controlDiv.appendChild(firstChild);

    var secondChild = document.createElement('div');
    secondChild.style.margin = '10px';
    secondChild.style.width = '18px';
    secondChild.style.height = '18px';
    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
    secondChild.style.backgroundPosition = '0px 0px';
    secondChild.style.backgroundRepeat = 'no-repeat';
    secondChild.id = 'you_location_img';
    firstChild.appendChild(secondChild);

    google.maps.event.addListener(map, 'dragend', function() {
        $('#you_location_img').css('background-position', '0px 0px');
    });

    firstChild.addEventListener('click', function() {
       if ("geolocation" in navigator){
			navigator.geolocation.getCurrentPosition(function(position){
				var currentLatitude = position.coords.latitude;
				var currentLongitude = position.coords.longitude;

				var infoWindowHTML = "Latitude: " + currentLatitude + "<br>Longitude: " + currentLongitude;
				var infoWindow = new google.maps.InfoWindow({map: map, content: infoWindowHTML});
				 myLatLng = { lat: currentLatitude, lng: currentLongitude };
				infoWindow.setPosition(myLatLng);

			});
		}
    });

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}

function markermodal(marker) {
  var button= document.getElementById("markermodal");
  button.click();
  myLatLng=""+marker.getPosition();
  marker.addListener('click', function() {
  var button= document.getElementById("markermodal");
  button.click();
  myLatLng=""+marker.getPosition();
});
}

function delmarker(){
  for(var i=0;i<vendermarker.length;i++){
      var a=""+vendermarker[i].getPosition();
      if(a==myLatLng){
         vendermarker[i].setMap(null);
         vendermarker.splice(i, 1);
      }
  }
  $("#myModal .close").click();
}

function savemarker(){
  markerdetailverify();
}

function InputNull(){
    quality=[0,0,0];
    price2=[0,0,0];
    i1=0;
    $("#hordtype").val('12');
    $("#desc").val('');
    $("#screenprice").val('');
    $("#totalprice").val('');
    $("#price").val('');
    $("#nopoles").val('');
    $("#widthgate").val('');
    $("#heightgate").val('');
    $("#lightheight").val('');
    $("#lightwidth").val('');
    $("#widthbus").val('');
    $("#heightbus").val('');
    $("#height").val('');
    $("#width").val('');
    $("#vehiclename").val('');
    selectimage(12);
}

function fadeimage(){
   $(document).ready(function(){
     $("#fadeimage").slideDown("slow");
   });
}

function fadeimageout(){
$(document).ready(function(){
     $("#fadeimage").hide("slow");
});
}


function HordingTypeFeilds(val){
  $("#otherhordingtypeblock").css('display','none');
  var parent=document.getElementById('otherhordingtypeselecttag'); // select
  $("#otherhordingtypeselecttag option").remove();
  var option = document.createElement("option"); // create newspaper options
  option.textContent="Select Supplements";
  parent.appendChild(option);
   var text=val.options[val.selectedIndex].text;
   if(text=="Road Ads" || text=="Digital Ads" || text=="Vehicle Ads" || text=="Balloon Ads"){
      $.ajax(
        {
            type:"post",
            url: "/ajax/otherhordingtypes/",
            data:{
                type: val.options[val.selectedIndex].value,
            },
            success: function( data )
            {
              var obj = data.id;
              var obj2 = data.type;
              for(i in obj){
                  var option = document.createElement("option"); // create newspaper options
                  option.textContent=""+obj2[i];
                  option.value=""+obj[i];
                  parent.appendChild(option);
              }
              $('#otherhordingtypeblock').css('display','block');
              document.getElementById('otherhordingtypelabel').textContent=text+" Type";
            }
         });
   }
    showHordingTypeFeilds(val);
}

function showHordingTypeFeilds(text){
    text=text.options[text.selectedIndex].text;
    var feild=[document.getElementById('areablock'),document.getElementById('priceblock'),document.getElementById('nodivideradsblock'),document.getElementById('vehiclenameblock')];
    for(var i=0;i<feild.length;i++){
        feild[i].style.display='none';
    }
    if(text=='Hording Ads'){
       feild[0].style.display="block";
       feild[1].style.display="block";
    }else if(text=='BusStop Ads'){
       feild[1].style.display="block";
    }else if(text=='GenetryGate Ads'){
       feild[1].style.display="block";
    }else if(text=='Divider Ads' || text=='SidePole Ads'){
       feild[1].style.display="block";
       feild[0].style.display="block";
       feild[2].style.display="block";
    }else if(text=='Vehicle Screen Ads'){
       feild[1].style.display="block";
       feild[0].style.display="block";
       feild[3].style.display="block";
    }else if(text=='Vehicle Poster Ads'){
       feild[3].style.display="block";
       feild[0].style.display="block";
    }else if(text=='Full Vehicle Ads'){
       feild[3].style.display="block";
       feild[1].style.display="block";
    }else if(text=='Full Rikshaw Ads'){
       feild[3].style.display="block";
       feild[1].style.display="block";
    }
}

function venderhordingsaved(){
    alert(1);
    var date='booked';
    if($('#vhdate').val() != ''){
       date=$('#vhdate').val();
    }

    var formData = new FormData();
    var fileInput = document.getElementById('vhfile');
    var file = fileInput.files[0];
    alert(fileInput.files.length);
    for(var i=0;i<fileInput.files.length;i++){
      formData.append('file'+i,fileInput.files[i]);
    }
    formData.append('filelen',fileInput.files.length);
    formData.append('date',date);
    formData.append('hordingtype',$('#hordtype option:selected').val());
    formData.append('hordingtypename',$('#hordtype option:selected').text());
    formData.append('otherhordingtypename',$('#otherhordingtypeselecttag option:selected').text());
    formData.append('otherhordingtype',$('#otherhordingtypeselecttag option:selected').val());
    formData.append('vehiclename',$('#vhvehiclename').val());
    formData.append('nopoles',$('#vhnopoles').val());
    formData.append('width',$('#vhwidth').val());
    formData.append('height',$('#vhheight').val());
    formData.append('price',$('#vhprice').val());
    formData.append('latlng',myLatLng+"");

   $.ajax(
    {
        type:"post",
        url: "/ajax/venderhordingsaved/",
        data: formData,
        contentType: false,
        processData: false,
        success: function( data )
        {
            alert('ok');
        }
     });
}

////////////////////////////////   Both function working user and vender   /////////////////////////////////////////////

function gethordingposition(val){
    alert(123);
    $.ajax(
    {
        type:"post",
        url: "/ajax/gethordingposition/",
        data: {
            value: val,
        },
        success: function( data )
        {
            var obj=data.latlng;
            for(i in obj){
                obj[i] = obj[i].replace(/[{()}]/g, '');
                obj[i]=obj[i].replace(" ", '');
                var tmp=new Array();
                tmp=obj[i].split(",");
                var lat=Number.parseFloat(tmp[0]);
                var lng=Number.parseFloat(tmp[1]);
                var marker = new google.maps.Marker({
                 position: {lat,lng},
                 map: map,
                 icon: 'http://localhost:8000/static/img/marker/blue_'+val+'.png'
                });
            }
        }
     });
}



////////////////////////////////////////////   desgine javascript         /////////////////////////////////////////////
function profilenavlist(tmp){
    var pt=document.getElementById('profile-tab');
    if(profilenavlistitem==''){
        if(pt.textContent=="Profile Information"){
            pt.style.backgroundColor='white';
            tmp.style.backgroundColor='#f5faff';
            profilenavlistitem=tmp;
        }
    }else{
        profilenavlistitem.style.backgroundColor='white';
        tmp.style.backgroundColor='#f5faff';
        profilenavlistitem=tmp;
    }
}

// multiple publish dates are select
$(".Txt_Date").datepicker({
    startDate: new Date(),
    format: 'd-M-yyyy',
    inline: false,
    lang: 'en',
    step: 5,
    multidate: 5,
    closeOnDateSelect: true
});

///////////////////   snackbar js ///////////////////////////////
function myFunction() {
  alert("1");
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 4000);
}

//  alert show with snackbar
function snackbarshow(str,flag){
    var snack=document.getElementById('snackbaralert');
    snack.textContent=str;
    myFunction();
}

////// classified display pdf view

function pdfview(tmp){
  var x=tmp.files[0];
  var reader  = new FileReader();
  reader.addEventListener("load", function () {
    document.getElementById('pdfviewsmall').src= reader.result;
  }, false);

  if (x) {
    reader.readAsDataURL(x);
  }
}
