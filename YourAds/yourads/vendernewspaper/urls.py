from django.urls import path
from . import views
from django.conf.urls import url

urlpatterns = [
    path('vender',views.vender,name='vender'),
    path('venderprofile/',views.profile,name='venderprofile'),
    url(r'^ajax/venderregister/', views.register,name='register'),
    url(r'^ajax/venderlogin/', views.login,name='login'),
    url(r'^ajax/venderotp', views.otp,name='otp'),
    url('ajax/venderresendotp/', views.resendotp, name='resendotp'),
    url('ajax/venderchangeemail/', views.gotoregisterpage, name='gotoregisterpage'),
    url('ajax/venderforgetemailverify', views.forgetemailverify, name='forgetemailverify'),
    url('ajax/venderforgetpassword', views.forgetpassword, name='forgetpassword'),
    url(r'^ajax/vendernewspaperdisplay/', views.newspaperdisplay),
    url(r'^ajax/venderclassifiedtext/', views.classifiedtext),
    url(r'^ajax/venderclassifieddisplay/', views.classifieddisplay),
    url(r'^ajax/venderupdateprofile/', views.updateprofile),
    url(r'^ajax/venderupdatepassword/', views.updatepassword),
    url(r'^ajax/vendercompleteinfo/', views.completeinfo),
    url(r'^ajax/vendercompanydet/', views.companydetail),
    url(r'^ajax/vendergstinno/', views.gstinnosave),
    url(r'^ajax/vendersignature/', views.signature),
    url(r'^ajax/venderaccount/', views.account),
    url(r'^ajax/venderattachnewspaper/', views.attachnewspaper),
    url(r'^ajax/venderattachnewspaperrename/', views.attachnewspaperrename),
    path('vprofile/',views.profilem,name='vprofile'),
    #url(r'^ajax/getothertypes/', views.venderclassifieddisplay),
]
