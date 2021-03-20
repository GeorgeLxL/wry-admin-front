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
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBLink,
  MDBModal,
  MDBModalBody

} from 'mdbreact';

import Pagination from '@material-ui/lab/Pagination';
var axios = require('axios');
import SectionContainer from '../../components/sectionContainer';
const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;
class Dashboard_user_detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: '1',
      pageNumber:1,
      pageSize: 10,
      pageCount1:0,
      totalRecords1:0,
      pageCount2:0,
      totalRecords2:0,
      pageCount3:0,
      totalRecords3:0,
      totalRecords4:0,
      pageCount4:0,
      userName:"",
      userEmail:"",
      userStatus:"",
      editName:true,
      editEmail:true,
      editStatus:true,
      userID:"",
      selectAllPayperView:false,
      payperViewids:[],
      selectAllLiveTicket:false,
      liveTicketids:[],
      selectAllSubscription:false,
      subscriptionids:[],
      selectAllrefundHistory:false,
      refundhistoryids:[],
      alertModal:false,
      alertTitle:"",
      alertContent:"",
      basic_infor_data: {
        columns: [
          {
            field: 'Name',
          },
          {
            field: 'Content',
          },
          {
            field: 'Action',
          },
        ],
        rows:[],
      },
      
      payperview_history_data:{
           columns: [
          {
            label: <input type='checkbox' checked={false} onChange={this.selectAllPayperView}/>,
            field: 'checkbox'
          },
          {
            label:<span>Tran. Date<br/>and Time</span>,
            field: 'DateandTime',
          },
          {
            label:"Tran. ID",
            field: 'ID',
          },
          {
            label:"Trans. Status",
            field: 'Status',
          },
          {
            label:"Cont. ID",
            field: 'Cont_ID',
          },
          {
            label:"Cont. Name",
            field: 'Cont_Name',
          },
          {
            label:"Amount",
            field: 'Amount',
          },
          {
            label:"Action",
            field: 'Action',
          },
        ],
        rows:[],  
      },

      liveticket_history_data:{
        columns: [
       {
         label: <input type='checkbox' checked={false} onChange={this.selectAllLiveTicket}/>,
         field: 'checkbox'
       },
       {
         label:<span>Tran. Date<br/>and Time</span>,
         field: 'DateandTime',
       },
       {
         label:"Tran. ID",
         field: 'ID',
       },
       {
         label:"Trans. Status",
         field: 'Status',
       },
       {
         label:"Cont. ID",
         field: 'Cont_ID',
       },
       {
         label:"Cont. Name",
         field: 'Cont_Name',
       },
       {
         label:"Amount",
         field: 'Amount',
       },
       {
         label:"Action",
         field: 'Action',
       },
     ],
     rows:[],
      },
      subscription_history_data:{
        columns: [
          {
            label: <input type='checkbox' checked={false} onChange={this.selectAllSubscription}/>,
            field: 'checkbox'
          },
          {
            label:<span>Tran. Date<br/>and Time</span>,
            field: 'DateandTime',
          },
          {
            label:"Tran. ID",
            field: 'ID',
          },
          {
            label:"Trans. Status",
            field: 'Status',
          },
          {
            label:"Cont. ID",
            field: 'Cont_ID',
          },
          {
            label:"Cont. Name",
            field: 'Cont_Name',
          },
          {
            label:"Amount",
            field: 'Amount',
          },
          {
            label:"Action",
            field: 'Action',
          },
        ],
        rows:[],
      },
      refund_history_data:{
        columns: [
          {
            label: <input type='checkbox' checked={false} onChange={this.selectAllrefundHistory}/>,
            field: 'checkbox'
          },
          {
            label:<span>Ref. Date<br/>and Time</span>,
            field: 'DateandTime',
          },
          {
            label:"Ref ID",
            field: 'ID',
          },
          {
            label:"Ref Status",
            field: 'Status',
          },
          {
            label:"Trans. Id",
            field: 'TransId',
          },
          {
            label:"Subscription Id",
            field: 'SubscriptionId',
          },
          {
            label:"Content Type",
            field: 'ContentType',
          },
          {
            label:"Amount",
            field: 'Amount',
          },
          {
            label:"Action",
            field: 'Action',
          },
        ],
        rows:[],
      },

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

  handlePagenationpay = (events,PageNumber)=>{
    this.setState({
      pageNumber:PageNumber,
      selectAllPayperView:false,
      payperViewids:[],
    });
    const {id} = this.props.match.params;
    this.getpayperInfo(id,PageNumber,this.state.userID);
  }

  handlePagenationlive = (events,PageNumber)=>{
    this.setState({
      pageNumber:PageNumber,
      selectAllLiveTicket:false,
      liveTicketids:[]
    });
    const {id} = this.props.match.params;
    this.getliveticketInfo(id,PageNumber,this.state.userID);
  }

  handlePagenationsub = (events,PageNumber)=>{
    this.setState({
      pageNumber:PageNumber,
      selectAllSubscription:false,
      subscriptionids:[]
    });
    const {id} = this.props.match.params;
    this.getsubscriptionInfo(id,PageNumber,this.state.userID);
  }

  handlePagenationrefund = (events,PageNumber)=>{
    this.setState({
      pageNumber:PageNumber,
      selectAllrefundHistory:false,
      refundhistoryids:[]
    });
    const {id} = this.props.match.params;
    this.getrefundthistoryInfo(id,PageNumber,this.state.userID);
  }

  componentDidMount(){
    const {id} = this.props.match.params;
    this.getbasicInfo(id);

  }

  getbasicInfo(id){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var data = new Array();
    var config = {
        method: 'get',
        url: '${apiurl}/users/' + id,
        headers: { 
        'Authorization': 'Bearer ' + token,
    },
        data : {},
    };
    axios(config)
    .then((response) => { 
        var responsedata = response.data;
        for (const [key, value] of Object.entries(responsedata)) {
          var temp = {};
          switch(key)
          {
            case "id":
              temp.Name = "ID";
              temp.Content = value;
              temp.Action = "";
              this.setState({userID:value});
              this.getpayperInfo(id,1,value);
              this.getliveticketInfo(id,1,value);
              this.getsubscriptionInfo(id,1,value);
              this.getrefundthistoryInfo(id,1,value);

              break;
            case "username":
              this.setState({
                userName:value
              });
              temp.Name = "Name";
              temp.Content = <input className="editinput" disabled={this.state.editName} value={this.state.userName}/>
              temp.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Edit</MDBBtn>
              break;
            case "email":
              this.setState({
                userEmail:value
              });
              temp.Name = "Email";
              temp.Content = <input className="editinput" disabled={this.state.editEmail} value={this.state.userEmail}/>
              temp.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Edit</MDBBtn>
              break;
            case "registeredDate":
              temp.Name = "Registration Date";
              temp.Content = value;
              temp.Action = "";
              break;
            case "dateUpdated":
              temp.Name = "Last Update Date";
              temp.Content = value;
              temp.Action = "";
              break;
            case "profile":
              temp.Name = "Profile URL";
              temp.Content = <a href={value}>{value}</a>;
              temp.Action = "";
              break;
            case "status":
              this.setState({
                userStatus:value
              })
              temp.Name = "Status";
              temp.Content =<select className="statusSelect" value={this.state.userStatus} disabled={this.state.editStatus}>
                        <option value={1}>SendSignupConfirmationEmail</option>
                        <option value={2}>SendSignupConfirmationEmailWithKeys</option>
                        <option value={3}>ForConfirmation</option>
                        <option value={4}>ForgotPasswordRequest</option>
                        <option value={5}>ForgotPasswordEmailSent</option>
                        <option value={6}>ForgotPasswordConfirmed</option>
                        <option value={7}>Active</option>
                        <option value={8}>Inactive</option>
                    </select>
              temp.Action =<MDBBtn onClick={this.updateStatus} className="btn btnEdit" color='primary'>Edit</MDBBtn>
              break;
          }
          data.push(temp)

        }
        var basic_infor_data = this.state.basic_infor_data;
        basic_infor_data.rows = data;      
        this.setState({
          basic_infor_data:basic_infor_data
        });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var basic_infor_data = this.state.basic_infor_data;
                basic_infor_data.rows = {}; 
                this.setState({
                  basic_infor_data:basic_infor_data
                });
            }
        }
    });
  }

  getpayperInfo(id,pageNumber,userID){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    let {pageSize} = this.state;
   
    var data = new Array();
    var config = {
      method: 'get',
      url: `${apiurl}/purchases/users/` + id + '/pay_per_views',
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:{pageSize:pageSize,pageNumber:pageNumber}
    };    
    axios(config)
    .then((response) => {
      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      var responsedata = response.data.payPerViews;
     
      responsedata.forEach(item => {
          var temp={};
          var {payperViewids} = this.state;
          var index = payperViewids.indexOf(item.transaction.payperviewId);
          if(index==-1)
          {
            temp.checkbox = <input type='checkbox' checked={false} onChange={this.changePayperView2Download(item.transaction.payperviewId)}/>;
          }
          else
          {
            temp.checkbox = <input type='checkbox' checked={true} onChange={this.changePayperView2Download(item.transaction.payperviewId)}/>;
          }
          temp.DateandTime = item.transaction.date;
          temp.ID = item.transaction.payperviewId;
          temp.Status = item.transaction.status;
          temp.Cont_ID = item.video.id;
          temp.Cont_Name = item.video.title;
          temp.Amount = item.transaction.amount;
          temp.Action = <MDBLink className="showdetail" to={`/admin/userTransaction/detail/${item.transaction.payperviewId} ${userID} PayPerview null ${3}`}>Show detail</MDBLink> 
          
          data.push(temp);
      });
      var payperview_history_data = this.state.payperview_history_data;
      var columns = payperview_history_data.columns;
      var temp = columns[0];
      temp.label = <input type='checkbox' id='all' checked={false} onChange={this.selectAllPayperView}/>
      columns[0] = temp;
      payperview_history_data.columns = columns
      payperview_history_data.rows = data;
      
      this.setState({
        pageCount1: pageCount,
        totalRecords1:totalRecords,
        payperview_history_data:payperview_history_data
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var payperview_history_data = this.state.payperview_history_data;
                payperview_history_data.rows = {}; 
                this.setState({
                  pageCount: 0,
                  totalRecords:0,
                  payperview_history_data:payperview_history_data
                });
            }
        }
    });
  }

  getliveticketInfo(id,pageNumber,userID){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    let {pageSize} = this.state;
    
    var data = new Array();
    var config = {
      method: 'get',
      url: `${apiurl}/purchases/users/` + id + '/live_tickets',
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:{pageSize:pageSize,pageNumber:pageNumber}
    };    
    axios(config)
    .then((response) => {
      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      var responsedata = response.data.liveTickets;
    
      responsedata.forEach(item => {
          var temp={};
          var {liveTicketids} = this.state;
          var index = liveTicketids.indexOf(item.transaction.liveTicketId);
          if(index==-1)
          {
            temp.checkbox = <input type='checkbox' checked={false} onChange={this.changeLiveTicket2Download(item.transaction.liveTicketId)}/>;
          }
          else
          {
            temp.checkbox = <input type='checkbox' checked={true} onChange={this.changeLiveTicket2Download(item.transaction.liveTicketId)}/>;
          }         
          temp.DateandTime = item.transaction.date;
          temp.ID = item.transaction.liveTicketId;
          temp.Status = item.transaction.status;
          temp.Cont_ID = item.live.id;
          temp.Cont_Name = item.live.liveName;
          temp.Amount = item.transaction.amount;
          temp.Action = <MDBLink className="showdetail" to={`/admin/userTransaction/detail/${item.transaction.liveTicketId} LiveTicket null ${userID} ${3}`}>Show detail</MDBLink> 
          data.push(temp);   
      });
      var liveticket_history_data = this.state.liveticket_history_data;
      var columns = liveticket_history_data.columns;
      var temp = columns[0];
      temp.label = <input type='checkbox' id='all' checked={false} onChange={this.selectAllLiveTicket}/>
      columns[0] = temp;
      liveticket_history_data.columns = columns
      liveticket_history_data.rows = data;

      this.setState({
        pageCount2: pageCount,
        totalRecords2:totalRecords,
        liveticket_history_data:liveticket_history_data
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var liveticket_history_data = this.state.liveticket_history_data;
                liveticket_history_data.rows = {}; 
                this.setState({
                  pageCount2: 0,
                  totalRecords2:0,
                  liveticket_history_data:liveticket_history_data
                });
            }
        }
    });
  
  }

  getsubscriptionInfo(id,pageNumber,userID){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    let {pageSize} = this.state;
    var data = new Array();
    var config = {
      method: 'get',
      url: `${apiurl}/purchases/users/` + id + '/subscriptions',
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:{pageSize:pageSize,pageNumber:pageNumber}
    };    
    axios(config)
    .then((response) => {
      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      var responsedata = response.data.subscriptions;
      console.log(responsedata);
      responsedata.forEach(item => {
          var temp={};
          var {subscriptionids} = this.state;
          var index = subscriptionids.indexOf(item.transaction.subscriptionId);
          if(index==-1)
          {
            temp.checkbox = <input type='checkbox' checked={false} onChange={this.changeSubscription2Download(item.transaction.subscriptionId)}/>;
          }
          else
          {
            temp.checkbox = <input type='checkbox' checked={true} onChange={this.changeSubscription2Download(item.transaction.subscriptionId)}/>;
          }
          temp.DateandTime = item.transaction.date;
          temp.ID = item.transaction.subscriptionId;
          temp.Status = item.transaction.status;
          temp.Cont_ID = item.artist.id;
          temp.Cont_Name = item.artist.username;
          temp.Amount = item.transaction.amount;
          temp.Action = <MDBLink className="showdetail" to={`/admin/userTransaction/detail/${item.transaction.subscriptionId} ${userID} Subscription ${item.transaction.subscriptionId} ${3}`}>Show detail</MDBLink> 
          data.push(temp);   
      });
      var subscription_history_data = this.state.subscription_history_data;
      var columns = subscription_history_data.columns;
      var temp = columns[0];
      temp.label = <input type='checkbox' id='all' checked={false} onChange={this.selectAllSubscription}/>
      columns[0] = temp;
      subscription_history_data.columns = columns
      subscription_history_data.rows = data;
      this.setState({
        pageCount3: pageCount,
        totalRecords3:totalRecords,
        subscription_history_data:subscription_history_data
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var subscription_history_data = this.state.subscription_history_data;
                subscription_history_data.rows = {}; 
                this.setState({
                  pageCount3: 0,
                  totalRecords3:0,
                  subscription_history_data:subscription_history_data
                });
            }
        }
    });
  
  }

  getrefundthistoryInfo(id,pageNumber,userID){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var pageCount, totalRecords;
    let {pageSize} = this.state;
    var data = new Array();
    var config = {
      method: 'get',
      url: `${apiurl}/transactions/users/${id}/refund_history`,
      headers: { 
        'Authorization': 'Bearer ' + token,
    },
      data : {},
      params:{pageSize:pageSize,pageNumber:pageNumber}
    };    
    axios(config)
    .then((response) => {
      console.log(response)
      pageCount = response.data.pageCount;
      totalRecords = response.data.totalRecords;
      var responsedata = response.data.refunds;
     
      responsedata.forEach(item => {
          var temp={};
          var {refundhistoryids} = this.state;
          var index = refundhistoryids.indexOf(item.id);
          if(index==-1)
          {
            temp.checkbox = <input type='checkbox' checked={false} onChange={this.changeRefundHistory2Download(item.id)}/>;
          }
          else
          {
            temp.checkbox = <input type='checkbox' checked={true} onChange={this.changeRefundHistory2Download(item.id)}/>;
          }
        
          temp.DateandTime = item.dateCreated;
          temp.ID = item.id;
          temp.Status = item.status;
          temp.TranId = item.transactionId;
          temp.SubscriptionId = !isNaN(item.subscriptionId)?item.subscriptionId:"";
          temp.ContentType = item.contentType;
          temp.Amount = item.amount;
          temp.Action = <MDBLink className="showdetail" to={`/admin/userTransaction/detail/${item.transactionId} ${userID} Refund ${item.subscriptionId} ${3}`}>Show detail</MDBLink> 
          data.push(temp);   
      });
      var refund_history_data = this.state.refund_history_data;
      var columns = refund_history_data.columns;
      var temp = columns[0];
      temp.label = <input type='checkbox' id='all' checked={false} onChange={this.selectAllrefundHistory}/>
      columns[0] = temp;
      refund_history_data.columns = columns
      refund_history_data.rows = data;
      this.setState({
        pageCount4: pageCount,
        totalRecords4:totalRecords,
        refund_history_data:refund_history_data,
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var refund_history_data = this.state.refund_history_data;
                refund_history_data.rows = {}; 
                this.setState({
                  pageCount4: 0,
                  totalRecords4:0,
                  refund_history_data:refund_history_data
                });
            }
        }
    });
  
  }

  updateName=(event)=>{
    var basic_infor_data = this.state.basic_infor_data;
    var status = this.state.editName;
    var item,index;

    for(var i=0; i<basic_infor_data.rows.length;i++)
    {
      if(basic_infor_data.rows[i].Name=="Name")
      {
        index = i;
        item = basic_infor_data.rows[i];
        break;
      }   
    }

    if(status){
      item.Content = <input className="editinput" onChange={this.handleName} disabled={!this.state.editName} maxLength={20} value={this.state.userName}/>
      item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Save</MDBBtn>
      basic_infor_data.rows[index] = item;
      this.setState({
        basic_infor_data:basic_infor_data,
        editName:!this.state.editName
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Username', this.state.userName);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/users/` + id + "/update/user_name",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        item.Content = <input className="editinput" onChange={this.handleName} disabled={!this.state.editName} maxLength={20} value={this.state.userName}/>
        item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        basic_infor_data.rows[index] = item;
        this.setState({
          basic_infor_data:basic_infor_data,
          editName:!this.state.editName
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        item.Content = <>
                        <input className="editinput" onChange={this.handleName} disabled={this.state.editName} maxLength={20} value={this.state.userName}/>
                        <div className="error">{error.response.data.errors.Username?error.response.data.errors.Username.message:""}</div>
                      </>
        item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Save</MDBBtn>
        basic_infor_data.rows[index] = item;
        this.setState({
          basic_infor_data:basic_infor_data
        });
      });
    }

  }

  handleName=(event)=>{
    var basic_infor_data = this.state.basic_infor_data;
    var item,index;
    for(var i=0; i<basic_infor_data.rows.length;i++)
    {
      if(basic_infor_data.rows[i].Name=="Name")
      {
        index = i;
        item = basic_infor_data.rows[i];
        break;
      }   
    }
    var value=(event.target.value).slice(0,20);
    item.Content = <input className="editinput" onChange={this.handleName} disabled={this.state.editName} value={value}/>
   
    basic_infor_data.rows[index] = item;
    this.setState({
      userName:value,
      basic_infor_data:basic_infor_data
    });
  }

  updateEmail=(event)=>{
    var basic_infor_data = this.state.basic_infor_data;
    var status = this.state.editEmail;
    var item,index;

    for(var i=0; i<basic_infor_data.rows.length;i++)
    {
      if(basic_infor_data.rows[i].Name=="Email")
      {
        index = i;
        item = basic_infor_data.rows[i];
        break;
      }   
    }

    if(status){
      item.Content = <input className="editinput" onChange={this.handleEmail} disabled={!this.state.editEmail} value={this.state.userEmail}/>
      item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Save</MDBBtn>
      basic_infor_data.rows[index] = item;
      this.setState({
        basic_infor_data:basic_infor_data,
        editEmail:!this.state.editEmail
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Email', this.state.userEmail);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/users/` + id + "/update/email",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        item.Content = <input className="editinput" onChange={this.handleEmail} disabled={!this.state.editEmail} value={this.state.userEmail}/>
        item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        basic_infor_data.rows[index] = item;
        this.setState({
          basic_infor_data:basic_infor_data,
          editEmail:!this.state.editEmail
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        item.Content =<>
                         <input className="editinput" onChange={this.handleEmail} disabled={this.state.editEmail} value={this.state.userEmail}/>
                         <div className="error">{error.response.data.errors.Email?error.response.data.errors.Email.message:""}</div>
                      </>
        item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Save</MDBBtn>
        basic_infor_data.rows[index] = item;
        this.setState({
          basic_infor_data:basic_infor_data
        });
      });
    }

  }

  handleEmail=(event)=>{
    var basic_infor_data = this.state.basic_infor_data;
    var item,index;
    for(var i=0; i<basic_infor_data.rows.length;i++)
    {
      if(basic_infor_data.rows[i].Name=="Email")
      {
        index = i;
        item = basic_infor_data.rows[i];
        break;
      }   
    }
    item.Content = <input className="editinput" onChange={this.handleEmail} disabled={this.state.editEmail} value={event.target.value}/>
   
    basic_infor_data.rows[index] = item;
    this.setState({
      userEmail:event.target.value,
      basic_infor_data:basic_infor_data
    });
  }

  updateStatus=(event)=>{

    var basic_infor_data = this.state.basic_infor_data;
    var status = this.state.editStatus;
    var item,index;

    for(var i=0; i<basic_infor_data.rows.length;i++)
    {
      if(basic_infor_data.rows[i].Name=="Status")
      {
        index = i;
        item = basic_infor_data.rows[i];
        break;
      }   
    }
    if(status){
      item.Content = <select value={this.state.userStatus} disabled={!this.state.editStatus} onChange={this.handleStatus}>
                        <option value={1}>SendSignupConfirmationEmail</option>
                        <option value={2}>SendSignupConfirmationEmailWithKeys</option>
                        <option value={3}>ForConfirmation</option>
                        <option value={4}>ForgotPasswordRequest</option>
                        <option value={5}>ForgotPasswordEmailSent</option>
                        <option value={6}>ForgotPasswordConfirmed</option>
                        <option value={7}>Active</option>
                        <option value={8}>Inactive</option>
                      </select>
      item.Action = <MDBBtn onClick={this.updateStatus} className="btn btnEdit" color='primary'>Save</MDBBtn>
      basic_infor_data.rows[index] = item;
      this.setState({
        basic_infor_data:basic_infor_data,
        editStatus:!this.state.editStatus
      });
    }
    else{
      const {id} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Status', this.state.userStatus);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/users/` + id + "/update/status",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        item.Content = <select value={this.state.userStatus} disabled={!this.state.editStatus} onChange={this.handleStatus}>
                        <option value={1}>SendSignupConfirmationEmail</option>
                        <option value={2}>SendSignupConfirmationEmailWithKeys</option>
                        <option value={3}>ForConfirmation</option>
                        <option value={4}>ForgotPasswordRequest</option>
                        <option value={5}>ForgotPasswordEmailSent</option>
                        <option value={6}>ForgotPasswordConfirmed</option>
                        <option value={7}>Active</option>
                        <option value={8}>Inactive</option>
                      </select>
        item.Action = <MDBBtn onClick={this.updateStatus} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        basic_infor_data.rows[index] = item;
        this.setState({
        basic_infor_data:basic_infor_data,
        editStatus:!this.state.editStatus
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        item.Content =<><select value={this.state.userStatus} disabled={this.state.editStatus} onChange={this.handleStatus}>
                          <option value={1}>SendSignupConfirmationEmail</option>
                          <option value={2}>SendSignupConfirmationEmailWithKeys</option>
                          <option value={3}>ForConfirmation</option>
                          <option value={4}>ForgotPasswordRequest</option>
                          <option value={5}>ForgotPasswordEmailSent</option>
                          <option value={6}>ForgotPasswordConfirmed</option>
                          <option value={7}>Active</option>
                          <option value={8}>Inactive</option>
                        </select>
                        <div className="error">Invalid Status</div></>
        item.Action = <MDBBtn onClick={this.updateStatus} className="btn btnEdit" color='primary'>Save</MDBBtn>
        basic_infor_data.rows[index] = item;
        this.setState({
        basic_infor_data:basic_infor_data
        });
      });
    }

  }

  handleStatus=(event)=>{
    var basic_infor_data = this.state.basic_infor_data;
    var item,index;
    for(var i=0; i<basic_infor_data.rows.length;i++)
    {
      if(basic_infor_data.rows[i].Name=="Status")
      {
        index = i;
        item = basic_infor_data.rows[i];
        break;
      }   
    }
    item.Content = <select value={event.target.value} disabled={!this.state.editStatus} onChange={this.handleStatus}>
                        <option value={1}>SendSignupConfirmationEmail</option>
                        <option value={2}>SendSignupConfirmationEmailWithKeys</option>
                        <option value={3}>ForConfirmation</option>
                        <option value={4}>ForgotPasswordRequest</option>
                        <option value={5}>ForgotPasswordEmailSent</option>
                        <option value={6}>ForgotPasswordConfirmed</option>
                        <option value={7}>Active</option>
                        <option value={8}>Inactive</option>
                      </select>
    basic_infor_data.rows[index] = item;
    this.setState({
      userStatus:event.target.value,
      basic_infor_data:basic_infor_data
    });
  }

selectAllPayperView  = event => {
  const {payperview_history_data, selectAllPayperView } = this.state;
  var columns = payperview_history_data.columns;
  var data = payperview_history_data.rows;
  var temp = columns[0];
  temp.label = <input type='checkbox' id='all' checked={!selectAllPayperView} onChange={this.selectAllPayperView}/>
  columns[0] = temp;
    
  for(var i=0;i<data.length; i++)
  {
    data[i].checkbox= <input type='checkbox' checked={!selectAllPayperView} onChange={this.changePayperView2Download(data[i].ID)}/>;
  }
  payperview_history_data.columns = columns;
  payperview_history_data.rows = data;
  this.setState({
    payperview_history_data:payperview_history_data,
    selectAllPayperView:!this.state.selectAllPayperView,
    payperViewids:[],
  })
}

changePayperView2Download = id => event =>{
  const {payperview_history_data, selectAllPayperView, payperViewids} = this.state;
  var data = payperview_history_data.rows;
  if(selectAllPayperView) return;
  for(var i=0;i<data.length; i++)
  {
      if(data[i].ID == id){
          
          var index = payperViewids.indexOf(id);
          if(index==-1)
          {
            payperViewids.push(id);
              data[i].checkbox= <input type='checkbox' checked={selectAllPayperView|true} onChange={this.changePayperView2Download(data[i].ID)}/>;
          }
          else
          {
            payperViewids.splice(index,1);
              data[i].checkbox= <input type='checkbox' checked={selectAllPayperView|false} onChange={this.changePayperView2Download(data[i].ID)}/>;
          }   
      }
  }
  payperview_history_data.rows = data;
    this.setState({
    payperview_history_data:payperview_history_data,
    payperViewids:payperViewids
    })
}


selectAllrefundHistory = event=>{
  const {refund_history_data, selectAllrefundHistory } = this.state;
  var columns = refund_history_data.columns;
  var data = refund_history_data.rows;
  var temp = columns[0];
  temp.label = <input type='checkbox' id='all' checked={!selectAllrefundHistory} onChange={this.selectAllrefundHistory}/>
  columns[0] = temp;
    
  for(var i=0;i<data.length; i++)
  {
    data[i].checkbox= <input type='checkbox' checked={!selectAllrefundHistory} onChange={this.changeRefundHistory2Download(data[i].ID)}/>;
  }
  refund_history_data.columns = columns;
  refund_history_data.rows = data;
  this.setState({
    refund_history_data:refund_history_data,
    selectAllrefundHistory:!this.state.selectAllrefundHistory,
    refundhistoryids:[],
  })
}
changeRefundHistory2Download = id =>event =>{
  const {refund_history_data, selectAllrefundHistory, refundhistoryids} = this.state;
  var data = refund_history_data.rows;
  if(selectAllrefundHistory) return;
  for(var i=0;i<data.length; i++)
  {
      if(data[i].ID == id){
          
          var index = refundhistoryids.indexOf(id);
          if(index==-1)
          {
            refundhistoryids.push(id);
              data[i].checkbox= <input type='checkbox' checked={selectAllrefundHistory|true} onChange={this.changeRefundHistory2Download(data[i].ID)}/>;
          }
          else
          {
            refundhistoryids.splice(index,1);
              data[i].checkbox= <input type='checkbox' checked={selectAllrefundHistory|false} onChange={this.changeRefundHistory2Download(data[i].ID)}/>;
          }   
      }
  }
  refund_history_data.rows = data;
   this.setState({
    refund_history_data:refund_history_data,
    refundhistoryids:refundhistoryids
   })
   console.log(refundhistoryids)
}


selectAllLiveTicket = event =>{
    const {liveticket_history_data, selectAllLiveTicket } = this.state;
    var columns = liveticket_history_data.columns;
    var data = liveticket_history_data.rows;
    var temp = columns[0];
    temp.label = <input type='checkbox' id='all' checked={!selectAllLiveTicket} onChange={this.selectAllLiveTicket}/>
    columns[0] = temp;
      
    for(var i=0;i<data.length; i++)
    {
      data[i].checkbox= <input type='checkbox' checked={!selectAllLiveTicket} onChange={this.changeLiveTicket2Download(data[i].ID)}/>;
    }
    liveticket_history_data.columns = columns;
    liveticket_history_data.rows = data;
    this.setState({
      liveticket_history_data:liveticket_history_data,
      selectAllLiveTicket:!this.state.selectAllLiveTicket,
      liveTicketids:[]
    })
}
changeLiveTicket2Download = id => event =>{
  const {liveticket_history_data, selectAllLiveTicket, liveTicketids} = this.state;
  var data = liveticket_history_data.rows;
  if(selectAllLiveTicket) return;
  for(var i=0;i<data.length; i++)
  {
      if(data[i].ID == id){
          
          var index = liveTicketids.indexOf(id);
          if(index==-1)
          {
            liveTicketids.push(id);
              data[i].checkbox= <input type='checkbox' checked={selectAllLiveTicket|true} onChange={this.changeLiveTicket2Download(data[i].ID)}/>;
          }
          else
          {
            liveTicketids.splice(index,1);
              data[i].checkbox= <input type='checkbox' checked={selectAllLiveTicket|false} onChange={this.changeLiveTicket2Download(data[i].ID)}/>;
          }   
      }
  }
  liveticket_history_data.rows = data;
   this.setState({
    liveticket_history_data:liveticket_history_data,
    liveTicketids:liveTicketids
   })
   console.log(liveTicketids)
}



selectAllSubscription = event =>{
    const {subscription_history_data, selectAllSubscription } = this.state;
    var columns = subscription_history_data.columns;
    var data = subscription_history_data.rows;
    var temp = columns[0];
    temp.label = <input type='checkbox' id='all' checked={!selectAllSubscription} onChange={this.selectAllSubscription}/>
    columns[0] = temp;
      
    for(var i=0;i<data.length; i++)
    {
      data[i].checkbox= <input type='checkbox' checked={!selectAllSubscription} onChange={this.changeSubscription2Download(data[i].ID)}/>;
    }
    subscription_history_data.columns = columns;
    subscription_history_data.rows = data;
    this.setState({
      subscription_history_data:subscription_history_data,
      selectAllSubscription:!this.state.selectAllSubscription,
      subscriptionids:[],
    })
}


changeSubscription2Download = id => event =>{
  const {subscription_history_data, selectAllSubscription, subscriptionids} = this.state;
  var data = subscription_history_data.rows;
  if(selectAllSubscription) return;
  for(var i=0;i<data.length; i++)
  {
      if(data[i].ID == id){
          
          var index = subscriptionids.indexOf(id);
          if(index==-1)
          {
            subscriptionids.push(id);
              data[i].checkbox= <input type='checkbox' checked={selectAllSubscription|true} onChange={this.changeSubscription2Download(data[i].ID)}/>;
          }
          else
          {
            subscriptionids.splice(index,1);
              data[i].checkbox= <input type='checkbox' checked={selectAllSubscription|false} onChange={this.changeSubscription2Download(data[i].ID)}/>;
          }   
      }
  }
  subscription_history_data.rows = data;
   this.setState({
    subscription_history_data:subscription_history_data,
    subscriptionids:subscriptionids
   })

}

csvDownloadPayperViewHistory = event => {
  const {selectAllPayperView,payperViewids}=this.state;
  var userData = JSON.parse(localStorage.userData);
  var token = userData.admin.token;
  const id = this.state.userID
    var data;       
    var config;
    var data;
     if(selectAllPayperView || payperViewids.length==0)
     { 
     
      var config = {
            method: 'post',
            url: `${apiurl}/purchases/users/${id}/pay_per_views/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : ""
          };
      }
      else
      {
         var PayPerViews=[];
         payperViewids.forEach(item=>{
             var temp={};
             temp.Id = item;
             PayPerViews.push(temp);
         })
         data = JSON.stringify({"PayPerViews":PayPerViews}); 
         config = {
            method: 'post',           
            url: `${apiurl}/purchases/users/${id}/pay_per_views/csv_download_selected`,
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

csvDownloadLiveTicketHistory = event => {
  const {selectAllLiveTicket,liveTicketids}=this.state;
  var userData = JSON.parse(localStorage.userData);
  var token = userData.admin.token;
  const id = this.state.userID

    var data;       
    var config;
    var data;
     if(selectAllLiveTicket || liveTicketids.length==0)
     { 
      data = JSON.stringify({"":""});   
      var config = {
            method: 'post',
            url: `${apiurl}/purchases/users/${id}/live_tickets/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : ""
          };
      }
      else
      {
         var LiveTickets=[];
         liveTicketids.forEach(item=>{
             var temp={};
             temp.Id = item;
             LiveTickets.push(temp);
         })
         data = JSON.stringify({"LiveTickets":LiveTickets}); 
         config = {
            method: 'post',           
            url: `${apiurl}/purchases/users/${id}/live_tickets/csv_download_selected`,
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

csvDownloadSubscription = event => {
  const {selectAllSubscription,subscriptionids}=this.state;
  var userData = JSON.parse(localStorage.userData);
  var token = userData.admin.token;
  const id = this.state.userID

    var data;       
    var config;
    var data;
     if(selectAllSubscription || subscriptionids.length==0)
     { 
      var config = {
            method: 'post',
            url: `${apiurl}/purchases/users/${id}/subscriptions/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : ""
          };
      }
      else
      {
         var Subscriptions=[];
         subscriptionids.forEach(item=>{
             var temp={};
             temp.Id = item;
             Subscriptions.push(temp);
         })
         data = JSON.stringify({"Subscriptions":Subscriptions}); 
         config = {
            method: 'post',           
            url: `${apiurl}/purchases/users/${id}/subscriptions/csv_download_selected`,
           
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

csvDownloadrefundHistory = event => {
  const {selectAllrefundHistory,refundhistoryids}=this.state;
  var userData = JSON.parse(localStorage.userData);
  var token = userData.admin.token;
  const id = this.state.userID

    var data;       
    var config;
    var data;
     if(selectAllrefundHistory || refundhistoryids.length==0)
     { 
      var config = {
            method: 'post',
            url: `${apiurl}/transactions/users/${id}/refund_history/csv_download`,
            headers: { 
             'Authorization': 'Bearer ' + token,
             'Content-Type': 'application/json'
            },
            data : ""
          };
      }
      else
      {
         var Refunds=[];
         refundhistoryids.forEach(item=>{
             var temp={};
             temp.Id = item;
             Refunds.push(temp);
         })
         data = JSON.stringify({"Refunds":Refunds}); 
         config = {
            method: 'post',           
            url: `${apiurl}/transactions/users/${id}/refund_history/csv_download_selected`,
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
    const {alertModal,alertTitle,alertContent, activeItem,basic_infor_data, payperview_history_data,liveticket_history_data, subscription_history_data, refund_history_data, pageCount1, pageCount2,pageCount3,pageCount4} = this.state;
    return (
        <MDBContainer className="maincontainer">
          <span style={{color:'blue'}}>Purchases Per User List &gt;</span><span>  Detail</span>
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
                    Basic Information
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
                    PayPerView
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink
                    link
                    to='#'
                    active={activeItem === '3'}
                    onClick={this.toggle('3')}
                    role='tab'
                    >
                    LiveTicket
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink
                    link
                    to='#'
                    active={activeItem === '4'}
                    onClick={this.toggle('4')}
                    role='tab'
                    >
                    Subscription
                    </MDBNavLink>
                </MDBNavItem>
                <MDBNavItem>
                    <MDBNavLink
                    link
                    to='#'
                    active={activeItem === '5'}
                    onClick={this.toggle('5')}
                    role='tab'
                    >
                    Refund
                    </MDBNavLink>
                </MDBNavItem>
                </MDBNav>
                <MDBTabContent activeItem={activeItem}>
                <MDBTabPane tabId='1' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                            <h4>Basic Information</h4>                     
                    </MDBCol>
                    <MDBCol sm="12">
                    <MDBTable striped>
                        <MDBTableBody rows={basic_infor_data.rows} />
                    </MDBTable>
                    </MDBCol>                  

                </MDBTabPane>
                <MDBTabPane tabId='2' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                        <MDBCol sm="6" style={{ padding:'0px' }} >
                            <h4>PayPerView History</h4>
                        </MDBCol> 
                        <MDBCol sm="6" style={{ padding:'0px' }}>
                            <MDBBtn className="btn downloadbtn" color='primary' onClick={this.csvDownloadPayperViewHistory}>CSV Download</MDBBtn>
                        </MDBCol> 
                    </MDBCol>

                    <MDBCol sm="12">
                      <MDBTable className="artist-records" responsive striped>
                        <MDBTableHead columns={payperview_history_data.columns} />
                        {payperview_history_data.rows.length ? <MDBTableBody rows={payperview_history_data.rows} /> :<MDBTableBody />}
                        {payperview_history_data.rows.length?"":<caption className="noresult">No result found</caption>}
                      </MDBTable>
                    </MDBCol>
                    <MDBCol className="pagination">
                            <Pagination className="paginationitem" count={pageCount1} onChange={this.handlePagenationpay} variant="outlined" color="primary" />
                            <MDBCol className="pageCountarea">
                            </MDBCol>
                    </MDBCol>
                </MDBTabPane>
      
                <MDBTabPane tabId='3' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                        <MDBCol sm="6" style={{ padding:'0px' }} >
                            <h4>LiveTicket History</h4>
                        </MDBCol> 
                        <MDBCol sm="6" style={{ padding:'0px' }}>
                            <MDBBtn className="btn downloadbtn" color='primary' onClick={this.csvDownloadLiveTicketHistory}>CSV Download</MDBBtn>
                        </MDBCol> 
                    </MDBCol>

                    <MDBCol sm="12">
                      <MDBTable className="artist-records" striped>
                        <MDBTableHead columns={liveticket_history_data.columns} />
                        {liveticket_history_data.rows.length ? <MDBTableBody rows={liveticket_history_data.rows} /> :<MDBTableBody />}
                        {liveticket_history_data.rows.length?"":<caption className="noresult">No result found</caption>}
                      </MDBTable>
                    </MDBCol>
                    <MDBCol className="pagination">
                          <Pagination className="paginationitem" count={pageCount2} onChange={this.handlePagenationlive} variant="outlined" color="primary" />
                          <MDBCol className="pageCountarea">
                          </MDBCol>
                    </MDBCol>
                </MDBTabPane>
                
                <MDBTabPane tabId='4' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                        <MDBCol sm="6" style={{ padding:'0px' }} >
                            <h4>Subscription History</h4>
                        </MDBCol> 
                        <MDBCol sm="6" style={{ padding:'0px' }}>
                            <MDBBtn className="btn downloadbtn" color='primary' onClick={this.csvDownloadSubscription}>CSV Download</MDBBtn>
                        </MDBCol> 
                    </MDBCol>

                    <MDBCol sm="12">
                      <MDBTable className="artist-records" striped>
                        <MDBTableHead columns={subscription_history_data.columns} />
                        {subscription_history_data.rows.length ? <MDBTableBody rows={subscription_history_data.rows} /> :<MDBTableBody />}
                        {subscription_history_data.rows.length?"":<caption className="noresult">No result found</caption>}
                      </MDBTable>
                    </MDBCol>
                    <MDBCol className="pagination">
                        <Pagination className="paginationitem" count={pageCount3} onChange={this.handlePagenationsub} variant="outlined" color="primary" />
                        <MDBCol className="pageCountarea">
                        </MDBCol>
                    </MDBCol>
                </MDBTabPane>
                <MDBTabPane tabId='5' role='tabpanel' className="refund-history">
                    <MDBCol sm="12" className="cardheader">
                        <MDBCol sm="6" style={{ padding:'0px' }} >
                            <h4>Refund History</h4>
                        </MDBCol> 
                        <MDBCol sm="6" style={{ padding:'0px' }}>
                            <MDBBtn className="btn downloadbtn" color='primary' onClick={this.csvDownloadrefundHistory}>CSV Download</MDBBtn>
                        </MDBCol> 
                    </MDBCol>

                    <MDBCol sm="12">
                      <MDBTable className="artist-records" striped>
                        <MDBTableHead columns={refund_history_data.columns} />
                        {refund_history_data.rows.length ? <MDBTableBody rows={refund_history_data.rows} /> :<MDBTableBody />}
                        {refund_history_data.rows.length?"":<caption className="noresult">No result found</caption>}
                      </MDBTable>
                    </MDBCol>
                    <MDBCol className="pagination">
                        <Pagination className="paginationitem" count={pageCount4} onChange={this.handlePagenationrefund} variant="outlined" color="primary" />
                        <MDBCol className="pageCountarea">
                        </MDBCol>
                    </MDBCol>
                </MDBTabPane>
                </MDBTabContent>
            </MDBCardBody>
            </MDBCard> 
            </SectionContainer>
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

export default Dashboard_user_detail;
