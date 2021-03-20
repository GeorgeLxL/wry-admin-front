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
  MDBModal,
  MDBModalBody,
  MDBNavbarNav,


} from 'mdbreact';
import Pagination from '@material-ui/lab/Pagination';

import SectionContainer from '../../components/sectionContainer';
var axios =require('axios');

const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;
class User_transaction_detail extends Component {
  state = {
    activeItem: "",
    userName:"",
    userEmail:"",
    userStatus:"",
    editName:true,
    editEmail:true,
    editStatus:true,
    alertContent:"",
    alertTitle:"",
    alertModal:false,
    confirmModal:false,
    confirmTitle:"",
    confirmContent:"",
    artistName:"",
    UserId:"",
    StartDate:"",
    EndDate:"",
    TransactionStatus:"",
    ContentType:"",
    PageSize:20,
    PageNumber:1,
    user_infor_data: {
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
    content_artist_detail: {
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
    transaction_detail_data: {
      columns: [
        {
          field: 'Name',
          attributes: {
            'aria-controls': 'DataTable',
            'aria-label': 'RegiDate',
          },
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

  };

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

  componentDidMount(){
    const {id,userid, tabid} = this.props.match.params;
    this.getuserinfo(userid);
    this.getContentArtistinfo(id);
    this.getTransctioninfo(id);
    this.setState({
      activeItem:tabid
    })
    
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
      var temp = {};          
      temp.Name = "Transaction ID";
      temp.Content = responsedata.id;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "Transaction Type";
      temp.Content = responsedata.type;
      temp.Action = ""
      data.push(temp);
      var temp = {};
      temp.Name = "Transaction Status";
      temp.Content = responsedata.status;
      temp.Action = "";
      data.push(temp);
      this.setState({TransactionStatus:responsedata.status});
      var temp = {};
      temp.Name = "Transaction Date";
      temp.Content = responsedata.transactionDate;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "Transaction Amount";
      temp.Content =  responsedata.amount;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "Paypal Transaction ID";
      temp.Content = responsedata.paypalTransactionId;
      temp.Action = "";
      data.push(temp);
      var transaction_detail_data = this.state.transaction_detail_data;
      transaction_detail_data.rows = data;      
      this.setState({
        transaction_detail_data:transaction_detail_data
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
                
            }
            else{
                var transaction_detail_data = this.state.transaction_detail_data;
                transaction_detail_data.rows = {}; 
                this.setState({
                  transaction_detail_data:transaction_detail_data
                });
            }
        }
    });
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
        var content = responsedata.content;
        console.log(content);
        var temp = {};          
        temp.Name = "Content ID";
        temp.Content = content.id;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Content Name";
        temp.Content = content.name;
        temp.Action = ""
        data.push(temp);
        var temp = {};
        temp.Name = "Content Type";
        temp.Content = content.type;
        temp.Action = "";
        data.push(temp);
        this.setState({contentType:content.type})
        var temp = {};
        temp.Name = "Content Status";
        temp.Content = content.status;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Content URL";
        console.log(content)
        temp.Content = <a href={content.url}>{content.url}</a>
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Content Amount";
        temp.Content = content.amount;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Content Registration Date";
        temp.Content = content.registeredDate;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Content Final Update Date";
        temp.Content = content.dateUpdated;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Artist ID";
        temp.Content = artistData.id;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Artist Name";
        temp.Content = artistData.name;
        temp.Action = "";
        data.push(temp);
        this.setState({artistName:artistData.name});
        var temp = {};
        temp.Name = "Artist Email";
        temp.Content = artistData.email;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Artist Status";
        temp.Content = artistData.status;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Artist Profile URL";
        temp.Content = <a href={artistData.profile}>{artistData.profile}</a>;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Artist Registration Date";
        temp.Content = artistData.registeredDate;
        temp.Action = "";
        data.push(temp);
        var temp = {};
        temp.Name = "Artist Final Update Date";
        temp.Content = artistData.dateUpdated;
        temp.Action = "";
        data.push(temp);
        var content_artist_detail = this.state.content_artist_detail;
        content_artist_detail.rows = data;      
        this.setState({
          content_artist_detail:content_artist_detail
        });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var content_artist_detail = this.state.content_artist_detail;
                content_artist_detail.rows = {}; 
                this.setState({
                  content_artist_detail:content_artist_detail
                });
            }
        }
    });
  }

  getuserinfo(id)
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var data = new Array();
    var config = {
        method: 'get',
        url: `${apiurl}/users/` + id,
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
              this.setState({UserId:value});
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
          }
          data.push(temp)

        }
        var user_infor_data = this.state.user_infor_data;
        user_infor_data.rows = data;      
        this.setState({
          user_infor_data:user_infor_data
        });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var user_infor_data = this.state.user_infor_data;
                user_infor_data.rows = {};
                
                this.setState({
                    activeItem: "3",
                  user_infor_data:user_infor_data
                });
            }
        }
    });
  }

  updateName=(event)=>{
    var user_infor_data = this.state.user_infor_data;
    var status = this.state.editName;
    var item,index;

    for(var i=0; i<user_infor_data.rows.length;i++)
    {
      if(user_infor_data.rows[i].Name=="Name")
      {
        index = i;
        item = user_infor_data.rows[i];
        break;
      }   
    }

    if(status){
      item.Content = <input className="editinput" onChange={this.handleName} disabled={!this.state.editName} maxLength="20" value={this.state.userName}/>
      item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Save</MDBBtn>
      user_infor_data.rows[index] = item;
      this.setState({
        user_infor_data:user_infor_data,
        editName:!this.state.editName
      });
    }
    else{
      const {userid} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Username', this.state.userName);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/users/` + userid + "/update/user_name",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        item.Content = <input className="editinput" onChange={this.handleName} disabled={!this.state.editName} maxLength="20" value={this.state.userName}/>
        item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        user_infor_data.rows[index] = item;
        this.setState({
          user_infor_data:user_infor_data,
          editName:!this.state.editName
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        item.Content = <>
                          <input className="editinput" onChange={this.handleName} disabled={this.state.editName} maxLength="20" value={this.state.userName}/>
                          <div className="error">{error.response.data.errors.Username?error.response.data.errors.Username.message:""}</div>
                       </>
        item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Save</MDBBtn>
        user_infor_data.rows[index] = item;
        this.setState({
          user_infor_data:user_infor_data,
        });
      });
    }

  }

  handleName=(event)=>{
    var user_infor_data = this.state.user_infor_data;
    var item,index;
    for(var i=0; i<user_infor_data.rows.length;i++)
    {
      if(user_infor_data.rows[i].Name=="Name")
      {
        index = i;
        item = user_infor_data.rows[i];
        break;
      }   
    }
    var value=(event.target.value).slice(0,20);
    item.Content = <input className="editinput" onChange={this.handleName} disabled={this.state.editName} value={value}/>
   
    user_infor_data.rows[index] = item;
    this.setState({
      userName:value,
      user_infor_data:user_infor_data
    });
  }

  updateEmail=(event)=>{
    var user_infor_data = this.state.user_infor_data;
    var status = this.state.editEmail;
    var item,index;

    for(var i=0; i<user_infor_data.rows.length;i++)
    {
      if(user_infor_data.rows[i].Name=="Email")
      {
        index = i;
        item = user_infor_data.rows[i];
        break;
      }   
    }

    if(status){
      item.Content = <input className="editinput" onChange={this.handleEmail} disabled={!this.state.editEmail} value={this.state.userEmail}/>
      item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Save</MDBBtn>
      user_infor_data.rows[index] = item;
      this.setState({
        user_infor_data:user_infor_data,
        editEmail:!this.state.editEmail
      });
    }
    else{
      const {userid} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Email', this.state.userEmail);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/users/` + userid + "/update/email",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        item.Content = <input className="editinput" onChange={this.handleEmail} disabled={!this.state.editEmail} value={this.state.userEmail}/>
        item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        user_infor_data.rows[index] = item;
        this.setState({
          user_infor_data:user_infor_data,
          editEmail:!this.state.editEmail
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        item.Content = <>
                        <input className="editinput" onChange={this.handleEmail} disabled={this.state.editEmail} value={this.state.userEmail}/>
                        <div className="error">{error.response.data.errors.Email? error.response.data.errors.Email.message:""}</div>
                       </> 
        item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Save</MDBBtn>
        user_infor_data.rows[index] = item;
        this.setState({
          user_infor_data:user_infor_data,
          editEmail:this.state.editEmail
        });
      });
    }

  }

  handleEmail=(event)=>{
    var user_infor_data = this.state.user_infor_data;
    var item,index;
    for(var i=0; i<user_infor_data.rows.length;i++)
    {
      if(user_infor_data.rows[i].Name=="Email")
      {
        index = i;
        item = user_infor_data.rows[i];
        break;
      }   
    }
    item.Content = <input className="editinput" onChange={this.handleEmail} disabled={this.state.editEmail} value={event.target.value}/>
   
    user_infor_data.rows[index] = item;
    this.setState({
      userEmail:event.target.value,
      user_infor_data:user_infor_data
    });
  }

  updateStatus=(event)=>{

    var user_infor_data = this.state.user_infor_data;
    var status = this.state.editStatus;
    var item,index;

    for(var i=0; i<user_infor_data.rows.length;i++)
    {
      if(user_infor_data.rows[i].Name=="Status")
      {
        index = i;
        item = user_infor_data.rows[i];
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
      user_infor_data.rows[index] = item;
      this.setState({
        user_infor_data:user_infor_data,
        editStatus:!this.state.editStatus
      });
    }
    else{
      const {userid} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Status', this.state.userStatus);
      fd.append('_method', 'PATCH');
      axios.post(
        `${apiurl}/users/` + userid + "/update/status",
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
        user_infor_data.rows[index] = item;
        this.setState({
        user_infor_data:user_infor_data,
        editStatus:!this.state.editStatus
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        else{
          item.Content =<> <select value={this.state.userStatus} disabled={this.state.editStatus} onChange={this.handleStatus}>
                              <option value={1}>SendSignupConfirmationEmail</option>
                              <option value={2}>SendSignupConfirmationEmailWithKeys</option>
                              <option value={3}>ForConfirmation</option>
                              <option value={4}>ForgotPasswordRequest</option>
                              <option value={5}>ForgotPasswordEmailSent</option>
                              <option value={6}>ForgotPasswordConfirmed</option>
                              <option value={7}>Active</option>
                              <option value={8}>Inactive</option>
                            </select>
                <div className="error">Invalid Status</div>
                </>
          item.Action = <MDBBtn onClick={this.updateStatus} className="btn btnEdit" color='primary'>Save</MDBBtn>
          user_infor_data.rows[index] = item;
          this.setState({
          user_infor_data:user_infor_data,
          editStatus:this.state.editStatus
          });
        }     
      });
    }

  }

  handleStatus=(event)=>{
    var user_infor_data = this.state.user_infor_data;
    var item,index;
    for(var i=0; i<user_infor_data.rows.length;i++)
    {
      if(user_infor_data.rows[i].Name=="Status")
      {
        index = i;
        item = user_infor_data.rows[i];
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
    user_infor_data.rows[index] = item;
    this.setState({
      userStatus:event.target.value,
      user_infor_data:user_infor_data
    });
  }

  sendRequest = (event) =>{
    this.setState({confirmModal:!this.state.confirmModal})
    const {id,userid, contentType,subscriptionId} = this.props.match.params;
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    const {UserId,userEmail,userName,ContentType,TransactionStatus,PageNumber,PageSize,StartDate,EndDate} = this.state;
    if(contentType=="PayPerView" || contentType=="LiveTicket")
    {     
      const fd = new FormData();
      fd.append('Username', "");
      fd.append('Email', "");
      fd.append('UserId', "");
      fd.append('StartDate', "");
      fd.append('EndDate', "");
      fd.append('TransactionStatus', TransactionStatus);
      fd.append('ContentType', contentType);
      fd.append('PageSize', 10);
      fd.append('PageNumber', 1);
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
            alertContent:<span>Refund request has been <br/> successfully sent to {this.state.artistName} </span>
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
      const fd = new FormData();
      fd.append('Username', "");
      fd.append('Email', "");
      fd.append('UserId', "");
      fd.append('StartDate', "");
      fd.append('EndDate', "");
      fd.append('TransactionStatus', TransactionStatus);
      fd.append('ContentType', contentType);
      fd.append('PageSize', 10);
      fd.append('PageNumber', 1);
      axios({
        method: 'post',
        url: `${apiurl}/transactions/users/${id}/subscription/${subscriptionId}/refund`,
        data: fd,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data' 
        }
    }).then((response)=>{
        this.setState({
            alertModal:!this.state.alertModal,
            alertTitle: "REFUND REQUEST",
            alertContent:<span>Refund request has been <br/> successfully sent to {this.state.artistName} </span>
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

  createRefundRequest=(event)=>{
    const {id,userid, contentType} = this.props.match.params;
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
  render() {
    const {confirmContent,confirmModal,confirmTitle,alertModal,alertTitle,alertContent, activeItem,user_infor_data, content_artist_detail,transaction_detail_data} = this.state;
    return (
        <MDBContainer className="maincontainer">
          <span style={{color:'blue'}}>User Transaction List &gt;</span><span> Detail</span>
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
                   User Information
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
                    Content &#38; Artist
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
                    Transaction
                  </MDBNavLink>
                </MDBNavItem>

                <MDBNavbarNav right className='nav-tabs'>
                  <MDBNavItem >
                      <MDBNavLink disabled={this.state.TransactionStatus=="Refunded"} onClick={this.createRefundRequest} className="danger_requestBtn" to='#'>
                        Create Refund Request
                      </MDBNavLink>
                  </MDBNavItem>
                </MDBNavbarNav>
                
                </MDBNav>
                <MDBTabContent activeItem={activeItem}>
                <MDBTabPane tabId='1' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                            <h4>User Information</h4>                     
                    </MDBCol>
                    <MDBCol sm="12">
                    <MDBTable striped>
                       {user_infor_data.rows.length ? <MDBTableBody rows={user_infor_data.rows} /> : <MDBTableBody />}
                    </MDBTable>
                    </MDBCol>                  

                </MDBTabPane>
                <MDBTabPane tabId='2' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                        <h4>Content &#38; Artist Detail</h4>                     
                    </MDBCol>
                    <MDBCol sm="12">
                    <MDBTable striped>
                      {content_artist_detail.rows.length ? <MDBTableBody rows={content_artist_detail.rows} /> : <MDBTableBody />}
                      
                    </MDBTable>
                    </MDBCol>                  

                </MDBTabPane>
      
                <MDBTabPane tabId='3' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                      <h4>Transaction Detail</h4>
                    </MDBCol>

                    <MDBCol sm="12">
                      <MDBTable striped>
                          {transaction_detail_data.rows.length ? <MDBTableBody rows={transaction_detail_data.rows} /> : <MDBTableBody />}
                      </MDBTable>
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

export default User_transaction_detail;
