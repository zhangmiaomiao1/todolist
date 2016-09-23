angular.module("myapp",[])
.controller("todo",["$scope","$filter",function($scope,$filter){
    //$scope.data=localstorage.essage?JSON.parse(localstorage.message):[];
    $scope.data=localStorage.messages?JSON.parse(localStorage.messages):[];
    /*当前的子内容*/
    $scope.currentId=$scope.data.length?$scope.data[0].id:null;
//当前内容的id
    $scope.currentCon=$scope.data.length?$scope.data[getIndex($scope.currentId)]:null;
    //开关
    $scope.isshow=true;
    //检测 改变数组
    $scope.search1="";
    $scope.$watch("search1",function(){
        var arr=$filter("filter")($scope.data,$scope.search1)
        $scope.currentCon=$scope.data[getIndex(arr[0].id)]
    })
//当前内容的内容
    /*添加列表*/
    //要考虑到下标的各种情况  比如 1  7 8在最大得上加 1
    $scope.addList=function(){
        $scope.isshow=true;
        var maxid=getMaxId($scope.data);
        var obj= {id:maxid+1,title:"note",son:[]}
        $scope.data.push(obj);
        //console.log($scope.data);
        localStorage.messages=JSON.stringify($scope.data);
        $scope.currentCon=$scope.data.length?$scope.data[getIndex(maxid)]:null;
    }

    /*删除列表 显示上一个*/
    $scope.removeList=function(id){
        angular.forEach($scope.data,function(val,index){
            if(val.id==id){
                if($scope.data.length==1){
                    $scope.currentId= null   ;
                    $scope.currentCon=[];
                    //[$scope.data.length-1]下标
                }else if(id===$scope.data[$scope.data.length-1].id){
                    //如果下标等于上个的下标
                    $scope.currentId= $scope.data[$scope.data.length-2].id
                    $scope.currentCon=$scope.data.length?$scope.data[getIndex($scope.currentId)]:null;
                }
                $scope.data.splice(index,1);
                localStorage.messages= JSON.stringify($scope.data);

            }
        })
    }
    /*更改列表数据*/
    $scope.blur=function(id){
                localStorage.messages=JSON.stringify($scope.data);
    }
    /*列表映射   把左边的映射到右边*/
    $scope.focus=function(id){
        $scope.isshow=true;
        $scope.currentId=id;
        $scope.currentCon=$scope.data.length?$scope.data[getIndex($scope.currentId)]:null;
    }
    /*添加内容*/
    $scope.addCon=function(){
        var id=getMaxId($scope.currentCon.son);
        var obj={id:id+1,title:"new directory"};
        $scope.currentCon.son.push(obj);
        localStorage.messages=JSON.stringify($scope.data);
    }
    /*修改内容*/
    $scope.conBlur=function(){
        localStorage.messages=JSON.stringify($scope.data);
    }
    /*删除内容*/
    $scope.removeCon=function(id){
       for(var i=0;i<$scope.currentCon.son.length;i++){
           if(id==$scope.currentCon.son[i].id){
               $scope.currentCon.son.splice(i,1);
           }
       }
        localStorage.messages=JSON.stringify($scope.data);
    }
    /*存储已经完成*/
    $scope.success=localStorage.success?JSON.parse(localStorage.success):[];
    /*存储已完成的数据*/
      //1 匹配的放入success
    $scope.success1=function(id){
        var  index=getIndex(id,$scope.currentCon.son);
        var obj=$scope.currentCon.son[index];
        obj.id=getMaxId($scope.success)+1;
        $scope.success.push(obj);

        // 2从原数组里删掉
        $scope.currentCon.son.splice(index,1)
        localStorage.success=JSON.stringify($scope.success);
        localStorage.messages=JSON.stringify($scope.data)
    }
    //删除已完成
  $scope.removeDown=function(id){
      for(var i=0;i<$scope.success.length;i++){
          if($scope.success[i].id==id){
              $scope.success.splice(i,1)
          }
      }
      localStorage.success=JSON.stringify($scope.success);
  }

    /*获取最大id*/
    function getMaxId(arr){
      if(arr.length>0) {
          var temp=arr[0].id;
          for (var i = 0; i < arr.length; i++) {
              if (temp < arr[i].id) {
                  temp = arr[i].id
              }
          }
      }else{
          temp=0;
      }
        return parseInt(temp) ;
    }
    /*通过ID获取下标   具有id的元素在数组里是第几个*/
    function getIndex(id,arr){
        var arr=arr||$scope.data;
        for (var i = 0; i < arr.length; i++) {
            if (id== arr[i].id) {
                return i;
            }
        }

    }
}])