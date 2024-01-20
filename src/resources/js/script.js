$(document).ready(function () { 
    $("form").on("submit", function (event) {
        event.preventDefault();
        var tag = document.getElementById('tag').value;
    
        var APIurl=  `https://www.themealdb.com/api/json/v1/1/search.php?s=${tag}`;

        $.ajax(
            {
               
                type: "GET",
                url: APIurl,
                dataType: "json", //Might need to change to jsonp when uploading to heroku
                error: function (e) {
                    console.log("Failed Get")
                },

                    success: function (data) {
                    if(data){
                        data.idMeal = data.idMeal || "-";
                        data.strMeal = data.strMeal || "-";
                        data.strArea = data.strArea || "-";
                        data.strCategory = data.strCategory || "-";
                        data.strTags = data.strTags || "-";
                    }

                    console.log(data);

                    if(data.meals){
                        $("#my-results").empty(); //Clears it so it doens't print twice
                        $("#my-results").append('<p id="idMeal">' + data.meals[0].idMeal + '</p>');
                        $("#my-results").append('<p id="strMeal">' + "Name:" + data.meals[0].strMeal + '</p>');
                        $("#my-results").append('<p id="strArea">' + "Area:" + data.meals[0].strArea + '</p>');
                        $("#my-results").append('<p id="strCategory">' + "Category:" + data.meals[0].strCategory + '</p>');
                        $("#my-results").append('<p id="strTags">' + "Tags:" + data.meals[0].strTags + '</p>');
                
                    }
                    else{
                        $("#my-results").empty(); //Clears it so it doens't print twice
                        $("#my-results").append('<p>' + "ID:" + "-" + '</p>');
                        $("#my-results").append('<p>' + "Name:" + "-" + '</p>');
                        $("#my-results").append('<p>' + "Area:" + "-" + '</p>');
                        $("#my-results").append('<p>' + "Category:" + "-" + '</p>');
                        $("#my-results").append('<p>' + "Tags:" + "-" + '</p>');

                    }
                    $("#modal-container").append('<button  style="margin-left: 45%;margin-top: 2%; position: fixed; background-color: white;" type="button"  data-toggle="modal" data-target="#exampleModal">Add Search Result</button>');

        
                }
            }

        )

    })

    $('#yesSave').click(function () {
        var address = `http://localhost:3000/searches`; //end point

        $.ajax(
            {
                type: "POST",
                url: address,
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({
                    idMeal: $("#idMeal").html(),
                    strMeal: $("#strMeal").html(),
                    strCategory: $("#strCategory").html(),
                    strArea: $("#strArea").html(),
                    strTags: $("#strTags").html()
                }),
                
       
                error: function (e) {
                    console.log("Failed Post");
                },
             
                dataType: "json",
                success: function (data) {

                    alert("Your Search Has Been Saved!");
    
                }
            }
        )
    })

});