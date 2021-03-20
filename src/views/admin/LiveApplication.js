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
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

import Pagination from '@material-ui/lab/Pagination';

var axios = require('axios');  
const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;
class LiveApplication extends Component {    
    constructor(props) {
        super(props);    
        this.handleEvent = this.handleEvent.bind(this);
        this.state = {
            weekendsVisible: true,
            currentEvents: [],
            startDate: moment(),
            endDate: moment(),
            ranges: {
              'All': [moment(), moment()],
              'Last 7 Days': [moment().subtract(6, 'days'), moment()],
              'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            },
            userFillter:{
                ArtistName: "",
                Email: "",
                PageSize: 5,
                PageNumber: 1
            },
            pageCountModal:0,
            totalRecordsModal:0,
            activeItem: '1',
            searchModal_user:false,
            searchResultModal_user:false,
            events:{},
            viewEvents:{},
            viewStatus:"",
            filter: {
                Username: "",
                Email: "",
                UserId: "",
                StartDate: "",
                EndDate: "",
                PageSize: 10,
                PageNumber: 1
            },
            pageCount:0,
            totalRecords:0,
            userlistData:{},
            selectAll:false,
            itemids:[],
            alertModal:false,
            alertContent:"",
            alertTitle:"",
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
            columns:
            [
                {
                  label: <input type='checkbox' checked={false} onChange={this.selectAllitems}/>,
                  field: 'checkbox'
                },
                {
                  label: 'Appl.Date',
                  field: 'applicationDate'
                },
                {
                  label: 'Appl.ID',
                  field: 'id'
                },
                {
                  label: <span>Artist ID<br/>Email</span>,
                  field: 'ArtistIDEmail'
                },
                {
                  label: 'Appl.Status',
                  field: 'applicationStatus'
                },
                {
                  label: 'Live Ticket',
                  field: 'liveTicket'
                },
                {
                  label: <span>Live Ticket<br/>Amount</span>,
                  field: 'liveTicketAmount'
                },
                {
                   label : "Action",
                   field : "action",
                }
            ],
            data:{}
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

  selectUser=id=>e=>{
    const{filter,userlistData}=this.state
    filter.Username = userlistData[id].artistName;
    filter.Email = userlistData[id].email;
    filter.UserId = userlistData[id].id;
    this.setState({
        filter:filter,
        searchResultModal_user: !this.state.searchResultModal_user
    });
  }

  switchmodal = e => {
      e.preventDefault();
    this.searchUsers();
    this.setState({
        searchModal_user: !this.state.searchModal_user
    });  
    this.setState({
        searchResultModal_user: !this.state.searchResultModal_user
    });
  }
  


  changeFillter  = fillterName=> e=>{
    const {filter} = this.state;
    filter[fillterName] = e.target.value;
    this.setState({
        filter:filter
    })
  }
  changeUserSearchFillter  = fillterName=> e=>{
    const {userFillter} = this.state;
    userFillter[fillterName] = e.target.value;
    this.setState({
        userFillter:userFillter
    })
  }

  handleEvent(event, picker) {
 
    this.setState({
      startDate: picker.startDate,
      endDate: picker.endDate,
    });
    const {filter} = this.state;
    let start = picker.startDate.format('MMMM D, YYYY');
    let end = picker.endDate.format('MMMM D, YYYY');
    if(start==end)
    {
        filter.StartDate = "";
        filter.EndDate = "";

    }
    else
    {
        filter.StartDate = picker.startDate.format('YYYY-MM-DD');
        filter.EndDate = picker.endDate.format('YYYY-MM-DD');
    }
    
    this.setState({
        filter:filter
    });

  }

  getCalendarData(fetchInfo) {
    try{
         let year = new Date().getFullYear();
         let month = new Date().getMonth() + 1;
         if (fetchInfo) {
          var yearstart = new Date(fetchInfo.start).getFullYear();
          var monthstart = new Date(fetchInfo.start).getMonth() + 1;
          var datestart = new Date(fetchInfo.start).getDate();
          if(datestart == 1){
              month = monthstart;
              year = yearstart;
          }
          else{
              month = monthstart==12 ? 1 :  monthstart + 1;
              var addyear = monthstart==12 ? 1 : 0;
              year = yearstart + addyear;
          }
        } 
         var userData = JSON.parse(localStorage.userData);
         var token = userData.admin.token;
         var config = {
         method: 'get',
         url: `${apiurl}/live/` + year + "/" + month,
         headers: { 
             'Authorization': 'Bearer ' + token,
         },
         data : {}
         };
        axios(config)
         .then((response) => {
           
            var data = new Array();
            response.data.calendar.forEach(events => {
                events.live.forEach(item=>{ 
                 var temp = {};
                 temp.start = events.date.replaceAll("/","-");               
                 temp.id = item.id;
                 temp.title = item.liveName;
                 if( item.applicationStatus==="ScheduleLive" ||  item.applicationStatus==="LiveNow" ||  item.applicationStatus==="LiveArchive" )
                 {
                    temp.type = "Approved"
                 }
                 else
                 {
                    temp.type = item.applicationStatus;
                 }
                 
                 data.push(temp)
               })
            })
            this.setState({events:data});
            this.setviewdata("");
                 
         })
         .catch((error)=> {
             console.log(error);
         });
     }
     catch (error) {
         console.log(error);
     }
 };

 setviewdata(string) {
    var veiwdata = new Array();
    
    const{events}=this.state;
    if(string=="")
    {
        veiwdata = events;
    }

    else{
        events.forEach(event=>{
            if(event.type==string)
            {
                veiwdata.push(event);
            }
        })
    }
    this.setState({
        viewEvents:veiwdata
    })
 }


 changeViewStatus  = string=> e=>{
    this.setviewdata(string);
}


  searchLiveApplicationData=(event)=>{ 
    event.preventDefault();
    const {filter} = this.state;    
    this.getdata(filter);  }

  resetFillter = (event)=>{
    let filter = {
        Username: "",
        Email: "",
        UserId: "",
        StartDate: "",
        EndDate: "",
        PageSize: 10,
        PageNumber: 1
    }
    
    this.setState({
        filter:filter,
        startDate: moment(),
        endDate: moment()
    })
    this.getdata(filter);
  }

  handleWeekendsToggle = () => {
    this.setState({
      weekendsVisible: !this.state.weekendsVisible
    })
    const {filter} = this.state;    
    this.getdata(filter);
  }

  handleEventClick = (clickInfo) => {
      window.location.assign('/admin/liveApplication/detail/' + clickInfo.event.id); 
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }

  handlePagenation = (events,PageNumber)=>{
    const {filter} = this.state; 
    filter.PageNumber = PageNumber;
    this.setState({
        filter:filter,
        selectAll:false
    });
    this.getdata(filter);
  }
  handlePagenationModal= (events,PageNumber)=>{
    const {userFillter} = this.state; 
    userFillter.PageNumber = PageNumber;
    this.setState({
        userFillter:userFillter
    });
    this.searchUsers();
  }

  handlePagecount = (events)=>{
    const {filter} = this.state;
    var prevepageSize = filter.PageSize;

    var prevepageNumber = filter.PageNumber;
    var currentPagesize = events.target.value;
    
    filter.PageSize = currentPagesize;
    
    events.target.value = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1;
    filter.PageNumber = Math.floor(prevepageSize * (prevepageNumber-1) / currentPagesize) + 1
    this.setState({
        selectAll:false,
        filter:filter
    });
    this.getdata(filter);
  }

  componentDidMount(){    
    const {filter} = this.state; 
    this.getdata(filter);
  }

  searchUsers(){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
    var {userFillter} = this.state;
    var config = {
        method: 'get',
        url: `${apiurl}/search/artists`,
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
        var responsedata = response.data.artists;
        var index = 0;
        responsedata.forEach(item => {
            var temp={};
            temp.UserIDEmail = <span>{item.artistName}<br/>{item.id}</span>;
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
  getdata(filter){       
    
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
   
    var config = {
      method: 'get',
      url: `${apiurl}/live`,
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
      var responsedata = response.data.live;
     
      responsedata.forEach(item => {
          var temp={};
          var {itemids} = this.state;
          var index = itemids.indexOf(item.id);
          if(index==-1)
          {
            temp.checkbox = <input type='checkbox' checked={false} onChange={this.changeitem2Download(item.id)} />;
          }
          else
          {
            temp.checkbox = <input type='checkbox' checked={true} onChange={this.changeitem2Download(item.id)} />;
          }
          
          var dateandtime = item.applicationDate.split(" ");
          temp.applicationDate =<span>{dateandtime[0]}<br/>{dateandtime[1]}</span>;
          temp.id = item.id;
          temp.ArtistIDEmail = <span>{item.artistId}<br/>{item.artistEmail}</span>;
          temp.applicationStatus = item.applicationStatus;
          temp.liveTicket = item.liveTicket?"True":"False";
          temp.liveTicketAmount = item.liveTicketAmount;
          temp.action = <MDBLink className="showdetail" to={"/admin/liveApplication/detail/" + item.id}>Show details</MDBLink> 
          data.push(temp);   
      });
      const {columns} = this.state;
      var temp = columns[0];
      temp.label = <input type='checkbox' id='all' checked={false} onChange={this.selectAllitems}/>
      columns[0] = temp;
      this.setState({
        pageCount: pageCount,
        totalRecords:totalRecords,
        data:data,
        columns:columns
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                this.setState({
                    pageCount:0,
                    totalRecords:0,
                    data:{}
                });
            }
        }
    });
 }

selectAllitems  = event=>{
    const {columns, data, selectAll, itemids } = this.state;
    var temp = columns[0];
    temp.label = <input type='checkbox' id='all' checked={!selectAll} onChange={this.selectAllitems}/>
    columns[0] = temp;

    for(var i=0;i<data.length; i++)
    {
      data[i].checkbox= <input type='checkbox' checked={!selectAll} onChange={this.changeitem2Download(data[i].id)}/>;        
    }
    
    this.setState({
      columns:columns,
      itemids:itemids,
      selectAll:!this.state.selectAll,
      data:data,
    })
}

changeitem2Download = id => event =>{
    const {data,selectAll,itemids} = this.state;
    if(selectAll) return;
    for(var i=0;i<data.length; i++)
    {
        if(data[i].id == id){
            
            var index = itemids.indexOf(id);
            if(index==-1)
            {
                itemids.push(id);
                data[i].checkbox= <input type='checkbox' checked={selectAll|true} onChange={this.changeitem2Download(data[i].id)}/>;
            }
            else
            {
                itemids.splice(index,1);
                data[i].checkbox= <input type='checkbox' checked={selectAll|false} onChange={this.changeitem2Download(data[i].id)}/>;
            }   
        }
    }
     this.setState({
         data:data,
         itemids:itemids
     })

}

downloadCSV = e=>{
    const {selectAll,filter,itemids}=this.state;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var data;       
    var config;
    var data;
     if(selectAll || itemids.length==0)
     {
         var config = {
            method: 'post',
            url: `${apiurl}/live/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : filter
          };
      }
      else
      {
         const {Username,Email,StartDate,EndDate} = filter;
         var live=[];
         itemids.forEach(item=>{
             var temp={};
             temp.Id = item;
             live.push(temp);
         })
         console.log(live)
         data = JSON.stringify({"Username":Username,"Email":Email,"StartDate":StartDate,"EndDate":EndDate, "Live":live});
         config = {
            method: 'post',
           
            url: `${apiurl}/live/csv_download_selected`,
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

  render() {
    const { activeItem, searchModal_user, searchResultModal_user, alertModal,alertContent,alertTitle, data, columns, pageCount, pageCountModal ,Artist,viewEvents} = this.state;
    let pageSize = this.state.filter.PageSize;
    let PageNumber = this.state.filter.PageNumber;
    let UserName = this.state.filter.Username;
    let UserEmail = this.state.filter.Email;
    let UserID = this.state.filter.UserId;
    let Username_Search = this.state.userFillter.Username;
    let UserEmail_Search = this.state.userFillter.Email;
    let userlistRows = this.state.userlist.rows;
    let userlistColumes = this.state.userlist.columns;
    let start = this.state.startDate.format('MMMM D, YYYY');
    let end = this.state.endDate.format('MMMM D, YYYY');
    let label = start + ' - ' + end;
    let events = this.state.events
    if (start === end) {
      label = "All:" +  "~" + end;
    }
    return (
        <MDBContainer className='mt-3 maincontainer'>
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
                            <label className="text-semil3xl p-0 mb-0">List</label>
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
                            <label className="text-semil3xl p-0 mb-0">Calendar</label>
                            </MDBNavLink>
                        </MDBNavItem>
                        </MDBNav>
                        <MDBTabContent activeItem={activeItem}>
                        <MDBTabPane tabId='1' role='tabpanel'>
                        <MDBCol sm="12" className="cardheader">
                            <MDBCol sm="8" >
                                <h4>Live Application List</h4>
                            </MDBCol> 
                            <MDBCol sm="4">
                                <MDBBtn className="btn downloadbtn" color='primary' onClick={this.downloadCSV}>CSV Download</MDBBtn>
                            </MDBCol> 
                        </MDBCol>
                        <form onSubmit={this.searchLiveApplicationData}>
                        <MDBRow className="search">
                            <MDBCol sm="6" >
                                <h5>Search</h5>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistName' className='col-3 col-form-label'>
                                        User Name
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='ArtistName'  value={UserName} onChange={this.changeFillter("Username")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistEmail' className='col-3 col-form-label'>
                                        User Email
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='UserEmail' value={UserEmail} onChange={this.changeFillter("Email")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='UserID' className='col-3 col-form-label'>
                                        User ID
                                    </label>
                                    <div className='col-9'>
                                        <input type='text' className='form-control' id='UserID' value={UserID} onChange={this.changeFillter ("UserId")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a onClick={this.togglemodal("searchModal_user")}>Search User ID</a>
                                </div>                    
                            </MDBCol>
                            <MDBCol sm="6">
                                <h5>Filter</h5>
                                <div className='form-group row align-items-center' style={{marginBottom:'0px'}}>
                                    <label htmlFor='TimePicker' className='col-sm-5 col-form-label'>
                                       Application Date Range
                                    </label>
                                    <div className='col-sm-7' style={{scrollPaddingBottom:'0px'}}>
                                        <DateRangePicker
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            ranges={this.state.ranges}
                                            onEvent={this.handleEvent}
                                            id="TimePicker"
                                        >
                                            <div className="datepicker" style={{background:"white"}}>
                                                <i className="fa fa-calendar"/> &nbsp;
                                                <span>{label}</span>
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
                                <MDBBtn type="submit" color='elegant' className="btn btnsearch">Search</MDBBtn>
                                <MDBBtn outline className="btn btnreset" onClick={this.resetFillter}>Reset</MDBBtn>                        
                            </MDBCol>
                        </MDBRow>
                        </form>
                        <MDBCol sm="12">
                            <label className="totalrecord">Result: {this.state.totalRecords} Records</label>
                            <MDBTable className="artist-records" responsive striped>
                                <MDBTableHead columns={columns} />
                                {data.length?<MDBTableBody rows={data} />:<MDBTableBody />}
                                {data.length?"":<caption className="noresult">No result found</caption>}
                            </MDBTable>
                        </MDBCol>
                        <MDBCol className="pagination">
                            <Pagination className="paginationitem" count={pageCount} page={PageNumber} onChange={this.handlePagenation} variant="outlined" color="primary" />
                            <MDBCol className="pageCountarea">
                                <label>Show:
                                    <select className="pageCount" value={pageSize} onChange={this.handlePagecount}>
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
                            <MDBCol sm="12" >
                                <h4>Live Application Calendar</h4>
                            </MDBCol>  
                        </MDBCol>
                        <MDBRow className="search">
                            <MDBCol sm="12" >
                                <h5 className="text-3xl">Filter Application Status</h5>
                                <MDBRow>
                                    <MDBCol className="col-2 bg-pending text-center mt-4 mb-12 ml-4 mr-1 text-white"><a onClick={this.changeViewStatus("Pending")}>PENDING</a></MDBCol>
                                    <MDBCol className="col-2 bg-approved text-center mt-4 mb-12 mx-1 text-white"><a onClick={this.changeViewStatus("Approved")}>APPROVED</a></MDBCol>
                                    <MDBCol className="col-2 bg-declined text-center mt-4 mb-12 mx-1 text-white"><a onClick={this.changeViewStatus("Declined")}>DECLINED</a></MDBCol>
                                    <MDBCol className="col-2 bg-canceled text-center mt-4 mb-12 mx-1 text-white"><a onClick={this.changeViewStatus("Cancelled")}>CANCELED</a></MDBCol>
                                </MDBRow>
                                  <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}       
                                    headerToolbar={{
                                    left: 'prev',
                                    center: 'title',
                                    right: 'next'
                                    }}
                                    buttonText={{
                                    prev:"Before",
                                    next:"Next"
                                    }}
                                    initialView='dayGridMonth'
                                    editable={true}
                                    selectable={true}
                                    selectMirror={true}
                                    dayMaxEvents={true}
                                    weekends={this.state.weekendsVisible}
                                    datesSet={(fetchInfo) => this.getCalendarData(fetchInfo)}
                                    events = {viewEvents}
                                    eventContent={renderEventContent} // custom render function
                                    eventClick={this.handleEventClick}
                                    eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
                               
                                />
                            </MDBCol> 
                        </MDBRow>
                    </MDBTabPane>
                    </MDBTabContent>
                    </MDBCardBody>
                </MDBCard> 
            </SectionContainer>
            
            <MDBModal  isOpen={searchModal_user} toggle={this.togglemodal("searchModal_user")}>
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <form onSubmit={this.switchmodal}>
                    <MDBRow>
                        <h4 className="modal-title font-semibold text-3xl">Search User ID</h4>
                    </MDBRow>
                    <MDBRow>
                        <label htmlFor='UserName' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                            User Name
                        </label>
                        <div className='col-8'>
                            <input type='text' className='form-control' id='UserName' value={Username_Search} onChange={this.changeUserSearchFillter("ArtistName")} placeholder='｜ Type here...' />
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
                        <MDBBtn type="submit" color='elegant' className="btn btnsearch ml-4" >Search</MDBBtn>
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
                            <Pagination className="paginationitem" count={pageCountModal} onChange={this.handlePagenationModal} variant="outlined" color="primary" />
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

function renderEventContent(eventInfo) {
    if(eventInfo.event.extendedProps.type==="Pending")
    eventInfo.backgroundColor="#D81159";
    else if(eventInfo.event.extendedProps.type==="Approved")
    eventInfo.backgroundColor="#5F4BB6";
    else if(eventInfo.event.extendedProps.type==="Declined")
    eventInfo.backgroundColor="#6BAA75";
    else if(eventInfo.event.extendedProps.type==="Cancelled")
    eventInfo.backgroundColor="#00A5CF";
    else
    eventInfo.backgroundColor="#707375";
  
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    )
  }

export default LiveApplication;
