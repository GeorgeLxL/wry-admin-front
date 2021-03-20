import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBTabPane,
  MDBTabContent,
  MDBNav,
  MDBCard,
  MDBCardBody,
  MDBNavItem,
  MDBNavLink,
  MDBBtn,
  MDBLink,
  MDBModal,
  MDBModalBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody

} from 'mdbreact';
import moment from 'moment';
import SectionContainer from '../../components/sectionContainer';
import DateRangePicker from '../../components/react-bootstrap-datetimerangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import "../../assets/styles/tailwind.css";
import Pagination from '@material-ui/lab/Pagination';
var axios = require('axios');
const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;

class Dashboard extends Component {
    constructor(props) {
        super(props);    
        this.handleEventDashboard = this.handleEventDashboard.bind(this);
        this.handleEventArtist = this.handleEventArtist.bind(this);
        this.handleEventUser = this.handleEventUser.bind(this);
        this.state = {
            startDateDashboard: moment(),
            endDateDashboard: moment(),
            startDateArtist: moment(),
            endDateArtist: moment(),
            startDateUser: moment(),
            endDateUser: moment(),
            ranges: {
              'All': [moment(), moment()],
              'Last 7 Days': [moment().subtract(6, 'days'), moment()],
              'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            },
            activeItem: '1',
            userFillter:{
                Username: "",
                Email: "",
                PageSize: 5,
                PageNumber: 1
            },
            artistFillter:{
                ArtistName: "",
                Email: "",
                PageSize: 5,
                PageNumber: 1
            },
            fillterArtistData: {
                ArtistName: "",
                ArtistEmail: "",
                ArtistId: "",
                StartDate: "",
                EndDate: "",
                PageSize: 10,
                PageNumber: 1
            },
            pageCountArtist:0,
            totalRecordsArtist:0,
            fillterUserData: {
                Username: "",
                Email: "",
                UserId: "",
                StartDate: "",
                EndDate: "",
                PageSize: 10,
                PageNumber: 1
            },
            pageCountUser:0,
            totalRecordsUser:0,
            artistData: {
              columns: [
                {
                  label: <input type='checkbox' checked={false} onChange={this.selectAllArtist}/>,
                  field: 'checkbox'
                },
                {
                  label: 'Regi.Date',
                  field: 'RegiDate',
                },
                {
                  label: <span>Artist ID<br/>Email</span>,
                  field: 'UserIDEmail',
                },
                {
                  label: 'PayPerView Sales',
                  field: 'PayPerViewSales',
               
                },
                {
                  label: 'Live Tickets Sales',
                  field: 'LiveTicketsSales',
        
                },
                {
                  label: 'Subscription Sales',
                  field: 'SubscriptionSales',                  
                },
                {
                  label: 'Total Sales',
                  field: 'TotalSales',                 
                },
                {
                    label: 'Action',
                    field: 'Action',                 
                },
              ],
              rows: []
            },
            userData: {
                columns: [
                  {
                    label: <input type='checkbox' checked={false} onChange={this.selectAllUser}/>,
                    field: 'checkbox'
                  },
                  {
                    label: 'Regi.Date',
                    field: 'RegiDate',
                  },
                  {
                    label: <span>UserID<br/>Email</span>,
                    field: 'UserIDEmail',
                  },
                  {
                    label: 'PayPerView Sales',
                    field: 'PayPerViewSales',
                 
                  },
                  {
                    label: 'Live Tickets Sales',
                    field: 'LiveTicketsSales',
          
                  },
                  {
                    label: 'Subscription Sales',
                    field: 'SubscriptionSales',                  
                  },
                  {
                    label: 'Total Sales',
                    field: 'TotalSales',                 
                  },
                  {
                      label: 'Action',
                      field: 'Action',                 
                  },
                ],
                rows: []
            },
            userlistData:{},
            artistlistData:{},
            alertModal:false,
            alertTitle:"",
            alertContent:"",
            selectAllArtist:false,
            artistids:[],
            selectAllUser:false,
            userids:[],
            userlist:{
                columns: [
                    {
                    label: <span>Name<br/>ID</span>,
                    field: 'UserIDEmail',
                    },
                    {
                    label: 'Regi.Date',
                    field: 'regiDate',
                    
                    },
                    {
                    label: 'Email',
                    field: 'Email',
            
                    },
                    {
                    label: 'Status',
                    field: 'status',                 
                    },
                    {
                        label: 'Action',
                        field: 'Action',                    
                    },
                ],
                rows: []  
            },
            artistlist:{
                columns: [
                    {
                    label: <span>Name<br/>ID</span>,
                    field: 'UserIDEmail',
                    },
                    {
                    label: 'Regi.Date',
                    field: 'regiDate',
                    
                    },
                    {
                    label: 'Email',
                    field: 'Email',
            
                    },
                    {
                    label: 'Status',
                    field: 'status',                 
                    },
                    {
                        label: 'Action',
                        field: 'Action',                    
                    },
                ],
                rows: []  
            },
            pageCountModal:0,
            totalRecordsModal:0,
            searchModal_artist:false,
            searchResultModal_artist:false,
            searchModal_user:false,
            searchResultModal_user:false,
            artistNumber:0,
            PayPerViewContent:0,
            LiveTicketContent:0,
            SubscriptionContent:0,
            usersNumber:0,
            PayPerView:0,
            LiveTicket:0,
            Subscription:0
        };
    }
 

  toggle = tab => e => {
    if (this.state.activeItem !== tab) {
      this.setState({
        activeItem: tab
      });
    }
  };

  togglemodal = modalName => e => {
    this.setState({
        [modalName]: !this.state[modalName]
      });
  };
  switchmodal = e => {
    e.preventDefault();
    this.searchArtist();
    this.setState({
        searchModal_artist: !this.state.searchModal_artist
    });  
    this.setState({
        searchResultModal_artist: !this.state.searchResultModal_artist
    });
  }

  switchmodaluser = e => {
    e.preventDefault();
    this.searchUser();
    this.setState({
        searchModal_user: !this.state.searchModal_user
    });  
    this.setState({
        searchResultModal_user: !this.state.searchResultModal_user
    });
  }
  
  changeArtistFillter  = fillterName=> e=>{
    const {fillterArtistData} = this.state;
    fillterArtistData[fillterName] = e.target.value;
    this.setState({
        fillterArtistData:fillterArtistData
    })
  }

  changeUserFillter  = fillterName=> e=>{
    const {fillterUserData} = this.state;
    fillterUserData[fillterName] = e.target.value;
    this.setState({
        fillterUserData:fillterUserData
    })
  }

  changeUserSearchFillter  = fillterName=> e=>{
    const {userFillter} = this.state;
    userFillter[fillterName] = e.target.value;
    this.setState({
        userFillter:userFillter
    })
  } 

  changeArtistSearchFillter  = fillterName=> e=>{
    const {artistFillter} = this.state;
    artistFillter[fillterName] = e.target.value;
    this.setState({
        artistFillter:artistFillter
    })
  }

  handleEventDashboard(event, picker) {
    this.setState({
      startDateDashboard: picker.startDate,
      endDateDashboard: picker.endDate,
    });
    this.getStatisticsInfo();

  }

 

  handleEventArtist(event, picker) {
    this.setState({
      startDateArtist: picker.startDate,
      endDateArtist: picker.endDate,
    });

    const {fillterArtistData} = this.state;
    let start = picker.startDate.format('MMMM D, YYYY');
    let end = picker.endDate.format('MMMM D, YYYY');
    if(start==end)
    {
        fillterArtistData.start = "";
        fillterArtistData.start = "";

    }
    else
    {
        fillterArtistData.StartDate = picker.startDate.format('YYYY-MM-DD');
        fillterArtistData.EndDate = picker.endDate.format('YYYY-MM-DD');
    }
    this.setState({
        fillterArtistData:fillterArtistData
    });  
    
  }
  handleEventUser(event, picker) {
    this.setState({
      startDateUser: picker.startDate,
      endDateUser: picker.endDate,
    });
    const {fillterUserData} = this.state;
    let start = picker.startDate.format('MMMM D, YYYY');
    let end = picker.endDate.format('MMMM D, YYYY');
    if(start==end)
    {
        fillterUserData.StartDate = "";
        fillterUserData.EndDate = "";

    }
    else
    {
        fillterUserData.StartDate = picker.startDate.format('YYYY-MM-DD');
        fillterUserData.EndDate = picker.endDate.format('YYYY-MM-DD');
    }
    this.setState({
        fillterUserData:fillterUserData
    });  
  }

  searchLiveApplicationData=(event)=>{
    event.preventDefault();
    const {fillterArtistData} = this.state;
    this.getdataArtist(fillterArtistData);
  }

  searchUsertransactionData=(event)=>{
    event.preventDefault();
    const {fillterUserData} = this.state; 
    this.getdataUser(fillterUserData);
  }

  resetfillterArtistData = (event)=>{
    var fillterArtistData= {
        ArtistName: "",
        ArtistEmail: "",
        ArtistId: "",
        StartDate: "",
        EndDate: "",
        PageSize: 10,
        PageNumber: 1
    }
    
    this.setState({
        fillterArtistData:fillterArtistData,
        startDateArtist: moment(),
        endDateArtist: moment()
    });
    this.getdataArtist(fillterArtistData);
  }

  resetfillterusertData = (event)=>{
    var fillterUserData= {
        Username: "",
        Email: "",
        UserId: "",
        StartDate: "",
        EndDate: "",
        PageSize: 10,
        PageNumber: 1
    }
    
    this.setState({
        fillterUserData:fillterUserData,
        startDateUser: moment(),
        endDateUser: moment()
    })

    this.getdataUser(fillterUserData);
  }


  handlePagenationArtist = (events,PageNumber)=>{
    const {fillterArtistData} = this.state; 
    fillterArtistData.PageNumber = PageNumber;
    this.setState({
        selectAllArtist:false,
        fillterArtistData:fillterArtistData
    });
    this.getdataArtist(fillterArtistData);
  }

  handlePagecountArtist = (events)=>{
    const {fillterArtistData} = this.state;
    var prevepageSize = fillterArtistData.PageSize;
    var prevepageNumber = fillterArtistData.PageNumber;
    var currentPagesize = events.target.value;
    
    fillterArtistData.PageSize = currentPagesize;
    events.target.value = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1;
    fillterArtistData.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        fillterArtistData:fillterArtistData,
        selectArtist:false,
    });
    this.getdataArtist(fillterArtistData);
  }

  handlePagenationUser = (events,PageNumber)=>{
    const {fillterUserData} = this.state; 
    fillterUserData.PageNumber = PageNumber;
    this.setState({
        fillterUserData:fillterUserData,
        selectAllUser:false
    });
    this.getdataUser(fillterUserData);
  }

  handlePagecountUser = (events)=>{
   
    const {fillterUserData} = this.state;
    var prevepageSize = fillterUserData.PageSize;

    var prevepageNumber = fillterUserData.PageNumber;
    var currentPagesize = events.target.value;
    
    fillterUserData.PageSize = currentPagesize;
    events.target.value = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1;
    fillterUserData.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        fillterUserData:fillterUserData,
        selectAllUser:false
    });
    this.getdataUser(fillterUserData);
  }



  handlePagenationModal= (events,PageNumber)=>{
    const {artistFillter} = this.state; 
    artistFillter.PageNumber = PageNumber;
    this.setState({
        artistFillter:artistFillter
    });
    this.searchArtist();
  }

  handlePagenationModaluser= (events,PageNumber)=>{
    const {userFillter} = this.state; 
    userFillter.PageNumber = PageNumber;
    this.setState({
        userFillter:userFillter
    });
    this.searchUser();
  }


  componentDidMount(){    
    const {fillterArtistData,fillterUserData} = this.state; 
    this.getdataArtist(fillterArtistData);
    this.getdataUser(fillterUserData);
    this.getStatisticsInfo();
  }

  getStatisticsInfo()
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var startdate = this.state.startDateDashboard;
    var enddate = this.state.endDateDashboard;
    var start = startdate.format('YYYY-MM-DD');
    var end = enddate.format('YYYY-MM-DD');
    
    if(start == end)
    {
        start = "";
        end = "";
    }

    var params = {"startDate":start,"endDate":end}
    const fd = new FormData();
    var config = {
      method: 'get',
      url: `${apiurl}/statistics/dashboard`,
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:params
    };
  
    axios(config)
    .then((response) => {
        console.log(response.data)
        this.setState({
            artistNumber:response.data.artist,
            usersNumber:response.data.user,
            PayPerViewContent:response.data.payPerView,
            PayPerView:response.data.payPerViewSales,
            LiveTicketContent:response.data.liveTicket,
            LiveTicket:response.data.liveTicketSales,
            SubscriptionContent:response.data.subscription,
            Subscription:response.data.subscriptionSales
        })
    })
    .catch((error)=>{console.log(error)})
  }

  getdataArtist(filter){       
  
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
    var config = {
      method: 'get',
      url: `${apiurl}/sales/artists`,
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:filter
    };    
    axios(config)
    .then((response) => {
      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      var responsedata = response.data.sales;
      responsedata.forEach(item => {
          var temp={};
          var {artistids} = this.state;
          var index = artistids.indexOf(item.artist.id);
          if(index==-1)
          {
            temp.checkbox = <input type='checkbox' checked={false} onChange={this.changeartist2Download(item.artist.id)}/>;        
          }
          else
          {
            temp.checkbox = <input type='checkbox' checked={true} onChange={this.changeartist2Download(item.artist.id)}/>;        
          }         
          var dateandtime = item.artist.registeredDate.split(" ");
          temp.RegiDate =<span>{dateandtime[0]}<br/>{dateandtime[1]}</span>;
          temp.UserIDEmail = <span>{item.artist.id}<br/>{item.artist.email}</span>;
          temp.PayPerViewSales = item.details.payPerView.amount;
          temp.LiveTicketsSales = item.details.liveTicket.amount;
          temp.SubscriptionSales = item.details.subscription.amount;
          temp.TotalSales = item.details.totalAmount;
          temp.action = <MDBLink className="showdetail" to={"/admin/dashboard/artistDetail/" + item.artist.id}>Show details</MDBLink> 
          data.push(temp);   
      });
      var artistData = this.state.artistData;
      var columns = artistData.columns;
      var temp = columns[0];
      temp.label = <input type='checkbox' id='all' checked={false} onChange={this.selectAllArtist}/>
      columns[0] = temp;
      artistData.columns = columns
      artistData.rows = data;

      this.setState({
        pageCountArtist: pageCount,
        totalRecordsArtist:totalRecords,
        artistData:artistData
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var artistData = this.state.artistData;
                artistData.rows = {}; 
                this.setState({
                    pageCountArtist: 0,
                    totalRecordsArtist:0,
                    artistData:artistData
                });
            }
        }
    });
  }

  getdataUser(filter){       
  
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
    var config = {
      method: 'get',
      url: `${apiurl}/purchases/users`,
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:filter
    };    
    axios(config)
    .then((response) => {
     
      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      var responsedata = response.data.purchases;
      responsedata.forEach(item => {
          var temp={};
          var {userids} = this.state;
          var index = userids.indexOf(item.user.id);
          if(index==-1)
          {
            temp.checkbox = <input type='checkbox' checked={false} onChange={this.changeuser2Download(item.user.id)}/>;
          }
          else
          {
            temp.checkbox = <input type='checkbox' checked={true} onChange={this.changeuser2Download(item.user.id)}/>;
          }
         
          var dateandtime = item.user.registeredDate.split(" ");
          temp.RegiDate =<span>{dateandtime[0]}<br/>{dateandtime[1]}</span>;
          temp.UserIDEmail = <span>{item.user.id}<br/>{item.user.email}</span>;
          temp.PayPerViewSales = item.details.payPerView.amount;
          temp.LiveTicketsSales = item.details.liveTicket.amount;
          temp.SubscriptionSales = item.details.subscription.amount;
          temp.TotalSales = item.details.totalAmount;
          temp.action = <MDBLink className="showdetail" to={"/admin/dashboard/userDetail/" + item.user.id}>Show details</MDBLink> 
          data.push(temp);   
      });
      var userData = this.state.userData;
      userData.rows = data; 
      var userData = this.state.userData;
      var columns = userData.columns;
      var temp = columns[0];
      temp.label = <input type='checkbox' id='all' checked={false} onChange={this.selectAllUser}/>
      columns[0] = temp;
      userData.columns = columns
      userData.rows = data;
      this.setState({
        pageCountUser: pageCount,
        totalRecordsUser:totalRecords,
        userData:userData
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var userData = this.state.userData;
                userData.rows = {}; 
                this.setState({
                    pageCountUser: 0,
                    totalRecordsUser:0,
                    userData:userData
                });
            }
        }
    });
  }


 selectArtist=id=>e=>{
    const{fillterArtistData,artistlistData}=this.state
    fillterArtistData.ArtistName = artistlistData[id].artistName;
    fillterArtistData.ArtistEmail = artistlistData[id].email;
    fillterArtistData.ArtistId = artistlistData[id].id;
    this.setState({
        fillterArtistData:fillterArtistData,
        searchResultModal_artist: !this.state.searchResultModal_artist
    });
 }

 selectUser=id=>e=>{
    const{fillterUserData,userlistData}=this.state
    fillterUserData.Username = userlistData[id].username;
    fillterUserData.Email = userlistData[id].email;
    fillterUserData.UserId = userlistData[id].id;
    this.setState({
        fillterUserData:fillterUserData,
        searchResultModal_user: !this.state.searchResultModal_user
    });
  }

 searchArtist(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
    var {artistFillter} = this.state;
    var config = {
      method: 'get',
      url: `${apiurl}/search/artists`,
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:artistFillter
    };    
    axios(config)
    .then((response) => {

      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      var responsedata = response.data.artists;
      var index = 0;
      responsedata.forEach(item => {
          var temp={};
          temp.UserIDEmail = <span>{item.artistName}<br/>{item.id}</span>;
          
          temp.RegiDate = item.registeredDate; 
          temp.Email = item.email;
          
          temp.Status = item.status;   

          temp.action =  <MDBBtn className="btn btnselectuser" onClick={this.selectArtist(index)} color='primary'>select</MDBBtn>
          data.push(temp); 
          index++;          
      });
      var artistlist = this.state.artistlist;
      artistlist.rows = data;
    
      
      this.setState({
        artistlistData:responsedata,
        pageCountModal: pageCount,
        totalRecordsModal:totalRecords,
        artistlist:artistlist
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var artistlist = this.state.artistlist;
                artistlist.rows = {}; 
                this.setState({
                    pageCountModal: 0,
                    totalRecordsModal:0,
                    artistlist:artistlist
                });
            }
        }
    });
 }

 searchUser(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
    var {userFillter} = this.state;
    var config = {
        method: 'get',
        url: `${apiurl}/search/users`,
        headers: { 
        'Authorization': 'Bearer ' + token,
    },
        data : {},
        params:userFillter
    };    
    axios(config)
    .then((response) => {
       
        pageCount = response.data.pageCount;
        totalRecords = response.data.totalRecords;
        var responsedata = response.data.users;
        
        var index = 0;
        responsedata.forEach(item => {
            var temp={};
            temp.UserIDEmail = <span>{item.username}<br/>{item.id}</span>;
            temp.RegiDate = item.registeredDate; 
            temp.Email = item.email;
            temp.Status = item.status;      
            temp.action =  <MDBBtn className="btn btnselectuser" onClick={this.selectUser(index)} color='primary'>select</MDBBtn> 
            data.push(temp); 
            
            index++;
        });
        var userlist = this.state.userlist;
        userlist.rows = data; 
       
        this.setState({
            userlistData:responsedata,
            pageCountModal: pageCount,
            totalRecordsModal:totalRecords,
            userlist:userlist
        });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var userlist = this.state.userlist;
                userlist.rows = {}; 
                this.setState({
                    pageCountModal: 0,
                    totalRecordsModal:0,
                    userlist:userlist
                });
            }
        }
    });
 }

 selectAllArtist  = event=>{
    const {artistData, selectAllArtist } = this.state;
    var columns = artistData.columns;
    var data = artistData.rows;
    var temp = columns[0];
    temp.label = <input type='checkbox' id='all' checked={!selectAllArtist} onChange={this.selectAllArtist}/>
    columns[0] = temp;
      
    for(var i=0;i<data.length; i++)
    {
      data[i].checkbox= <input type='checkbox' checked={!selectAllArtist} onChange={this.changeartist2Download(data[i].UserIDEmail.props.children[0])}/>;
    }
    artistData.columns = columns;
    artistData.rows = data;
    this.setState({
      artistData:artistData,
      selectAllArtist:!this.state.selectAllArtist,
      artistids:[],
    })
}

changeartist2Download = id => event =>{
    const {artistData, selectAllArtist, artistids} = this.state;
 
    var data = artistData.rows;
    if(selectAllArtist) return;
    for(var i=0;i<data.length; i++)
    {
        if(data[i].UserIDEmail.props.children[0] == id){
            
            var index = artistids.indexOf(id);
            if(index==-1)
            {
                artistids.push(id);
                data[i].checkbox= <input type='checkbox' checked={selectAllArtist|true} onChange={this.changeartist2Download(data[i].UserIDEmail.props.children[0])}/>;
            }
            else
            {
                artistids.splice(index,1);
                data[i].checkbox= <input type='checkbox' checked={selectAllArtist|false} onChange={this.changeartist2Download(data[i].UserIDEmail.props.children[0])}/>;
            }   
        }
    }
    artistData.rows = data;
     this.setState({
        artistData:artistData,
        artistids:artistids
     })

}

downloadArtistCSV = e=>{
    const {selectAllArtist,fillterArtistData,artistids}=this.state;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    const {ArtistName,ArtistEmail,ArtistId,StartDate,EndDate,PageSize,PageNumber} = fillterArtistData;

    var data;       
    var config;
    var data;
     if(selectAllArtist || artistids.length==0)
     {
        data = JSON.stringify({"ArtistName":ArtistName,"ArtistEmail":ArtistEmail,"ArtistId":ArtistId,"StartDate":StartDate, "EndDate":EndDate}); 
        var config = {
            method: 'post',
            url: `${apiurl}/sales/artists/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : data
          };
      }
      else
      {
         var Artists=[];
         artistids.forEach(item=>{
             var temp={};
             temp.Id = item;
             Artists.push(temp);
         })
         data = JSON.stringify({"ArtistName":ArtistName,"ArtistEmail":ArtistEmail,"ArtistId":ArtistId,"StartDate":StartDate, "EndDate":EndDate, "Artists":Artists}); 
         config = {
            method: 'post',           
            url: `${apiurl}/sales/artists/csv_download_selected`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : data
          };
     }
     axios(config)
      .then((response)=>{
        this.setState({
            alertModal:true,
            alertTitle: "CSV DOWNLOAD REQUEST",
            alertContent:"Email which contains the CSV file will be sent to your inbox once ready."
        });      
      }).catch((error)=>{
        this.setState({
            alertModal:true,
            alertTitle: "CSV DOWNLOAD REQUEST",
            alertContent:"Failed"
        });
      })
}


downloadUserCSV = e=>{
    const {selectAllUser,fillterUserData,userids}=this.state;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    const {Username, Email, UserId, StartDate, EndDate, PageSize, PageNumber} = fillterUserData;

    var data;       
    var config;
    var data;
     if(selectAllUser || userids.length==0)
     {
        data = JSON.stringify({"Username":Username,"Email":Email,"UserId":UserId,"StartDate":StartDate, "EndDate":EndDate}); 
        var config = {
            method: 'post',
            url: `${apiurl}/purchases/users/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : data
          };
      }
      else
      {
         var Users=[];
         userids.forEach(item=>{
             var temp={};
             temp.Id = item;
             Users.push(temp);
         })
         data = JSON.stringify({"Username":Username,"Email":Email,"UserId":UserId,"StartDate":StartDate, "EndDate":EndDate, "Users":Users}); 
         config = {
            method: 'post',           
            url: `${apiurl}/purchases/users/csv_download_selected`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : data
          };
     }
     axios(config)
      .then((response)=>{
        this.setState({
            alertModal:true,
            alertTitle: "CSV DOWNLOAD REQUEST",
            alertContent:"Email which contains the CSV file will be sent to your inbox once ready."
        });      
      }).catch((error)=>{
        this.setState({
            alertModal:true,
            alertTitle: "CSV DOWNLOAD REQUEST",
            alertContent:"Failed"
        });
      })
}



selectAllUser  = event=>{
    const {userData, selectAllUser } = this.state;
    var columns = userData.columns;
    var data = userData.rows;
    var temp = columns[0];
    temp.label = <input type='checkbox' id='all' checked={!selectAllUser} onChange={this.selectAllUser}/>
    columns[0] = temp;
      
    for(var i=0;i<data.length; i++)
    {
      data[i].checkbox= <input type='checkbox' checked={!selectAllUser} onChange={this.changeuser2Download(data[i].UserIDEmail.props.children[0])}/>;
    }
    userData.columns = columns;
    userData.rows = data;
    this.setState({
        userData:userData,
        selectAllUser:!this.state.selectAllUser,
        userids:[]
    })
}

changeuser2Download = id => event =>{
    const {userData, selectAllUser, userids} = this.state;
    var data = userData.rows;
    if(selectAllUser) return;
    for(var i=0;i<data.length; i++)
    {
        if(data[i].UserIDEmail.props.children[0] == id){
            
            var index = userids.indexOf(id);
            if(index==-1)
            {
                userids.push(id);
                data[i].checkbox= <input type='checkbox' checked={selectAllUser|true} onChange={this.changeuser2Download(data[i].UserIDEmail.props.children[0])}/>;
            }
            else
            {
                userids.splice(index,1);
                data[i].checkbox= <input type='checkbox' checked={selectAllUser|false} onChange={this.changeuser2Download(data[i].UserIDEmail.props.children[0])}/>;
            }   
        }
    }
    userData.rows = data;
     this.setState({
        userData:userData,
        userids:userids
     })
   
}

  render() {
    const { activeItem, artistData, userData, searchModal_artist, searchResultModal_artist, searchModal_user, searchResultModal_user, alertModal, alertTitle, alertContent, pageCountArtist, pageCountUser, pageCountModal} = this.state;
    let pageSizeArtist = this.state.fillterArtistData.PageSize;
    let pageNumber1 = this.state.fillterArtistData.PageNumber;
    let pageNumber2 = this.state.fillterUserData.PageNumber;
    let ArtistName = this.state.fillterArtistData.ArtistName;
    let ArtistEmail = this.state.fillterArtistData.ArtistEmail;
    let ArtistID = this.state.fillterArtistData.ArtistId;
    let UserName = this.state.fillterUserData.Username;
    let UserEmail = this.state.fillterUserData.Email;
    let UserId = this.state.fillterUserData.UserId;
    let Username_Search = this.state.userFillter.Username;
    let UserEmail_Search = this.state.userFillter.Email;
    let Artistname_Search = this.state.artistFillter.Username;
    let ArtistEmail_Search = this.state.artistFillter.Email;
    let pageSizeUser = this.state.fillterUserData.PageSize;
    let userlistRows = this.state.userlist.rows;
    let userlistColumes = this.state.userlist.columns;
    let artistlistRows = this.state.artistlist.rows;
    let artistlistColumes = this.state.artistlist.columns;
    let start = this.state.startDateDashboard.format('MMMM D, YYYY');
    let end = this.state.endDateDashboard.format('MMMM D, YYYY');
    let labelDashboard = start + ' - ' + end;
  
    if (start == end) {
        labelDashboard = "All:"  + "~" + end;
    }

    start = this.state.startDateArtist.format('MMMM D, YYYY');
    end = this.state.endDateArtist.format('MMMM D, YYYY');
    let labelArtist = start + ' - ' + end;
    if (start == end) {
        labelArtist = "All:" + "~" + end;
    }

    start = this.state.startDateUser.format('MMMM D, YYYY');
    end = this.state.endDateUser.format('MMMM D, YYYY');
    let labelUser = start + ' - ' + end;
    if (start == end) {
        labelUser = "All:"  + "~" + end;
    }

    let buttonStyle = { width: '100%' };
    return (
        <MDBContainer className='mt-3 maincontainer'>
         <MDBRow className='py-3'>
            <MDBCol md='12'>
                <SectionContainer noBorder>
                    <MDBCard>
                        <MDBCardBody>
                            <MDBCol sm="12" className="cardheader">
                                <MDBCol sm="6"  >
                                    <h4>Dashboard</h4>
                                </MDBCol> 
                                <MDBCol sm="2"  ></MDBCol> 
                                <MDBCol sm="4" >
                                    <DateRangePicker
                                        startDate={this.state.startDateDashboard}
                                        endDate={this.state.endDateDashboard}
                                        ranges={this.state.ranges}
                                        onEvent={this.handleEventDashboard}                      
                                    >
                                    <div className="datepicker bg-gray-defalt">
                                        <i className="fa fa-calendar"/> &nbsp;
                                        <span>{labelDashboard}</span>
                                        <i className="fa fa-angle-down"/>
                                    </div>
                                    </DateRangePicker>
                                </MDBCol> 
                            </MDBCol>
                            <MDBRow>
                                <MDBCol sm="3" className="dashboard_cell">
                                    <span><h4 className="text-5xl">{this.state.artistNumber}</h4></span>
                                    <span className="text-2xl">Artist</span>
                                    <h4 className="text-5xl">{this.state.usersNumber}</h4>
                                    <span className="text-2xl">Users</span>
                                </MDBCol>
                                <MDBCol sm="3" className="dashboard_cell">
                                    <span><h4 className="text-5xl">{this.state.PayPerViewContent}</h4></span>
                                    <span className="text-2xl">PayPerView Content</span>
                                    <span><h4 className="text-5xl">{this.state.PayPerView}</h4></span>
                                    <span className="text-2xl">PayPerView(USD)</span>
                                </MDBCol>
                                <MDBCol sm="3" className="dashboard_cell">
                                    <span><h4 className="text-5xl">{this.state.LiveTicketContent}</h4></span>
                                    <span className="text-2xl">LiveTicket Content</span>
                                    <span><h4 className="text-5xl">{this.state.LiveTicket}</h4></span>
                                    <span className="text-2xl">LiveTicket(USD)</span>
                                </MDBCol>
                                <MDBCol sm="3">
                                    <span><h4 className="text-5xl">{this.state.SubscriptionContent}</h4></span>
                                    <span className="text-2xl">Subscription</span>
                                    <span><h4 className="text-5xl">{this.state.Subscription}</h4></span>
                                    <span className="text-2xl">Subscription(USD)</span>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                        
                    </MDBCard>
            
                </SectionContainer>
            </MDBCol>
    </MDBRow> 

            <SectionContainer noBorder>
                <MDBCard>
                    <MDBCardBody>
                        <MDBNav className='nav-tabs'>
                        <MDBNavItem>
                            <MDBNavLink
                            link
                            to='#'
                            active={activeItem === '1'}
                            onClick={this.toggle('1')}
                            role='tab'
                            >
                            <label className="text-semil3xl p-0 mb-0">Artist</label>
                            </MDBNavLink>
                        </MDBNavItem>
                        <MDBNavItem>
                            <MDBNavLink
                            link
                            to='#'
                            active={activeItem === '2'}
                            onClick={this.toggle('2')}
                            role='tab'
                            >
                            <label className="text-semil3xl p-0 mb-0">User</label>
                            </MDBNavLink>
                        </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={activeItem}>
                        <MDBTabPane tabId='1' role='tabpanel'>
                        <MDBCol sm="12" className="cardheader">
                            <MDBCol sm="8" >
                                <h4>Sales Per Artist List</h4>
                            </MDBCol> 
                            <MDBCol sm="4">
                                <MDBBtn className="btn downloadbtn" color='primary' onClick={this.downloadArtistCSV}>CSV Download</MDBBtn>
                            </MDBCol> 
                        </MDBCol>
                        <form onSubmit={this.searchLiveApplicationData}>
                        <MDBRow className="search">
                            <MDBCol sm="6" >
                                <h5>Search</h5>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistName' className='col-3 col-form-label'>
                                        Artist Name
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='ArtistName' value={ArtistName} onChange={this.changeArtistFillter("ArtistName")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistEmail' className='col-3 col-form-label'>
                                        Artist Email
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='ArtistEmail' value={ArtistEmail} onChange={this.changeArtistFillter("ArtistEmail")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistID' className='col-3 col-form-label'>
                                        Artist ID
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='ArtistID' value={ArtistID} onChange={this.changeArtistFillter("ArtistId")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a onClick={this.togglemodal("searchModal_artist")}>Search Artist ID</a>
                                </div>                    
                            </MDBCol>
                            <MDBCol sm="6">
                                <h5>Filter</h5>
                                <div className='form-group row align-items-center' style={{marginBottom:'0px'}}>
                                    <label htmlFor='fillter' className='col-5 col-form-label'>
                                        Registration Date Range
                                    </label>
                                    <div className='col-7' style={{scrollPaddingBottom:'0px'}}>
                                        <DateRangePicker
                                            startDate={this.state.startDateArtist}
                                            endDate={this.state.endDateArtist}
                                            ranges={this.state.ranges}
                                            onEvent={this.handleEventArtist}
                                        >
                                            <div className="datepicker" style={{background:"white"}}>
                                                <i className="fa fa-calendar"/> &nbsp;
                                                <span>{labelArtist}</span>
                                                <i className="fa fa-angle-down"/>
                                            </div>
                                        </DateRangePicker>
                                    </div>
                                </div>
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a>+ Add more Filter</a>
                                </div>   
                            </MDBCol>
                            <MDBCol sm="12" style={{textAlign:'right'}}>
                                <MDBBtn color='elegant' className="btn btnsearch" type="submit">Search</MDBBtn>
                                <MDBBtn outline className="btn btnreset" onClick={this.resetfillterArtistData}>Reset</MDBBtn>                        
                            </MDBCol>
                        </MDBRow>
                        </form>
                        <MDBCol sm="12">
                        <label className="totalrecord">Result: {this.state.totalRecordsArtist} Records</label>
                            <MDBTable className="artist-records" responsive striped>
                                <MDBTableHead columns={artistData.columns} />
                                {artistData.rows.length?<MDBTableBody rows={artistData.rows} />:<MDBTableBody />}
                                {artistData.rows.length?"":<caption className="noresult">No result found</caption>}
                            </MDBTable>
                        </MDBCol>
                        <MDBCol className="pagination">
                            <Pagination className="paginationitem" page={pageNumber1} count={pageCountArtist} onChange={this.handlePagenationArtist} variant="outlined" color="primary" />
                            <MDBCol className="pageCountarea">
                                <label>Show:
                                    <select className="pageCount" value={pageSizeArtist} onChange={this.handlePagecountArtist}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                </label>
                            </MDBCol>
                        </MDBCol>
                    

                    </MDBTabPane>

                    <MDBTabPane tabId='2' role='tabpanel'>
                        <MDBCol sm="12" className="cardheader">
                            <MDBCol sm="8" >
                                <h4>Purchase Per User List</h4>
                            </MDBCol> 
                            <MDBCol sm="4">
                                <MDBBtn className="btn downloadbtn" color='primary' onClick={this.downloadUserCSV}>CSV Download</MDBBtn>
                            </MDBCol> 
                        </MDBCol>
                        <form onSubmit={this.searchUsertransactionData}>
                        <MDBRow className="search">
                            <MDBCol sm="6" >
                                <h5>Search</h5>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistName' className='col-3 col-form-label'>
                                        User Name
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='UserName' value={UserName} onChange={this.changeUserFillter("Username")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='UserEmail' className='col-3 col-form-label'>
                                        User Email
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='UserEmail' value={UserEmail} onChange={this.changeUserFillter("Email")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistID' className='col-3 col-form-label'>
                                        User ID
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='UserID' value={UserId} onChange={this.changeUserFillter("UserId")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div style={{textAlign:'right'}}>
                                    <a onClick={this.togglemodal("searchModal_user")}>Search User ID</a>
                                </div>               
                            </MDBCol>
                            <MDBCol sm="6">
                                <h5>Filter</h5>
                                <div className='form-group row align-items-center' style={{marginBottom:'0px'}}>
                                    <label htmlFor='fillter' className='col-5 col-form-label'>
                                        Registration Date Range
                                    </label>
                                    <div className='col-7' style={{scrollPaddingBottom:'0px'}}>
                                    <DateRangePicker
                                        startDate={this.state.startDateUser}
                                        endDate={this.state.endDateUser}
                                        ranges={this.state.ranges}
                                        onEvent={this.handleEventUser}
                                    >
                                        <div className="datepicker" style={{background:"white"}}>
                                            <i className="fa fa-calendar"/> &nbsp;
                                            <span>{labelUser}</span>
                                            <i className="fa fa-angle-down"/>
                                        </div>
                                    </DateRangePicker>
                                    </div>
                                </div>
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a>+ Add more Filter</a>
                                </div>   
                            </MDBCol>
                            <MDBCol sm="12" style={{textAlign:'right'}}>
                                <MDBBtn type ="submit" color='elegant' className="btn btnsearch">Search</MDBBtn>
                                <MDBBtn outline className="btn btnreset" onClick={this.resetfillterusertData}>Reset</MDBBtn>                        
                            </MDBCol>
                        </MDBRow>
                        </form>
                        <MDBCol sm="12">
                        <label className="totalrecord">Result: {this.state.totalRecordsUser} Records</label>
                            <MDBTable className="artist-records" responsive striped>
                                <MDBTableHead columns={userData.columns} />
                                {userData.rows.length?<MDBTableBody rows={userData.rows} />:<MDBTableBody />}
                                {userData.rows.length?"":<caption className="noresult">No result found</caption>}
                            </MDBTable>
                        </MDBCol> 
                        <MDBCol className="pagination">
                            <Pagination className="paginationitem" page={pageNumber2} count={pageCountUser} onChange={this.handlePagenationUser} variant="outlined" color="primary" />
                            <MDBCol className="pageCountarea">
                                <label>Show:
                                    <select className="pageCount" value={pageSizeUser} onChange={this.handlePagecountUser}>
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </select>
                                </label>
                            </MDBCol>
                        </MDBCol>             

                    </MDBTabPane>
                    </MDBTabContent>
                    </MDBCardBody>
                </MDBCard> 
            </SectionContainer>
            
            <MDBModal  isOpen={searchModal_artist} toggle={this.togglemodal("searchModal_artist")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow className="my-2">
                        <h4 className="modal-title font-semibold text-3xl">Search Artist ID</h4>
                    </MDBRow>
                    <form onSubmit={this.switchmodal}>
                    <MDBRow className="my-2">
                        <label htmlFor='ArtistName' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                            Artist Name
                        </label>
                        <div className='col-8'>
                            <input type='text' className='form-control' id='ArtistName' value={Artistname_Search} onChange={this.changeArtistSearchFillter("ArtistName")} placeholder='｜ Type here...' />
                        </div>
                    </MDBRow>
                    <MDBRow className="my-2">
                        <h5  className='col-4 col-form-label pl-10 text-lg font-semibold text-right'>OR</h5>
                    </MDBRow>
                    <MDBRow className="my-2">
                        <label htmlFor='ArtistEmail' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                            Artist Email
                        </label>
                        <div className='col-8'>
                            <input type='text' className='form-control' id='ArtistEmail' value={ArtistEmail_Search} onChange={this.changeArtistSearchFillter("Email")} placeholder='｜ Type here...' />
                        </div>
                    </MDBRow>
                    <MDBRow className="mt-4 mb-4">
                    <MDBCol className="col-5"></MDBCol>
                    <MDBCol className="col-6 text-right">
                        <MDBBtn outline className="btn btnreset mr-4" onClick={this.togglemodal("searchModal_artist")}>Close</MDBBtn> 
                        <MDBBtn type="submit" color='elegant' className="btn btnsearch ml-4">Search</MDBBtn>
                    </MDBCol>
                    </MDBRow>
                    </form>
                </MDBModalBody>       
            </MDBModal>

            <MDBModal  isOpen={searchResultModal_artist} toggle={this.togglemodal("searchResultModal_artist")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow>
                        <label className="text-xl">Search Result {}</label>
                    </MDBRow>                    
                        <MDBCol>
                            <MDBTable className="artist-records" responsive striped>
                                <MDBTableHead columns={artistlistColumes} />
                                {artistlistRows.length?<MDBTableBody rows={artistlistRows} />:<MDBTableBody />}
                                {artistlistRows.length?"":<caption className="noresult">No result found</caption>}
                            </MDBTable>
                        </MDBCol>
                        <MDBCol className="pagination">
                            <Pagination className="paginationitem" count={pageCountModal} onChange={this.handlePagenationModal} variant="outlined" color="primary" />
                        </MDBCol>                     
                    <MDBRow className="mt-4 mb-4">
                  
                    <MDBCol className="col-12 text-center">
                        <MDBBtn outline className="btn btnreset" onClick={this.togglemodal("searchResultModal_artist")}>Close</MDBBtn> 
                    </MDBCol>
                    </MDBRow>
                </MDBModalBody>       
            </MDBModal>

            <MDBModal  isOpen={searchModal_user} toggle={this.togglemodal("searchModal_user")}>
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <form onSubmit={this.switchmodaluser}>
                    <MDBRow>
                        <h4 className="modal-title font-semibold text-3xl">Search User ID</h4>
                    </MDBRow>
                    <MDBRow>
                        <label htmlFor='UserName' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                            User Name
                        </label>
                        <div className='col-8'>
                            <input type='text' className='form-control' id='UserName' value={Username_Search} onChange={this.changeUserSearchFillter("Username")} placeholder='｜ Type here...' />
                        </div>
                    </MDBRow>
                    <MDBRow>
                        <h5  className='col-4 col-form-label pl-10 text-lg font-semibold text-right'>OR</h5>
                    </MDBRow>
                    <MDBRow>
                        <label htmlFor='UserEmail' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                            User Email
                        </label>
                        <div className='col-8'>
                            <input type='text' className='form-control' id='UserEmail' value={UserEmail_Search} onChange={this.changeUserSearchFillter("Email")} placeholder='｜ Type here...' />
                        </div>
                    </MDBRow>
                    <MDBRow className="mt-4 mb-4">
                    <MDBCol className="col-5"></MDBCol>
                    <MDBCol className="col-6 text-right">
                        <MDBBtn outline className="btn btnreset mr-4" onClick={this.togglemodal("searchModal_user")}>Close</MDBBtn>                    
                        <MDBBtn color='elegant' className="btn btnsearch ml-4" type="submit">Search</MDBBtn>
                    </MDBCol>
                    </MDBRow>
                    </form>
                </MDBModalBody>       
            </MDBModal>

            <MDBModal  isOpen={searchResultModal_user} toggle={this.togglemodal("searchResultModal_user")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow>
                        <label className="text-xl">Search Result</label>
                    </MDBRow>
                        <MDBCol>
                            <MDBTable className="artist-records" responsive striped>
                                <MDBTableHead columns={userlistColumes} />
                                {userlistRows.length?<MDBTableBody rows={userlistRows} />:<MDBTableBody />}
                                {userlistRows.length?"":<caption className="noresult">No result found</caption>}
                                
                            </MDBTable>
                        </MDBCol>
                        <MDBCol className="pagination">
                            <Pagination className="paginationitem" count={pageCountModal} onChange={this.handlePagenationModaluser} variant="outlined" color="primary" />
                        </MDBCol>                   
                    <MDBRow className="mt-4 mb-4">                  
                    <MDBCol className="col-12 text-center">
                        <MDBBtn outline className="btn btnreset" onClick={this.togglemodal("searchResultModal_user")}>Close</MDBBtn> 
                    </MDBCol>
                    </MDBRow>
                </MDBModalBody>       
            </MDBModal>  
            <MDBModal className="requestModal"  isOpen={alertModal} toggle={this.togglemodal("alertModal")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow className="my-6">
                        <h4 className="modal-title font-semibold text-3xl">{alertTitle}</h4>
                    </MDBRow>
                    <MDBRow className="my-6">
                        <label className="modal-title font-semibold text-2xl text-center">{alertContent}</label>
                    </MDBRow>
                      
                    <MDBRow className="mt-4 mb-4">                  
                      <MDBCol className="col-12 text-center">
                          <MDBBtn color='elegant' className="btn btnrequest" onClick={this.togglemodal("alertModal")}>CLOSE</MDBBtn> 
                      </MDBCol>
                    </MDBRow>
                </MDBModalBody>       
            </MDBModal>
        </MDBContainer>
   
   );
  }
}

export default Dashboard;
