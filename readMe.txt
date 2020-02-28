
How To Run
Note : Kindly  put  'npm install ' in server dir

1.From server directory
2. Excute 'Node server.js'
    1. once server started ,
        following thigs happen
            1. Crete Bus table with one Bus record from default_bus.json file
            2. Once bus created 
            3. Creted seats for the bus in  Seats Collection
            4. Setas would be created using default_seats.json
    2. App has fowllowing  Api routes 
            1. http://localhost:1337/bookSeat
                In order to make new booking pass following data 
                Method:POST
                ex format:

                    {
                         "name": "Sudhir",
                          "from": "Bengaulru",
                           "to": "Delhi",
                            "onWardDate": "02/29/2020"
                     },

                     in response out put will be like given below
                       {
                        "booked": true,
                        "message": {
                       "PassangerName": "Sudhir",
                       "Status": "CNF",
                        "BusName": "TNQ005",
                        "SeatNumber": "QT003",
                        "From": "Bengaulru",
                         "to": "Delhi",
                          "BoardingDate": "02/29/2020",
                         "Note": "Kindly Use your Seat Number and Boarding Date , for further information"
                        }
                         },

                    Validation: 
                        1.  onWardDate Date should be  next date from the current date
                        2.  'name' is Alpa chars only



                2.  http://localhost:1337/busSeatDetails 
                    Method:GET
                        1. Details of all Seats for bus 
                            (in this case we only one bus so default that will come)

                            Example Response:
                            {
                            "BusName": "TNQ005",
                            "Seats": [
                                {
                                    "SeatNumber": "QT001",
                                    "id": "5e5816795188921a687b8a04"
                                },
                                {
                                    "SeatNumber": "QT002",
                                    "id": "5e5816795188921a687b8a05"
                                }]


                3. http://localhost:1337/bookedSeatDetails/5e5822c0a1db2d1e3c834fe5
                    METHOD:GET

                    BYpassing bookig id ,
                    will retunrn like below
                            {
                                "PassangerName": "Sudhir",
                                "BookingStatus": "CNF",
                                "BusName": "TNQ005",
                                "Seat": "QT008",
                                "boardingDate": "2/29/2020",
                                "from": "Jaunpur",
                                "to": "Rmkumar"
                            }


                4.   http://localhost:1337/cancelBookedSeat
                    Method:DELETE
                    
                    request body{
                            "bookingId": "5e582245a1db2d1e3c834fdf"
                    }


                        This will softly delete booking 

                        Response : 
                       {
                        "cancled": true,
                        "message": "Hi  your ticket got  canceled"
                        }






Default bus name in db-> TNQ005




3. Config dir 
    1. HOST 
    2.Port
    3. DB name
    4. DB URL 
    etc....




4. All application routes can be  found in routes dir
        index.js

serber would be runnig on port 1337


Thnaks 

