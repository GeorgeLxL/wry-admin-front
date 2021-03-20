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
import { CsvToHtmlTable } from 'react-csv-to-table'
var axios = require('axios');

const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;

class ArtistPayment extends Component {
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
            createPaymentModal:false,
            paymentConfirmModal:false,
            paymentResultModal:false,
            csvDatamodal:false,
            alertModal:false,
            alertTitle:"",
            alertContent:"",
            selectAll:false,
            itemids:[],
            title:"",
            description:"",
            amount:"",
            duedate:"",
            events:{}, 
            filter: {
                artistName: "",
                artistEmail: "",
                artistId:"",
                startDate:"",
                endDate: "",
                paymentStatus: "",
                contentType: "",
                pageNumber: 1,
                pageSize: 10
            },
            pageCount:0,
            totalRecords:0,
            userlistData:{},
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
                  label: <span>Paym. Request <br/>Date and Time</span>,
                  field: 'PayReqDatetime'
                },
                {
                  label: 'Request ID',
                  field: 'requestId'
                },
                {
                  label: <span>Artist ID<br/>Email</span>,
                  field: 'ArtistIDEmail'
                },
                {
                  label: 'Paym. Status',
                  field: 'PayStatus'
                },
                {
                  label: <span>Due Date<br/>and Time</span>,
                  field: 'duedateandtime'
                },
                {
                  label: "Amount",
                  field: 'PayAmount'
                },
                {
                   label : "Action",
                   field : "action",
                }
            ],
            csvData:"",
            data:{},
            uploadfile:null,
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

  createPaymentdata = datafild => e=>{
      this.setState({
          [datafild]:e.target.value
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
        artistName: "",
        artistEmail: "",
        artistId:"",
        startDate:"",
        endDate: "",
        paymentStatus: "",
        contentType: "",
        pageNumber: 1,
        pageSize: 10
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
    filter.pageNumber = PageNumber;
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
  getdata(filter){       
    
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    var data = new Array();
    var config = {
      method: 'get',
      url: `${apiurl}/payments`,
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
      var responsedata = response.data.payments;
      responsedata.forEach(item => {
          var temp={};
          var itemids =  this.state.itemids
          var index = itemids.indexOf(item.requestId);
          if(index==-1){
            temp.checkbox = <input type='checkbox' checked={false} onChange={this.changeitem2Download(item.requestId)}/>;
          }
          else
          {
            temp.checkbox = <input type='checkbox' checked={true} onChange={this.changeitem2Download(item.requestId)}/>;
          }
          var dateandtime = (item.paymentRequestDateTime || '-').split(" ");
          temp.PayReqDatetime =<span>{dateandtime[0]}<br/>{dateandtime[1]}</span>;
          temp.requestId = item.requestId;
          temp.ArtistIDEmail = <span>{item.artistId}<br/>{item.email}</span>;
          temp.PayStatus = item.paymentStatus;
          temp.duedateandtime = item.dueDate;
          temp.PayAmount = item.amount;
          temp.action = <MDBLink className="showdetail" to={`/admin/artistPayment/detail/${item.requestId} ${item.artistId}`}>Show detail</MDBLink> 
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

 chagefile = event =>{
    
    var reader = new FileReader();
    this.setState({
        uploadfile:event.target.files[0]
    })
    reader.onload = function(e) {
        var data = reader.result.replace(/\"|/gi, "");
        this.setState({
            csvData:data,
        });
    }.bind(this);

    if(event.target.files[0]){
        reader.readAsText(event.target.files[0]);
    }
  }

  uploadCSV = e=>{
    const {uploadfile} = this.state;
    if(uploadfile==null){
        this.setState({
            alertModal:!this.state.alertModal,
            alertTitle:"Choose a CSV file"
        });
    }
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    const fd = new FormData();
    fd.append('CsvFile', new Blob([uploadfile], { type: 'text/csv' }));
    axios.post(`${apiurl}/payments/artists/upload_csv`, fd, {
        headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded', 
          'Authorization': 'Bearer ' + token,
        }
    }).then((response)=>{
        this.setState({
            alertModal:!this.state.alertModal,
            alertTitle: "CSV BULK PAYMENT SUCCESS",
            alertContent: "CSV file was successfully uploaded.",
            csvDatamodal: false,
            csvData: ''
        })
        this.getdata(this.state.filter);
    }).catch((error)=>{
        console.log(error.response);
        var alertContent = 'Uploading Failed';
        if(error.response.data.errors && error.response.data.errors) {
            const errArray = [];
            const { errors } = error.response.data;
            Object.keys(errors).forEach((key) => {
                const match = key.match(/\[(\d+)\]/);
                var lineNum = Number(match[1]) + 1;
                if(match) {
                    const name = key.split('.')[1];
                    lineNum = `Line no ${lineNum}: ${name} `;
                }
                errArray.push(`${lineNum}${errors[key].message}`);
            });

            if(errArray.length) {
                alertContent = errArray.join('\n');
            }

        }
         this.setState({
             alertModal:!this.state.alertModal,
             csvDatamodal:!this.state.csvDatamodal,
             alertTitle:"Upload a CSV file failed",
             alertContent,
         })
    })
  }

  selectAllitems  = event=>{
    const {columns, data, selectAll, itemids } = this.state;
    var temp = columns[0];
    temp.label = <input type='checkbox' id='all' checked={!selectAll} onChange={this.selectAllitems}/>
    columns[0] = temp;
      
    for(var i=0;i<data.length; i++)
    {
      data[i].checkbox= <input type='checkbox' checked={!selectAll} onChange={this.changeitem2Download(data[i].requestId)}/>;        
    }
    this.setState({
      columns:columns,
      selectAll:!this.state.selectAll,
      data:data,
      itemids:itemids
    })
}

changeitem2Download = id => event =>{
    const {data,selectAll,itemids} = this.state;
    if(selectAll) return;
    for(var i=0;i<data.length; i++)
    {
        if(data[i].requestId == id){
            
            var index = itemids.indexOf(id);
            if(index==-1)
            {
                itemids.push(id);
                data[i].checkbox= <input type='checkbox' checked={selectAll|true} onChange={this.changeitem2Download(data[i].requestId)}/>;
            }
            else
            {
                itemids.splice(index,1);
                data[i].checkbox= <input type='checkbox' checked={selectAll|false} onChange={this.changeitem2Download(data[i].requestId)}/>;
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
    const {artistName,artistEmail,artistId,startDate, endDate, paymentStatus,contentType,pageNumber,pageSize} = filter;
    var data;       
    var config;
    var data;
     if(selectAll || itemids.length==0)
     {
        data = JSON.stringify({"ArtistName":artistName,"Email":artistEmail,"ArtistId":artistId,"StartDate":startDate, "EndDate":endDate, "PaymentStatus":paymentStatus}); 
        var config = {
            method: 'post',
            url: `${apiurl}/payments/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : data
          };
      }
      else
      {
         var payment=[];
         itemids.forEach(item=>{
             var temp={};
             temp.RequestId = item;
             payment.push(temp);
         })
         data = JSON.stringify({"ArtistName":artistName,"Email":artistEmail,"ArtistId":artistId,"StartDate":startDate, "EndDate":endDate, "PaymentStatus":paymentStatus, "Payments":payment}); 
         config = {
            method: 'post',
           
            url: `${apiurl}/payments/csv_download_selected`,
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
    const {alertTitle, alertModal, alertContent, activeItem, searchModal_user, searchResultModal_user,csvDatamodal, data, columns, pageCount, pageCountModal, createPaymentModal,title,description,amount,duedate} = this.state;
    let pageSize = this.state.filter.PageSize;
    let artistName = this.state.filter.artistName;
    let artistEmail = this.state.filter.artistEmail;
    let artistId = this.state.filter.artistId;
    let paymentStatus = this.state.filter.paymentStatus;
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
                        <MDBCol sm="5" style={{ padding:'0px' }} >
                            <h4>Artist Payment</h4>
                        </MDBCol> 
                        <MDBCol sm="7" style={{ padding:'0px' }}>
                            <MDBBtn className="btn downloadbtn" onClick={this.downloadCSV} color='primary'>CSV Download</MDBBtn>
                            <MDBLink to={'/admin/artistPayment/singlePayment'}  className="btn btnrequest paymentbtn">CREATE PAYMENT</MDBLink>
                            <MDBLink onClick={(e) => {this.setState({csvDatamodal:true});}} className="btn btnrequest paymentbtn">CSV BULK PAYMENT</MDBLink>
                        </MDBCol> 
                    </MDBCol>
                    
                    <form onSubmit={this.searchUserTransactionData}>
                    <MDBRow className="search">
                            <MDBCol sm="6" >
                                <h5>Search</h5>                                
                                <div className='form-group row'>
                                    <label htmlFor='ArtistName' className='col-3 col-form-label'>
                                        Artist Name
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='ArtistName'  value={artistName} onChange={this.changeFillter("artistName")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='ArtistEmail' className='col-sm-3 col-form-label'>
                                        Artist Email
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='UserEmail' value={artistEmail} onChange={this.changeFillter("artistEmail")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div className='form-group row'>
                                    <label htmlFor='UserID' className='col-sm-3 col-form-label'>
                                        Artist ID
                                    </label>
                                    <div className='col-sm-9'>
                                        <input type='text' className='form-control' id='UserID' value={artistId} onChange={this.changeFillter ("artistId")} placeholder='｜ Type here...' />
                                    </div>
                                </div>
                                <div style={{textAlign:'right',marginTop:'0px', paddingTop:'0px'}}>
                                    <a onClick={this.togglemodal("searchModal_user")}>Search Artist ID</a>
                                </div>                    
                            </MDBCol>
                            <MDBCol sm="6">
                                <h5>Filter</h5>
                                <div className='form-group row align-items-center'>
                                    <label htmlFor='fillter' className='col-5 col-form-label'>
                                        Payment Date Range
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

                                <div className='form-group row align-items-center'>
                                    <label htmlFor='UserID' className='col-5 col-form-label'>
                                        Payment Status
                                    </label>
                                    <div className='col-7'>
                                        <select className="filter" value={paymentStatus} onChange={this.changeFillter ("paymentStatus")}>
                                        <option value="">Select</option>
                                            <option value={1}>Pending</option>
                                            <option value={2}>Failed</option>
                                            <option value={3}>Success</option>
                                            <option value={4}>Unclaimed</option>
                                            <option value={5}>Returned</option>
                                            <option value={6}>OnHold</option>
                                            <option value={7}>Blocked</option>
                                            <option value={8}>Refunded</option>
                                            <option value={9}>Reversed</option>

                                        </select>
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
                    <label className="totalrecord">Result: {this.state.totalRecords} Records</label>
                        <MDBTable responsive striped className="artist-records">
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
                        <h4 className="modal-title font-semibold text-3xl">Search Artist ID</h4>
                    </MDBRow>
                    <form onSubmit={this.switchmodal}>
                    <MDBRow>
                        <label htmlFor='UserName' className='col-3 col-form-label pl-10 text-lg font-semibold'>
                        Artist Name
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
                        Artist Email
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
                            <MDBTable responsive striped>
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

            <MDBModal isOpen={csvDatamodal} toggle={this.togglemodal("csvDatamodal")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-4 pl-4 csv-bulk-prev">
                        <MDBCol className="csv-table">
                            <CsvToHtmlTable
                                data={this.state.csvData}
                                csvDelimiter=","
                            />
                        </MDBCol>
                 
                    <MDBRow className="mt-4 mb-4">
                   
                    <MDBCol className="col-12 text-center">
                        <MDBBtn color='elegant' className="btn btnsearch ml-4" onClick={e=>{this.upload.click()}}>Choose</MDBBtn>                   
                        <MDBBtn  color='elegant' className="btn btnsearch ml-4" onClick={this.uploadCSV} >Upload</MDBBtn>
                        <MDBBtn outline className="btn btnreset ml-4" onClick={e=>{this.setState({uploadfile:null,csvData:"",csvDatamodal:false})}}>Close</MDBBtn>
                        {/* Use for clearing values of Input File */}
                        {this.state.csvData && (<input type="file" accept=".csv, .CSV" onChange={this.chagefile} ref={(ref) => this.upload = ref} style={{ display: 'none' }}/>)}
                        {!this.state.csvData && (<input type="file" accept=".csv, .CSV" onChange={this.chagefile} ref={(ref) => this.upload = ref} style={{ display: 'none' }}/>)}
                                    
                    </MDBCol>
                    </MDBRow>
                </MDBModalBody>       
            </MDBModal>

            <MDBModal className="requestModal"  isOpen={alertModal} toggle={this.togglemodal("alertModal")} >
                <MDBModalBody className="bg-gray-modal p-8 pr-12 pl-12">
                    <MDBRow className="my-2">
                        <h4 className="modal-title font-semibold text-3xl">{alertTitle}</h4>
                    </MDBRow>
                    <MDBRow className="my-6 pre-line-text">
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

export default ArtistPayment;
