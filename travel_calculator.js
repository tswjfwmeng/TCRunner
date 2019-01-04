 // travel_calculator.js
 // don't forget to validate at jslint.com

 /*jslint devel: true, browser: true */
 /*global $*/
$(function () {
    "use strict";

    var pay_rate = 0;
    var travelers = 0;
    var food_cost = 0;
    var audio_users = 0;
    var audio_rate = 0;
    var video_users = 0;
    var video_rate = 0;
    var data_cap = 0;
    var plan_overage = 0;
    var audio_user_daily_data = 0;
    var video_user_daily_data = 0;
    var total_user_daily_data = 0;
    var total_daily_data = 0;

    function mbpsToGBpd(Mbps) {
         // This converts Megabits per second items into Gigabytes per day
         // This is used when calculating data service overages
        var MbToMBRatio = 8; //ratio of Megabits per Megabyte
        var MBToGBRatio = 1024; // ratio of Megabytes per Gigabyte
        var secPerDay = 24 * 60 * 60; // number of seconds in a day 24h * 60m/h * 60s/m
        var MBps = Mbps / MbToMBRatio; // calculate Megabytes per Second
        var GBps = MBps / MBToGBRatio; // calculate Gigabytes per Second
        var GBpd = GBps * secPerDay; // calculate Gigabytes per Day
        return GBpd;
     }

    function addCheckboxValues(groupName) {
         // This checks all of the checkboxes in a group and adds up the total!

        var total = 0;

         // this loop goes through all checked elements of "groupName" and adds them
         // note use of 'ignore' instead of expected 'index':
         // this is to pass jslint validation, but is a good practice for
         // parameter that isn't used
        $("input[name='" + groupName + "']:checked").each(function (ignore, element) {
            total = Number($(element).val());
         });
        return total;
    }

    function getCommonCosts() {
         //function reads values from the "common costs" area of the form
         //returns the total cost calculated based on fields and static values

         //---- FORM VALUES ----
         //average pay rate per user in dollars
        pay_rate = Number($("#pay_rate").val());
        console.log("pay_rate " + pay_rate);

         //total number of travelers
        travelers = Number($("#travelers").val());
        console.log("travelers " + travelers);

         //base food cost per traveler
        food_cost = Number($("#food_cost").val());
        console.log("food_cost " + food_cost);

         //number of audio stream users
        audio_users = Number($("#audio_users").val());
        console.log("audio_users " + audio_users);

         //audio rate in Megabits per second
        audio_rate = Number($("#audio_rate").val());
        console.log("audio_rate " + audio_rate);

         //number of video stream users
        video_users = Number($("#video_users").val());
        console.log("video_users " + video_users);

         //video rate in Megabits per second
        video_rate = Number($("#video_rate").val());
        console.log("video_rate " + video_rate);

         //cell plan data cap
        data_cap = Number($("#data_cap").val());
        console.log("data_cap " + data_cap);

         //cell plan cost per Gigabyte (per month) over data cap
        plan_overage = ($("input[type=radio][name=plan_overage]:checked")).val();
        console.log("plan_overage " + plan_overage);

         //calculate audio users daily data
        audio_user_daily_data = audio_users * mbpsToGBpd(audio_rate);
        console.log("audio_user_daily_data " + audio_user_daily_data);

         //calculate video users daily data
        video_user_daily_data = video_users * mbpsToGBpd(video_rate);
        console.log("video " + video_user_daily_data);

         //add audio and video together for total daily data
        total_daily_data = audio_user_daily_data + video_user_daily_data;
        console.log("total_user_daily_data " + total_user_daily_data);
     }

    function getCarCosts() {
         //function reads values from the "car related costs" area of the form
         //returns the total cost calculated based on fields and static values

         //---- FORM VALUES ----

         //total number of CAR DRIVING miles
        var car_distance = Number($("#car_distance").val());
        console.log("car_distance " + car_distance);

         //maximum number of miles our group will drive per day
        var maximum_daily_miles = Number($("#maximum_daily_car_distance").val());
        console.log("maximum_daily_miles " + maximum_daily_miles);

         //estimated wear and tear cost PER MILE
        var wear_per_mile = Number($("#wear_per_mile").val());
        console.log("wear_per_mile " + wear_per_mile);

         //average MPG rate
        var mpg = Number($("#mpg").val());
        console.log("mpg " + mpg);

         //average cost of gas per gallon
        var ppg = Number($("#ppg").val());
        console.log("ppg " + ppg);

         //estimated cost of hotel per night
        var rent_per_night = Number($("#rent_per_night").val());
        console.log("rent_per_night " + rent_per_night);

         //a "fudge factor" to add-in unaccounted for discounts for driving
        var car_discount = Number($("#car_discount").val());
        console.log("car_discount " + car_discount);

         //average cost PER DAY to park
        var parking_cost_per_day = Number($("#parking_per_day").val());
        console.log("parking_cost_per_day " + parking_cost_per_day);


         //---- CALCULATED VALUES ----

         //calculate total number of gallons of gas used on trip
        var number_of_gallons = car_distance / mpg;
        console.log("number_of_gallons " + number_of_gallons);

         //calculate total cost of gas for trip
        var total_mileage_cost = car_distance * ppg;
        console.log("total_mileage_cost " + total_mileage_cost);

         //calculate food cost rounded up to nearest day
        var number_of_days_by_car = car_distance / maximum_daily_miles;
        console.log("number_of_days_by_car " + number_of_days_by_car);

         //calculate per day food cost
        var per_day_food_cost = food_cost * number_of_days_by_car;
        console.log("per_day_food_cost " + per_day_food_cost);

         //calculate total trip food cost
        var total_car_food_cost = number_of_days_by_car * per_day_food_cost;
        console.log("total_car_food_cost " + total_car_food_cost);

         //calculate total usage for the whole trip
        var total_car_data = total_daily_data * number_of_days_by_car;
        console.log("total_car_data " + total_car_data);

         //Uses Math.ceil() to round up to nearest full Gigabyte
        var adjusted_total_car_data = Math.ceil(total_car_data);
        console.log("adjusted_total_car_data " + adjusted_total_car_data);

         //Uses Conditional operator to multiply the rate * the overage amount or zero if there is no overage
        var total_car_data_cost = (adjusted_total_car_data > 0)
            ? (plan_overage * adjusted_total_car_data)
            : 0;
        console.log("total_car_data_cost " + total_car_data_cost);

         //Round the number of days down to get nights. If it's less than a day, no hotel needed
        var total_rent = Math.floor(number_of_days_by_car);
        console.log("total_rent " + total_rent);

         //Calculate the total car wear and tear for the trip
        var total_car_wear = wear_per_mile * car_distance;
        console.log("total_car_wear " + total_car_wear);

         //Calculate the total cost of parking for the trip
        var total_car_parking_cost = total_rent * parking_cost_per_day;
        console.log("total_car_parking_cost " + total_car_parking_cost);

         //Round the number of days UP, then multiple by 8 to get hours per day
        var car_payrate = Math.ceil(number_of_days_by_car) * 8;
        console.log("car_payrate " + car_payrate);

        var total_car_cost = total_car_food_cost + total_mileage_cost +
                total_car_data_cost + total_rent +
                total_car_parking_cost + total_car_wear -
                car_discount + car_payrate;
        console.log("total_car_cost " + total_car_cost);

        return total_car_cost;
     }

    function getFlightCosts() {
         //function reads values from the "flight related costs" area of the form
         //returns the total cost calculated based on fields and static values

         //---- FORM VALUES ----

        var checked_bags = Number($("#checked_bags").val());
        console.log("checked_bags " + checked_bags);

        var flight_speed = Number($("#flight_speed").val());
        console.log("flight_speed " + flight_speed);

        var airport_hours = Number($("#airport_hours").val());
        console.log("airport_hours " + airport_hours);

        var miles_flying = Number($("#flight_distance").val());
        console.log("flight_distance " + miles_flying);

        var flight_ticket_cost = Number($("#flight_ticket_cost").val());
        console.log("flight_ticket_cost " + flight_ticket_cost);

        var transit_cost = Number($("#transit_cost").val());
        console.log("transit_cost " + transit_cost);

        var flight_discount = Number($("#flight_discount").val());
        console.log("flight_discount " + flight_discount);

        var checked_bags_per_traveler = travelers / checked_bags;
        console.log("checked_bags_per_traveler " + checked_bags_per_traveler);

        var flight_amenities = Number(addCheckboxValues("airport_amenities"));
        console.log("flight_amenities " + flight_amenities);

        var in_flight_amenities = Number(addCheckboxValues("in_flight_amenities"));
        console.log("in_flight_amenities " + in_flight_amenities);

         //---- CALCULATED VALUES ----

         // calculate flight_food_cost as one meal per traveler
        var total_flight_food_cost = food_cost * travelers;
        console.log("total_flight_food_cost " + total_flight_food_cost);

         // calculate total usage at both airports since total_daily_data
         // is DAILY, we need to divide by 24 to get hourly
        var total_flight_data = (total_daily_data * 2) / 24;
        console.log("total_flight_data " + total_flight_data);

         // Uses Math.ceil() to round up to nearest full Gigabyte
        var adjusted_total_flight_data = Math.ceil(total_flight_data);
        console.log("adjusted_total_flight_data " + adjusted_total_flight_data);

         // Uses Conditional operator to multiply the rate * the overage amount
         // or zero if there is no overage
        var total_flight_data_cost = (adjusted_total_flight_data > 0)
            ? (plan_overage * adjusted_total_flight_data)
            : 0;
        console.log("total_flight_data_cost " + total_flight_data_cost);

        var total_traveler_flight_cost = travelers * flight_ticket_cost;
        console.log("total_traveler_flight_cost " + total_traveler_flight_cost);

        var time_of_flight = miles_flying / flight_speed;
        console.log("time_of_flight " + time_of_flight);

        var total_amenities = in_flight_amenities + flight_amenities;
        console.log("total_amenities " + total_amenities);

        var total_payrate_cost = pay_rate * ((time_of_flight * 2) + airport_hours) *
                travelers;
        console.log("total_payrate_cost " + total_payrate_cost);

        var total_flight_checked_bags_cost = checked_bags;
        console.log("total_flight_checked_bags_cost " + total_flight_checked_bags_cost);

        var total_flight_cost = total_traveler_flight_cost + total_amenities +
                total_flight_checked_bags_cost - flight_discount +
                total_flight_food_cost + total_flight_data_cost +
                total_payrate_cost;
        console.log("total_flight_cost " + total_flight_cost);

        return total_flight_cost;
    }

    function showResult(cost1, cost2) {
        if (cost1 < cost2) {
            $("#results").html($("<img>").attr(
                "src",
                "images/car-family.jpg"
            )).slideDown("slow").fadeIn("slow");
            $("#travel_calculator").fadeTo("slow", 0.2);
        } else {
            $("#results").html($("<img>").attr(
                "src",
                "images/balloon-flight-2.jpg"
            )).slideDown("slow").fadeIn("slow");
            $("#travel_calculator").fadeTo("slow", 0.2);
        }
    }

    function checkTravelers() {
         // Get the values of travelers, audio streamers, and video streamers
         // Number of audio streams can't be greater than total travelers
         // Number of video streams can't be greater than total travelers - 1
         // NOTE: someone can watch video with a different audio stream
         //
         // For example, a Lynda.com video + some streaming music

        travelers = Number($("#travelers").val());
        audio_users = Number($("#audio_users").val());
        video_users = Number($("#video_users").val());

         // more people can't stream video than total travelers
         // NOTE: we take care of the fact that drivers can't watch video by
         // subtracting one
        if (video_users > travelers - 1) {
             //reset number of video streams
            $("#video_users").val(travelers - 1);
        }
         // more people can't stream audio than total travelers
        if (audio_users > travelers) {
             //reset number of audio streams
            $("#audio_users").val(travelers);
        }
    }

    function updateResults() {
        getCommonCosts();
        checkTravelers(); //make certain that number of streams is reasonable!
        showResult(getCarCosts(), getFlightCosts()); //finally, show the result!
    }

    $("#results").click(function () {
        $("#results").slideUp("slow").fadeOut("slow");
        $("#travel_calculator").fadeTo("slow", 1);
    });
    var ESCAPE_KEY = 27;
    $(document).keyup(function (evt) {
        if (evt.which === ESCAPE_KEY) {
            $("#results").slideUp("slow").fadeOut("slow");
            $("#travel_calculator").fadeTo("slow", 1);
        }
    });
    $("#travelers").change(function () {
        checkTravelers();
    });
    $("#audio_users").change(function () {
        checkTravelers();
    });
    $("#video_users").change(function () {
        checkTravelers();
    });
    $("#update_button").focus();
    $("#update_button").click(function () {
        updateResults();
    });
});
