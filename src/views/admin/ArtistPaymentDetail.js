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

} from 'mdbreact';

import SectionContainer from '../../components/sectionContainer';
var axios =require('axios');

const apiurl = process.env.REACT_APP_API_BASE_URL;
const publicurl = process.env.REACT_APP_PUBLIC_BASE_URL;
const adminurl = process.env.REACT_APP_ADMIN_BASE_URL;

class ArtistPaymentDetail extends Component {
  state = {
    activeItem: '1',
    artistName:"",
    artistEmail:"",
    artistStatus:"",
    autoPay: false,
    editName:true,
    editEmail:true,
    editStatus:true,
    artist_infor_data: {
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
    content_detail_data: {
      columns: [
        {
          label: <input type="checkbox" id="all"/>,
          field: 'checkbox'
        },
        {
          label:<span>Tran.Date <br/>and Time</span>,
          field: 'tranDateTime',
        },
        {
          label:'Tran.ID',
          field: 'tranID',
        },
        {
          label:'User ID',
          field: 'userID',
        },
        {
          label:'User Email',
          field: 'userEmail',
        },
        {
          label:'Cont.Type',
          field: 'contType',
        },
        {
          label:'Amount',
          field: 'amount',
        },
        {
          label:"Action",
          field: 'action',
        },
      ],
      rows:[],
    },
    payment_detail_data: {
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

  componentDidMount(){
    const {requestid, artistid} = this.props.match.params;
    this.getPaymentinfo(requestid);
    this.getartistinfo();
    this.getContentinfo(requestid);
   
  }

  getPaymentinfo(requestid){
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var data = new Array();
    var config = {
        method: 'get',
        url: `${apiurl}/payments/`+ requestid +"/detail",
        headers: { 
        'Authorization': 'Bearer ' + token,
    },
        data : {},
    };
    axios(config)
    .then((response) => { 
     
      var responsedata = response.data;
      console.log(responsedata);
      var temp = {};          
      temp.Name = "Payment Request ID";
      temp.Content = responsedata.requestId;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "Due Date";
      temp.Content = responsedata.dueDate;
      temp.Action = ""
      data.push(temp);
      var temp = {};
      temp.Name = "Status";
      temp.Content = responsedata.status;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "PayPal Payment ID";
      temp.Content = responsedata.paypalTransactionId;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "Amount";
      temp.Content = responsedata.amount;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "Executor Account";
      temp.Content = responsedata.executor;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "Payment Request Date";
      temp.Content = responsedata.dateRequested;
      temp.Action = "";
      data.push(temp);
      var temp = {};
      temp.Name = "PayPal Payment Date";
      temp.Content = responsedata.paypalPaymentDate;
      temp.Action = "";
      data.push(temp);
      var payment_detail_data = this.state.payment_detail_data;
      payment_detail_data.rows = data;      
      this.setState({
        payment_detail_data:payment_detail_data
      });
      this.setState({
        autoPay:responsedata.autoPay
      });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var payment_detail_data = this.state.payment_detail_data;
                payment_detail_data.rows = {}; 
                this.setState({
                    payment_detail_data:payment_detail_data
                });
            }
        }
    });
  }

  getContentinfo(requestid)
  {
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var data = new Array();
 
    var config = {
        method: 'get',
        url: `${apiurl}/payments/` + requestid + '/content',
        headers: { 
        'Authorization': 'Bearer ' + token,
    },
        data : {},
    };
    axios(config)
    .then((response) => { 
      var responsedata = response.data.contents;
      responsedata.forEach(item=>{
          var temp={};
          temp.checkbox = <input type='checkbox' id={'check_' + item.transactionId} />;
          temp.tranDateTime = item.transactionDate;
          temp.tranID = item.transactionId;
          temp.userID = item.userId;
          temp.userEmail = item.userEmail;
          temp.contType = item.contentType;
          temp.amount = item.amount;
          temp.action = <MDBLink className="showdetail" to={`/admin/userTransaction/detail/${item.transactionId} ${item.userId} ${3}`}>Show detail</MDBLink> 
          data.push(temp);
        });
   
        var content_detail_data = this.state.content_detail_data;
        content_detail_data.rows = data;
           
        this.setState({
            content_detail_data:content_detail_data
        });
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var content_detail_data = this.state.content_detail_data;
                content_detail_data.rows = {}; 
                this.setState({
                    content_detail_data:content_detail_data
                });
            }
        }
    });
  }

  getartistinfo()
  {
    const {requestid, artistid} = this.props.match.params;
  
    var userData = JSON.parse(localStorage.userData);
    var token = userData.admin.token;
    var data = new Array();
    var config = {
        method: 'get',
        url: `${apiurl}/artists/` + artistid,
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
              break;
            case "artistName":
              this.setState({
                artistName:value
              });
              temp.Name = "Name";
              temp.Content = <input className="editinput" disabled={this.state.editName} maxLength={20} value={this.state.artistName}/>
              temp.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Edit</MDBBtn>
              break;
            case "email":
              this.setState({
                artistEmail:value
              });
              temp.Name = "Email";
              temp.Content = <input className="editinput" disabled={this.state.editEmail} value={this.state.artistEmail}/>
              temp.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Edit</MDBBtn>
              break;
            case "registeredDate":
              temp.Name = "Registration Date";
              temp.Content = value;
              temp.Action = "";
              break;
            case "dateUpdated":
              temp.Name = "Final Update Date";
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
                artistStatus:value
              })
              temp.Name = "Status";
              temp.Content =<select className="statusSelect" value={this.state.artistStatus} disabled={this.state.editStatus}>
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
        var artist_infor_data = this.state.artist_infor_data;
        artist_infor_data.rows = data;      
        this.setState({
            artist_infor_data:artist_infor_data
        });
       
    })
    .catch((error)=> {
        if (error.response) {
            if(error.response.status==401){
                localStorage.removeItem("userData");
                window.location.assign('/');
            }
            else{
                var artist_infor_data = this.state.artist_infor_data;
                artist_infor_data.rows = {}; 
                this.setState({
                    artist_infor_data:artist_infor_data
                });
            }
        }
    });
  }

  updateName=(event)=>{
    var artist_infor_data = this.state.artist_infor_data;
    var status = this.state.editName;
    var item,index;

    for(var i=0; i<artist_infor_data.rows.length;i++)
    {
      if(artist_infor_data.rows[i].Name=="Name")
      {
        index = i;
        item = artist_infor_data.rows[i];
        break;
      }   
    }

    if(status){
      item.Content = <input className="editinput" onChange={this.handleName} disabled={!this.state.editName} value={this.state.artistName}/>
      item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Save</MDBBtn>
      artist_infor_data.rows[index] = item;
      this.setState({
        artist_infor_data:artist_infor_data,
        editName:!this.state.editName
      });
    }
    else{
      const {artistid} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Username', this.state.artistName);
      fd.append('_method', 'PATCH');
      axios.post(
        "https://wry-apiadmin-stg.ipfssys.info/artists/" + artistid + "/update/user_name",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        item.Content = <input className="editinput" onChange={this.handleName} disabled={!this.state.editName} value={this.state.artistName}/>
        item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        artist_infor_data.rows[index] = item;
        this.setState({
          artist_infor_data:artist_infor_data,
          editName:!this.state.editName
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        item.Content = <>
                        <input className="editinput" onChange={this.handleName} disabled={this.state.editName} value={this.state.artistName}/>
                        <div className="error">{error.response.data.errors.Username?error.response.data.errors.Username.message:""}</div>
                      </>
        item.Action = <MDBBtn onClick={this.updateName} className="btn btnEdit" color='primary'>Save</MDBBtn>
        artist_infor_data.rows[index] = item;
        this.setState({
          artist_infor_data:artist_infor_data,
        });
      });
    }
    
  }

  handleName=(event)=>{
    var artist_infor_data = this.state.artist_infor_data;
    var item,index;
    for(var i=0; i<artist_infor_data.rows.length;i++)
    {
      if(artist_infor_data.rows[i].Name=="Name")
      {
        index = i;
        item = artist_infor_data.rows[i];
        break;
      }   
    }
    var value=(event.target.value).slice(0,20);
    item.Content = <input className="editinput" onChange={this.handleName} disabled={this.state.editName} value={value}/>
   
    artist_infor_data.rows[index] = item;
    this.setState({
      artistName:value,
      artist_infor_data:artist_infor_data
    });
  }

  updateEmail=(event)=>{
    var artist_infor_data = this.state.artist_infor_data;
    var status = this.state.editEmail;
    var item,index;

    for(var i=0; i<artist_infor_data.rows.length;i++)
    {
      if(artist_infor_data.rows[i].Name=="Email")
      {
        index = i;
        item = artist_infor_data.rows[i];
        break;
      }   
    }

    if(status){
      item.Content = <input className="editinput" onChange={this.handleEmail} disabled={!this.state.editEmail} value={this.state.artistEmail}/>
      item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Save</MDBBtn>
      artist_infor_data.rows[index] = item;
      this.setState({
        artist_infor_data:artist_infor_data,
        editEmail:!this.state.editEmail
      });
    }
    else{
      const {artistid} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Email', this.state.artistEmail);
      fd.append('_method', 'PATCH');
      axios.post(
        "https://wry-apiadmin-stg.ipfssys.info/artists/" + artistid + "/update/email",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        item.Content = <input className="editinput" onChange={this.handleEmail} disabled={!this.state.editEmail} value={this.state.artistEmail}/>
        item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Edit</MDBBtn>
        artist_infor_data.rows[index] = item;
        this.setState({
          artist_infor_data:artist_infor_data,
          editEmail:!this.state.editEmail
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        item.Content = <>
                          <input className="editinput" onChange={this.handleEmail} disabled={this.state.editEmail} value={this.state.artistEmail}/>
                          <div className="error">{error.response.data.errors.Email?error.response.data.errors.Email.message:""}</div>
                       </>
        item.Action = <MDBBtn onClick={this.updateEmail} className="btn btnEdit" color='primary'>Save</MDBBtn>
        artist_infor_data.rows[index] = item;
        this.setState({
          artist_infor_data:artist_infor_data,
        });
      });
    }
    
  }

  handleEmail=(event)=>{
    var artist_infor_data = this.state.artist_infor_data;
    var item,index;
    for(var i=0; i<artist_infor_data.rows.length;i++)
    {
      if(artist_infor_data.rows[i].Name=="Email")
      {
        index = i;
        item = artist_infor_data.rows[i];
        break;
      }   
    }
    item.Content = <input className="editinput" onChange={this.handleEmail} disabled={this.state.editEmail} value={event.target.value}/>
   
    artist_infor_data.rows[index] = item;
    this.setState({
      artistEmail:event.target.value,
      artist_infor_data:artist_infor_data
    });
  }

  updateStatus=(event)=>{

    var artist_infor_data = this.state.artist_infor_data;
    var status = this.state.editStatus;
    var item,index;

    for(var i=0; i<artist_infor_data.rows.length;i++)
    {
      if(artist_infor_data.rows[i].Name=="Status")
      {
        index = i;
        item = artist_infor_data.rows[i];
        break;
      }   
    }
    if(status){
      item.Content = <select value={this.state.artistStatus} disabled={!this.state.editStatus} onChange={this.handleStatus}>
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
      artist_infor_data.rows[index] = item;
      this.setState({
        artist_infor_data:artist_infor_data,
        editStatus:!this.state.editStatus
      });
    }
    else{
      const {artistid} = this.props.match.params;
      var userData = JSON.parse(localStorage.userData);
      var token = userData.admin.token;
      const fd = new FormData();
      fd.append('Status', this.state.artistStatus);
      fd.append('_method', 'PATCH');
      axios.post(
        "https://wry-apiadmin-stg.ipfssys.info/artists/" + artistid + "/update/status",
        fd,
        { headers: { 
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/x-www-form-urlencoded' 
        } }
      ).then((response)=>{
        item.Content = <select value={this.state.artistStatus} disabled={!this.state.editStatus} onChange={this.handleStatus}>
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
        artist_infor_data.rows[index] = item;
        this.setState({
        artist_infor_data:artist_infor_data,
          editStatus:!this.state.editStatus
        });
      }).catch((error)=>{
        if(error.response.status==401){
          localStorage.removeItem("userData");
          window.location.assign('/');
        }
        item.Content = <><select value={this.state.artistStatus} disabled={this.state.editStatus} onChange={this.handleStatus}>
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
        artist_infor_data.rows[index] = item;
        this.setState({
        artist_infor_data:artist_infor_data,
        editStatus:this.state.editStatus
        });
      });
    }
    
  }

  handleStatus=(event)=>{
    var artist_infor_data = this.state.artist_infor_data;
    var item,index;
    for(var i=0; i<artist_infor_data.rows.length;i++)
    {
      if(artist_infor_data.rows[i].Name=="Status")
      {
        index = i;
        item = artist_infor_data.rows[i];
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
    artist_infor_data.rows[index] = item;
    this.setState({
      artistStatus:event.target.value,
      artist_infor_data:artist_infor_data
    });
  }


  render() {
    const { activeItem,artist_infor_data, content_detail_data,payment_detail_data,autoPay} = this.state;
    return (
        <MDBContainer className="maincontainer">
          <span style={{color:'blue'}}>Artist Payment List &gt;</span><span> Detail</span>
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
                   Artist Information
                    </MDBNavLink>
                </MDBNavItem>
                {autoPay && (
                <MDBNavItem>
                    <MDBNavLink
                    link
                    to='#'
                    active={activeItem === '2'}
                    onClick={this.toggle('2')}
                    role='tab'
                    >
                    Content &#38; User List
                    </MDBNavLink>
                </MDBNavItem>
                )}
                <MDBNavItem>
                  <MDBNavLink
                    link
                    to='#'
                    active={activeItem === '3'}
                    onClick={this.toggle('3')}
                    role='tab'
                    >
                    Payment Detail
                  </MDBNavLink>
                </MDBNavItem>                
            </MDBNav>
                <MDBTabContent activeItem={activeItem}>
                <MDBTabPane tabId='1' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                            <h4>Artist Information</h4>                     
                    </MDBCol>
                    <MDBCol sm="12">
                    <MDBTable striped>
                       {artist_infor_data.rows.length ? <MDBTableBody rows={artist_infor_data.rows} /> : <MDBTableBody />}
                    </MDBTable>
                    </MDBCol>                  

                </MDBTabPane>
                <MDBTabPane tabId='2' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                        <h4>Content &#38; User List</h4>                     
                    </MDBCol>
                    <MDBCol sm="12">
                    <MDBTable responsive striped className="artist-records">
                        <MDBTableHead columns={content_detail_data.columns} />
                        {content_detail_data.rows.length ? <MDBTableBody rows={content_detail_data.rows} /> :<MDBTableBody />}
                        {content_detail_data.rows.length?"":<caption className="noresult">No result found</caption>}
                    </MDBTable>
                    </MDBCol>
                </MDBTabPane>
      
                <MDBTabPane tabId='3' role='tabpanel'>
                    <MDBCol sm="12" className="cardheader">
                      <h4>Payment Detail</h4>
                    </MDBCol>
                    <MDBCol sm="12">
                      <MDBTable striped>
                         {payment_detail_data.rows.length ? <MDBTableBody rows={payment_detail_data.rows} /> : <MDBTableBody />}
                      </MDBTable>
                    </MDBCol>
                </MDBTabPane>
                </MDBTabContent>
            </MDBCardBody>
            </MDBCard> 
            </SectionContainer>          
        </MDBContainer>
    );
  }
}

export default ArtistPaymentDetail;
