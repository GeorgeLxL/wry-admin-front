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
import DateRangePicker from '../../components/react-bootstrap-datetimerangepicker/lib';
import 'bootstrap-daterangepicker/daterangepicker.css';
import Pagination from '@material-ui/lab/Pagination';
var axios = require('axios');
const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;
class CreateBulkPayment extends Component {
    constructor(props) {
        super(props);
        var now = new Date();
        var day = new Date(new Date(now).setHours(now.getHours() + 9)).toJSON().slice(0,19); 
        this.handleEvent = this.handleEvent.bind(this);
        this.state = {
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
            day:day,
            pageCountModal:0,
            totalRecordsModal:0,
            searchModal_user:false,
            searchResultModal_user:false,
            createPaymentModal:false,
            paymentConfirmModal:false,
            paymentResultModal:false,
            alertModal:false,
            alertTitle:"",
            alertContent:"",
            title:"",
            description:"",
            amount:"",
            duedate:day,
            paymentUserid:[],
            title_error:"",
            description_error:"",
            amount_error:"",
            duedate_error:"",
            filter: {
                artistName: "",
                email: "",
                artistId:"",
                startDate:"",
                endDate: "",
                pageSize: 10
            },
            pageCount:0,
            totalRecords:0,
            userlistData:{},
            names:{},
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
                  label: <input type='checkbox' id='all'/>,
                  field: 'Checkbox'
                },
                {
                  label: "Regi.Date",
                  field: 'registerDate'
                },
                {
                  label: <span>Update<br/>Date</span>,
                  field: 'updateDate'
                },
                {
                  label: "User ID",
                  field: 'userID'
                },
                {
                  label: 'Email',
                  field: 'email'
                },
                {
                  label: 'Status',
                  field: 'status'
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
    filter.artistName = userlistData[id].artistName;
    filter.artistEmail = userlistData[id].email;
    filter.artistId = userlistData[id].id;
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
  back = e =>{
    this.setState({
        createPaymentModal: !this.state.createPaymentModal,
        paymentConfirmModal: !this.state.paymentConfirmModal,
        amount:parseFloat(this.state.amount)>0? parseFloat(this.state.amount): 0.00
      });
  }

  confirm = e => {
      e.preventDefault();
      const{day} = this.state;
      var val = parseFloat(this.state.amount)>0? parseFloat(this.state.amount): 0.00
      if(this.state.title=="")
      {
          this.setState({
              title_error:"Required"
          })
      }
      if(val<=0)
      {
        this.setState({
            amount_error:"Invalid"
        });
      }
      if(moment(this.state.duedate) < new Date(day))
      {
          this.setState({
              duedate_error:"Invalid"
          })
      }

      if(val<=0 || moment(this.state.duedate) < new Date(day) )
      {
          return
      }
      this.setState({
        createPaymentModal: !this.state.createPaymentModal,
        paymentConfirmModal: !this.state.paymentConfirmModal,
        amount:val
      });
  }

  createPayment = e=>{
     e.preventDefault();
     const {title,description,amount,duedate,paymentUserid}=this.state;
     var userData = JSON.parse(localStorage.userData);
     var token = userData.admin.token;
     var date = duedate.slice(0,16).replace("T"," ");
     var data = JSON.stringify({"Title":title,"Description":description,"Amount":amount,"DueDate":date, "Artists":paymentUserid});        
 
     var config = {
       method: 'post',
       
       url: `${apiurl}/payments/artists/bulk`,
       headers: { 
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
       },
       data : data
     };
     axios(config)
      .then((response)=>{
        var usernames="";
      
        paymentUserid.forEach(userid=>{
            usernames+=this.state.names[userid.ArtistId];
            usernames+=", ";
        });
        usernames = usernames.slice(0,-1);
        this.setState({
            paymentConfirmModal:!this.state.paymentConfirmModal,
            alertModal:!this.state.alertModal,
            alertTitle:"Create Payment Complete",
            alertContent:<span>Payment request has been <br/> successfully sent to {usernames} </span>
        })
      }).catch((error)=>{
          if(error.response)
          {    
                var alertContent = "";
                if(error.response.data.errors.User)
                {
                    alertContent = error.response.data.errors.User.message
                }
                else if(error.response.data.errors.DueDate)
                {
                    alertContent = error.response.data.errors.DueDate.message
                }
                else{
                    alertContent = "unknown"
                }
                this.setState({
                    paymentConfirmModal:!this.state.paymentConfirmModal,
                    alertModal:!this.state.alertModal,
                    alertTitle:"Create Payment Failed",
                    alertContent:alertContent
                });
          }
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

  checkUser = e =>{
    if(this.state.paymentUserid=="")
    {
        this.setState({
            alertModal:!this.state.alertModal,
            alertTitle:"",
            alertContent:"Please select an artist"
        })
    }
    else{
        this.setState({
            createPaymentModal:!this.state.createPaymentModal
        });
    }
    
  }

  createPaymentdata = datafild => e=>{
      this.setState({
          [datafild]:e.target.value,
          [datafild+"_error"]:""
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
        filter.startDate = "";
        filter.endDate = "";
    }
    else
    {
        filter.startDate = picker.startDate.format('YYYY-MM-DD');
        filter.endDate = picker.endDate.format('YYYY-MM-DD');
    }
    this.setState({
        filter:filter
    });

  }

  resetFillter = (event)=>{
    let filter = {
        artistName: "",
        email: "",
        artistId:"",
        startDate:"",
        endDate: "",
        pageSize: 10
    }
    
    this.setState({
        filter:filter,
        startDate: moment(),
        endDate: moment()
    });
    this.getdata(filter);  
  }

  cancelCreate=(events)=>{

    this.setState({
        createPaymentModal: !this.state.createPaymentModal,
        title:"",
        description:"",
        amount:"",
    })
    
  }

  handlePagenation = (events,PageNumber)=>{
    const {filter} = this.state; 
    filter.PageNumber = PageNumber;
    this.setState({
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

  changeuserId = id =>(event)=>{
    var {data} = this.state;
    var paymentUserid=this.state.paymentUserid;
    for(var i=0;i<data.length; i++)
    {
        
        if(data[i].userID == id){
            var found=false;
            var index;
            for(var j=0; j<paymentUserid.length;j++)
            {
                if(paymentUserid[j].ArtistId==id)
                {
                    found = true;
                    index = j;
                    break;
                } 
            }
            if(!found){
                data[i].Checkbox= <input type='checkbox' checked={true} onClick={this.changeuserId(data[i].userID)}/>;
                var temp={};
                temp.ArtistId = id;
                paymentUserid.push(temp);
            }
            else{
                data[i].Checkbox= <input type='checkbox' checked={false} onClick={this.changeuserId(data[i].userID)}/>;
                paymentUserid.splice(index,1);
            }       
        }
    }
    this.setState({
        data:data,
        paymentUserid:paymentUserid
    })
  }

 getdata(filter){       
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
    var names=  new Array();
    var config = {
        method: 'get',
        url: `${apiurl}/search/artists`,
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
      var responsedata = response.data.artists;
      responsedata.forEach(item => {
          var temp={};         
          temp.Checkbox = <input type='checkbox' checked={false} onChange={this.changeuserId(item.id)}/>;
          temp.registerDate =item.registeredDate;
          temp.updateDate = item.dateUpdated;
          temp.userID = item.id;
          temp.email = item.email;
          temp.status = item.status;
          temp.action = <MDBLink className="showdetail">Show detail</MDBLink> 
          data.push(temp);
          names.push(item.artistName);
      });  
      this.setState({
        pageCount: pageCount,
        totalRecords:totalRecords,
        data:data,
        names:names,
        paymentUserid:[]
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



  render() {
    const {searchModal_user, searchResultModal_user, alertModal,alertTitle,alertContent, data, columns, pageCount, pageCountModal, createPaymentModal, paymentConfirmModal, title,description,amount,duedate,title_error,description_error,amount_error,duedate_error} = this.state;
    
    let pageSize = this.state.filter.PageSize;
    let artistName = this.state.filter.artistName;
    let artistEmail = this.state.filter.email;
    let artistId = this.state.filter.artistId;
    let Username_Search = this.state.userFillter.Username;
    let UserEmail_Search = this.state.userFillter.Email;
    
    let userlistRows = this.state.userlist.rows;
    let userlistColumes = this.state.userlist.columns;

    let start = this.state.startDate.format('MMMM D, YYYY');
    let end = this.state.endDate.format('MMMM D, YYYY');
    let label = start + ' - ' + end;
    let montharray =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] 
    let year = duedate.slice(0,4);
    let month = duedate.slice(5,7);
    let day = duedate.slice(8,10);
    let displaydueDate = `${montharray[parseInt(month-1)]} ${parseInt(day)}, ${year}`;
    if (start === end) {
        label = "All:" +  "~" + end;
    }
    return (
        <MDBContainer className='mt-3 maincontainer'>
            <span style={{color:'blue'}}>Artist Payment List &gt;</span><span> Create Payment</span>
            <SectionContainer noBorder>
            <MDBCard>
                <MDBCardBody>                    
                    <form onSubmit={this.searchUserTransactionData}>
                    <h5>Search</h5> 
                    <MDBRow className="search">
                            <MDBCol sm="6" >                                
                                <div className='form-group row'>
                                    <label htmlFor='UserName' className='col-3 col-form-label'>
                                        User Name
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='UserName'  value={artistName} onChange={this.changeFillter("artistName")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistEmail' className='col-sm-3 col-form-label'>
                                        User Email
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='UserEmail' value={artistEmail} onChange={this.changeFillter("email")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='UserID' className='col-sm-3 col-form-label'>
                                        User ID
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='UserID' value={artistId} onChange={this.changeFillter ("artistId")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a onClick={this.togglemodal("searchModal_user")}>Search User ID</a>
                                </div>                    
                            </MDBCol>
                            <MDBCol sm="6">
                                <div className='form-group row align-items-center'>
                                    <label htmlFor='fillter' className='col-5 col-form-label'>
                                        Registration Date Range
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
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a>+ Add more Filter</a>
                                </div>

                            </MDBCol>
                            <MDBCol sm="12" style={{textAlign:'right'}}>
                                <MDBBtn color='elegant' type="submit" className="btn btnsearch">Search</MDBBtn>
                                <MDBBtn outline className="btn btnreset" onClick={this.resetFillter}>Reset</MDBBtn>                        
                            </MDBCol>
                            
                        </MDBRow>
                        </form>
                    <MDBCol sm="12">
                        <div className="totalrecord">Result: {this.state.totalRecords} Records</div>
                        <MDBBtn onClick={this.checkUser} className="btn downloadbtn" color='primary'>CREATE PAYMENT</MDBBtn>
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
                    <MDBRow>
                        <h4 className="modal-title font-semibold text-3xl">Search User ID</h4>
                    </MDBRow>
                    <form onSubmit={this.switchmodal}>
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

            <MDBModal className="createpaymodal"  isOpen={createPaymentModal} toggle={this.togglemodal("createPaymentModal")}>
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow>
                        <h4 className="modal-title font-semibold text-3xl">Create Payment</h4>
                    </MDBRow>
                    <div className="selected_user">Selected User {this.state.paymentUserid.length}</div>
                    <form onSubmit={this.confirm}>
                    <MDBRow className="mb-4">
                        <label htmlFor='title' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Title
                        </label>
                        <div className='col-8'>
                            <input type='text' className='form-control' id='title' value={title} onChange={this.createPaymentdata("title")} placeholder='｜ Type here...' />
                            <span className="error">{title_error}</span>
                        </div>
                       
                    </MDBRow>
                    <MDBRow className="mb-4">
                        <label htmlFor='description' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Description
                        </label>
                        <div className='col-8'>
                            <textarea type='text' className='form-control' id='description' value={description} onChange={this.createPaymentdata("description")} placeholder='｜ Type here...' ></textarea>
                            <span className="error">{description_error}</span>
                        </div>
                        
                    </MDBRow>
                    <MDBRow className="mb-4">
                        <label htmlFor='amount' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Amount
                        </label>
                        <div className='col-8 amount-input'>
                            <input type='text' className='form-control' id='amount' value={amount} onChange={this.createPaymentdata("amount")} placeholder='｜ Type here...' />
                            <span className="amount-unit">USD</span>
                            <div className="error">{amount_error}</div>
                        </div>
                        
                    </MDBRow>
                    <MDBRow className="mb-4">
                        <label htmlFor='duedate' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Due Date
                        </label>
                        <div className='col-8'>
                            <input aria-invalid="false" type='datetime-local' className='form-control' id='duedate' value={duedate} onChange={this.createPaymentdata("duedate")} placeholder='｜ Type here...' />
                            <span className="error">{duedate_error}</span>
                        </div>
                        
                    </MDBRow>

                    <MDBRow className="mt-4 mb-4">
                        <MDBCol className=" text-right">
                            <MDBBtn outline className="btn btnreset mr-4" onClick={this.cancelCreate}>Cancel</MDBBtn>                    
                            <MDBBtn type="submit" color='elegant' className="btn btnsearch ml-4">Confirm</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                    </form>
                </MDBModalBody>       
            </MDBModal>

            <MDBModal className="createpaymodal"  isOpen={paymentConfirmModal} toggle={this.togglemodal("paymentConfirmModal")}>
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    
                    <MDBRow>
                        <h4 className="modal-title font-semibold text-3xl">Create Payment</h4>
                    </MDBRow>
                    <div className="selected_user">Selected User {this.state.paymentUserid.length}</div>
                    <form onSubmit={this.createPayment}>
                    <MDBRow className="mb-4">
                        <label htmlFor='title' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Title
                        </label>
                        <div className='col-8'>
                            <input type='text' className='form-control' id='title' value={title} onChange={this.createPaymentdata("title")}/>
                        </div>
                    </MDBRow>
                    <MDBRow className="mb-4">
                        <label htmlFor='description' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Description
                        </label>
                        <div className='col-8'>
                            <textarea type='text' className='form-control' id='description' value={description} onChange={this.createPaymentdata("description")} ></textarea>
                        </div>
                    </MDBRow>
                    <MDBRow className="mb-4">
                        <label htmlFor='amount' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Amount
                        </label>
                        <div className='col-8 amount-input'>
                            <input style={{textAlign:'right',paddingRight:'50px'}} type='text' className='form-control' id='amount' value={amount>0?amount:0.00} onChange={this.createPaymentdata("amount")}/>
                            <span className="amount-unit">USD</span>
                        </div>
                    </MDBRow>
                    <MDBRow className="mb-4">
                        <label htmlFor='duedate' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Due Date
                        </label>
                        <div className='col-8'>
                            <input style={{textAlign:'right'}} className='form-control' id='duedate' value={displaydueDate} onChange={this.createPaymentdata("duedate")}/>
                        </div>
                    </MDBRow>

                    <MDBRow className="mt-4 mb-4">
                        <MDBCol className=" text-right">
                            <MDBBtn outline className="btn btnreset mr-4" onClick={this.back}>Back</MDBBtn>                    
                            <MDBBtn type="submit" color='elegant' className="btn btnsearch ml-4">Send</MDBBtn>
                        </MDBCol>
                    </MDBRow>
                    </form>
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

export default CreateBulkPayment;
