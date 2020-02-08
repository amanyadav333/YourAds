from django.shortcuts import render
from django.http import JsonResponse
from firebase_admin import credentials
from firebase_admin import firestore
from firebase import Firebase
from django.views.decorators.csrf import csrf_exempt
from usernewspaper.models import *
from .models import *
import json


# firebase 
config = {
  "apiKey": "AIzaSyBMKiaGBGcvWyEH7gnRG3CSs9D4bDPDm7s",
  "authDomain": "webfirebase-b8abc.firebaseapp.com",
  "databaseURL": "https://webfirebase-b8abc.firebaseio.com/",
  "storageBucket": "webfirebase-b8abc.appspot.com",
  "serviceAccount": "webfirebase-b8abc-firebase-adminsdk-xexh8-a11539f558.json"
}
firebase = Firebase(config)

# firebase storage
storage=firebase.storage()

# other hording type send
@csrf_exempt
def otherhordingtypes(request):
    if request.method == "POST":
        value=request.POST.get('type')
        dicton={}
        id=[]
        type=[]
        dicton=HordingType().getChildHordingType(value)
        for i,j in dicton.items():
            id.append(i)
            type.append(j)
    return JsonResponse({'id': id,"type":type})

# vender hording saved
@csrf_exempt
def venderhordingsaved(request):
    if request.method == "POST":
        imageurl=[]
        hordingtypename=request.POST.get('hordingtypename')
        otherhordingtypename=request.POST.get('otherhordingtypename')
        filelen=int(request.POST.get('filelen'))
        latlng = request.POST.get('latlng')
        date = request.POST.get('date')
        width = request.POST.get('width')
        height = request.POST.get('height')
        price=request.POST.get('price')
        hordingtype = request.POST.get('hordingtype')
        otherhordingtype = request.POST.get('otherhordingtype')
        vehiclename = request.POST.get('vehiclename')
        noploes = request.POST.get('nopoles')
        for i in range(filelen):
            imageurl.append(Image(request.FILES.get('file'+str(i))).uploadHordingImage(storage))
        hording=VenderHording(imageurl,date,latlng,hordingtype,width,height,price,otherhordingtype,vehiclename,noploes)
        if(hordingtypename == 'Hording Ads'):
            hording.setHordingAds()
        elif(hordingtypename == 'GenetryGate Ads'):
            hording.setGenetryGateAds()
        elif (hordingtypename == 'BusStop Ads'):
            hording.setBusStopAds()
        elif (hordingtypename == 'Digital Ads'):
            hording.setDigitalAds(otherhordingtypename)
        elif (hordingtypename == 'Road Ads'):
            hording.setRoadAds(otherhordingtypename)
        elif (hordingtypename == 'Vehicle Ads'):
            hording.setVehicleAds(otherhordingtypename)
    return JsonResponse({'id': "id"})

#   get hording map latlng position
@csrf_exempt
def gethordingposition(request):
    value=request.POST.get('value')
    latlng=VenderHording.getHordingLatlng(value)
    vallatlng=[]
    for i in latlng:
        vallatlng.append(db.collection(u"VenderHordingSaved").document(i).get().get('latlng'))
    return JsonResponse({'latlng': vallatlng})



