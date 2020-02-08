/////////////////////////////////////////   profile   ////////////////////////////////////////////////
/// variables
var attachnwpid='';
var attachnwpname='';
var base_tmp='';

//// end


function updateprofile(tmp,value) {
    alert(1);
    var name=$('#profilename').val();
    var email=$('#profileemail').val();
    var contact=$('#profilecontact').val();
    if(email != '' &&  name != '' && contact != ''){
        var check=/^[A-Z a-z]*$/;
        if(check.test(name)){
            check=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if(check.test(email)){
                 check=/^[0-9]*$/;
                 if(check.test(contact) && contact.length == 10){
                        var url='';
                        if(value=="user"){
                            url='/ajax/userupdateprofile/';
                        }else{
                            url='/ajax/venderupdateprofile/';
                        }
                        $.ajax(
                        {
                            type:"post",
                            url: url,
                            data: {
                                name: name,
                                email: email,
                                contact: contact
                            },
                            success: function( data )
                            {
                                var v=data.forget;
                                if(v=="success"){
                                    snackbarshow("Successfull Update Profile","success");
                                }else if(v=="Try again"){
                                    snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                                }else if(v=="Invalid Feild"){
                                    snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                                }else if(v=="error"){
                                    snackbarshow("Error: Network Problem.Please Try Again","");
                                }else if(v=="update feilds same"){
                                    snackbarshow("Error: Update Feilds are Same","");
                                }else if(v=="session"){
                                    snackbarshow("Error: Your Session is Required.Please Login","");
                                }
                            },
                             error: function(xhr) {
                                    snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                             }
                         });

                 }else{
                     var node=tmp.parentNode.children[2].children[2];
                     profilevalidtimeout(node,"Error: Invalid Mobile No:(10 Digit No)");
                 }
            }else{
                var node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Invalid Email.Like a@example.com");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Invalid Name.Like: John Bravo ");
        }
    }else{
        if(name != ''){
            if(email != ''){
                if(contact != ''){

                }
                else{
                    node=tmp.parentNode.children[2].children[2];
                    profilevalidtimeout(node,"Error: Please Enter Feild");
                }
            }else{
                node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Please Enter Feild");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Please Enter Feild");
        }
    }
}

function updatepassword(tmp,value) {
    var old=$('#profileoldpass').val();
    var newp=$('#profilenewpass').val();
    var renew=$('#profilerenewpass').val();
    if(old != '' &&  newp != '' && renew != ''){
        var check=new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,16})");;
        if(check.test(old)){
            if(check.test(newp)){
                 if(newp == renew){
                        var url='';
                        if(value=="user"){
                            url='/ajax/userupdatepassword/';
                        }else{
                            url='/ajax/venderupdatepassword/';
                        }
                        $.ajax(
                                {
                                    type:"post",
                                    url: url,
                                    data: {
                                        oldpass: old,
                                        newpass: newp,
                                    },
                                    success: function( data )
                                    {
                                        var v=data.forget;
                                        if(v=="success"){
                                            snackbarshow("Successfull Password Updated","success");
                                        }else if(v=="Try again"){
                                            snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                                        }else if(v=="Invalid Feild"){
                                            snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                                        }else if(v=="error"){
                                            snackbarshow("Error: Network Problem.Please Try Again","");
                                        }else if(v=="password wrong"){
                                            snackbarshow("Error: Your Password is Wrong.Please Try Again","");
                                        }else if(v=="session"){
                                            snackbarshow("Error: Your Session is Required.Please Login","");
                                        }else if(v=="updates are same"){
                                            snackbarshow("Error: Update Feilds are Same","");
                                        }
                                    },
                                     error: function(xhr) {
                                        snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                                     }
                                 });

                 }else{
                     var node=tmp.parentNode.children[2].children[2];
                     profilevalidtimeout(node,"Error: Password are Not Same)");
                 }
            }else{
                var node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Invalid Password.like:(a-z0-9) len(8-16)");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Invalid Password.like:(a-z0-9) len(8-16)");
        }
    }else{
        if(old != ''){
            if(newp != ''){
                if(renew != ''){

                }
                else{
                    node=tmp.parentNode.children[2].children[2];
                    profilevalidtimeout(node,"Error: Please Enter Feild");
                }
            }else{
                node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Please Enter Feild");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Please Enter Feild");
        }
    }
}

function completeinfo(tmp,value){
    var city=$('#compinfocity option:selected').val();
    var pancard=$('#compinfopancard').val();
    var address=$('#compinfoaddress').val().trim();
    if(city != '' &&  pancard != '' && address != ''){
        var check=/^([a-zA-Z]{5})(\d{4})([a-zA-Z]{1})$/;
        if(check.test(pancard)){
            if(address.length < 50){
                    var url='';
                    if(value=="user"){
                        url='/ajax/usercompleteinfo/';
                    }else{
                        url='/ajax/vendercompleteinfo/';
                    }
                    $.ajax(
                    {
                        type:"post",
                        url: url,
                        data: {
                            city: city,
                            pancard: pancard,
                            address: address,
                        },
                        success: function( data )
                        {
                            var v=data.forget;
                            if(v=="success"){
                                snackbarshow("Successfull Complete Registration","success");
                            }else if(v=="Try again"){
                                snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                            }else if(v=="Invalid Feild"){
                                snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                            }else if(v=="error"){
                               snackbarshow("Error: Network Problem.Please Try Again","");
                            }else if(v=="updates are same"){
                                snackbarshow("Error: Update Feilds are Same","");
                            }else if(v=="session"){
                                snackbarshow("Error: Your Session is Required.Please Login","");
                            }
                        },
                         error: function(xhr) {
                            snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                         }
                     });
            }else{
                node=tmp.parentNode.children[2].children[2];
                profilevalidtimeout(node,"Error: Please Enter Full Address and Length 80 Max)");
            }
        }else{
            node=tmp.parentNode.children[1].children[2];
            profilevalidtimeout(node,"Error: Invalid Pan Card No");
        }
    }else{
        if(city != ''){
            if(pancard != ''){
                if(!address.length < 1){

                }
                 else{
                    node=tmp.parentNode.children[2].children[2];
                    profilevalidtimeout(node,"Error: Please Enter Feild");
                }
            }else{
                node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Please Enter Feild");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Please Enter Feild");
        }
    }
}

function updatecompanydet(tmp,value) {
    alert(value);
    var name=$('#companydetname').val();
    var desc=$('#companydetdesc').val();
    if(name != '' &&  desc != ''){
        var check=/^[A-Z a-z]*$/;
        if(check.test(name)){
            if(desc.length < 50){
                    var url='';
                    if(value=="user"){
                        url='/ajax/usercompanydet/';
                    }else{
                        url='/ajax/vendercompanydet/';
                    }
                    $.ajax(
                    {
                        type:"post",
                        url: url,
                        data: {
                            name: name,
                            email: email,
                        },
                        success: function( data )
                        {
                            var v=data.forget;
                            if(v=="success"){
                                snackbarshow("Successfull Company Detail Saved","success");
                            }else if(v=="Try again"){
                                snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                            }else if(v=="Invalid Feild"){
                                snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                            }else if(v=="error"){
                                snackbarshow("Error: Network Problem.Please Try Again","");
                            }else if(v=="updates are same"){
                                snackbarshow("Error: Update Feilds are Same","");
                            }else if(v=="session"){
                                snackbarshow("Error: Your Session is Required.Please Login","");
                            }
                        },
                         error: function(xhr) {
                            snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                         }
                     });
            }else{
                var node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Invalid Email.Like a@example.com)");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Invalid Name Like: YourAds ");
        }
    }else{
        if(name != ''){
            if(desc != ''){

            }else{
                var node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Please Enter Feild");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Please Enter Feild");
        }
    }
}

function gstinnosave(tmp){
    alert(1);
   var gst=$('#gstinno').val();
   if(gst!=''){
      var check=/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}Z[0-9]{1}?$/;
      if(check.test(gst)){
          $.ajax(
            {
                type:"post",
                url: '/ajax/vendergstinno/',
                data: {
                    gstin: gst,
                },
                success: function( data )
                {
                    alert(data.forget);
                    var v=data.forget;
                    if(v=="success"){
                        snackbarshow("Successfull GSTIN No Register","success");
                    }else if(v=="Invalid Feild"){
                        snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                    }else if(v=="error"){
                        snackbarshow("Error: Network Problem.Please Try Again","");
                    }else if(v=="Try again"){
                        snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                    }else if(v=="session"){
                        snackbarshow("Error: Your Session is Required.Please Login","");
                    }
                },
                 error: function(xhr) {
                    snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                 }
             });
      }else{
          profilevalidtimeout(tmp.parentNode.children[2],"Error: Invalid GSTIN No Please Read Details");
      }
   }else{
      profilevalidtimeout(tmp.parentNode.children[2],"Error: Please Enter Feild");
   }
}

function signatureupload(tmp){
   var img=$('#imgInp');
   alert(8);
   if(img.val() != ''){
      if(img[0].files[0].size < 5242880){
            alert(img[0].files[0].name);
            var formData = new FormData();
            formData.append('file',img[0].files[0]);
             $.ajax(
                {
                    type:"post",
                    url: "/ajax/vendersignature/",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function( data )
                    {
                        alert(data.forget);
                        var v=data.forget;
                        if(v=="success"){
                            snackbarshow("Successfull Signature Uploaded","success");
                        }else if(v=="Try again"){
                            snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                        }else if(v=="Invalid Feild"){
                            snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                        }else if(v=="error"){
                            snackbarshow("Error: Network Problem.Please Try Again","");
                        }else if(v=="imagefirebase"){
                            snackbarshow("Error: Internet Browsing Slow.Image is not Uploaded","");
                        }else if(v=="session"){
                            snackbarshow("Error: Your Session is Required.Please Login","");
                        }
                    },
                    error: function(val){
                        alert("ajax not send");
                    }
                 });
      }else{
          profilevalidtimeout(tmp.parentNode.children[2],"Error: Invalid Image Please Read Details");
      }
   }else{
      profilevalidtimeout(tmp.parentNode.children[2],"Error: Please Upload Image");
   }
}

function bankdetail(tmp) {
    alert(1);
    var name=$('#accname').val();
    var account_no=$('#accno').val();
    var ifsc=$('#accifsc').val();
    if(name != '' &&  account_no != '' && ifsc!=''){
        var check=/^[A-Z a-z]*$/;
        if(check.test(name)){
            check=/^[0-9]{9,18}$/;
            if(check.test(account_no)){
                check=/^[A-Za-z]{4}0[A-Z0-9a-z]{6}$/;
                if(check.test(ifsc)){
                        $.ajax(
                        {
                            type:"post",
                            url: "/ajax/venderaccount/",
                            data: {
                                name: name,
                                accno: account_no,
                                ifsc: ifsc,
                            },
                            success: function( data )
                            {
                                alert(data.forget);
                                var v=data.forget;
                                if(v=="success"){
                                    snackbarshow("Successfull BankDetail Register","success");
                                }else if(v=="Try again"){
                                    snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                                }else if(v=="Invalid Feild"){
                                    snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                                }else if(v=="error"){
                                     snackbarshow("Error: Network Problem.Please Try Again","");
                                }else if(v=="updates are same"){
                                    snackbarshow("Error: Update Feilds are Same","");
                                }else if(v=="session"){
                                    snackbarshow("Error: Your Session is Required.Please Login","");
                                }
                            },
                             error: function(xhr) {
                                snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                             }
                         });
                }else{
                    var node=tmp.parentNode.children[2].children[2];
                    profilevalidtimeout(node,"Error: Invalid IFSC Code");
                }
            }else{
                var node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Invalid Account Number");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Invalid Name Like: John Bravo ");
        }
    }else{
        if(name != ''){
            if(account_no != ''){
                if(ifsc != ''){

                }else{
                    var node=tmp.parentNode.children[2].children[2];
                    profilevalidtimeout(node,"Error: Please Enter Feild");
                }
            }else{
                var node=tmp.parentNode.children[1].children[2];
                profilevalidtimeout(node,"Error: Please Enter Feild");
            }
        }else{
            var node=tmp.parentNode.children[0].children[2];
            profilevalidtimeout(node,"Error: Please Enter Feild");
        }
    }
}

function attachnewspaper(tmp){
   alert(1);
   var gst=$('#attachnewspaper').val();
   if(gst!=''){
      var check=/^[A-Z a-z]*$/;
      if(check.test(gst)){
          var url='';
          if(attachnwpid == ''){
            url='/ajax/venderattachnewspaper/';
          }else{
            url='/ajax/venderattachnewspaperrename/';
          }
          $.ajax(
            {
                type:"post",
                url: url,
                data: {
                    name: gst,
                    id:attachnwpid
                },
                success: function( data )
                {
                    alert(data.forget);
                    var v=data.forget;
                    if(v=="success"){
                       snackbarshow("Successfull Newspaper Attached","success");
                       var parentblock=document.getElementById('attachnwpnameshow');
                       var labeltag=document.createElement('label');
                       labeltag.textContent=gst;
                       labeltag.style.borderRadius='20px';
                       labeltag.style.backgroundColor='#f1f3f4';
                       labeltag.style.padding='5px 15px';
                       labeltag.style.marginLeft='10px';
                       labeltag.style.fontSize='15px';
                       labeltag.id=data.id;
                       labeltag.style.marginTop='10px';
                       labeltag.onclick = function() {
                              alert(this.textContent);
                              base_tmp=this.id;
                              $('#button_modal_bottom').click();
                              attachnwpid=data.id;
                              attachnwpname=this.textContent;
                       }
                       parentblock.appendChild(labeltag);
                    }else if(v=="Try again"){
                        snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                    }else if(v=="Invalid Feild"){
                        snackbarshow("Error: Your Feild is Invaild.Please Try Again","");
                    }else if(v=="error"){
                        snackbarshow("Error: Network Problem.Please Try Again","");
                    }else if(v=="updates are same"){
                        snackbarshow("Error: Update Feilds are Same","");
                    }else if(v=="session"){
                        snackbarshow("Error: Your Session is Required.Please Login","");
                    }
                },
                 error: function(xhr) {
                    snackbarshow("Error: Internet Browsing Slow.Please Refresh WebSite","");
                 }
             });
      }else{
          profilevalidtimeout(tmp.parentNode.children[2],"Error: Please Valid Name Enter");
      }
   }else{
      profilevalidtimeout(tmp.parentNode.children[2],"Error: Please Enter Feild");
   }
}

function attachnwplabeltag(tmp,id){
  attachnwpid=id;
  attachnwpname=tmp.textContent;
  base_tmp=tmp;
  $('#button_modal_bottom').click();
}

function attachnewspaperrename(tmp) {
    $('#button_modal_bottom').click();
    base_tmp.style.display='none';
    $('#attachnewspaper').val(attachnwpname.trim());
}

//////////////  other function  /////////////////////
//  time out function relato to login
function profilevalidtimeout(child,str) {
      child.style.display='block';
      child.textContent=str;
      window.setTimeout(function (child) {
          //clearInterval(myInterval);
          child.style.display='none';
      },4000,child);
}

///////////////////   snackbar js ///////////////////////////////
function myFunction() {
  var x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

//  alert show with snackbar
function snackbarshow(str,flag){
    var snack=document.getElementById('snackbaralert');
    snack.textContent=str;
    myFunction();
}
