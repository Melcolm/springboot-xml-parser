var app = angular.module("app", ['angularUtils.directives.dirPagination', "pathgather.popeye"]);

    app.controller("HttpGetController", function ($scope, $http, Popeye) {
      $scope.sortType  = 'firstName'; 
      $scope.sortReverse  = false; 
      $scope.divTable = false;
      $scope.mediaDiv= false;
      $scope.isDeleted=false;
      $scope.deletedRecords = false;
      $scope.deletedSortType  = 'salary'; 
      $scope.deletedSortReverse  = false; 

      $scope.pieChartDiv = false;

      $scope.modalDiv=false;
      $scope.editDiv= false;
      $scope.welcolmDiv = true;
      $scope.errorDiv = false;
      $scope.index= null;
      $scope.deletedResult = [];      

      $scope.pieChart = function (){

      var pieOrBar = document.getElementById('chartType');
      var chartType = pieOrBar.options[pieOrBar.selectedIndex].value;
      
        if($scope.pieChartDiv){
          $scope.pieChartDiv = false;
          $scope.mediaDiv=true;
          $scope.myChart.destroy();
          document.getElementById("chartButton").innerHTML  = "View Chart";

          

        }else{

        $scope.mediaDiv=false;
        $scope.editDiv= false;
        $scope.deletedRecords = false;
        document.getElementById("chartButton").innerHTML  = "Hide Chart";

        $scope.pieChartDiv = true;
        $scope.salaries = [];

        angular.forEach($scope.result, function (employee) {
          $scope.salaries.push(employee.salary);
         }); 

         var salary25000 = 0;
         var salary50000 = 0;
         var salary75000 = 0;
         var salary100000 = 0;
         var salary125000 = 0;
         var salary150000 = 0;

         angular.forEach($scope.salaries, function (salary) {

           

            if(salary > 0 && salary <= 25000){

              salary25000++

            }if(salary > 25000 && salary <= 50000){

              salary50000++

            }if(salary > 50000 && salary <= 75000){

              salary75000++

            }if(salary > 75000 &&salary <= 100000){

              salary100000++

            }if(salary > 100000 && salary <= 125000){

              salary125000++

            }if(salary > 125000 && salary <= 150000){

              salary150000++

            }

            
          
         });
    
       var ctx = document.getElementById('myChart').getContext('2d');
        $scope.myChart = new Chart(ctx, {
           type: chartType,
           data: {
             labels: ["25,000","50,000", "75,000", "100,000", "125,000","150,000"],
             datasets: [{
               label: 'Salary',
               data:[salary25000, salary50000, salary75000, salary100000, salary125000, salary150000],
               backgroundColor: [
                'rgba(255, 99, 132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255,1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderColor: '#777',
            borderWidth: 1,
            hoverBorderwidth: 3,
            hoverBorderColor: '#000'

             }]
           },
           options: {
             title:{
               display: true,
               text: 'Employee Salary Range',
               fontSize: 25
             },
             legend:{
               display: true,
              position: 'right',
              labels: { 
                fontColor: '#000'
              }
             },
            beginAtZero: true,
            responsive: true

           }
          
       });  
       
      }
      
  };

     


      //edit
        $scope.edit = function (employee) {

          $scope.index = this.result.indexOf(employee);
          $scope.mediaDiv= false;
          $scope.editDiv= true;
          $scope.pieChartDiv = false;
          $scope.deletedRecords=false;

          document.getElementById("employeeId").value = employee.employeeId ;
          document.getElementById("employeeId").readOnly = true;
          document.getElementById("firstName").value = employee.firstName;
          document.getElementById("lastName").value = employee.lastName;
          document.getElementById("email").value = employee.email;
          document.getElementById("salary").value = employee.salary;

          console.log($scope.index);
         };

         $scope.saveEmployee = function (){
          console.log($scope.index);

          this.result[$scope.index]= {employeeId: document.getElementById("employeeId").value, 
                                      firstName: document.getElementById("firstName").value, 
                                      lastName: document.getElementById("lastName").value , 
                                      email: document.getElementById("email").value, 
                                      salary: document.getElementById("salary").value};

          $scope.editDiv= false;
          $scope.mediaDiv= true;
         };

         //view
          $scope.view = function(employee, view) {
            console.log(employee);

            var formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              maximumSignificantDigits: 3
            });
            
            var viewInject = '';

            formatter.format(2500);

            if (view != undefined){
               viewInject = '('+view+')';

            }

            var modal = Popeye.openModal({
            template: '<div class="d-flex justify-content-between">'+
            '<div>'+
               '<h1><i class="glyphicon glyphicon-user"></i> Employee Information ' + viewInject +'</h1>'+
              '</div>'+
              '<div>'+
                '<span><strong>Employee ID: </strong> </span> '+employee.employeeId+'<br>'+
                '<span><strong>Name: </strong></span>'+employee.firstName+' '+ employee.lastName+'<br>'+
                '<span><strong>Email: </strong></span>'+employee.email+'<br>'+
                '<span><strong>Salary: </strong></span>'+formatter.format(employee.salary)+
              '</div>'+
              '<div>'+
               '<button ng-click="$close()" class="btn btn-primary pull-right" >Close</button>'+
            '</div>'+
          '</div>',
            controller: "HttpGetController",
            modalClass: "popeye-modal-custom"
           
            });

           

        };

        $scope.manageDeleteTable = function(){

          if($scope.deletedRecords){
            $scope.deletedRecords=false;
            $scope.mediaDiv=true;
            document.getElementById("employeeButton").innerHTML  = "View Deleted Employees";


          }else{

            $scope.mediaDiv=false;
            $scope.pieChartDiv=false;
            $scope.editDiv=false;
            $scope.deletedRecords=true;
            document.getElementById("employeeButton").innerHTML  = "Hide Deleted Employees";

          }


        

        };

           //delete
           $scope.delete = function(employee) {   

            $scope.index = this.result.indexOf(employee);
            this.result.splice( $scope.index, 1);
            $scope.deletedResult.push(employee); 
            $scope.isDeleted=true;

            angular.forEach($scope.deletedResult, function (employee) {
              employee.salary = parseFloat(employee.salary);
             }); 

           
           };

           //delete
           $scope.retrieve = function(employee) {   

            $scope.index = $scope.deletedResult.indexOf(employee);
            $scope.deletedResult.splice( $scope.index, 1);
            $scope.result.push(employee); 

            if($scope.deletedResult  === undefined || $scope.deletedResult .length == 0){
              $scope.isDeleted=false;
              $scope.deletedRecords = false;
              $scope.pieChartDiv=false;
              $scope.mediaDiv=true;
            }
           

           
           };
  

        $scope.SendData = function () {
           
            var file = document.getElementById('file').files[0];

            if(file==null){

              $scope.divTable = false;
              $scope.welcolmDiv = false;
              $scope.errorMessageEmptyFile ="You Must Select a XML File";
              $scope.errorDiv = true;

            }


            var fd = new FormData();
            fd.append('file', file);

            $http({
                method: 'POST',
                url: 'http://localhost:8080/upload',
                headers: {'Content-Type': undefined},
                transformRequest: angular.identity,
                data: fd
              }).then(
                function (response) {
                  $scope.result = response.data;               
                  $scope.divTable = true; 
                  $scope.mediaDiv= true;
                  $scope.welcolmDiv = false;       
                }, function (error) {
                  $scope.welcolmDiv = false; 
                  $scope.errorMessage = error.data;      
                  $scope.errorDiv = true;                  
                  
                });
                
        };

    });