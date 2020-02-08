from django.urls import path
from . import views
from django.conf.urls import url

urlpatterns = [
    path('',views.Index,name='Index'),
    path('userprofile/',views.userprofile,name='userprofile'),
    url('ajax/userregister/', views.register, name='register'),
    url('ajax/userlogin', views.login, name='login'),
    url('ajax/userotp', views.otp, name='otp'),
    url('ajax/userresendotp/', views.resendotp, name='resendotp'),
    url('ajax/userchangeemail/', views.gotoregisterpage, name='gotoregisterpage'),
    url('ajax/userforgetemailverify', views.forgetemailverify, name='forgetemailverify'),
    url('ajax/userforgetpassword', views.forgetpassword, name='forgetpassword'),
    path('newspaperdisplaybook/',views.newspaperdisplaybook,name='newspaperdisplaybook'),
    url(r'^ajax/getcitynewsname/', views.getcitynewspapername),
    url(r'^ajax/getnewspaperpage/', views.getnewspaperpage),
    url(r'^ajax/getnewspaperclasstext/', views.getnewspaperclasstext),
    url(r'^ajax/userupdateprofile/', views.updateprofile),
    url(r'^ajax/userupdatepassword/', views.updatepassword),
    url(r'^ajax/usercompleteinfo/', views.completeinfo),
    url(r'^ajax/usercompanydet/', views.companydetail),
    path('editor/',views.editor,name='editor'),
    path('uprofile/',views.profilem,name='uprofile'),
    path('about/',views.about,name='about'),
    path('cart/',views.cart,name='cart'),
]
