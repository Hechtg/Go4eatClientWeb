/** Global Variables **/
var dbClientReference; // WILL hold a reference to the go4eatweb firebase project database AFTER LINKING FIREBASE TO THE PAGE
var dbProviderReference; // WILL hold a reference to the go4eatprovider-5dac4 firebase project database AFTER LINKING FIREBASE TO THE PAGE
var client = {}; // holds a reference to our current user
var order = {}; // holds the on-going order
var ordersHistory = {}; // holds all the current unfinished orders
var finishedOrders = []; // holds all the current unfinished orders
var favouritProviders = [];
var favouritDishes = [];

$("script[name='firebaseScripts']").ready(function() {
  // Initialize Firebase
  var clientConfig = {
    apiKey: "AIzaSyA9j_49jkNPNYmNJ-YRwpB1F0YX4WEN0WI",
    authDomain: "go4eatweb.firebaseapp.com",
    databaseURL: "https://go4eatweb.firebaseio.com",
    projectId: "go4eatweb",
    storageBucket: "go4eatweb.appspot.com",
    messagingSenderId: "455829610429"
  };

  var providerConfig = {
    apiKey: "AIzaSyBmxr2j77P571cuMDbIJLytl5ts7jL7J4o",
    authDomain: "go4eatprovider-5dac4.firebaseapp.com",
    databaseURL: "https://go4eatprovider-5dac4.firebaseio.com",
    projectId: "go4eatprovider-5dac4",
    storageBucket: "go4eatprovider-5dac4.appspot.com",
    messagingSenderId: "867135430663"
  };

  var clientFb = firebase.initializeApp(clientConfig);
  var providerFb = firebase.initializeApp(providerConfig, "providerFb");

  dbClientReference = clientFb.database();
  dbProviderReference = providerFb.database();
});

function chosenDish(){
  var temp = Math.floor(Math.random()*10+1);// TODO: remove this - it generates random ids
  order.userId = temp; // TODO: replace this with a dynamic value

  switch($("#submitButton").val()){
    case "restSelection":
      order.provider = $("input[name='rest']:checked").val();
      $("div[name='restDiv']").hide();
      $("div[name='dishDiv']").show();
      $("#regretButton").show();
      $("#submitButton").val("dishSelection");
      $("#regretButton").val("dishSelection");
      break;
    case "dishSelection":
      order.dishTitle = $("input[name='dish']:checked").val();
      $("div[name='dishDiv']").hide();
      $("div[name='dishProp']").show();
      $("#regretButton").show();
      $("#submitButton").val("propSelection");
      $("#regretButton").val("propSelection");
      break;
    case "propSelection":
      order.dishIngredients = $("input[type='checkbox'][name='prop']:checked").map(function(_, el) {
                                      return $(el).val();
                                  }).get();
      $("div[name='addNotes']").show();
      $("div[name='dishProp']").hide();
      $("#submitButton").html("Go over your order");
      $("#submitButton").val("addNotes");
      $("#regretButton").val("addNotes");
      break;
    case "addNotes":
      order.notes = $("#notes").val();
      $("div[name='finalAprooval']").show();
      $("div[name='addNotes']").hide();
      $("div[name='finalAprooval']").html(orderToHtml(order));
      $("#submitButton").html("Submit Your Order");
      $("#submitButton").val("finalAprooval");
      $("#regretButton").val("finalAprooval");
      break;
    case "finalAprooval":
      $("div[name='orderSent']").show();
      $("#submitButton").hide();
      $("#regretButton").hide();
      $("#closeWindowButton").show();
      $("#submitButton").val("finalAprooval");
      $("#regretButton").val("finalAprooval");
      makeNewOrder(order);
      break;
  }
}

function regretChoice(){
  switch($("#regretButton").val()){
    case "dishSelection":
      order.provider = null;
      $("div[name='restDiv']").show();
      $("div[name='dishDiv']").hide();
      $("#regretButton").hide();
      $("#submitButton").val("restSelection");
      break;
    case "propSelection":
      order.dishTitle = null;
      $("div[name='dishDiv']").show();
      $("div[name='dishProp']").hide();
      $("#submitButton").val("dishSelection");
      $("#regretButton").val("dishSelection");
      break;
    case "addNotes":
      order.dishIngredients = null;
      $("div[name='addNotes']").hide();
      $("div[name='dishProp']").show();
      $("#submitButton").html("Choose");
      $("#submitButton").val("propSelection");
      $("#regretButton").val("propSelection");
      break;
    case "finalAprooval":
      order.notes = null;
      $("div[name='finalAprooval']").hide();
      $("div[name='addNotes']").show();
      $("#submitButton").html("Go Over Your Order");
      $("#submitButton").val("addNotes");
      $("#regretButton").val("addNotes");
      break;
    }
}

function orderToHtml(order){
  if(order.notes==="")
    order.notes="NO SPECIAL NOTES WERE INSERTED."
  if(order.dishIngredients.length===0)
    order.dishIngredients.push("NO INGRIDIENTS WERE CHOSEN.");
  var curOrderString =
    '<table id="orderTable" style="width:100%; border-color: black; border-style:solid; border-width: thin;">'
    +'<tr style="width:100%;">'
    +'<td style="width:100%;">'
    +'<div>'
    +  '  <table style="width: 100%; border-bottom: thin black; border-top: thin black; border-style:solid;">'
    +     '<tr>'
    +       '<td style="width:50%; color:Black;">Your Order Details:<br><br></td>'
    +      '</tr>'
    +      '<tr>'
    +       '<td style="width:50%; color:Black;">Supplier:<br><br></td>'
    +      '</tr>'
    +      '<tr>'
    +        '<td style="width:50%; color:#626161;">'+order.provider+'<br><br></td>'
    +      '</tr>'
    +      '<tr>'
    +        '<td style="width:50%; color:Black;">'+order.dishTitle+'<br><br></td>'
    +      '</tr>'
    +      '<tr>'
    +        '<td style="width:50%; color:Black;">Ingridients:</td>'
    +      '</tr>'
    +      '<tr>'
    +        '<td style="width:50%; color:#626161;">&nbsp&nbsp&nbsp'+order.dishIngredients.join('<br>&nbsp&nbsp&nbsp')+'<br><br></td>'
    +      '</tr>'
    +      '<tr>'
    +        '<td style="width:50%; color:Black;">Notes:</td>'
    +      '</tr>'
    +      '<tr>'
    +        '<td style="width:50%; color:#626161;">&nbsp&nbsp&nbsp'+order.notes+'<br><br></td>'
    +      '</tr>'
    +    '</table>'
    +'</div>'
    +'</a>'
    +  '</td>'
    +  '</tr>'
    +'</table>';

  return curOrderString;
}

function quickOrder(){
  var qorder =
   {
    "date" : "01_06_2017",
    "dishIngredients" : [ "NO INGRIDIENTS WERE CHOSEN." ],
    "dishTitle" : "Salad",
    "key" : "-KlUmJQ8belJpBpfCvQX",
    "notes" : "NO SPECIAL NOTES WERE INSERTED.",
    "provider" : "Karnaf",
    "time" : "21:33",
    "userId" : 1
  };
  makeNewOrder(qorder);
}
function makeNewOrder(order) {
  var fullDate = new Date();
  order.time = fullDate.getHours()+":";
  if(fullDate.getMinutes()<10)
    order.time+="0"+fullDate.getMinutes();
  else
    order.time+= fullDate.getMinutes();
  order.date = addZero(fullDate.getDate())+"_"+addZero(fullDate.getMonth()+1)+"_"+fullDate.getFullYear();

  // Get a key for a new Order.
  order.key = dbProviderReference.ref().child("/all_orders/"+order.date+"/"+order.userId).push().key;
  // Write the new order's data simultaneously in the karnaf-orders list and our general all-orders list.
  var updates = {};
  updates["/providers/"+order.provider+"/"+order.provider+"_orders/"+order.date+"/"+order.key] = order;
  updates["/all_orders/"+order.date+"/"+order.key] = order;
  updates["/users/"+order.userId+"/"+order.userId+"_orders/"+order.key] = order;

  return dbProviderReference.ref().update(updates);
}


function addZero(n){
  return n<10? '0'+n:''+n;
}
