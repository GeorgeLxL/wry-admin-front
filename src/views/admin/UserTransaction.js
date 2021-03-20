import React, { Component } from 'react';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBLink,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBModal,
  MDBModalBody,

} from 'mdbreact';
import moment from 'moment';
import SectionContainer from '../../components/sectionContainer';
import DateRangePicker from '../../components/react-bootstrap-datetimerangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Pagination from '@material-ui/lab/Pagination';
import { TimelineSeparator } from '@material-ui/lab';
var axios = require('axios');

const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;
class Usertransaction extends Component {
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
                Username: "",
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
            filter: {
                transactionStatus:"",
                contentType:"",
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
            userids:[],
            contenttypes:[],
            statustypes:"",
            alertModal:false,
            alertContent:"",
            alertTitle:"",
            artistName:"",
            TransactionStatustosend:"",
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
                  field: 'Checkbox'
                },
                {
                  label: <span>Tran.Date<br/>and Time</span>,
                  field: 'TranDatetime'
                },
                {
                  label: 'Tran.ID',
                  field: 'id'
                },
                {
                  label: <span>User ID<br/>Email</span>,
                  field: 'UserIDEmail'
                },
                {
                  label: 'Cont.Type',
                  field: 'ContType'
                },
                {
                  label: 'Tran. Status',
                  field: 'TranStatus'
                },
                {
                  label: "Amount",
                  field: 'TranAmount'
                },
                {
                   label : "Action",
                   field : "action",
                }
            ],
            data:{},
            subscriptionids:[]
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
    filter.Username = userlistData[id].username;
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

  resetFillter = (event)=>{
    let filter = {
        transactionStatus:"",
        contentType:"",
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
    });
    this.getdata(filter);  
  }


  handlePagenation = (events,PageNumber)=>{
    const {filter} = this.state; 
    filter.PageNumber = PageNumber;
    this.setState({
        selectAll:false,
        filter:filter
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
    var prevepageSize = filter.pageSize;
    var prevepageNumber = filter.PageNumber;
    var currentPagesize = events.target.value;
    filter.PageSize = currentPagesize;
    filter.PageNumber = Math.ceil(prevepageSize * prevepageNumber / currentPagesize)
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
  
  searchUserTransactionData = (event)=>{
    event.preventDefault();
    var {filter} = this.state;    
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
  getdata(filter){       
    
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
    var subscriptionids = this.state.subscriptionids
    var config = {
      method: 'get',
      url: `${apiurl}/transactions/users`,
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
      var responsedata = response.data.transactions;
      console.log(responsedata)
      responsedata.forEach(item => {
          var temp={};

          var {itemids} = this.state;
          var index = itemids.indexOf(item.details.transactionId);
          if(index==-1)
          {
            temp.Checkbox = <input type='checkbox' checked={false} onChange={this.changeitem2Download(item.details.transactionId)} />;
          }
          else
          {
            temp.Checkbox = <input type='checkbox' checked={true} onChange={this.changeitem2Download(item.details.transactionId)} />;
          }
          var dateandtime = item.details.transactionDate.split(" ");
          temp.TranDatetime =<span>{dateandtime[0]}<br/>{dateandtime[1]}</span>;
          temp.id = item.details.transactionId;
          temp.UserIDEmail = <span>{item.user.id}<br/>{item.user.email}</span>;
          temp.ContType = item.details.contentType;
          temp.TranStatus = item.details.transactionStatus;
          temp.TranAmount = item.details.amount;
          temp.action = <MDBLink className="showdetail" to={`/admin/userTransaction/detail/${item.details.transactionId} ${item.user.id} ${item.details.contentType} ${item.details.subscriptionId} ${1}`}>Show detail</MDBLink> 
          var obj={};
          obj[item.details.transactionId] = item.details.subscriptionId;
          subscriptionids.push(obj);
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
        subscriptionids:subscriptionids,
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
      data[i].Checkbox= <input type='checkbox' checked={!selectAll} onChange={this.changeitem2Download(data[i].id)}/>;        
    }
    this.setState({
      columns:columns,
      selectAll:!this.state.selectAll,
      data:data,
      itemids:itemids,
    })
}

changeitem2Download = id => event =>{
    const {data,selectAll,itemids,contenttypes,userids} = this.state;
    var statustypes;
    if(selectAll) return;
    for(var i=0;i<data.length; i++)
    {
        if(data[i].id == id){
            
            var index = itemids.indexOf(id);
            if(index==-1)
            {
                itemids.push(id);
                contenttypes.push(data[i].ContType);
                userids.push(data[i].UserIDEmail.props.children[0]);
                data[i].Checkbox= <input type='checkbox' checked={selectAll|true} onChange={this.changeitem2Download(data[i].id)}/>;
            }
            else
            {
                itemids.splice(index,1);
                contenttypes.splice(index,1);
                userids.splice(index,1);
                data[i].Checkbox= <input type='checkbox' checked={selectAll|false} onChange={this.changeitem2Download(data[i].id)}/>;
            }  
        }
    }
    var firstchildid
    
    if(itemids.length>0)
    {
        var idd = itemids[0];
        for(var ii=0;ii<data.length; ii++)
        {
            if(data[ii].id == idd)
            {
                firstchildid = ii;
            }
        }
       
    }
    statustypes = firstchildid>=0?data[firstchildid].TranStatus:""
 
     this.setState({
         data:data,
         itemids:itemids,
         statustypes:statustypes,        
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
        const {Username,UserId,Email,StartDate,EndDate,transactionStatus,contentType} = filter;
        data = JSON.stringify({"Username":Username,"Email":Email, "UserId":UserId ,"StartDate":StartDate,"EndDate":EndDate, "TransactionStatus":transactionStatus,"ContentType":contentType});
        var config = {
            method: 'post',
            url: `${apiurl}/transactions/users/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : filter
          };
      }
      else
      {
         const {Username,UserId,Email,StartDate,EndDate,transactionStatus,contentType} = filter;
         var Transactions=[];
         itemids.forEach(item=>{
             var temp={};
             temp.Id = item;
             Transactions.push(temp);
         })
         data = JSON.stringify({"Username":Username,"Email":Email, "UserId":UserId ,"StartDate":StartDate,"EndDate":EndDate, "TransactionStatus":transactionStatus,"ContentType":contentType, "Transactions":Transactions});
         config = {
            method: 'post',
           
            url: `${apiurl}/transactions/users/csv_download_selected`,
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


createRefundRequest=(event)=>{
    const {itemids,contenttypes,userids} = this.state;
    var contentType=contenttypes[0];
    this.getContentArtistinfo(itemids[0]);
    this.getTransctioninfo(itemids[0])
    if(contentType=="PayPerView" || "LiveTicket")
    {
        this.setState({
          confirmModal:!this.state.confirmModal,
          confirmTitle:"REFUND REQUEST",
          confirmContent:"Are you sure you want to request a refund for this transaction?"
         
        })
    }
    if(contentType=="Subscription")
    {
      this.setState({
        confirmModal:!this.state.confirmModal,
        confirmTitle:"REFUND REQUEST",
        confirmContent:<span>This will revoke the user's subscription to {this.state.artistName}<br/>Are you sure you want to request a refund for this transaction?</span>
      })
    }
}  

getContentArtistinfo(id)
{
  var userData = JSON.parse(localStorage.userData);
  var token = userData.admin.token;
  var data = new Array();
  var config = {
      method: 'get',
      url: `${apiurl}/transactions/users/` + id + '/content_artist',
      headers: { 
      'Authorization': 'Bearer ' + token,
  },
      data : {},
  };
  axios(config)
  .then((response) => { 
      var responsedata = response.data;
      var artistData = responsedata.artist;
      this.setState({artistName:artistData.name});

  })
  .catch((error)=> {
      if (error.response) {
          if(error.response.status==401){
              localStorage.removeItem("userData");
              window.location.assign('/');
          }
      }
  });
}

getTransctioninfo(id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var data = new Array();
    var config = {
        method: 'get',
        url: `${apiurl}/transactions/users/` + id,
        headers: { 
        'Authorization': 'Bearer ' + token,
    },
        data : {},
    };
    axios(config)
    .then((response) => { 
      var responsedata = response.data;
      this.setState({TransactionStatustosend:responsedata.status});
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
                
            }
        }
    });
}

sendRequest = (event) =>{
    this.setState({confirmModal:!this.state.confirmModal})
    const {itemids,contenttypes,userids} = this.state;
    var id =itemids[0];
    var contentType = contenttypes[0];
    var userid = userids[0];
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    // const {UserId,userEmail,userName,ContentType,PageNumber,PageSize,StartDate,EndDate} = this.state;
    if(contentType=="PayPerView" || contentType=="LiveTicket")
    {
      const fd = new FormData();
      fd.append('Username', "");
      fd.append('Email', "");
      fd.append('UserId', "");
      fd.append('StartDate', "");
      fd.append('EndDate', "");
      fd.append('TransactionStatus', this.state.TransactionStatustosend);
      fd.append('ContentType', contentType);
      fd.append('PageSize', this.state.filter.PageSize);
      fd.append('PageNumber', this.state.filter.PageNumber);
      axios({
        method: 'post',
        url: `${apiurl}/transactions/users/${id}/refund`,
        data: fd,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data' 
        }
    }).then((response)=>{
        this.setState({
            alertModal:true,
            alertTitle: "REFUND REQUEST",
            alertContent:<span>Refund request has been <br/> successfully sent. </span>
        });
      }).catch((error)=>{
        this.setState({
            alertModal:true,
            alertTitle: "REFUND REQUEST",
            alertContent:"Failed"
        });
      })
    }
    
    if(contentType=="Subscription")
    {
      const {subscriptionids} = this.state
      var subscriptionid;
      subscriptionids.forEach(item=>{
          if(item[id]){
            subscriptionid = item[id];
          }
      })
      const fd = new FormData();
      fd.append('Username', "");
      fd.append('Email', "");
      fd.append('UserId', "");
      fd.append('StartDate', "");
      fd.append('EndDate', "");
      fd.append('TransactionStatus', this.state.TransactionStatustosend);
      fd.append('ContentType', contentType);
      fd.append('PageSize', this.state.filter.PageSize);
      fd.append('PageNumber', this.state.filter.PageNumber);
      axios({
        method: 'post',
        url: `${apiurl}/transactions/users/${id}/subscription/${subscriptionid}/refund`,
        data: fd,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data' 
        }
    }).then((response)=>{
        this.setState({
            alertModal:!this.state.alertModal,
            alertTitle: "REFUND REQUEST",
            alertContent:<span>Refund request has been <br/> successfully sent. </span>
        });
      }).catch((error)=>{
        this.setState({
            alertModal:true,
            alertTitle: "REFUND REQUEST",
            alertContent:"Failed"
        });
      })
    } 
}

  render() {
    const { activeItem, searchModal_user, searchResultModal_user, alertContent,alertModal,alertTitle, confirmModal,confirmTitle,confirmContent, data, columns, pageCount, pageCountModal ,Artist} = this.state;
    let pageSize = this.state.filter.PageSize;
    let UserName = this.state.filter.Username;
    let UserEmail = this.state.filter.Email;
    let UserID = this.state.filter.UserId;
    let tranStatus = this.state.filter.transactionStatus;
    let contenttype = this.state.filter.contentType; 
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
                    <MDBCol sm="12" className="cardheader">
                        <MDBCol sm="6" style={{ padding:'0px' }} >
                            <h4>User Transaction</h4>
                        </MDBCol> 
                        <MDBCol sm="6" style={{ padding:'0px' }}>
                            <MDBBtn className="btn downloadbtn" color='primary' onClick={this.downloadCSV}>CSV Download</MDBBtn>
                            <MDBBtn color='elegant' className="btn btnrequest" disabled={!((this.state.itemids.length)==1) || ((this.state.statustypes)=="Refunded")} onClick={this.createRefundRequest}>CREATE REFUND REQUEST</MDBBtn>
                            
                        </MDBCol> 
                    </MDBCol>
                    <form onSubmit={this.searchUserTransactionData}>
                    <MDBRow className="search">
                            <MDBCol sm="6" >
                                <h5>Search</h5>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistName' className='col-3 col-form-label'>
                                        User Name
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='ArtistName'  value={UserName} onChange={this.changeFillter("Username")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistEmail' className='col-sm-3 col-form-label'>
                                        User Email
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='UserEmail' value={UserEmail} onChange={this.changeFillter("Email")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='UserID' className='col-sm-3 col-form-label'>
                                        User ID
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='UserID' value={UserID} onChange={this.changeFillter ("UserId")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a onClick={this.togglemodal("searchModal_user")}>Search User ID</a>
                                </div>                    
                            </MDBCol>
                            <MDBCol sm="6">
                                <h5>Filter</h5>
                                <div className='form-group row align-items-center'>
                                    <label htmlFor='fillter' className='col-5 col-form-label'>
                                        Transaction Date Range
                                    </label>
                                    <div className='col-7' style={{scrollPaddingBottom:'0px'}}>
                                        <DateRangePicker
                                            startDate={this.state.startDate}
                                            endDate={this.state.endDate}
                                            ranges={this.state.ranges}
                                            onEvent={this.handleEvent}
                                        >
                                            <div className="datepicker" style={{background:"white"}}>
                                                <i className="fa fa-calendar"/> &nbsp;
                                                <span>{label}</span>
                                                <i className="fa fa-angle-down"/>
                                            </div>
                                        </DateRangePicker>
                                    </div>
                                </div>
                                
                                <div className='form-group row align-items-center' style={{marginBottom:'0px'}}>
                                    <label htmlFor='UserID' className='col-5 col-form-label'>
                                        Content Type
                                    </label>
                                    <div className='col-7'>
                                        <select className="filter" value={contenttype} onChange={this.changeFillter ("contentType")} >
                                            <option value="">Select</option>
                                            <option value={1}>PayPerView</option>
                                            <option value={2}>LiveTicket</option>
                                            <option value={3}>Subscription</option>
                                        </select>
                                    </div>
                                </div>

                                <div className='form-group row align-items-center'>
                                    <label htmlFor='UserID' className='col-5 col-form-label'>
                                    Transaction Status
                                    </label>
                                    <div className='col-7'>
                                        <select className="filter" value={tranStatus} onChange={this.changeFillter ("transactionStatus")}>
                                        <option value="">Select</option>
                                            <option value={1}>Created</option>
                                            <option value={2}>Captured</option>
                                            <option value={3}>WaitingForPayment</option>
                                            <option value={4}>Paid</option>
                                            <option value={5}>CouponCodeSent</option>
                                            <option value={6}>Active</option>
                                        </select>
                                    </div>
                                </div>
                               
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a>+ Add more Filter</a>
                                </div>   
                            </MDBCol>
                            <MDBCol sm="12" style={{textAlign:'right'}}>
                                <MDBBtn color='elegant' className="btn btnsearch" type="submit">Search</MDBBtn>
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
                        <Pagination className="paginationitem" count={pageCount} onChange={this.handlePagenation} variant="outlined" color="primary" />
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
                        <MDBBtn type="submit" color='elegant' className="btn btnsearch ml-4">Search</MDBBtn>
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

            <MDBModal className="requestModal"  isOpen={confirmModal} toggle={this.togglemodal("confirmModal")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow className="my-6">
                        <h4 className="modal-title font-semibold text-3xl">{confirmTitle}</h4>
                    </MDBRow>
                    <MDBRow className="my-6">
                        <label className="modal-title font-semibold text-2xl text-center">{confirmContent}</label>
                    </MDBRow>
                      
                    <MDBRow className="mt-4 mb-4">                  
                      <MDBCol className="col-12 text-center">
                          <MDBBtn color='elegant' className="btn btnrequest" onClick={this.sendRequest}>YES</MDBBtn> 
                          <MDBBtn color='elegant' className="btn btnrequest" onClick={this.togglemodal("confirmModal")}>No</MDBBtn> 
                      </MDBCol>
                    </MDBRow>
                </MDBModalBody>       
            </MDBModal> 
        
        </MDBContainer>
   
   );
  }
}

export default Usertransaction;
